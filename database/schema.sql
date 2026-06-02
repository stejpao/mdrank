-- ============================================================
-- MDRank.org — PostgreSQL 16 Schema (Step 1)
-- Target: 5-category medical device review platform
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ----------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------

CREATE TYPE fda_status AS ENUM (
  'fda_510k_cleared',
  'fda_registered',
  'not_fda_regulated',
  'unknown'
);

CREATE TYPE review_section_type AS ENUM (
  'overview',
  'clinical_summary',
  'performance_metric',
  'quick_take',
  'real_world_usage',
  'cost_coverage',
  'patient_suitability',
  'clinical_efficacy',
  'clinical_recommendation',
  'expert_summary',
  'methodology'
);

CREATE TYPE scrape_status AS ENUM (
  'pending',
  'scraped',
  'transformed',
  'loaded',
  'discarded',
  'failed'
);

CREATE TYPE page_content_type AS ENUM (
  'landing_hero',
  'landing_featured',
  'landing_methodology',
  'landing_disclaimer',
  'category_hub',
  'subcategory_hub'
);

-- ----------------------------------------------------------
-- CATEGORIES (exactly 5 — enforced by seed + app logic)
-- ----------------------------------------------------------

CREATE TABLE categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            CITEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  description     TEXT,                    -- transformed category hub intro
  hub_copy        JSONB NOT NULL DEFAULT '{}'::JSONB,  -- { "hero_title", "hero_body", "meta_description" }
  sort_order      SMALLINT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT categories_name_not_empty CHECK (char_length(trim(name)) > 0)
);

-- ----------------------------------------------------------
-- SUBCATEGORIES
-- ----------------------------------------------------------

CREATE TABLE subcategories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id     UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  slug            CITEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  description     TEXT,                    -- transformed subcategory hub copy
  hub_copy        JSONB NOT NULL DEFAULT '{}'::JSONB,
  sort_order      SMALLINT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (category_id, slug)
);

-- ----------------------------------------------------------
-- SITE / LANDING PAGE CONTENT (transformed copy)
-- ----------------------------------------------------------

CREATE TABLE site_pages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            CITEXT NOT NULL UNIQUE,  -- e.g. 'home', 'methodology'
  page_type       page_content_type NOT NULL,
  title           TEXT NOT NULL,
  body            TEXT,                    -- transformed markdown/HTML body
  metadata        JSONB NOT NULL DEFAULT '{}'::JSONB,
  sort_order      SMALLINT NOT NULL DEFAULT 0,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------
-- DEVICES
-- ----------------------------------------------------------

CREATE TABLE devices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            CITEXT NOT NULL UNIQUE,
  source_url      TEXT,                    -- original device page URL (null for synthetic)
  source_device_id INTEGER,               -- original compare-tool ID if scraped

  -- Core fields (per spec)
  name            TEXT NOT NULL,
  manufacturer    TEXT NOT NULL,
  mdrank_score    SMALLINT NOT NULL
    CHECK (mdrank_score BETWEEN 0 AND 100),
  fda_status      fda_status NOT NULL DEFAULT 'unknown',
  connectivity    TEXT,
  retail_price    NUMERIC(10,2),
  spec_json       JSONB NOT NULL DEFAULT '{}'::JSONB,  -- all technical specs as key-value
  image_url       TEXT,                    -- public path e.g. '/assets/devices/foo.jpg'
  image_local_path TEXT,                   -- filesystem path for scraper pipeline

  -- Pipeline / display extensions
  overview        TEXT,                    -- transformed short description
  key_features    JSONB NOT NULL DEFAULT '[]'::JSONB,
  is_editors_choice BOOLEAN NOT NULL DEFAULT FALSE,
  is_synthetic    BOOLEAN NOT NULL DEFAULT FALSE,    -- TrueVitals BP Pro flag
  rank_in_subcategory SMALLINT,
  subcategory_device_count SMALLINT,

  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT devices_name_not_empty CHECK (char_length(trim(name)) > 0)
);

CREATE INDEX idx_devices_mdrank_score ON devices (mdrank_score DESC);
CREATE INDEX idx_devices_price ON devices (retail_price);
CREATE INDEX idx_devices_manufacturer ON devices (manufacturer);
CREATE INDEX idx_devices_fda_status ON devices (fda_status);
CREATE INDEX idx_devices_editors_choice ON devices (is_editors_choice) WHERE is_editors_choice = TRUE;
CREATE INDEX idx_devices_spec_json ON devices USING GIN (spec_json);

-- Many-to-many: device belongs to one or more subcategories
CREATE TABLE device_subcategories (
  device_id       UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  subcategory_id  UUID NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
  rank            SMALLINT,
  PRIMARY KEY (device_id, subcategory_id)
);

CREATE INDEX idx_device_subcategories_sub ON device_subcategories (subcategory_id, rank);

-- ----------------------------------------------------------
-- REVIEWS (transformed long-form content)
-- ----------------------------------------------------------

CREATE TABLE reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id       UUID NOT NULL UNIQUE REFERENCES devices(id) ON DELETE CASCADE,
  slug            CITEXT NOT NULL UNIQUE,
  source_url      TEXT,

  title           TEXT NOT NULL,           -- e.g. "MDRank Hands-On Test: ..."
  excerpt         TEXT,
  table_of_contents JSONB NOT NULL DEFAULT '[]'::JSONB,

  strengths       JSONB NOT NULL DEFAULT '[]'::JSONB,
  limitations     JSONB NOT NULL DEFAULT '[]'::JSONB,
  recommend_if    JSONB NOT NULL DEFAULT '[]'::JSONB,
  avoid_if        JSONB NOT NULL DEFAULT '[]'::JSONB,

  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_slug ON reviews (slug);

CREATE TABLE review_sections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id       UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  section_type    review_section_type NOT NULL,
  heading         TEXT NOT NULL,
  body            TEXT NOT NULL,
  sort_order      SMALLINT NOT NULL DEFAULT 0,
  metadata        JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX idx_review_sections_review ON review_sections (review_id, sort_order);

-- ----------------------------------------------------------
-- SCRAPE + TRANSFORM STAGING
-- ----------------------------------------------------------

CREATE TABLE scrape_runs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at     TIMESTAMPTZ,
  status          scrape_status NOT NULL DEFAULT 'pending',
  notes           TEXT
);

CREATE TABLE scrape_raw_devices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scrape_run_id   UUID NOT NULL REFERENCES scrape_runs(id) ON DELETE CASCADE,
  source_slug     CITEXT NOT NULL,
  source_category_slug CITEXT,
  source_subcategory_slug CITEXT,
  source_device_url TEXT,
  source_review_url TEXT,
  raw_payload     JSONB NOT NULL,
  original_clinical_score SMALLINT,        -- pre-jitter score for audit
  mdrank_score    SMALLINT,                -- post-jitter score
  discard_reason  TEXT,                    -- e.g. 'oxiline_purge', 'out_of_scope'
  status          scrape_status NOT NULL DEFAULT 'scraped',
  error_message   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (scrape_run_id, source_slug)
);

-- ----------------------------------------------------------
-- UPDATED_AT TRIGGER
-- ----------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_subcategories_updated BEFORE UPDATE ON subcategories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_devices_updated BEFORE UPDATE ON devices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_reviews_updated BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_site_pages_updated BEFORE UPDATE ON site_pages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------
-- SEED: 5 CATEGORIES + SUBCATEGORIES
-- ----------------------------------------------------------

INSERT INTO categories (slug, name, sort_order) VALUES
  ('blood-pressure',  'Blood Pressure',  1),
  ('respiratory',     'Respiratory',     2),
  ('sleep',           'Sleep',           3),
  ('pain-relief',     'Pain Relief',     4),
  ('temperature',     'Temperature',     5);

INSERT INTO subcategories (category_id, slug, name, sort_order)
SELECT c.id, v.slug, v.name, v.sort_order
FROM categories c
JOIN (VALUES
  -- Blood Pressure
  ('blood-pressure',  'blood-pressure-monitors',       'Blood Pressure Monitors',              1),
  ('blood-pressure',  'upper-arm-monitors',            'Upper Arm Blood Pressure Monitor',     2),
  ('blood-pressure',  'wrist-blood-pressure-monitors', 'Wrist Blood Pressure Monitors',        3),
  -- Respiratory
  ('respiratory',     'pulse-oximeters',               'Pulse Oximeters',                      1),
  ('respiratory',     'fingertip-pulse-oximeters',     'Fingertip Pulse Oximeters',            2),
  ('respiratory',     'nebulizers',                    'Nebulizers',                           3),
  ('respiratory',     'home-spirometers',              'Home Spirometers',                     4),
  ('respiratory',     'peak-flow-meters',              'Peak Flow Meters',                     5),
  -- Sleep
  ('sleep',           'home-sleep-tests',              'Home Sleep Tests',                     1),
  ('sleep',           'anti-snoring-devices',          'Anti-Snoring Devices',                 2),
  -- Pain Relief
  ('pain-relief',     'tens-units',                    'TENS Units',                           1),
  ('pain-relief',     'massage-guns',                  'Massage Guns',                         2),
  ('pain-relief',     'heating-pads',                  'Heating Pads',                         3),
  -- Temperature
  ('temperature',     'thermometers',                  'Thermometers',                         1),
  ('temperature',     'in-ear-thermometers',           'In-Ear Thermometers',                  2),
  ('temperature',     'infrared-forehead-thermometers','Infrared Forehead Thermometers',       3)
) AS v(cat_slug, slug, name, sort_order) ON c.slug = v.cat_slug::citext;

-- Landing page placeholder (populated by transformer pipeline)
INSERT INTO site_pages (slug, page_type, title, body, is_published) VALUES
  ('home', 'landing_hero', 'MDRank — Data-Driven Device Rankings', '', FALSE);

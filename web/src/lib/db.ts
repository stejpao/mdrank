import { Pool } from "pg";

import fallbackData from "@/data/devices.json";
import type {
  Category,
  DeviceFilters,
  DeviceWithReview,
  LandingCopy,
  Review,
  SortDir,
} from "./types";

const CATEGORIES: Category[] = [
  {
    slug: "blood-pressure",
    name: "Blood Pressure",
    subcategories: [
      { slug: "blood-pressure-monitors", name: "Blood Pressure Monitors" },
      { slug: "upper-arm-monitors", name: "Upper Arm Monitors" },
    ],
  },
  {
    slug: "respiratory",
    name: "Respiratory",
    subcategories: [
      { slug: "pulse-oximeters", name: "Pulse Oximeters" },
      { slug: "fingertip-pulse-oximeters", name: "Fingertip Pulse Oximeters" },
      { slug: "nebulizers", name: "Nebulizers" },
      { slug: "home-spirometers", name: "Home Spirometers" },
      { slug: "peak-flow-meters", name: "Peak Flow Meters" },
    ],
  },
  {
    slug: "sleep",
    name: "Sleep",
    subcategories: [
      { slug: "home-sleep-tests", name: "Home Sleep Tests" },
      { slug: "anti-snoring-devices", name: "Anti-Snoring Devices" },
    ],
  },
  {
    slug: "pain-relief",
    name: "Pain Relief",
    subcategories: [
      { slug: "tens-units", name: "TENS Units" },
      { slug: "massage-guns", name: "Massage Guns" },
      { slug: "heating-pads", name: "Heating Pads" },
    ],
  },
  {
    slug: "temperature",
    name: "Temperature",
    subcategories: [
      { slug: "thermometers", name: "Thermometers" },
      { slug: "in-ear-thermometers", name: "In-Ear Thermometers" },
      { slug: "infrared-forehead-thermometers", name: "Forehead Thermometers" },
    ],
  },
];

// Legacy database rows are quarantined because the inherited dataset contains synthetic
// scores and unsupported testing claims. A migrated evidence-v1 database must be
// explicitly enabled after its approval fields and validators are deployed.
const pool = process.env.MDRANK_EVIDENCE_DB_V1 === "enabled" && process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

let dbAvailable: boolean | null = null;

async function checkDb(): Promise<boolean> {
  if (!pool) return false;
  if (dbAvailable !== null) return dbAvailable;
  try {
    await pool.query("SELECT 1");
    dbAvailable = true;
  } catch {
    dbAvailable = false;
  }
  return dbAvailable;
}

type FallbackRoot = {
  landing?: LandingCopy;
  devices: DeviceWithReview[];
};

function fromFallback(): FallbackRoot {
  return fallbackData as unknown as FallbackRoot;
}

function normalizeDevice(d: Record<string, unknown>): DeviceWithReview["device"] {
  const device = d as unknown as DeviceWithReview["device"];
  if (!device.mdrank_score && (d as { transformed_clinical_score?: number }).transformed_clinical_score) {
    device.mdrank_score = (d as { transformed_clinical_score: number }).transformed_clinical_score;
  }
  return device;
}

function applyFilters(items: DeviceWithReview[], filters: DeviceFilters): DeviceWithReview[] {
  let result = items.map((item) => ({
    ...item,
    device: normalizeDevice(item.device as unknown as Record<string, unknown>),
  }));

  if (filters.category) {
    result = result.filter((d) => d.device.category_slug === filters.category);
  }

  if (filters.subcategory) {
    result = result.filter((d) =>
      d.device.subcategory_slugs?.includes(filters.subcategory!)
    );
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (d) =>
        d.device.name.toLowerCase().includes(q) ||
        d.device.manufacturer.toLowerCase().includes(q)
    );
  }

  if (filters.manufacturer) {
    result = result.filter(
      (d) => d.device.manufacturer.toLowerCase() === filters.manufacturer!.toLowerCase()
    );
  }

  if (filters.fda_status) {
    result = result.filter((d) => d.device.fda_status === filters.fda_status);
  }

  const sort = filters.sort ?? "score";
  const dir: SortDir = filters.dir ?? "desc";
  const mult = dir === "asc" ? 1 : -1;

  result.sort((a, b) => {
    const av = sort === "price" ? (a.device.retail_price ?? 9999) : a.device.mdrank_score;
    const bv = sort === "price" ? (b.device.retail_price ?? 9999) : b.device.mdrank_score;
    return (av - bv) * mult;
  });

  return result;
}

export async function getLandingCopy(): Promise<LandingCopy> {
  if (await checkDb()) {
    try {
      const { rows } = await pool!.query(
        "SELECT title, body FROM site_pages WHERE slug = 'home' AND is_published = TRUE LIMIT 1"
      );
      if (rows[0]) {
        return { hero_title: rows[0].title, hero_body: rows[0].body };
      }
    } catch {
      /* fallback */
    }
  }
  return fromFallback().landing ?? {
    hero_title: "MDRank — Medical devices, ranked by evidence",
    hero_body: "Exact-model records, traceable sources, deterministic methods, and human-approved publication.",
  };
}

export async function getDevices(filters: DeviceFilters = {}): Promise<DeviceWithReview[]> {
  if (await checkDb()) {
    try {
      const { rows } = await pool!.query(`
        SELECT d.*, r.slug AS review_slug, r.title AS review_title, r.excerpt,
               r.strengths, r.limitations, r.recommend_if, r.avoid_if
        FROM devices d
        LEFT JOIN reviews r ON r.device_id = d.id
        WHERE d.is_published = TRUE
        ORDER BY d.mdrank_score DESC
      `);
      const items: DeviceWithReview[] = rows.map((row) => ({
        device: {
          id: row.id,
          slug: row.slug,
          name: row.name,
          manufacturer: row.manufacturer,
          mdrank_score: row.mdrank_score,
          fda_status: row.fda_status,
          connectivity: row.connectivity,
          retail_price: row.retail_price ? parseFloat(row.retail_price) : null,
          spec_json: row.spec_json,
          image_url: row.image_url,
          overview: row.overview,
          key_features: row.key_features,
          is_editors_choice: row.is_editors_choice,
          is_synthetic: row.is_synthetic,
          rank_in_subcategory: row.rank_in_subcategory,
        },
        review: {
          slug: row.review_slug,
          title: row.review_title,
          excerpt: row.excerpt,
          strengths: row.strengths,
          limitations: row.limitations,
          recommend_if: row.recommend_if,
          avoid_if: row.avoid_if,
        },
      }));
      return applyFilters(items, filters);
    } catch {
      /* fallback */
    }
  }
  return applyFilters(fromFallback().devices ?? [], filters);
}

export async function getDeviceBySlug(slug: string): Promise<DeviceWithReview | null> {
  const devices = await getDevices();
  return devices.find((d) => d.device.slug === slug) ?? null;
}

export async function getReviewBySlug(slug: string): Promise<(DeviceWithReview & { review: Review }) | null> {
  const devices = await getDevices();
  const match = devices.find((d) => d.review.slug === slug);
  if (match) return match;
  return devices.find((d) => d.device.slug === slug.replace("-hands-on-test", "")) ?? null;
}

export async function getManufacturers(): Promise<string[]> {
  const devices = await getDevices();
  return [...new Set(devices.map((d) => d.device.manufacturer))].sort();
}

export function getCategories(): Category[] {
  return CATEGORIES;
}

export async function getStats(filters: DeviceFilters = {}): Promise<{
  count: number;
  avgScore: number;
  minPrice: number;
  maxPrice: number;
}> {
  const devices = getDevices(filters);
  const list = await devices;
  const prices = list.map((d) => d.device.retail_price).filter((p): p is number => p != null);
  const scores = list.map((d) => d.device.mdrank_score);
  return {
    count: list.length,
    avgScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
  };
}

export { CATEGORIES };

export type DossierSource = {
  label: string;
  url: string;
  sourceClass: "A" | "C" | "D";
};

export type PersonaFit = {
  persona: string;
  fit: string;
  confidence: string;
  basis: string;
};

export type PublishedDossier = {
  slug: string;
  name: string;
  manufacturer: string;
  model: string;
  market: string;
  category: string;
  evidenceCutoff: string;
  directAnswer: string;
  disposition: "accepted-evidence-dossier";
  evidenceConfidence: string;
  publicExperienceConfidence: string;
  testingStatus: string;
  scoreStatus: "withheld";
  rankStatus: "withheld";
  scoreReason: string;
  exactIdentity: string[];
  regulatoryFindings: string[];
  validationFindings: string[];
  hsaFsa: {
    status: string;
    basis: string;
    limitations: string[];
  };
  specifications: Array<{ label: string; value: string }>;
  personaFit: PersonaFit[];
  limitations: string[];
  sources: DossierSource[];
  changeLog: string[];
};

export const publishedDossiers: PublishedDossier[] = [
  {
    slug: "ihealth-track-kn-550bt",
    name: "iHealth Track Blood Pressure Monitor",
    manufacturer: "iHealth Labs, Inc.",
    model: "KN-550BT",
    market: "United States",
    category: "Upper-arm blood-pressure monitor",
    evidenceCutoff: "July 21, 2026",
    directAnswer:
      "The iHealth Track KN-550BT has a strong exact-model evidence packet: FDA clearance K160014, three commercial GUDID records, current standard and XL cuff packages, and a 2024 exact-model validation study that passed both reported criteria. Its numeric score and category rank remain withheld while MDRank completes and validates the deterministic scoring implementation.",
    disposition: "accepted-evidence-dossier",
    evidenceConfidence: "High",
    publicExperienceConfidence: "Insufficient",
    testingStatus: "Public evidence only. MDRank has not performed hands-on or laboratory testing of this monitor.",
    scoreStatus: "withheld",
    rankStatus: "withheld",
    scoreReason:
      "The category methodology is owner-approved, but the production scorer, normalized evidence adapter, fixtures, and commercial-isolation tests have not completed validation. Rank also requires a sufficiently complete eligible comparison cohort.",
    exactIdentity: [
      "Exact US model KN-550BT appears across FDA clearance K160014, manufacturer support, exact-model validation, and three commercial GUDID records.",
      "Primary DIs reviewed: 00850078377081, 00856362005005, and 00856362005395.",
      "The current manufacturer offer separates standard SKU 550BT with a 22–42 cm cuff from SKU 550BT-XL with a 42–48 cm cuff.",
      "No public official crosswalk was found mapping each of the three primary DIs to the standard versus XL retail package. The similarly named KN-550LT Track Pro is outside this dossier.",
    ],
    regulatoryFindings: [
      "FDA K160014 identifies the Wireless Blood Pressure Monitor, model KN-550BT, and records a substantially equivalent decision dated July 13, 2016.",
      "Three exact KN-550BT GUDID records identify an over-the-counter Class II noninvasive blood-pressure system in commercial distribution.",
      "Fourteen exact-model, alias, identifier, and clearance queries across the reviewed openFDA enforcement and recall/correction datasets returned no indexed match.",
      "A no-match query is not proof that no differently named, lot-specific, future, non-US, or unindexed action exists.",
      "FDA clearance is not FDA approval, endorsement, independent validation, or proof of superior accuracy.",
    ],
    validationFindings: [
      "A 2024 peer-reviewed paper names the exact KN-550BT model.",
      "The study reports 89 qualified participants and states that the device passed both reported AAMI/ESH/ISO criteria.",
      "The reviewed PubMed packet did not establish funding independence; MDRank does not convert the study into a hands-on-testing claim.",
    ],
    hsaFsa: {
      status: "Eligible per current exact-offer sources",
      basis:
        "The current manufacturer offer labels the Track standard and XL variants HSA/FSA eligible. HSA Shopping separately identifies the named iHealth Track offer as eligible.",
      limitations: [
        "Eligibility is displayed separately and does not affect the MDRank score or rank.",
        "MDRank did not complete checkout or test benefit-card acceptance.",
        "Plan rules, documentation requirements, seller coding, and reimbursement can vary.",
      ],
    },
    specifications: [
      { label: "Measurement method", value: "Oscillometric" },
      { label: "Standard package cuff", value: "22–42 cm (8.66–16.5 in)" },
      { label: "XL package cuff", value: "42–48 cm (16.5–18.9 in)" },
      { label: "Display", value: "Color-coded LCD" },
      { label: "On-device memory", value: "60 readings per reviewed exact-model support specification" },
      { label: "Connectivity", value: "Bluetooth with iHealth MyVitals synchronization" },
      { label: "Power", value: "Four 1.5V AAA batteries" },
      { label: "Manufacturer-stated pressure accuracy", value: "±3 mmHg" },
      { label: "Manufacturer-stated pulse accuracy", value: "±5%" },
    ],
    personaFit: [
      { persona: "Adult arm circumference 22–42 cm", fit: "Strong with standard package", confidence: "High", basis: "Current standard SKU cuff range." },
      { persona: "Adult arm circumference 42–48 cm", fit: "Strong with XL package", confidence: "High", basis: "Current XL SKU cuff range." },
      { persona: "User wanting readings without routine app use", fit: "Strong", confidence: "High", basis: "LCD and 60-reading on-device memory are documented; Bluetooth is used for synchronization." },
      { persona: "Two-person household requiring separate on-device user banks", fit: "Weak or unresolved", confidence: "Moderate", basis: "Reviewed exact sources document 60-reading memory but not separate two-user banks." },
      { persona: "Arm circumference outside 22–48 cm", fit: "Not supported by reviewed packages", confidence: "High", basis: "Current standard and XL package ranges together cover 22–48 cm." },
    ],
    limitations: [
      "MDRank did not perform hands-on, laboratory, or independent performance testing.",
      "No official public crosswalk maps the three exact GUDID DIs to SKU 550BT versus 550BT-XL.",
      "The validation paper's funding independence was not established from the reviewed PubMed packet.",
      "The manufacturer support source exposes manual-derived specifications, but a current standalone exact manual PDF was not exposed through the reviewed support route.",
      "An older manufacturer correction identifies a KN-550BT/KN-550LT cover typo; no KN-550LT evidence is transferred here.",
      "No licensed or API-permitted exact-model customer-review corpus was acquired.",
      "No product photograph is used under MDRank's owner-approved no-product-media launch policy.",
    ],
    sources: [
      { label: "FDA K160014 record", url: "https://api.fda.gov/device/510k.json?search=k_number:K160014&limit=10", sourceClass: "A" },
      { label: "Exact KN-550BT validation, PMID 37702596", url: "https://pubmed.ncbi.nlm.nih.gov/37702596/", sourceClass: "A" },
      { label: "iHealth KN-550BT specifications and display symbols", url: "https://support.ihealthlabs.com/hc/en-us/articles/34550216066445-FAQ-Specifications-and-display-Symbols-iHealth-Track-KN-550BT", sourceClass: "C" },
      { label: "iHealth KN-550BT memory and synchronization support", url: "https://support.ihealthlabs.com/hc/en-us/articles/8164457920525-FAQ-Reading-Measurements-in-Memory-Synchronize-data-Track-KN-550BT", sourceClass: "C" },
      { label: "Current iHealth Track manufacturer offer", url: "https://ihealthlabs.com/products/ihealth-track-connected-blood-pressure-monitor", sourceClass: "C" },
      { label: "HSA Shopping iHealth Track eligibility page", url: "https://www.hsashopping.com/products/ihealth-track-blood-pressure-monitor", sourceClass: "D" },
      { label: "iHealth privacy policy", url: "https://ihealthlabs.com/policies/privacy-policy", sourceClass: "C" },
    ],
    changeLog: ["July 22, 2026: First human-approved public evidence dossier. Score, rank, public-experience claims, and product imagery withheld."],
  },
  {
    slug: "omron-evolv-bp7000",
    name: "OMRON Evolv Wireless Upper Arm Blood Pressure Monitor",
    manufacturer: "OMRON Healthcare",
    model: "BP7000 / HEM-7600T-Z",
    market: "United States",
    category: "Upper-arm blood-pressure monitor",
    evidenceCutoff: "July 21, 2026",
    directAnswer:
      "The OMRON Evolv BP7000 has strong exact US regulatory identity and official manual documentation. Its peer-reviewed validation evidence carries a material family-level caveat because the paper and validation registry name HEM-7600T rather than the US BP7000/HEM-7600T-Z. Its score and category rank are therefore withheld while the deterministic scorer and comparison cohort are completed.",
    disposition: "accepted-evidence-dossier",
    evidenceConfidence: "Moderate",
    publicExperienceConfidence: "Insufficient",
    testingStatus: "Public evidence only. MDRank has not performed hands-on or laboratory testing of this monitor.",
    scoreStatus: "withheld",
    rankStatus: "withheld",
    scoreReason:
      "The production scorer and its tests are not yet validated. Exact applicability of HEM-7600T validation evidence to BP7000/HEM-7600T-Z remains a documented family-level caveat, and rank requires a sufficiently complete eligible category cohort.",
    exactIdentity: [
      "FDA K162092 names the Evolv model BP7000 and records product code DXN.",
      "AccessGUDID DI 00073796270001 identifies exact model BP7000 in US commercial distribution.",
      "The OMRON US manual places BP7000 and HEM-7600T-Z in the same specifications row.",
      "The validation paper and STRIDE BP entry name HEM-7600T, not BP7000 or HEM-7600T-Z; MDRank does not silently transfer exact-model validation status.",
    ],
    regulatoryFindings: [
      "FDA K162092 records a substantially equivalent decision dated November 22, 2016 for Evolv model BP7000.",
      "AccessGUDID exact DI 00073796270001 aligns BP7000 with K162092.",
      "Ten reviewed exact and alternate-name queries across openFDA enforcement and recall/correction datasets returned no indexed match.",
      "A no-match query is not proof that no differently named, lot-specific, future, non-US, or unindexed action exists.",
      "FDA clearance is not FDA approval, endorsement, independent validation, or proof of superior accuracy.",
    ],
    validationFindings: [
      "The peer-reviewed HEM-7600T study reports passing ANSI/AAMI/ISO 81060-2:2013 criteria in adults.",
      "The reviewed paper does not name BP7000 or HEM-7600T-Z.",
      "The HEM-7600T result is shown as family-level context, not exact BP7000 validation proof.",
    ],
    hsaFsa: {
      status: "Eligible per a named exact third-party listing",
      basis: "HSA Shopping identifies the exact OMRON Evolv BP7000 listing as HSA/FSA eligible.",
      limitations: [
        "The source is third-party eligibility guidance, not a plan-administrator determination.",
        "MDRank did not complete checkout, test a benefit card, or verify every linked seller and package.",
        "Eligibility is displayed separately and does not affect the MDRank score or rank.",
      ],
    },
    specifications: [
      { label: "Measurement method", value: "Oscillometric" },
      { label: "Integrated cuff range", value: "22–42 cm (9–17 in)" },
      { label: "Display", value: "OLED" },
      { label: "Internal memory", value: "Up to 100 measurements; prior stored readings require transfer to a smart device for viewing" },
      { label: "Connectivity", value: "Bluetooth Low Energy with OMRON connect" },
      { label: "Power", value: "Four AAA batteries" },
      { label: "Manufacturer-stated pressure accuracy", value: "±3 mmHg" },
      { label: "Manufacturer-stated pulse accuracy", value: "±5% of displayed reading" },
      { label: "Integrated cuff replaceability", value: "FDA summary states the cuff is not replaceable" },
    ],
    personaFit: [
      { persona: "Adult seeking a compact one-piece upper-arm format", fit: "Strong", confidence: "High", basis: "Attached cuff, tubeless format, and documented 22–42 cm range." },
      { persona: "Adult wanting app-based trend transfer", fit: "Strong", confidence: "High", basis: "Bluetooth Low Energy and OMRON connect are documented." },
      { persona: "Person avoiding smartphone use", fit: "Mixed", confidence: "High", basis: "Current readings work without a phone, but historical readings cannot be reviewed on the monitor." },
      { persona: "Household requiring separate on-device profiles", fit: "Poor or unverified", confidence: "Moderate", basis: "No two-user mode was established in the reviewed official evidence." },
      { persona: "Buyer prioritizing a replaceable cuff", fit: "Poor", confidence: "High", basis: "The FDA summary states the integrated cuff is not replaceable." },
    ],
    limitations: [
      "MDRank did not perform hands-on, laboratory, or independent performance testing.",
      "Exact validation applicability remains unresolved between HEM-7600T and the US BP7000/HEM-7600T-Z.",
      "The integrated cuff is not replaceable according to the FDA summary.",
      "Prior stored readings require a compatible smart device; app behavior and compatibility can change.",
      "Manufacturer portability, ease-of-use, movement-interference, and accuracy wording is not independent proof.",
      "No licensed or API-permitted exact-model customer-review corpus was acquired.",
      "No product photograph is used under MDRank's owner-approved no-product-media launch policy.",
    ],
    sources: [
      { label: "FDA 510(k) K162092 summary", url: "https://www.accessdata.fda.gov/cdrh_docs/pdf16/K162092.pdf", sourceClass: "A" },
      { label: "AccessGUDID DI 00073796270001", url: "https://accessgudid.nlm.nih.gov/api/v3/devices/lookup.json?di=00073796270001", sourceClass: "A" },
      { label: "OMRON Evolv BP7000 instruction manual", url: "https://omronhealthcare.com/storage/pdfs/evolv-wireless-upper-arm-blood-pressure-monitor-bp7000-im-en03022020.pdf", sourceClass: "C" },
      { label: "OMRON US BP7000 product page", url: "https://omronhealthcare.com/products/evolv-wireless-upper-arm-blood-pressure-monitor-bp7000", sourceClass: "C" },
      { label: "HEM-7600T validation, PMID 33577185", url: "https://pubmed.ncbi.nlm.nih.gov/33577185/", sourceClass: "A" },
      { label: "STRIDE BP HEM-7600T registry entry", url: "https://www.stridebp.org/device/omron-hem-7600t/", sourceClass: "A" },
      { label: "HSA Shopping BP7000 eligibility page", url: "https://www.hsashopping.com/products/omron-evolv-bp7000", sourceClass: "D" },
    ],
    changeLog: ["July 22, 2026: First human-approved public evidence dossier. Score, rank, public-experience claims, and product imagery withheld."],
  },
];

export function getPublishedDossier(slug: string): PublishedDossier | undefined {
  return publishedDossiers.find((dossier) => dossier.slug === slug);
}

export function requirePublishedDossier(slug: string): PublishedDossier {
  const dossier = getPublishedDossier(slug);
  if (!dossier) throw new Error(`Missing published dossier data for ${slug}.`);
  return dossier;
}

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

export type IllustrativePhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: "*Photo edited for clarity.";
  rightsStatus: "owned";
  rightsNote: string;
};

export type AmazonListing = {
  asin: string;
  listingNote: string;
};

export type HandlingMeter = "strong" | "mixed" | "limited" | "unsupported" | "documented";

export type HandlingGlanceItem = {
  id: string;
  label: string;
  summary: string;
  fit: string;
  confidence: string;
  meter: HandlingMeter;
};

export type HandlingReportRow = {
  id: string;
  criterion: string;
  finding: string;
  confidence: string;
  sourceClass: "A" | "C" | "D";
  sourceLabel: string;
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
  illustrativePhoto?: IllustrativePhoto;
  amazonListing?: AmazonListing;
  handlingGlance: HandlingGlanceItem[];
  handlingReport: HandlingReportRow[];
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
      "The iHealth Track KN-550BT has a strong exact-model evidence packet: FDA clearance K160014, three commercial GUDID records, current standard and XL cuff packages, and a 2024 exact-model validation study that passed both reported criteria. Its numeric score and category rank remain withheld until the comparison cohort is complete.",
    disposition: "accepted-evidence-dossier",
    evidenceConfidence: "High",
    publicExperienceConfidence: "Insufficient",
    testingStatus: "Public evidence only. MDRank has not performed hands-on or laboratory testing of this monitor.",
    scoreStatus: "withheld",
    rankStatus: "withheld",
    scoreReason:
      "MDRank publishes a numeric score and a category rank when the eligible comparison cohort is complete. That cohort is not complete for home blood-pressure monitors, so score and rank are withheld. Evidence Confidence is reported separately.",
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
      "The photograph on this page is an owner-supplied illustrative image edited for clarity. It is not manufacturer photography, clinical photography, or an MDRank hands-on or laboratory test.",
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
    changeLog: [
      "July 22, 2026: Evidence dossier published. Score, rank, and public-experience claims withheld.",
      "October 28, 2026: Score and rank remain withheld until the comparison cohort is complete. An owner-supplied illustrative photograph edited for clarity and a disclosed Amazon Associates link were added. Evidence cutoff unchanged.",
    ],
    handlingGlance: [
      { id: "cuff-fit", label: "Cuff fit", summary: "22–42 cm standard · 42–48 cm XL", fit: "Strong with the matching package", confidence: "High", meter: "strong" },
      { id: "memory", label: "Memory", summary: "60 readings on the device", fit: "Documented specification", confidence: "Stated in cited specifications", meter: "documented" },
      { id: "app-dependence", label: "App dependence", summary: "Readings available without routine app use", fit: "Strong", confidence: "High", meter: "strong" },
      { id: "multi-user", label: "Multi-user", summary: "Separate on-device user banks not documented", fit: "Weak or unresolved", confidence: "Moderate", meter: "limited" },
      { id: "power", label: "Power", summary: "Four 1.5V AAA batteries", fit: "Documented specification", confidence: "Stated in cited specifications", meter: "documented" },
      { id: "connectivity", label: "Connectivity", summary: "Bluetooth with iHealth MyVitals", fit: "Documented specification", confidence: "Stated in cited specifications", meter: "documented" },
    ],
    handlingReport: [
      { id: "cuff-standard", criterion: "Cuff fit, 22–42 cm", finding: "Strong with standard package. Standard package cuff: 22–42 cm (8.66–16.5 in).", confidence: "High", sourceClass: "C", sourceLabel: "Current iHealth Track manufacturer offer" },
      { id: "cuff-xl", criterion: "Cuff fit, 42–48 cm", finding: "Strong with XL package. XL package cuff: 42–48 cm (16.5–18.9 in).", confidence: "High", sourceClass: "C", sourceLabel: "Current iHealth Track manufacturer offer" },
      { id: "cuff-outside", criterion: "Cuff fit outside reviewed packages", finding: "Not supported by reviewed packages. Current standard and XL package ranges together cover 22–48 cm.", confidence: "High", sourceClass: "C", sourceLabel: "Current iHealth Track manufacturer offer" },
      { id: "memory", criterion: "On-device memory", finding: "60 readings per reviewed exact-model support specification.", confidence: "Stated in cited specifications", sourceClass: "C", sourceLabel: "iHealth KN-550BT memory and synchronization support" },
      { id: "app-dependence", criterion: "App dependence", finding: "Strong. LCD and 60-reading on-device memory are documented; Bluetooth is used for synchronization.", confidence: "High", sourceClass: "C", sourceLabel: "iHealth KN-550BT specifications and display symbols" },
      { id: "multi-user", criterion: "Multi-user", finding: "Weak or unresolved. Reviewed exact sources document 60-reading memory but not separate two-user banks.", confidence: "Moderate", sourceClass: "C", sourceLabel: "iHealth KN-550BT memory and synchronization support" },
      { id: "power", criterion: "Power", finding: "Four 1.5V AAA batteries.", confidence: "Stated in cited specifications", sourceClass: "C", sourceLabel: "iHealth KN-550BT specifications and display symbols" },
      { id: "connectivity", criterion: "Connectivity", finding: "Bluetooth with iHealth MyVitals synchronization.", confidence: "Stated in cited specifications", sourceClass: "C", sourceLabel: "iHealth KN-550BT memory and synchronization support" },
    ],
    illustrativePhoto: {
      src: "/devices/ihealth-track-kn-550bt/real-use.jpg",
      width: 1152,
      height: 864,
      alt: "Illustrative real-use photo edited for clarity, showing an upper-arm cuff and monitor for the iHealth Track KN-550BT. Not manufacturer or clinical photography.",
      caption: "*Photo edited for clarity.",
      rightsStatus: "owned",
      rightsNote: "Owner-supplied illustrative photograph edited for clarity. Rights status: owned. It is not manufacturer photography, clinical photography, or an MDRank hands-on or laboratory test.",
    },
    amazonListing: {
      asin: "B01C5QS1T8",
      listingNote:
        "Amazon.com product details for ASIN B01C5QS1T8 list model name KN-550BT, model number 550BT, and UPC 856362005005. That UPC matches reviewed DI 00856362005005. The listing describes an upper-arm cuff of 22–42 cm, the standard package in this dossier, and leaves the XL package unresolved. Amazon marketing copy is not MDRank evidence.",
    },
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
      "The OMRON Evolv BP7000 has strong exact US regulatory identity and official manual documentation. Its peer-reviewed validation evidence carries a material family-level caveat because the paper and validation registry name HEM-7600T rather than the US BP7000/HEM-7600T-Z. Its score and category rank are withheld until the comparison cohort is complete.",
    disposition: "accepted-evidence-dossier",
    evidenceConfidence: "Moderate",
    publicExperienceConfidence: "Insufficient",
    testingStatus: "Public evidence only. MDRank has not performed hands-on or laboratory testing of this monitor.",
    scoreStatus: "withheld",
    rankStatus: "withheld",
    scoreReason:
      "MDRank publishes a numeric score and a category rank when the eligible comparison cohort is complete. That cohort is not complete for home blood-pressure monitors, so score and rank are withheld. Exact applicability of HEM-7600T validation evidence to BP7000/HEM-7600T-Z remains a documented family-level caveat.",
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
      "The photograph on this page is an owner-supplied illustrative image edited for clarity. It is not manufacturer photography, clinical photography, or an MDRank hands-on or laboratory test.",
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
    changeLog: [
      "July 22, 2026: Evidence dossier published. Score, rank, and public-experience claims withheld.",
      "October 28, 2026: Score and rank remain withheld until the comparison cohort is complete. An owner-supplied illustrative photograph edited for clarity and a disclosed Amazon Associates link were added. Evidence cutoff unchanged.",
    ],
    handlingGlance: [
      { id: "cuff-fit", label: "Cuff fit", summary: "22–42 cm integrated cuff", fit: "Strong", confidence: "High", meter: "strong" },
      { id: "replaceable-cuff", label: "Replaceable cuff", summary: "Integrated cuff is not replaceable", fit: "Poor", confidence: "High", meter: "limited" },
      { id: "memory", label: "Memory", summary: "Up to 100 readings; history needs a phone", fit: "Mixed", confidence: "High", meter: "mixed" },
      { id: "app-dependence", label: "App dependence", summary: "Current reading works without a phone", fit: "Mixed", confidence: "High", meter: "mixed" },
      { id: "multi-user", label: "Multi-user", summary: "Separate on-device profiles not established", fit: "Poor or unverified", confidence: "Moderate", meter: "limited" },
      { id: "power", label: "Power", summary: "Four AAA batteries", fit: "Documented specification", confidence: "Stated in cited specifications", meter: "documented" },
      { id: "connectivity", label: "Connectivity", summary: "Bluetooth Low Energy, OMRON connect", fit: "Documented specification", confidence: "Stated in cited specifications", meter: "documented" },
    ],
    handlingReport: [
      { id: "cuff-fit", criterion: "Cuff fit", finding: "Strong for a compact one-piece upper-arm format. Integrated cuff range: 22–42 cm (9–17 in).", confidence: "High", sourceClass: "C", sourceLabel: "OMRON Evolv BP7000 instruction manual" },
      { id: "replaceable-cuff", criterion: "Replaceable cuff", finding: "Poor. The FDA summary states the integrated cuff is not replaceable.", confidence: "High", sourceClass: "A", sourceLabel: "FDA 510(k) K162092 summary" },
      { id: "memory", criterion: "On-device memory", finding: "Up to 100 measurements; prior stored readings require transfer to a smart device for viewing.", confidence: "High", sourceClass: "C", sourceLabel: "OMRON Evolv BP7000 instruction manual" },
      { id: "app-dependence", criterion: "App dependence", finding: "Mixed. Current readings work without a phone, but historical readings cannot be reviewed on the monitor.", confidence: "High", sourceClass: "C", sourceLabel: "OMRON Evolv BP7000 instruction manual" },
      { id: "multi-user", criterion: "Multi-user", finding: "Poor or unverified. No two-user mode was established in the reviewed official evidence.", confidence: "Moderate", sourceClass: "C", sourceLabel: "OMRON Evolv BP7000 instruction manual" },
      { id: "power", criterion: "Power", finding: "Four AAA batteries.", confidence: "Stated in cited specifications", sourceClass: "C", sourceLabel: "OMRON Evolv BP7000 instruction manual" },
      { id: "connectivity", criterion: "Connectivity", finding: "Bluetooth Low Energy with OMRON connect.", confidence: "Stated in cited specifications", sourceClass: "C", sourceLabel: "OMRON US BP7000 product page" },
    ],
    illustrativePhoto: {
      src: "/devices/omron-evolv-bp7000/real-use.jpg",
      width: 1152,
      height: 864,
      alt: "Illustrative real-use photo edited for clarity, showing an upper-arm cuff monitor for the OMRON Evolv BP7000. Not manufacturer or clinical photography.",
      caption: "*Photo edited for clarity.",
      rightsStatus: "owned",
      rightsNote: "Owner-supplied illustrative photograph edited for clarity. Rights status: owned. It is not manufacturer photography, clinical photography, or an MDRank hands-on or laboratory test.",
    },
    amazonListing: {
      asin: "B01MRL790Q",
      listingNote:
        "Amazon.com product details for ASIN B01MRL790Q list model BP7000 and UPC 073796270001. That UPC matches reviewed DI 00073796270001. The listing describes an upper-arm monitor. Amazon marketing copy is not MDRank evidence.",
    },
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

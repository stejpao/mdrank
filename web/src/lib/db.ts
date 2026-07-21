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

type FallbackRoot = {
  landing?: LandingCopy;
  devices: DeviceWithReview[];
};

function fromFallback(): FallbackRoot {
  return fallbackData as unknown as FallbackRoot;
}

function applyFilters(items: DeviceWithReview[], filters: DeviceFilters): DeviceWithReview[] {
  let result = [...items];

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

// The inherited SQL schema and rows are intentionally unreachable. A future evidence-v1
// adapter must validate the exact-model contract and publication gate before it can replace
// this reviewed public fallback.
export async function getLandingCopy(): Promise<LandingCopy> {
  return fromFallback().landing ?? {
    hero_title: "MDRank — Medical devices, ranked by evidence",
    hero_body: "Exact-model records, traceable sources, deterministic methods, and human-approved publication.",
  };
}

export async function getDevices(filters: DeviceFilters = {}): Promise<DeviceWithReview[]> {
  return applyFilters(fromFallback().devices ?? [], filters);
}

export async function getDeviceBySlug(slug: string): Promise<DeviceWithReview | null> {
  const devices = await getDevices();
  return devices.find((d) => d.device.slug === slug) ?? null;
}

export async function getReviewBySlug(slug: string): Promise<(DeviceWithReview & { review: Review }) | null> {
  const devices = await getDevices();
  return devices.find((d) => d.review.slug === slug) ?? null;
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
  const list = await getDevices(filters);
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

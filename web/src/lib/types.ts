export type FdaStatus =
  | "fda_510k_cleared"
  | "fda_registered"
  | "not_fda_regulated"
  | "unknown";

export interface Device {
  id?: string;
  slug: string;
  name: string;
  manufacturer: string;
  mdrank_score: number;
  fda_status: FdaStatus;
  connectivity?: string;
  retail_price?: number | null;
  spec_json?: Record<string, string>;
  image_url?: string;
  overview?: string;
  key_features?: string[];
  is_editors_choice?: boolean;
  is_synthetic?: boolean;
  rank_in_subcategory?: number;
  subcategory_slugs?: string[];
  category_slug?: string;
}

export interface ReviewSection {
  section_type: string;
  heading: string;
  body: string;
  sort_order: number;
}

export interface Review {
  slug: string;
  title: string;
  excerpt?: string;
  strengths?: string[];
  limitations?: string[];
  recommend_if?: string[];
  avoid_if?: string[];
  sections?: ReviewSection[];
}

export interface DeviceWithReview {
  device: Device;
  review: Review;
}

export interface Category {
  slug: string;
  name: string;
  subcategories: { slug: string; name: string }[];
}

export type SortField = "score" | "price";
export type SortDir = "asc" | "desc";

export interface DeviceFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  manufacturer?: string;
  fda_status?: string;
  sort?: SortField;
  dir?: SortDir;
}

export interface LandingCopy {
  hero_title?: string;
  hero_body?: string;
  sections?: { heading: string; body: string }[];
}

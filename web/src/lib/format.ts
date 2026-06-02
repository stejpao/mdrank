import type { FdaStatus } from "./types";

export function formatFdaStatus(status: FdaStatus | string): string {
  const map: Record<string, string> = {
    fda_510k_cleared: "FDA 510(k) Cleared",
    fda_registered: "FDA Registered",
    not_fda_regulated: "Not FDA Regulated",
    unknown: "Unknown",
  };
  return map[status] ?? status;
}

export function fdaBadgeClass(status: FdaStatus | string): string {
  if (status === "fda_510k_cleared") return "fda-badge fda-cleared";
  if (status === "fda_registered") return "fda-badge fda-registered";
  return "fda-badge fda-unknown";
}

export function scoreBadgeClass(score: number): string {
  if (score >= 90) return "score-badge score-high";
  if (score >= 75) return "score-badge score-mid";
  return "score-badge score-low";
}

export function formatPrice(price?: number | null): string {
  if (price == null) return "N/A";
  return `$${price.toFixed(0)}`;
}

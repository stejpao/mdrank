export const AMAZON_ASSOCIATES_TAG = "sjpenterpri05-20";

const ASIN_PATTERN = /^[A-Z0-9]{10}$/;

export function amazonAssociateUrl(asin: string): string | null {
  if (!ASIN_PATTERN.test(asin)) return null;
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_ASSOCIATES_TAG}`;
}

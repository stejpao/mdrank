import type { AmazonCanadaLocalMatch } from "@/data/publishedDossiers";

export function AmazonCanadaNote({
  asin,
  canadaLocalMatch,
  id,
}: {
  asin: string;
  canadaLocalMatch: AmazonCanadaLocalMatch;
  id?: string;
}) {
  if (canadaLocalMatch === "confirmed") {
    return (
      <div id={id} className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4" data-field="amazon-canada-local-match" role="note">
        <p className="text-sm font-semibold text-amber-950">Canada shoppers: check the product on Amazon</p>
        <p className="mt-2 text-sm leading-relaxed text-amber-950">
          This link is the US amazon.com exact-model ASIN {asin}. Amazon may show Canadian shoppers an Amazon.ca &ldquo;Local match&rdquo; similar product that is not this exact model. A Local match does not appear on every visit. Check the product title and model on Amazon before buying.
        </p>
      </div>
    );
  }

  return (
    <div id={id} className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4" data-field="amazon-canada-local-match" role="note">
      <p className="text-sm leading-relaxed text-slate-800">
        No Amazon.ca Local-match substitute is documented for this listing. This link is the US amazon.com exact-model ASIN {asin}. Check the product title and model on Amazon before buying.
      </p>
    </div>
  );
}

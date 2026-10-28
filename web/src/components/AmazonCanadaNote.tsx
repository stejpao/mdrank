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
        <p className="text-sm font-semibold text-amber-950">Canada shoppers: Amazon may substitute a different product</p>
        <p className="mt-2 text-sm leading-relaxed text-amber-950">
          Canadian visitors may see an Amazon.ca &ldquo;Local match&rdquo; substitute product that is not the exact model on this dossier. This link stays the US amazon.com exact-model listing (ASIN {asin}). Amazon may substitute a different product for local shoppers. Check the title and model number on Amazon before buying.
        </p>
      </div>
    );
  }

  return (
    <div id={id} className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4" data-field="amazon-canada-local-match" role="note">
      <p className="text-sm leading-relaxed text-slate-800">
        No Amazon.ca Local-match substitute is documented for this listing. This link stays the US amazon.com exact-model listing (ASIN {asin}). Check the title and model number on Amazon before buying.
      </p>
    </div>
  );
}

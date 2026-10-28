import type { Metadata } from "next";

import { DossierCatalog } from "@/components/DossierCatalog";
import { PublicPageJsonLd } from "@/components/PublicPageJsonLd";
import { publishedDossiers } from "@/data/publishedDossiers";
import { isPublicUpperArmDossier } from "@/lib/catalog";
import { socialMetadata } from "@/lib/pageMetadata";
import { getPublicScore } from "@/lib/publicScore";

const description = "Exact-model upper-arm evidence dossiers. MDRank Score and category rank appear when the row is scored-eligible. Evidence Confidence stays separate. Incomplete exact-model evidence stays unranked.";

export const metadata: Metadata = {
  title: "Published Medical-Device Evidence Dossiers",
  description,
  alternates: { canonical: "/devices" },
  robots: { index: true, follow: true },
  ...socialMetadata({
    title: "Published Medical-Device Evidence Dossiers",
    description,
    path: "/devices",
    ogType: "website",
  }),
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function DossiersIndexPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const dossiers = publishedDossiers.filter(isPublicUpperArmDossier).map((dossier) => {
    const score = getPublicScore(dossier.slug);
    return {
      slug: dossier.slug,
      name: dossier.name,
      manufacturer: dossier.manufacturer,
      model: dossier.model,
      category: dossier.category,
      directAnswer: dossier.directAnswer,
      evidenceConfidence: dossier.evidenceConfidence,
      scoreLabel: score.scoreLabel,
      rankLabel: score.rankLabel,
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <PublicPageJsonLd path="/devices" />
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Published records</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Upper-arm blood-pressure evidence dossiers</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-700">
        These exact-model dossiers are published. A published dossier is not a recommendation, a hands-on test, or a customer-review summary. MDRank Score and category rank use rubric upper-arm-home-bp-v1.0.0 and appear only when the row is scored-eligible. Search and brand filters cover this upper-arm catalog. The list stays in publication order.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-800">
        <strong>Score and rank stay withheld when exact-model evidence is incomplete.</strong>
        <p className="mt-2">Evidence Confidence is shown on each dossier and is separate from the product score. Family-level validation stays on the unranked path.</p>
      </div>

      <div className="mt-8">
        <DossierCatalog
          dossiers={dossiers}
          initialQuery={firstParam(params.q)}
          initialBrand={firstParam(params.brand)}
        />
      </div>
    </div>
  );
}

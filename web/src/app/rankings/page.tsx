import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { DeviceTable } from "@/components/DeviceTable";
import { RankingsFilters } from "@/components/RankingsFilters";
import { publishedDossiers } from "@/data/publishedDossiers";
import { CATEGORIES, getDevices, getManufacturers, getStats } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { listPublicScores } from "@/lib/publicScore";
import type { DeviceFilters, SortField } from "@/lib/types";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export const metadata: Metadata = {
  title: "Medical-Device Rankings",
  description:
    "Upper-arm home blood-pressure ranks under rubric upper-arm-home-bp-v1.0.0. Scored-eligible dossiers show an MDRank Score and category rank. Incomplete exact-model evidence stays unranked.",
  alternates: { canonical: "/rankings" },
  robots: { index: false, follow: true },
};

export default async function RankingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const categorySlug = params.category ?? "blood-pressure";
  const category = CATEGORIES.find((c) => c.slug === categorySlug);

  const filters: DeviceFilters = {
    category: categorySlug,
    subcategory: params.subcategory,
    search: params.search,
    manufacturer: params.manufacturer,
    fda_status: params.fda_status,
    sort: (params.sort as SortField) ?? "score",
    dir: "desc",
  };

  const [devices, manufacturers, stats] = await Promise.all([
    getDevices(filters),
    getManufacturers(),
    getStats(filters),
  ]);
  const upperArmScores = categorySlug === "blood-pressure" ? listPublicScores() : [];
  const ranked = upperArmScores.filter((row) => row.rankStatus === "published").sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
  const unranked = upperArmScores.filter((row) => row.rankStatus !== "published");
  const dossierName = (slug: string) => publishedDossiers.find((dossier) => dossier.slug === slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {category?.name ?? "Medical Device"} Rankings
        </h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          {categorySlug === "blood-pressure"
            ? "Rubric upper-arm-home-bp-v1.0.0. Rank is among scored-eligible public dossiers only. Rows with incomplete exact-model evidence stay unranked. Evidence Confidence is separate from the MDRank Score."
            : "This category has no public scored cohort."}
        </p>
        {category && devices.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {category.subcategories.map((sub) => (
              <a
                key={sub.slug}
                href={`/rankings?category=${category.slug}&subcategory=${sub.slug}`}
                className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-800 hover:bg-indigo-100"
              >
                {sub.name}
              </a>
            ))}
          </div>
        )}
      </div>

      {devices.length === 0 && ranked.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-7 text-slate-800">
          <h2 className="text-xl font-bold text-slate-950">No scored cohort in this category</h2>
          <p className="mt-3 max-w-3xl leading-relaxed">
            MDRank publishes a category rank for scored-eligible exact-model rows. This category does not have one. Published upper-arm dossiers report exact-model findings and Evidence Confidence.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/devices" className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800">
              Read evidence dossiers
            </Link>
            <Link href="/methodology" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
              Read the methodology
            </Link>
          </div>
        </section>
      ) : devices.length === 0 ? (
        <div className="space-y-8">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">Scored-eligible upper-arm dossiers under {ranked[0]?.rubricVersion}</caption>
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">MDRank Score</th>
                  <th className="px-4 py-3">Evidence Confidence</th>
                  <th className="px-4 py-3">Clearance</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((row) => {
                  const dossier = dossierName(row.slug);
                  return (
                    <tr key={row.slug} className="border-t border-slate-100">
                      <td className="px-4 py-4 font-semibold text-slate-950">{row.rankLabel}</td>
                      <td className="px-4 py-4">
                        <Link href={`/devices/${row.slug}`} className="font-semibold text-indigo-800 hover:underline">{dossier?.name ?? row.slug}</Link>
                        <div className="text-xs text-slate-500">{dossier?.model}</div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-950">{row.scoreLabel} / 100</td>
                      <td className="px-4 py-4">{row.evidenceConfidence}</td>
                      <td className="px-4 py-4">{row.clearanceLabel}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {unranked.length > 0 ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-bold text-slate-950">Published and unranked</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">These public dossiers stay in the catalog. Their score and rank stay withheld because exact-model evidence is incomplete.</p>
              <ul className="mt-4 space-y-3">
                {unranked.map((row) => {
                  const dossier = dossierName(row.slug);
                  return (
                    <li key={row.slug} className="rounded-xl border border-slate-100 p-4">
                      <Link href={`/devices/${row.slug}`} className="font-semibold text-indigo-800 hover:underline">{dossier?.name ?? row.slug}</Link>
                      <p className="mt-1 text-sm text-slate-600">Score {row.scoreLabel} · Rank {row.rankLabel} · Evidence Confidence {row.evidenceConfidence} · {row.clearanceLabel}</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700">{row.rankDetail}</p>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}
        </div>
      ) : (
        <>
          <Suspense fallback={<div className="h-24 animate-pulse rounded-xl bg-slate-100" />}>
            <RankingsFilters manufacturers={manufacturers} />
          </Suspense>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
            <span>Showing <strong>{devices.length}</strong> devices</span>
            <span>Avg MDRank: <strong>{stats.avgScore}</strong></span>
            <span>{formatPrice(stats.minPrice)} – {formatPrice(stats.maxPrice)}</span>
          </div>

          <div className="mt-6">
            <DeviceTable devices={devices} />
          </div>
        </>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { DeviceTable } from "@/components/DeviceTable";
import { RankingsFilters } from "@/components/RankingsFilters";
import { CATEGORIES, getDevices, getManufacturers, getStats } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import type { DeviceFilters, SortField } from "@/lib/types";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export const metadata: Metadata = {
  title: "Medical-Device Rankings",
  description:
    "Evidence-led medical-device rankings will appear after exact-model verification, methodology checks, and human publication approval.",
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {category?.name ?? "Medical Device"} Rankings
        </h1>
        <p className="mt-2 text-slate-600">
          Exact-model comparisons built from traceable evidence and a versioned category methodology.
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

      {devices.length === 0 ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-7 text-amber-950">
          <h2 className="text-xl font-bold">Public rankings are temporarily withheld</h2>
          <p className="mt-3 max-w-3xl leading-relaxed">
            MDRank removed inherited placeholder scores and unsupported testing claims. Rankings will return only after exact-model identity, evidence, deterministic scoring, and human publication gates pass.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/methodology" className="rounded-lg bg-amber-900 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-950">
              Read the methodology
            </Link>
            <Link href="/evidence-status" className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-semibold hover:bg-amber-100">
              View evidence-system status
            </Link>
          </div>
        </section>
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

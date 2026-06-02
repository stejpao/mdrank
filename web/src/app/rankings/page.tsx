import { Suspense } from "react";

import { DeviceTable } from "@/components/DeviceTable";
import { RankingsFilters } from "@/components/RankingsFilters";
import { CATEGORIES, getDevices, getManufacturers, getStats } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import type { DeviceFilters, SortField } from "@/lib/types";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

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
          Best {category?.name ?? "Devices"}
        </h1>
        <p className="mt-2 text-slate-600">MDRank rankings and hands-on performance comparison</p>
        {category && (
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
    </div>
  );
}

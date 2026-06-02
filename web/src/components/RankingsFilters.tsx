"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface RankingsFiltersProps {
  manufacturers: string[];
}

export function RankingsFilters({ manufacturers }: RankingsFiltersProps) {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.push(`/rankings?${next.toString()}`);
    },
    [params, router]
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">Filters</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Search</label>
          <input
            type="text"
            defaultValue={params.get("search") ?? ""}
            placeholder="Device or brand..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            onChange={(e) => update("search", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Brand</label>
          <select
            defaultValue={params.get("manufacturer") ?? ""}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            onChange={(e) => update("manufacturer", e.target.value)}
          >
            <option value="">All Brands</option>
            {manufacturers.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">FDA Status</label>
          <select
            defaultValue={params.get("fda_status") ?? ""}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            onChange={(e) => update("fda_status", e.target.value)}
          >
            <option value="">All</option>
            <option value="fda_510k_cleared">FDA 510(k) Cleared</option>
            <option value="fda_registered">FDA Registered</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Sort By</label>
          <select
            defaultValue={params.get("sort") ?? "score"}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            onChange={(e) => update("sort", e.target.value)}
          >
            <option value="score">MDRank Score</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type CatalogDossier = {
  slug: string;
  name: string;
  manufacturer: string;
  model: string;
  category: string;
  directAnswer: string;
  evidenceConfidence: string;
  scoreLabel: string;
  rankLabel: string;
};

type DossierCatalogProps = {
  dossiers: CatalogDossier[];
  initialQuery: string;
  initialBrand: string;
};

function writeCatalogQuery(query: string, brand: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (brand) params.set("brand", brand);
  const qs = params.toString();
  const path = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
  window.history.replaceState(null, "", path);
}

function brandSelected(manufacturer: string, brand: string) {
  return manufacturer.toLowerCase() === brand.toLowerCase();
}

export function DossierCatalog({ dossiers, initialQuery, initialBrand }: DossierCatalogProps) {
  const [query, setQuery] = useState(initialQuery);
  const [brand, setBrand] = useState(initialBrand);

  useEffect(() => {
    setQuery(initialQuery);
    setBrand(initialBrand);
  }, [initialQuery, initialBrand]);

  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") ?? "");
      setBrand(params.get("brand") ?? "");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const brands = Array.from(new Set(dossiers.map((dossier) => dossier.manufacturer))).sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base" })
  );
  const normalizedQuery = query.trim().toLowerCase();
  const visible = dossiers.filter((dossier) => {
    if (brand && !brandSelected(dossier.manufacturer, brand)) return false;
    if (!normalizedQuery) return true;
    const haystack = `${dossier.name} ${dossier.model} ${dossier.manufacturer} ${dossier.category}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
  const filtersActive = query !== "" || brand !== "";

  function updateQuery(next: string) {
    setQuery(next);
    writeCatalogQuery(next, brand);
  }

  function updateBrand(next: string) {
    setBrand(next);
    writeCatalogQuery(query, next);
  }

  function clearFilters() {
    setQuery("");
    setBrand("");
    writeCatalogQuery("", "");
  }

  return (
    <div>
      <div className="z-20 -mx-4 border-b border-slate-200/80 bg-slate-50/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 md:sticky md:top-0">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <label htmlFor="dossier-search" className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Search
              </label>
              <input
                id="dossier-search"
                type="search"
                value={query}
                placeholder="Model, name, or brand"
                autoComplete="off"
                onChange={(event) => updateQuery(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            {filtersActive ? (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
              >
                Clear filters
              </button>
            ) : null}
          </div>

          <fieldset className="mt-4">
            <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Brand</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              <label
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-semibold transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-700 ${
                  brand === ""
                    ? "border-indigo-700 bg-indigo-700 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50"
                }`}
              >
                <input
                  type="radio"
                  name="catalog-brand"
                  value=""
                  checked={brand === ""}
                  onChange={() => updateBrand("")}
                  className="sr-only"
                />
                All brands
              </label>
              {brands.map((manufacturer) => {
                const selected = brandSelected(manufacturer, brand);
                return (
                  <label
                    key={manufacturer}
                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-semibold transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-700 ${
                      selected
                        ? "border-indigo-700 bg-indigo-700 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="catalog-brand"
                      value={manufacturer}
                      checked={selected}
                      onChange={() => updateBrand(manufacturer)}
                      className="sr-only"
                    />
                    {manufacturer}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      </div>

      <p className="mt-5 text-sm text-slate-600" aria-live="polite">
        Showing <strong>{visible.length}</strong> of <strong>{dossiers.length}</strong> published upper-arm dossiers. Listed in publication order.
      </p>

      {visible.length === 0 ? (
        <div className="motion-safe:animate-catalog-rise mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-slate-700">
          <h2 className="text-lg font-bold text-slate-950">No matching dossier</h2>
          <p className="mt-2 max-w-2xl leading-relaxed">
            No published upper-arm dossier matches that search. Devices without a human-approved public record stay off this catalog.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {visible.map((dossier, index) => (
            <article
              key={dossier.slug}
              className="catalog-card motion-safe:animate-catalog-rise flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">{dossier.category}</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{dossier.name}</h2>
              <p className="mt-1 text-sm text-slate-500">
                Exact model: {dossier.model}
                <span className="mx-1.5 text-slate-300">·</span>
                {dossier.manufacturer}
              </p>
              <p className="mt-4 line-clamp-4 leading-relaxed text-slate-700">{dossier.directAnswer}</p>
              <dl className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl bg-slate-100 px-2 py-3">
                  <dt className="font-semibold uppercase tracking-wide text-slate-500">Score</dt>
                  <dd className="mt-1 font-bold text-slate-900">{dossier.scoreLabel}</dd>
                </div>
                <div className="rounded-xl bg-slate-100 px-2 py-3">
                  <dt className="font-semibold uppercase tracking-wide text-slate-500">Rank</dt>
                  <dd className="mt-1 font-bold text-slate-900">{dossier.rankLabel}</dd>
                </div>
                <div className="rounded-xl bg-indigo-50 px-2 py-3">
                  <dt className="font-semibold uppercase tracking-wide text-indigo-700">Evidence</dt>
                  <dd className="mt-1 font-bold text-indigo-950">{dossier.evidenceConfidence}</dd>
                </div>
              </dl>
              <Link
                href={`/devices/${dossier.slug}`}
                className="mt-5 inline-flex w-fit rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
              >
                Read the evidence dossier
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

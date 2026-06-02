import Link from "next/link";

import { DeviceTable } from "@/components/DeviceTable";
import { CATEGORIES, getDevices, getLandingCopy, getStats } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export default async function HomePage() {
  const [landing, devices, stats] = await Promise.all([
    getLandingCopy(),
    getDevices({ sort: "score", dir: "desc" }),
    getStats(),
  ]);

  const topDevices = devices.slice(0, 10);
  const editorsChoice = devices.find((d) => d.device.is_editors_choice);

  return (
    <div>
      <section className="bg-gradient-to-br from-indigo-950 to-indigo-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {landing.hero_title ?? "MDRank — Data-Driven Device Rankings"}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-indigo-100">
            {landing.hero_body ??
              "Independent hands-on evaluations with unique MDRank Scores across five health device categories."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/rankings?category=${cat.slug}`}
                className="rounded-lg border border-white/25 px-4 py-2 text-sm font-medium hover:bg-white/10"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {editorsChoice && (
        <section className="border-b border-amber-100 bg-amber-50">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-amber-700">Editor&apos;s Choice</span>
              <div className="font-semibold text-amber-950">{editorsChoice.device.name}</div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-amber-900">{editorsChoice.device.mdrank_score}/100</span>
              <Link href={`/devices/${editorsChoice.device.slug}`} className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800">
                View Review
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Device Comparisons</h2>
            <p className="mt-1 text-sm text-slate-500">MDRank Score, FDA status, connectivity, and price</p>
          </div>
          <div className="flex gap-6 text-sm text-slate-600">
            <span><strong>{stats.count}</strong> devices</span>
            <span>Avg MDRank: <strong>{stats.avgScore}</strong></span>
            <span>{formatPrice(stats.minPrice)} – {formatPrice(stats.maxPrice)}</span>
          </div>
        </div>
        <DeviceTable devices={topDevices} />
      </section>
    </div>
  );
}

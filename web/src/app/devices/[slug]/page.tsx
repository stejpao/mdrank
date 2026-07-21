import Link from "next/link";
import { notFound } from "next/navigation";

import { ScoreBadge } from "@/components/ScoreBadge";
import { getDeviceBySlug, getDevices } from "@/lib/db";
import { fdaBadgeClass, formatFdaStatus, formatPrice } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DevicePage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getDeviceBySlug(slug);
  if (!item) notFound();

  const { device, review } = item;
  const peers = (await getDevices({ category: device.category_slug, sort: "score", dir: "desc" }))
    .filter((d) => d.device.slug !== slug)
    .slice(0, 3);

  const specs = device.spec_json ?? {};

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-2 text-sm text-slate-500">{device.manufacturer}</div>
          <h1 className="text-3xl font-bold text-slate-900">{device.name}</h1>
          {device.is_editors_choice && (
            <span className="mt-2 inline-block rounded bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
              Editor&apos;s Choice
            </span>
          )}

          {device.key_features && device.key_features.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold">Key Features</h2>
              <ul className="mt-3 space-y-2">
                {device.key_features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-slate-700">
                    <span className="text-emerald-600">✓</span>{f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {device.overview && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold">Overview</h2>
              <p className="mt-3 text-slate-700 leading-relaxed">{device.overview}</p>
            </section>
          )}

          {Object.keys(specs).length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold">Specifications</h2>
              <dl className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-4 px-4 py-3">
                    <dt className="text-sm font-medium capitalize text-slate-500">{key.replace(/_/g, " ")}</dt>
                    <dd className="text-sm text-slate-800">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {review?.excerpt && (
            <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold">Evidence Summary</h2>
              <p className="mt-3 italic text-slate-700">&ldquo;{review.excerpt}&rdquo;</p>
              {review.slug && (
                <Link href={`/reviews/${review.slug}`} className="mt-4 inline-block text-sm font-semibold text-indigo-700 hover:underline">
                  Read the full evidence dossier →
                </Link>
              )}
            </section>
          )}
        </div>

        <aside>
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <ScoreBadge score={device.mdrank_score} size="lg" />
            <div className="mt-2 text-sm text-slate-500">MDRank Score /100</div>
            <div className="mt-4 text-2xl font-bold">{formatPrice(device.retail_price)}</div>
            <div className="mt-2">
              <span className={fdaBadgeClass(device.fda_status)}>{formatFdaStatus(device.fda_status)}</span>
            </div>
            {device.connectivity && (
              <div className="mt-3 text-sm text-slate-600">{device.connectivity}</div>
            )}
          </div>
        </aside>
      </div>

      {peers.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold">Similar Devices</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {peers.map(({ device: d }) => (
              <Link key={d.slug} href={`/devices/${d.slug}`} className="rounded-xl border border-slate-200 bg-white p-4 hover:border-indigo-300">
                <div className="font-semibold text-indigo-800">{d.name}</div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="font-bold">{d.mdrank_score}/100</span>
                  <span>{formatPrice(d.retail_price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

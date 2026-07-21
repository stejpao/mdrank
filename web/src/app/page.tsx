import Link from "next/link";

import { CATEGORIES, getDevices, getLandingCopy } from "@/lib/db";

export default async function HomePage() {
  const [landing, devices] = await Promise.all([getLandingCopy(), getDevices()]);
  const approvedCount = devices.length;

  return (
    <div>
      <section className="bg-gradient-to-br from-indigo-950 to-indigo-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-200">MDRank Evidence Engine</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
            {landing.hero_title ?? "MDRank — Medical devices, ranked by evidence"}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-indigo-100">
            {landing.hero_body ?? "Exact-model records, traceable sources, deterministic methods, and human-approved publication."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/methodology" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-indigo-950 hover:bg-indigo-50">Read the methodology</Link>
            <Link href="/evidence-status" className="rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/10">Evidence-system status</Link>
          </div>
        </div>
      </section>

      <section className="border-b border-amber-200 bg-amber-50">
        <div className="mx-auto max-w-7xl px-4 py-5 text-sm text-amber-950 sm:px-6">
          <strong>Integrity reset:</strong> inherited placeholder scores and unsupported hands-on claims have been removed from public ranking output. No product will be ranked until its exact-model evidence and human approval gates pass.
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">Current public corpus</p>
            <p className="mt-3 text-4xl font-bold text-slate-950">{approvedCount}</p>
            <p className="mt-2 text-sm text-slate-600">Evidence-approved product dossiers. Candidate discovery is not counted as approval.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">Initial focus</p>
            <h2 className="mt-3 text-xl font-bold text-slate-950">Home blood-pressure monitors</h2>
            <p className="mt-2 text-sm text-slate-600">The first 90 days prioritize exact-model identity, validation status, cuff fit, support, ownership cost, and evidence gaps.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">Publication rule</p>
            <h2 className="mt-3 text-xl font-bold text-slate-950">Evidence plus human approval</h2>
            <p className="mt-2 text-sm text-slate-600">Automation can research, validate, score, and build a preview. A human must approve every new public product URL.</p>
          </article>
        </div>
      </section>

      <section className="bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-950">Planned category coverage</h2>
          <p className="mt-2 max-w-3xl text-slate-600">Only blood-pressure work is active. Adjacent categories remain private until their category-specific evidence and scoring rules are ready.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map((category) => (
              <div key={category.slug} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="font-semibold text-slate-900">{category.name}</div>
                <div className="mt-1 text-xs text-slate-500">{category.slug === "blood-pressure" ? "Active evidence build" : "Private readiness only"}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";

import { PublicPageJsonLd } from "@/components/PublicPageJsonLd";
import { CATEGORIES, getLandingCopy } from "@/lib/db";
import { publishedDossiers } from "@/data/publishedDossiers";
import { getPublicScore } from "@/lib/publicScore";

export default async function HomePage() {
  const landing = await getLandingCopy();
  const approvedCount = publishedDossiers.length;

  return (
    <div>
      <PublicPageJsonLd path="/" />
      <section className="bg-gradient-to-br from-indigo-950 to-indigo-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-200">MDRank Evidence Engine</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
            {landing.hero_title ?? "MDRank — Medical devices, ranked by evidence"}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-indigo-100">
            {landing.hero_body ?? "Exact-model evidence for home medical devices, with Evidence Confidence kept separate from score and rank."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/methodology" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-indigo-950 hover:bg-indigo-50">Read the methodology</Link>
            <Link href="/devices" className="rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/10">Read evidence dossiers</Link>
            <Link href="/evidence-status" className="rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/10">Evidence status</Link>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-5 text-sm leading-relaxed text-slate-700 sm:px-6">
          <strong>MDRank Score and category rank use rubric upper-arm-home-bp-v1.0.0.</strong> Score and rank stay withheld when exact-model evidence is incomplete. Evidence Confidence stays separate.
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">Published dossiers</p>
            <p className="mt-3 text-4xl font-bold text-slate-950">{approvedCount}</p>
            <p className="mt-2 text-sm text-slate-600">Exact-model evidence records on the public site. Publication is not a rank.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">In publication</p>
            <h2 className="mt-3 text-xl font-bold text-slate-950">Home blood-pressure monitors</h2>
            <p className="mt-2 text-sm text-slate-600">Public dossiers cover exact-model identity, validation status, cuff fit, support, ownership cost, and documented evidence gaps.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">Publication review</p>
            <h2 className="mt-3 text-xl font-bold text-slate-950">Reviewed before publication</h2>
            <p className="mt-2 text-sm text-slate-600">Every public product page is reviewed before publication. A dossier can be public while its score and rank stay withheld.</p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Public records</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Published evidence dossiers</h2>
            <p className="mt-2 max-w-3xl text-slate-600">These dossiers are on the public site. A row shows an MDRank Score and category rank only when exact-model scoring gates pass.</p>
          </div>
          <Link href="/devices" className="text-sm font-semibold text-indigo-700 hover:underline">View all dossiers →</Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {publishedDossiers.map((dossier) => {
            const score = getPublicScore(dossier.slug);
            return (
            <article key={dossier.slug} className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">{dossier.model}</p>
              <h3 className="mt-2 text-xl font-bold text-slate-950">{dossier.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{dossier.directAnswer}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded bg-slate-100 px-2 py-1">Score {score.scoreLabel}</span>
                <span className="rounded bg-slate-100 px-2 py-1">Rank {score.rankLabel}</span>
                <span className="rounded bg-indigo-50 px-2 py-1 text-indigo-800">Evidence Confidence: {dossier.evidenceConfidence}</span>
              </div>
              <Link href={`/devices/${dossier.slug}`} className="mt-5 inline-block text-sm font-semibold text-indigo-700 hover:underline">Read dossier →</Link>
            </article>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-950">Category coverage</h2>
          <p className="mt-2 max-w-3xl text-slate-600">Home blood-pressure monitors have published dossiers. The other categories listed here do not.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map((category) => (
              <div key={category.slug} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="font-semibold text-slate-900">{category.name}</div>
                <div className="mt-1 text-xs text-slate-500">{category.slug === "blood-pressure" ? "Published dossiers" : "No public dossiers"}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";

import { ScoreBadge } from "@/components/ScoreBadge";
import { getReviewBySlug } from "@/lib/db";
import { fdaBadgeClass, formatFdaStatus, formatPrice } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ReviewPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getReviewBySlug(slug);
  if (!item) notFound();

  const { device, review } = item;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link href={`/devices/${device.slug}`} className="text-sm font-medium text-indigo-700 hover:underline">
        ← Back to {device.name}
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-slate-900">{review.title}</h1>
      <p className="mt-2 text-slate-600">{device.manufacturer}</p>

      {device.is_editors_choice && (
        <span className="mt-3 inline-block rounded bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
          Editor&apos;s Choice
        </span>
      )}

      <div className="mt-8 grid gap-6 rounded-xl border border-slate-200 bg-white p-6 sm:grid-cols-3">
        <div className="flex flex-col items-center">
          <ScoreBadge score={device.mdrank_score} size="lg" />
          <span className="mt-2 text-xs text-slate-500">MDRank Score</span>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{formatPrice(device.retail_price)}</div>
          <span className="text-xs text-slate-500">Price</span>
        </div>
        <div className="text-center">
          <span className={fdaBadgeClass(device.fda_status)}>{formatFdaStatus(device.fda_status)}</span>
        </div>
      </div>

      {(review.strengths?.length || review.limitations?.length) && (
        <section className="mt-10">
          <h2 className="text-xl font-bold">Quick Take</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {review.strengths && review.strengths.length > 0 && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
                <h3 className="font-semibold text-emerald-800">+ Strengths</h3>
                <ul className="mt-3 space-y-2 text-sm text-emerald-900">
                  {review.strengths.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            )}
            {review.limitations && review.limitations.length > 0 && (
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
                <h3 className="font-semibold text-amber-800">− Limitations</h3>
                <ul className="mt-3 space-y-2 text-sm text-amber-900">
                  {review.limitations.map((l) => <li key={l}>{l}</li>)}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {review.sections && review.sections.length > 0 && (
        <section className="mt-10 space-y-8">
          {review.sections.map((section) => (
            <article key={section.heading}>
              <h2 className="text-xl font-bold">{section.heading}</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">{section.body}</p>
            </article>
          ))}
        </section>
      )}

      {(review.recommend_if?.length || review.avoid_if?.length) && (
        <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold">Recommendation</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {review.recommend_if && review.recommend_if.length > 0 && (
              <div>
                <h3 className="font-semibold text-emerald-700">Recommend If</h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {review.recommend_if.map((r) => <li key={r}>• {r}</li>)}
                </ul>
              </div>
            )}
            {review.avoid_if && review.avoid_if.length > 0 && (
              <div>
                <h3 className="font-semibold text-amber-700">Avoid If</h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {review.avoid_if.map((a) => <li key={a}>• {a}</li>)}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

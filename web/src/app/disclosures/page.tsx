import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclosures",
  description:
    "How MDRank handles affiliate links, paid placement, operator relationships, scoring boundaries, and commercial isolation.",
  alternates: { canonical: "/disclosures" },
};

const textLink =
  "font-semibold text-indigo-700 underline decoration-indigo-200 underline-offset-2 hover:text-indigo-900";

export default function DisclosuresPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700">Transparency</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Disclosures</h1>
      <p className="mt-4 text-sm text-slate-600">Updated October 28, 2026</p>

      <div className="mt-8 space-y-8 text-base leading-7 text-slate-700">
        <section className="space-y-4">
          <p>
            MDRank is rebuilt as an exact-model evidence system. Scores, Evidence Confidence, ranks, and publication
            decisions are produced under versioned methodology and publication contracts. Commercial
            relationships—when they exist—are disclosed here and kept out of the scorer.
          </p>
          <p>
            This page describes how MDRank handles affiliate links, paid placement, operator relationships, scoring
            boundaries, and commercial isolation. It does not change the methodology at{" "}
            <Link href="/methodology" className={textLink}>/methodology</Link> or the privacy notice at{" "}
            <Link href="/privacy" className={textLink}>/privacy</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Current commercial relationships</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[720px] text-left text-sm leading-6">
              <caption className="sr-only">
                Current commercial relationships and their effect on score, rank, and Evidence Confidence as of October 28, 2026
              </caption>
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Relationship type</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Current status (as of October 28, 2026)</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Effect on score / rank / Evidence Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <th scope="row" className="px-4 py-3 align-top font-medium text-slate-900">
                    Affiliate / commission links on public MDRank product pages
                  </th>
                  <td className="px-4 py-3 align-top">
                    <strong>Amazon.com Associates.</strong> The two public upper-arm blood-pressure dossiers (iHealth Track KN-550BT and OMRON Evolv BP7000 / HEM-7600T-Z) each show a Buy on Amazon link using Associates tag <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">sjpenterpri05-20</code>, labeled with an ordinary affiliate-commission disclosure. No other affiliate program is authorized.
                  </td>
                  <td className="px-4 py-3 align-top">
                    None. Affiliate, EPC, and conversion data remain unavailable to the scorer. Affiliate participation weight is zero.
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 align-top font-medium text-slate-900">
                    Paid placement / sponsored Top-5 / advertorial
                  </th>
                  <td className="px-4 py-3 align-top">
                    <strong>None live.</strong> Template and isolation rules are defined below for future use only.
                  </td>
                  <td className="px-4 py-3 align-top">Paid lanes are separate from independent editorial ranking.</td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 align-top font-medium text-slate-900">
                    Operator / ownership-adjacent products (including TrueVitals USA / TruVitals / True Health Co)
                  </th>
                  <td className="px-4 py-3 align-top">
                    <strong>No special treatment.</strong> Any such product may only appear under the same exact-model, eligibility, and commercial-isolation rules as any other brand.
                  </td>
                  <td className="px-4 py-3 align-top">
                    Commission, margin, inventory, conversion, and advertising data remain unavailable to the scorer.
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 align-top font-medium text-slate-900">
                    Sponsorship of an independent dossier
                  </th>
                  <td className="px-4 py-3 align-top"><strong>None.</strong></td>
                  <td className="px-4 py-3 align-top">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            If another affiliate program, paid placement, or other commercial relationship is added later, this table
            will be updated with the relationship type, start date, and disclosure label before or at the same time the
            commercial feature appears on the site.
          </p>
          <p className="mt-4">
            MDRank will not invent a commercial disclosure where no qualifying relationship exists.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Affiliate relationships</h2>
          <p className="mt-3">
            An affiliate or commission relationship exists only when MDRank may earn a fee from a qualifying outbound
            product link or offer.
          </p>
          <p className="mt-4">
            <strong>Current state:</strong> Amazon.com Associates is the only authorized affiliate relationship.
            The two public upper-arm blood-pressure dossiers (iHealth Track KN-550BT and OMRON Evolv BP7000 /
            HEM-7600T-Z) each show a Buy on Amazon link using Associates tag <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">sjpenterpri05-20</code>,
            with an ordinary affiliate-commission disclosure. Affiliate, EPC, and conversion data remain unavailable
            to the scorer (weight zero). No other affiliate program is authorized.
          </p>
          <p className="mt-4"><strong>Rules for a qualifying affiliate link:</strong></p>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>Every page that contains a qualifying affiliate link carries an ordinary affiliate-commission disclosure near the link or in a page-level disclosure block.</li>
            <li>Affiliate, EPC, conversion, margin, inventory, and advertising performance data stay in a separate business dataset.</li>
            <li>Those fields are unavailable to the deterministic scorer, Evidence Confidence calculation, rank ordering, tie-breakers, and publication eligibility gates.</li>
            <li>Presence or absence of an affiliate offer does not create eligibility, raise a score, or reserve a rank position.</li>
            <li>“#1,” “best,” or reserved top placement cannot be purchased through affiliate participation.</li>
          </ol>
          <p className="mt-4">
            Affiliate analytics may be used to operate the business. Analytics for site navigation are described in the{" "}
            <Link href="/privacy" className={textLink}>privacy notice</Link> and likewise do not influence device scores,
            Evidence Confidence, or publication decisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Paid placement (dormant template)</h2>
          <p className="mt-3">
            Paid placement, sponsored selections, and advertorial landings are <strong>not live</strong>. The following
            rules are the dormant template that must be followed if such a lane is ever activated. Activation requires
            explicit human approval of both the commercial relationship and the public disclosure wording on this page.
          </p>
          <h3 className="mt-6 text-xl font-semibold text-slate-950">Isolation rules (mandatory)</h3>
          <ol className="mt-3 list-decimal space-y-3 pl-5">
            <li><strong>Separate lane.</strong> Paid or sponsored content uses a separate URL pattern, template, and analytics identifier from independent evidence dossiers and category rankings.</li>
            <li><strong>Conspicuous label.</strong> Every paid page uses a conspicuous disclosure such as “Sponsored,” “Paid placement,” or “Advertorial / Advertising,” as appropriate to the relationship. The label appears above the fold and is not buried in footer-only text.</li>
            <li><strong>No purchased independent rank.</strong> A sponsor cannot buy an MDRank Score, Evidence Confidence level, category rank, tie-breaker outcome, or “#1” / reserved top position in the independent ranking.</li>
            <li><strong>No scorer inputs.</strong> Sponsorship amount, package, margin, inventory, click-through, conversion, and advertising performance never enter the scorer or confidence calculation.</li>
            <li><strong>Facts remain evidence-checked.</strong> Paid pages may reuse approved exact-model facts. They may not invent hands-on, laboratory, clinical-proof, or “FDA approved” language for 510(k)-cleared devices, and they may not present a commercially selected list as an independent market-wide ranking.</li>
            <li><strong>Usually noindex when paid-only.</strong> Conversion-only paid landings are usually <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">noindex</code> and excluded from the public sitemap unless a human explicitly approves otherwise.</li>
            <li>
              <strong>Publication gate still applies</strong> for any new public product URL that would appear as an independent evidence dossier. Automation may draft; a human Publish action is required (<Link href="/evidence-status" className={textLink}>/evidence-status</Link>).
            </li>
          </ol>
          <p className="mt-4">
            Until a paid relationship is live and this page is updated, MDRank will not display Sponsored / Paid
            placement / Advertorial labels that imply a relationship that does not exist.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Operator relationships</h2>
          <p className="mt-3">
            MDRank.org, Authentic Reviews, and TrueVitals USA (including related TruVitals / True Health Co naming)
            are separate brands and businesses for editorial and scoring purposes.
          </p>
          <ul className="mt-4 list-disc space-y-3 pl-5">
            <li>Authentic Reviews editorial pages, scores, and conclusions are <strong>not</strong> MDRank evidence and are not imported into MDRank rankings.</li>
            <li>Products associated with an operator-adjacent brand may be researched, screened, scored, ranked below competitors, excluded, or held—<strong>under the same exact-model rules</strong> as any other brand.</li>
            <li>Public content must not state or imply that operator-adjacent products receive preferred eligibility, reduced evidence standards, hidden boosts, or reserved rank positions.</li>
            <li>If a qualifying affiliate link to an operator-adjacent product later exists, the ordinary affiliate disclosure applies. If that brand pays for placement, the content moves to the paid lane and does not alter the independent ranking.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Scoring boundaries</h2>
          <p className="mt-3">MDRank separates outputs that readers often conflate:</p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[720px] text-left text-sm leading-6">
              <caption className="sr-only">Scoring outputs, what each one is, and what it is not</caption>
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Output</th>
                  <th scope="col" className="px-4 py-3 font-semibold">What it is</th>
                  <th scope="col" className="px-4 py-3 font-semibold">What it is not</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <th scope="row" className="px-4 py-3 align-top font-medium text-slate-900">MDRank Score</th>
                  <td className="px-4 py-3 align-top">Result under a versioned category rubric</td>
                  <td className="px-4 py-3 align-top">Not Evidence Confidence; not a medical recommendation</td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 align-top font-medium text-slate-900">Evidence Confidence</th>
                  <td className="px-4 py-3 align-top">How complete, independent, current, and consistent the supporting evidence is</td>
                  <td className="px-4 py-3 align-top">Not a substitute score; not proof of superiority</td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 align-top font-medium text-slate-900">Category rank</th>
                  <td className="px-4 py-3 align-top">Ordering among eligible exact-model peers when the cohort and scorer are ready</td>
                  <td className="px-4 py-3 align-top">Not reserved; not for sale; currently withheld while the comparison cohort and production scorer complete validation</td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 align-top font-medium text-slate-900">Public Experience</th>
                  <td className="px-4 py-3 align-top">Permitted owner-feedback themes when a licensed exact-model corpus exists</td>
                  <td className="px-4 py-3 align-top">Cannot prove clinical accuracy, regulatory status, validation, safety, or medical suitability</td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 align-top font-medium text-slate-900">FDA 510(k) clearance (with K-number)</th>
                  <td className="px-4 py-3 align-top">Regulatory clearance decision for a named device</td>
                  <td className="px-4 py-3 align-top">Not “FDA approved,” not endorsement, not independent validation, not proof one device is more accurate than another</td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 align-top font-medium text-slate-900">Family-level validation</th>
                  <td className="px-4 py-3 align-top">Validation evidence naming a related model string</td>
                  <td className="px-4 py-3 align-top">Not exact-model validation proof; does not silently transfer</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">Additional boundaries that apply on every public result:</p>
          <ul className="mt-3 list-disc space-y-3 pl-5">
            <li>Exact-model identity must be resolved before evidence transfer. Regional variants, suffixes, packages, accessories, and unresolved aliases remain separate until equivalence is documented.</li>
            <li>Unresolved identity → score and rank withheld.</li>
            <li>Missing evidence stays missing. Gaps are limitations, not filled with invented hands-on, lab, or testimonial claims.</li>
            <li>MDRank does not claim that a home blood-pressure monitor treats, cures, or controls hypertension. Devices may help people measure and track blood pressure when used as directed; clinical decisions belong with a qualified clinician.</li>
            <li>Wrist and optical blood-pressure devices are a <strong>separate category</strong> from upper-arm monitors and are not mixed into the current upper-arm cohort.</li>
            <li>Pulse oximeters, TENS, and other new device classes are out of scope for v1 scoring publication until category methodology and owner approval exist.</li>
            <li>Paid placement, affiliate participation, and operator relationship weight <strong>zero</strong> in scoring.</li>
          </ul>
          <p className="mt-4">
            Testing language is controlled: “hands-on,” “independently tested,” “clinically proven,” and similar phrases
            are prohibited unless an exact-model protocol, sample, tester, date, method, and result are documented for
            that page version. Current public dossiers use <strong>public evidence only</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Commercial isolation</h2>
          <p className="mt-3">
            Affiliate, sponsorship, margin, inventory, conversion, and advertising data are unavailable to the scorer.
            This matches the commercial-isolation principle on{" "}
            <Link href="/methodology" className={textLink}>/methodology</Link> and the evidence-system statement on{" "}
            <Link href="/evidence-status" className={textLink}>/evidence-status</Link>.
          </p>
          <p className="mt-4">Operationally:</p>
          <ol className="mt-3 list-decimal space-y-3 pl-5">
            <li>Commercial performance fields live outside the evidence and methodology contracts used for scoring.</li>
            <li>
              Publication eligibility requires an approved disclosure status for the page type being published (<code className="rounded bg-slate-100 px-1 py-0.5 text-sm">disclosureStatus</code> in the publication gate). Independent editorial pages must not carry invented commercial claims.
            </li>
            <li>
              Site analytics (see <Link href="/privacy" className={textLink}>/privacy</Link>) measure navigation and
              technical health. Analytics preferences and measurement do not influence device scores, Evidence
              Confidence, or publication decisions.
            </li>
            <li>Automated research may draft disclosures; it may not silently enable affiliate links or paid lanes on public URLs.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-950">What this page does not do</h2>
          <ul className="mt-4 list-disc space-y-3 pl-5">
            <li>It does not create affiliate deals, paid placements, or sponsorships by disclosure alone.</li>
            <li>It does not authorize a new public product URL. Every new public product page still requires an explicit human Publish action after preview and validation.</li>
            <li>It does not convert family-level validation into exact-model validation.</li>
            <li>It does not provide medical advice, diagnosis, or treatment guidance.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Changes</h2>
          <p className="mt-3">
            Material changes to commercial relationships, disclosure labels, or isolation rules are dated on this page.
            Adding another affiliate program, or enabling paid placement, is a material change and requires human
            approval of both the commercial setup and the updated wording here.
          </p>
          <ul className="mt-4 list-disc space-y-3 pl-5">
            <li>
              <strong>October 28, 2026.</strong> Amazon.com Associates is the affiliate relationship for MDRank buy links (Associates tag <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">sjpenterpri05-20</code>). The two public upper-arm dossiers show a Buy on Amazon link with an ordinary affiliate-commission disclosure. Affiliate, EPC, and conversion data remain unavailable to the scorer (weight zero). Paid placement remains not live. No other affiliate program is authorized.
            </li>
          </ul>
          <h3 className="mt-6 text-xl font-semibold text-slate-950">MDRank.org</h3>
          <p className="mt-3">
            Medical devices, ranked by evidence. Exact-model records, deterministic methods, visible confidence, and
            human-approved publication.
          </p>
        </section>
      </div>
    </div>
  );
}

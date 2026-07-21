import type { Metadata } from "next";

import { AnalyticsPreferencesButton } from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How MDRank uses privacy-respecting analytics and handles site-use data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700">Privacy</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Privacy notice</h1>
      <p className="mt-4 text-sm text-slate-600">Effective July 21, 2026</p>

      <div className="mt-8 space-y-8 text-base leading-7 text-slate-700">
        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Analytics</h2>
          <p className="mt-3">
            MDRank uses Google Analytics 4, measurement ID G-KEB95QJD5F, to understand which
            pages are useful, how visitors navigate the site, and whether technical problems
            occur. Analytics data is used for operating and improving MDRank. It does not
            influence device scores, evidence confidence, or publication decisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Your choice</h2>
          <p className="mt-3">
            Analytics storage is denied by default. Before a choice is made, Google Consent
            Mode may send limited cookieless measurement signals. If you allow analytics,
            Google Analytics may store or read analytics identifiers. Advertising storage,
            advertising user data, and ad personalization remain denied.
          </p>
          <div className="mt-4">
            <AnalyticsPreferencesButton />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Information collected</h2>
          <p className="mt-3">
            Analytics may process page URLs, page titles, approximate location derived from an
            IP address, device and browser information, referral source, and interaction timing.
            MDRank does not ask visitors to enter medical readings or health records into the
            current public website, and no such information is intentionally sent to GA4.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Google&apos;s role</h2>
          <p className="mt-3">
            Google processes analytics information under its own terms and privacy practices.
            Browser privacy controls, content blockers, and your MDRank analytics preference may
            limit collection.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Changes</h2>
          <p className="mt-3">
            This notice will be updated when MDRank adds accounts, forms, newsletters, commerce,
            or other data-processing features. Material changes will be dated on this page.
          </p>
        </section>
      </div>
    </div>
  );
}

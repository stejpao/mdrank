"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { GA_MEASUREMENT_ID } from "@/lib/analytics";

const CONSENT_KEY = "mdrank_analytics_consent";
type ConsentChoice = "granted" | "denied";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function sendGtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...queuedArgs: unknown[]) {
    window.dataLayer.push(queuedArgs);
  };
  window.gtag(...args);
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<ConsentChoice | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    if (saved === "granted" || saved === "denied") {
      setChoice(saved);
      sendGtag("consent", "update", { analytics_storage: saved });
    }

    const reopen = () => setChoice(null);
    window.addEventListener("mdrank:privacy-settings", reopen);
    return () => window.removeEventListener("mdrank:privacy-settings", reopen);
  }, []);

  useEffect(() => {
    sendGtag("event", "page_view", {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    });
  }, [pathname]);

  function saveChoice(nextChoice: ConsentChoice) {
    window.localStorage.setItem(CONSENT_KEY, nextChoice);
    sendGtag("consent", "update", { analytics_storage: nextChoice });
    setChoice(nextChoice);
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />

      {choice === null ? (
        <section
          aria-label="Analytics privacy choice"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-4 shadow-xl"
        >
          <p className="text-sm leading-6 text-slate-700">
            MDRank uses Google Analytics to understand site use. Analytics storage is denied
            until you choose to allow it. Read our{" "}
            <a className="font-medium text-indigo-700 underline" href="/privacy">
              privacy notice
            </a>
            .
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
              onClick={() => saveChoice("granted")}
              type="button"
            >
              Allow analytics
            </button>
            <button
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => saveChoice("denied")}
              type="button"
            >
              No thanks
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}

export function AnalyticsPreferencesButton() {
  return (
    <button
      className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
      onClick={() => window.dispatchEvent(new Event("mdrank:privacy-settings"))}
      type="button"
    >
      Change analytics preference
    </button>
  );
}

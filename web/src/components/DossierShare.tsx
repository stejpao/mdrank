"use client";

import { useState } from "react";

type DossierShareProps = {
  name: string;
  model: string;
  variant?: "hero" | "dock";
};

export function DossierShare({ name, model, variant = "hero" }: DossierShareProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "shared" | "manual">("idle");
  const [manualUrl, setManualUrl] = useState("");

  async function onShare() {
    const url = window.location.href;
    const title = `${name} · MDRank`;
    const text = `${name} (${model}) evidence dossier on MDRank`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        setStatus("shared");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setStatus("copied");
      setManualUrl("");
    } catch {
      setManualUrl(url);
      setStatus("manual");
    }
  }

  const label = status === "copied" ? "Link copied" : status === "shared" ? "Shared" : "Share";
  const buttonClass =
    variant === "dock"
      ? "flex min-h-12 w-full items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white"
      : "inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 sm:w-auto";

  return (
    <div className={variant === "dock" ? "fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white p-3 md:hidden" : ""}>
      <button type="button" className={buttonClass} onClick={onShare} aria-label={`Share ${name} evidence dossier`}>
        {label}
      </button>
      <p className="sr-only" aria-live="polite">
        {status === "copied" ? "Link copied" : status === "shared" ? "Share sheet opened" : ""}
      </p>
      {status === "manual" ? (
        <label className="mt-2 block text-xs text-slate-600">
          Copy this link
          <input readOnly value={manualUrl} className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm" />
        </label>
      ) : null}
    </div>
  );
}

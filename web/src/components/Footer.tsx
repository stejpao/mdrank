import Link from "next/link";

import { CATEGORIES } from "@/lib/db";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-bold text-indigo-950">MDRank.org</h3>
            <p className="mt-2 text-sm text-slate-600">
              Independent MDRank Scores and hands-on tests for home health devices
              across Blood Pressure, Respiratory, Sleep, Pain Relief, and Temperature.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Categories</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/rankings?category=${cat.slug}`} className="hover:text-indigo-700">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Disclaimer</h4>
            <p className="mt-2 text-xs text-slate-500">
              MDRank content is for informational purposes only and is not medical advice.
              Consult a qualified healthcare professional before purchasing or using any device.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} MDRank.org
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

import { CATEGORIES } from "@/lib/db";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-700 text-sm font-bold text-white">
            MD
          </div>
          <div>
            <span className="text-lg font-bold text-indigo-950">MDRank</span>
            <span className="ml-1 text-xs text-slate-500">mdrank.org</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/rankings?category=${cat.slug}`}
              className="text-sm font-medium text-slate-700 hover:text-indigo-700"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-2 sm:px-6">
          {CATEGORIES.flatMap((cat) =>
            cat.subcategories.slice(0, 1).map((sub) => (
              <Link
                key={sub.slug}
                href={`/rankings?category=${cat.slug}&subcategory=${sub.slug}`}
                className="whitespace-nowrap text-xs font-medium text-slate-600 hover:text-indigo-700"
              >
                {sub.name}
              </Link>
            ))
          )}
        </div>
      </div>
    </header>
  );
}

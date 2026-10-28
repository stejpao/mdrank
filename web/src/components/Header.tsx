import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-700 text-sm font-bold text-white">MD</div>
          <div className="min-w-0">
            <span className="text-lg font-bold text-indigo-950">MDRank</span>
            <span className="ml-2 hidden text-xs text-slate-500 sm:inline">Medical devices, ranked by evidence</span>
          </div>
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/devices" className="text-sm font-medium text-slate-700 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700">Dossiers</Link>
          <Link href="/methodology" className="text-sm font-medium text-slate-700 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700">Methodology</Link>
          <Link href="/evidence-status" className="text-sm font-medium text-slate-700 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700">Evidence status</Link>
        </nav>
      </div>
    </header>
  );
}

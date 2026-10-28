import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-700 text-sm font-bold text-white">MD</div>
          <div className="min-w-0">
            <span className="text-lg font-bold text-indigo-950">MDRank</span>
            <span className="ml-1 text-xs text-slate-500">Medical devices, ranked by evidence</span>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/devices" className="whitespace-nowrap text-sm font-medium text-slate-700 hover:text-indigo-700">Dossiers</Link>
          <Link href="/methodology" className="whitespace-nowrap text-sm font-medium text-slate-700 hover:text-indigo-700">Methodology</Link>
          <Link href="/evidence-status" className="whitespace-nowrap text-sm font-medium text-slate-700 hover:text-indigo-700">Evidence status</Link>
        </nav>
      </div>
    </header>
  );
}

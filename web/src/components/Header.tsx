import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-700 text-sm font-bold text-white">MD</div>
          <div>
            <span className="text-lg font-bold text-indigo-950">MDRank</span>
            <span className="ml-1 text-xs text-slate-500">Medical devices, ranked by evidence</span>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/devices" className="text-sm font-medium text-slate-700 hover:text-indigo-700">Dossiers</Link>
          <Link href="/methodology" className="text-sm font-medium text-slate-700 hover:text-indigo-700">Methodology</Link>
          <Link href="/evidence-status" className="text-sm font-medium text-slate-700 hover:text-indigo-700">System status</Link>
        </nav>
      </div>
    </header>
  );
}

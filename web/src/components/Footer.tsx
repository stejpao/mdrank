import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="font-bold text-indigo-950">MDRank.org</h3>
          <p className="mt-2 text-sm text-slate-600">Medical devices, ranked by evidence. Exact-model records, deterministic methods, visible confidence, and human-approved publication.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Transparency</h4>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            <li><Link href="/methodology" className="hover:text-indigo-700">Methodology</Link></li>
            <li><Link href="/evidence-status" className="hover:text-indigo-700">Evidence-system status</Link></li>
            <li><Link href="/privacy" className="hover:text-indigo-700">Privacy notice</Link></li>
            <li><Link href="/llms.txt" className="hover:text-indigo-700">Neutral resource directory</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Disclaimer</h4>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">MDRank content is informational and is not medical advice. A regulatory record, validation listing, manufacturer specification, public owner report, and documented hands-on test are different evidence types and are not treated as interchangeable.</p>
        </div>
      </div>
      <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-600">© {new Date().getFullYear()} MDRank.org</div>
    </footer>
  );
}

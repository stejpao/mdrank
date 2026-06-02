import Link from "next/link";

import { fdaBadgeClass, formatFdaStatus, formatPrice } from "@/lib/format";
import type { DeviceWithReview } from "@/lib/types";

import { ScoreBadge } from "./ScoreBadge";

interface DeviceTableProps {
  devices: DeviceWithReview[];
  showRank?: boolean;
}

export function DeviceTable({ devices, showRank = true }: DeviceTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {showRank && <th className="px-4 py-3">Rank</th>}
            <th className="px-4 py-3">Device</th>
            <th className="px-4 py-3">MDRank Score</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">FDA Status</th>
            <th className="px-4 py-3">Connectivity</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((item, idx) => {
            const { device, review } = item;
            const rank = device.rank_in_subcategory ?? idx + 1;

            return (
              <tr key={device.slug} className="border-b border-slate-100 hover:bg-slate-50">
                {showRank && (
                  <td className="px-4 py-4 font-semibold text-slate-400">{rank}</td>
                )}
                <td className="px-4 py-4">
                  <Link href={`/devices/${device.slug}`} className="font-semibold text-indigo-800 hover:underline">
                    {device.name}
                  </Link>
                  <div className="text-xs text-slate-500">{device.manufacturer}</div>
                  {device.is_editors_choice && (
                    <span className="mt-1 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                      Editor&apos;s Choice
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <ScoreBadge score={device.mdrank_score} size="sm" />
                    <span className="text-slate-600">/100</span>
                  </div>
                </td>
                <td className="px-4 py-4 font-medium">{formatPrice(device.retail_price)}</td>
                <td className="px-4 py-4">
                  <span className={fdaBadgeClass(device.fda_status)}>
                    {formatFdaStatus(device.fda_status)}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-600">{device.connectivity ?? "—"}</td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <Link href={`/devices/${device.slug}`} className="rounded border border-slate-200 px-2 py-1 text-xs font-medium hover:bg-slate-100">
                      Device
                    </Link>
                    {review?.slug && (
                      <Link href={`/reviews/${review.slug}`} className="rounded bg-indigo-700 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-800">
                        Review
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

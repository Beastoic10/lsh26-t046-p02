import { MonthlyBucket } from "@/lib/classify";
import DotHistogram from "./DotHistogram";

export default function ExpiringSoonCard({ buckets }: { buckets: MonthlyBucket[] }) {
  const totalItems = buckets.reduce((sum, b) => sum + b.count, 0);
  const peak = buckets.reduce((max, b) => (b.count > max.count ? b : max), buckets[0]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <h2 className="text-sm font-medium text-slate-500">Items expiring, next 6 months</h2>
        {peak && peak.count > 0 && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
            Peak: <span className="font-semibold text-slate-700">{peak.label.split(" ")[0]}</span>
          </span>
        )}
      </div>
      <p className="mb-4 text-3xl font-semibold tabular-nums text-slate-900">{totalItems}</p>
      <DotHistogram data={buckets} colorClass="bg-indigo-500" />
    </div>
  );
}

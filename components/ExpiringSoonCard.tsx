import { MonthlyBucket } from "@/lib/classify";
import DotHistogram from "./DotHistogram";

export default function ExpiringSoonCard({ buckets }: { buckets: MonthlyBucket[] }) {
  const totalItems = buckets.reduce((sum, b) => sum + b.count, 0);
  const peak = buckets.reduce((max, b) => (b.count > max.count ? b : max), buckets[0]);

  return (
    <div className="clay-surface flex flex-col p-6">
      <div className="mb-4 flex items-start justify-between">
        <h2 className="text-sm font-medium text-clay-ink2">Items expiring, next 6 months</h2>
        {peak && peak.count > 0 && (
          <span className="clay-pill bg-clay-surface2 px-2.5 py-1 text-xs font-medium text-clay-ink2 shadow-none">
            Peak: <span className="font-semibold text-clay-ink">{peak.label.split(" ")[0]}</span>
          </span>
        )}
      </div>
      <p className="mb-4 text-3xl font-semibold tabular-nums text-clay-ink">{totalItems}</p>
      <div className="mt-4">
        <DotHistogram data={buckets} colorClass="bg-clay-steel" />
      </div>
    </div>
  );
}

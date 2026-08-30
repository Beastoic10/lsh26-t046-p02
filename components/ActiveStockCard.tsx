import { ExpiryGroup, Medicine } from "@/lib/types";
import { GROUP_LABEL } from "@/lib/classify";

const GROUP_ORDER: ExpiryGroup[] = ["safe", "mid90", "soon30", "expired"];

const GROUP_DOT_COLOR: Record<ExpiryGroup, string> = {
  expired: "bg-red-500",
  soon30: "bg-amber-500",
  mid90: "bg-yellow-500",
  safe: "bg-emerald-500",
};

export default function ActiveStockCard({ byGroup }: { byGroup: Record<ExpiryGroup, Medicine[]> }) {
  const total = GROUP_ORDER.reduce((sum, g) => sum + byGroup[g].length, 0);
  const largest = GROUP_ORDER.reduce((max, g) => (byGroup[g].length > byGroup[max].length ? g : max), GROUP_ORDER[0]);

  // Allocate a fixed dot budget proportionally across groups so the
  // cluster reads as a composition, not just a raw count.
  const dotBudget = 40;
  const composition = GROUP_ORDER.map((g) => ({
    group: g,
    dots: total > 0 ? Math.max(byGroup[g].length > 0 ? 1 : 0, Math.round((byGroup[g].length / total) * dotBudget)) : 0,
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <h2 className="text-sm font-medium text-slate-500">Active stock</h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
          Largest: <span className="font-semibold text-slate-700">{GROUP_LABEL[largest]}</span>
        </span>
      </div>
      <p className="mb-4 text-3xl font-semibold tabular-nums text-slate-900">{total}</p>
      <div className="grid grid-cols-10 gap-1">
        {composition.flatMap(({ group, dots }) =>
          Array.from({ length: dots }, (_, i) => (
            <span key={`${group}-${i}`} className={`aspect-square rounded-full ${GROUP_DOT_COLOR[group]}`} />
          ))
        )}
      </div>
    </div>
  );
}

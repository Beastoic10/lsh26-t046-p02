import { ExpiryGroup, Medicine } from "@/lib/types";
import { GROUP_LABEL } from "@/lib/classify";

const GROUP_ORDER: ExpiryGroup[] = ["safe", "mid90", "soon30", "expired"];

const GROUP_DOT_COLOR: Record<ExpiryGroup, string> = {
  expired: "bg-clay-terracotta",
  soon30: "bg-clay-mustard",
  mid90: "bg-clay-olive",
  safe: "bg-clay-sage",
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
    <div className="clay-surface flex h-full flex-col p-6">
      <div className="mb-4 flex items-start justify-between">
        <h2 className="text-sm font-medium text-clay-ink2">Active stock</h2>
        <span className="clay-pill bg-clay-surface2 px-2.5 py-1 text-xs font-medium text-clay-ink2 shadow-none">
          Largest: <span className="font-semibold text-clay-ink">{GROUP_LABEL[largest]}</span>
        </span>
      </div>
      <p className="mb-4 text-3xl font-semibold tabular-nums text-clay-ink">{total}</p>
      <div className="mt-auto grid grid-cols-10 gap-1.5">
        {composition.flatMap(({ group, dots }) =>
          Array.from({ length: dots }, (_, i) => (
            <span
              key={`${group}-${i}`}
              className={`aspect-square rounded-full shadow-clay-sm ${GROUP_DOT_COLOR[group]}`}
            />
          ))
        )}
      </div>
    </div>
  );
}

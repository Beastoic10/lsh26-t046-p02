import { ExpiryGroup, Medicine } from "@/lib/types";
import { GROUP_LABEL } from "@/lib/classify";
import DotCluster from "./DotCluster";

const GROUP_ORDER: ExpiryGroup[] = ["expired", "soon30", "mid90", "safe"];

const GROUP_DOT_COLOR: Record<ExpiryGroup, string> = {
  expired: "bg-clay-terracotta",
  soon30: "bg-clay-mustard",
  mid90: "bg-clay-olive",
  safe: "bg-clay-sage",
};

const GROUP_TEXT_COLOR: Record<ExpiryGroup, string> = {
  expired: "text-clay-terracotta-dark",
  soon30: "text-clay-mustard-dark",
  mid90: "text-clay-olive-dark",
  safe: "text-clay-sage-dark",
};

export default function StockByExpiryCard({
  byGroup,
  groupFilter,
  onSelect,
}: {
  byGroup: Record<ExpiryGroup, Medicine[]>;
  groupFilter: ExpiryGroup | null;
  onSelect: (group: ExpiryGroup) => void;
}) {
  return (
    <div className="clay-surface flex h-full flex-col p-6">
      <h2 className="mb-5 text-sm font-medium text-clay-ink2">Stock by expiry</h2>
      <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
        {GROUP_ORDER.map((group) => {
          const count = byGroup[group].length;
          const active = groupFilter === group;
          return (
            <button
              key={group}
              onClick={() => onSelect(group)}
              className={`flex flex-col justify-between gap-4 rounded-[1.25rem] p-4 text-left transition ${
                active ? "clay-surface-pressed" : "bg-clay-surface shadow-clay-sm hover:shadow-clay"
              }`}
            >
              <div>
                <span className={`text-xs font-medium ${active ? GROUP_TEXT_COLOR[group] : "text-clay-ink2"}`}>
                  {GROUP_LABEL[group]}
                </span>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-clay-ink">{count}</p>
              </div>
              <DotCluster filled={count} total={20} columns={5} colorClass={GROUP_DOT_COLOR[group]} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { ExpiryGroup, Medicine } from "@/lib/types";
import { GROUP_LABEL } from "@/lib/classify";
import DotCluster from "./DotCluster";

const GROUP_ORDER: ExpiryGroup[] = ["expired", "soon30", "mid90", "safe"];

const GROUP_DOT_COLOR: Record<ExpiryGroup, string> = {
  expired: "bg-red-500",
  soon30: "bg-amber-500",
  mid90: "bg-yellow-500",
  safe: "bg-emerald-500",
};

const GROUP_TEXT_COLOR: Record<ExpiryGroup, string> = {
  expired: "text-red-600",
  soon30: "text-amber-600",
  mid90: "text-yellow-700",
  safe: "text-emerald-600",
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-medium text-slate-500">Stock by expiry</h2>
      <div className="grid grid-cols-2 divide-slate-100 sm:grid-cols-4 sm:divide-x">
        {GROUP_ORDER.map((group) => {
          const count = byGroup[group].length;
          const active = groupFilter === group;
          return (
            <button
              key={group}
              onClick={() => onSelect(group)}
              className={`flex flex-col gap-3 rounded-lg p-3 text-left transition sm:rounded-none sm:first:pl-0 sm:last:pr-0 ${
                active ? "bg-slate-50" : "hover:bg-slate-50/60"
              }`}
            >
              <span
                className={`text-xs font-medium ${active ? GROUP_TEXT_COLOR[group] : "text-slate-500"}`}
              >
                {GROUP_LABEL[group]}
              </span>
              <span className="text-2xl font-semibold tabular-nums text-slate-900">{count}</span>
              <DotCluster
                filled={count}
                total={30}
                columns={10}
                colorClass={GROUP_DOT_COLOR[group]}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

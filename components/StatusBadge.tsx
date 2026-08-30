import { ExpiryGroup } from "@/lib/types";

const STYLES: Record<ExpiryGroup, string> = {
  expired: "bg-red-50 text-red-700 ring-red-600/20",
  soon30: "bg-amber-50 text-amber-700 ring-amber-600/20",
  mid90: "bg-yellow-50 text-yellow-800 ring-yellow-600/20",
  safe: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

const LABELS: Record<ExpiryGroup, string> = {
  expired: "Expired",
  soon30: "Within 30 days",
  mid90: "Within 90 days",
  safe: "Safe",
};

export default function StatusBadge({ group }: { group: ExpiryGroup }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[group]}`}
    >
      {LABELS[group]}
    </span>
  );
}

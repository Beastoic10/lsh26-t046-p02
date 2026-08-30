import { ExpiryGroup } from "@/lib/types";

const STYLES: Record<ExpiryGroup, string> = {
  expired: "bg-clay-terracotta text-white",
  soon30: "bg-clay-mustard text-white",
  mid90: "bg-clay-olive text-white",
  safe: "bg-clay-sage text-white",
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
      className={`clay-pill inline-flex items-center px-3 py-1 text-xs font-medium shadow-clay-sm ${STYLES[group]}`}
    >
      {LABELS[group]}
    </span>
  );
}

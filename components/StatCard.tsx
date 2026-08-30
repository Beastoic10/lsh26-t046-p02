interface StatCardProps {
  label: string;
  count: number;
  accent: "red" | "amber" | "yellow" | "emerald" | "slate";
  active: boolean;
  onClick: () => void;
}

const ACCENT_RING: Record<StatCardProps["accent"], string> = {
  red: "ring-red-500",
  amber: "ring-amber-500",
  yellow: "ring-yellow-500",
  emerald: "ring-emerald-500",
  slate: "ring-slate-400",
};

const ACCENT_DOT: Record<StatCardProps["accent"], string> = {
  red: "bg-red-500",
  amber: "bg-amber-500",
  yellow: "bg-yellow-500",
  emerald: "bg-emerald-500",
  slate: "bg-slate-400",
};

export default function StatCard({ label, count, accent, active, onClick }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-start gap-2 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        active ? `ring-2 ${ACCENT_RING[accent]}` : ""
      }`}
    >
      <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <span className={`h-2 w-2 rounded-full ${ACCENT_DOT[accent]}`} />
        {label}
      </span>
      <span className="text-3xl font-semibold tabular-nums text-slate-900">{count}</span>
    </button>
  );
}

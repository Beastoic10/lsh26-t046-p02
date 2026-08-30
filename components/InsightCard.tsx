function formatBDT(value: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function InsightCard({
  atRiskPct,
  atRiskItemCount,
  atRiskValue,
}: {
  atRiskPct: number;
  atRiskItemCount: number;
  atRiskValue: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700 p-5 text-white shadow-sm">
      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium">
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707M8 17a4 4 0 118 0c0 1.5-1 2-1 3H9c0-1-1-1.5-1-3z"
          />
        </svg>
        Insight
      </div>
      <p className="text-4xl font-semibold tracking-tight">{Math.round(atRiskPct)}%</p>
      <p className="mt-2 text-sm font-medium leading-snug text-white/90">
        of active stock value is expired or expiring within 30 days.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-white/70">
        {atRiskItemCount} item{atRiskItemCount === 1 ? "" : "s"} worth {formatBDT(atRiskValue)} need
        action now.
      </p>
    </div>
  );
}

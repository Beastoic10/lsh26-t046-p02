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
    <div
      className="relative flex h-full flex-col overflow-hidden p-6 text-clay-surface shadow-clay"
      style={{
        borderRadius: "1.75rem",
        background: "linear-gradient(135deg, #8F3B33 0%, #C1544A 55%, #D9A24B 100%)",
      }}
    >
      <div className="clay-pill mb-3 inline-flex w-fit items-center gap-1.5 bg-white/15 px-3 py-1 text-xs font-medium shadow-none">
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
      <p className="mt-auto pt-3 text-xs leading-relaxed text-white/75">
        {atRiskItemCount} item{atRiskItemCount === 1 ? "" : "s"} worth {formatBDT(atRiskValue)} need
        action now.
      </p>
    </div>
  );
}

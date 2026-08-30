function formatBDT(value: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ValueAtRiskCard({
  expiredValue,
  soonValue,
}: {
  expiredValue: number;
  soonValue: number;
}) {
  const total = expiredValue + soonValue;
  const expiredPct = total > 0 ? (expiredValue / total) * 100 : 0;
  const soonPct = total > 0 ? (soonValue / total) * 100 : 0;

  return (
    <div className="clay-surface flex h-full flex-col p-6">
      <h2 className="mb-2 text-sm font-medium text-clay-ink2">Value at risk</h2>
      <p className="text-3xl font-semibold tracking-tight text-clay-ink">{formatBDT(total)}</p>
      <p className="mt-1 text-xs text-clay-ink2">Expired + expiring within 30 days</p>

      <div className="mt-6 flex-1 space-y-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-clay-ink2">Already expired</span>
            <span className="font-semibold text-clay-ink">{formatBDT(expiredValue)}</span>
          </div>
          <div className="clay-surface-pressed h-2.5 w-full overflow-hidden !rounded-full p-0.5">
            <div
              className="h-full rounded-full bg-clay-terracotta shadow-clay-sm"
              style={{ width: `${expiredPct}%` }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-clay-ink2">Expiring within 30 days</span>
            <span className="font-semibold text-clay-ink">{formatBDT(soonValue)}</span>
          </div>
          <div className="clay-surface-pressed h-2.5 w-full overflow-hidden !rounded-full p-0.5">
            <div
              className="h-full rounded-full bg-clay-mustard shadow-clay-sm"
              style={{ width: `${soonPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-2 text-sm font-medium text-slate-500">Value at risk</h2>
      <p className="text-3xl font-semibold tracking-tight text-slate-900">{formatBDT(total)}</p>
      <p className="mt-1 text-xs text-slate-400">Expired + expiring within 30 days</p>

      <div className="mt-5 space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">Already expired</span>
            <span className="font-semibold text-slate-900">{formatBDT(expiredValue)}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-red-500" style={{ width: `${expiredPct}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">Expiring within 30 days</span>
            <span className="font-semibold text-slate-900">{formatBDT(soonValue)}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-amber-500" style={{ width: `${soonPct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

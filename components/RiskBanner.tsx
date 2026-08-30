function formatBDT(value: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RiskBanner({
  expiredValue,
  soonValue,
}: {
  expiredValue: number;
  soonValue: number;
}) {
  const total = expiredValue + soonValue;

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-red-800">Money at risk right now</p>
          <p className="mt-1 text-2xl font-semibold text-red-900">{formatBDT(total)}</p>
        </div>
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-red-700">Already expired</p>
            <p className="font-semibold text-red-900">{formatBDT(expiredValue)}</p>
          </div>
          <div>
            <p className="text-red-700">Expiring within 30 days</p>
            <p className="font-semibold text-red-900">{formatBDT(soonValue)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

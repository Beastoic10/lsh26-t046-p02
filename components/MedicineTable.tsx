import { Medicine } from "@/lib/types";
import { classify, daysLeft } from "@/lib/classify";
import StatusBadge from "./StatusBadge";

function formatBDT(value: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDaysLeft(days: number): string {
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Today";
  return `${days}d left`;
}

export default function MedicineTable({
  medicines,
  onReturn,
  showReturnAction = true,
  pendingId = null,
}: {
  medicines: Medicine[];
  onReturn?: (id: string) => void;
  showReturnAction?: boolean;
  pendingId?: string | null;
}) {
  if (medicines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        No items in this group.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-100 text-sm">
        <thead className="bg-slate-50/70">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Medicine</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Batch</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">Qty</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">Unit price</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">Value</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Expiry</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Status</th>
            {showReturnAction && <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {medicines.map((m) => {
            const group = classify(m.expiry_date);
            const left = daysLeft(m.expiry_date);
            const value = m.quantity * m.unit_price_bdt;
            return (
              <tr key={m.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{m.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{m.batch}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">{m.quantity}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                  {formatBDT(m.unit_price_bdt)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-900">
                  {formatBDT(value)}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <div>{m.expiry_date}</div>
                  <div className="text-xs text-slate-400">{formatDaysLeft(left)}</div>
                </td>
                <td className="px-4 py-3">
                  {m.status === "returned" ? (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-400/20">
                      Returned
                    </span>
                  ) : (
                    <StatusBadge group={group} />
                  )}
                </td>
                {showReturnAction && (
                  <td className="px-4 py-3 text-right">
                    {m.status === "active" && (
                      <button
                        onClick={() => onReturn?.(m.id)}
                        disabled={pendingId === m.id}
                        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {pendingId === m.id ? "Returning…" : "Mark returned"}
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

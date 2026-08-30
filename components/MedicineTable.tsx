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
      <div className="clay-surface-pressed p-10 text-center text-sm text-clay-ink2">
        No items in this group.
      </div>
    );
  }

  return (
    <div className="clay-surface overflow-hidden p-3">
      {/* Column header row — kept as a lightweight label bar rather than a
          grid header, so the emphasis stays on the puffy row cards below. */}
      <div className="hidden grid-cols-[2fr_1fr_0.6fr_0.9fr_0.9fr_1.1fr_1fr_1fr] gap-3 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-clay-ink2 sm:grid">
        <span>Medicine</span>
        <span>Batch</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Unit price</span>
        <span className="text-right">Value</span>
        <span>Expiry</span>
        <span>Status</span>
        {showReturnAction && <span className="text-right">Action</span>}
      </div>

      <div className="space-y-2">
        {medicines.map((m) => {
          const group = classify(m.expiry_date);
          const left = daysLeft(m.expiry_date);
          const value = m.quantity * m.unit_price_bdt;
          return (
            <div
              key={m.id}
              className="grid grid-cols-2 gap-3 rounded-2xl bg-clay-surface2 px-4 py-3 shadow-clay-sm sm:grid-cols-[2fr_1fr_0.6fr_0.9fr_0.9fr_1.1fr_1fr_1fr] sm:items-center"
            >
              <div className="font-medium text-clay-ink">{m.name}</div>
              <div className="font-mono text-xs text-clay-ink2">{m.batch}</div>
              <div className="text-right tabular-nums text-clay-ink sm:text-right">
                <span className="text-[10px] uppercase text-clay-ink2 sm:hidden">Qty </span>
                {m.quantity}
              </div>
              <div className="text-right tabular-nums text-clay-ink">
                <span className="text-[10px] uppercase text-clay-ink2 sm:hidden">Unit </span>
                {formatBDT(m.unit_price_bdt)}
              </div>
              <div className="text-right tabular-nums font-semibold text-clay-ink">
                <span className="text-[10px] uppercase text-clay-ink2 sm:hidden">Value </span>
                {formatBDT(value)}
              </div>
              <div className="text-clay-ink2">
                <div className="text-clay-ink">{m.expiry_date}</div>
                <div className="text-xs">{formatDaysLeft(left)}</div>
              </div>
              <div>
                {m.status === "returned" ? (
                  <span className="clay-pill inline-flex items-center bg-clay-surface px-3 py-1 text-xs font-medium text-clay-ink2 shadow-clay-sm">
                    Returned
                  </span>
                ) : (
                  <StatusBadge group={group} />
                )}
              </div>
              {showReturnAction && (
                <div className="text-right">
                  {m.status === "active" && (
                    <button
                      onClick={() => onReturn?.(m.id)}
                      disabled={pendingId === m.id}
                      className="clay-pill bg-clay-surface px-3 py-1.5 text-xs font-medium text-clay-ink shadow-clay-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {pendingId === m.id ? "Returning…" : "Mark returned"}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

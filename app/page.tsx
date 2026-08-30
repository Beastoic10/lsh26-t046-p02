"use client";

import { useMemo, useState } from "react";
import { getMedicines } from "@/lib/data";
import { classify, GROUP_LABEL } from "@/lib/classify";
import { ExpiryGroup, Medicine } from "@/lib/types";
import StatCard from "@/components/StatCard";
import RiskBanner from "@/components/RiskBanner";
import MedicineTable from "@/components/MedicineTable";

type Tab = "stock" | "returned";

const GROUP_ACCENT: Record<ExpiryGroup, "red" | "amber" | "yellow" | "emerald"> = {
  expired: "red",
  soon30: "amber",
  mid90: "yellow",
  safe: "emerald",
};

export default function DashboardPage() {
  const [medicines, setMedicines] = useState<Medicine[]>(() => getMedicines());
  const [tab, setTab] = useState<Tab>("stock");
  const [groupFilter, setGroupFilter] = useState<ExpiryGroup | null>(null);

  const active = useMemo(() => medicines.filter((m) => m.status === "active"), [medicines]);
  const returned = useMemo(() => medicines.filter((m) => m.status === "returned"), [medicines]);

  const byGroup = useMemo(() => {
    const buckets: Record<ExpiryGroup, Medicine[]> = {
      expired: [],
      soon30: [],
      mid90: [],
      safe: [],
    };
    for (const m of active) buckets[classify(m.expiry_date)].push(m);
    return buckets;
  }, [active]);

  const valueOf = (items: Medicine[]) =>
    items.reduce((sum, m) => sum + m.quantity * m.unit_price_bdt, 0);

  const visibleStock = groupFilter ? byGroup[groupFilter] : active;

  function handleReturn(id: string) {
    setMedicines((prev) => prev.map((m) => (m.id === id ? { ...m, status: "returned" } : m)));
    // Once Supabase is connected, fire the update alongside this:
    // await supabase.from("medicines").update({ status: "returned" }).eq("id", id);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Pharmacy Expiry Shelf Check</h1>
        <p className="mt-1 text-sm text-slate-500">
          {active.length} items on active shelf · {returned.length} returned to distributor
        </p>
      </header>

      {/* Segmented control — a familiar top-level view switch */}
      <div className="mb-6 inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        {(["stock", "returned"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
              tab === t ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t === "stock" ? "Active stock" : `Returned (${returned.length})`}
          </button>
        ))}
      </div>

      {tab === "stock" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(Object.keys(byGroup) as ExpiryGroup[]).map((group) => (
              <StatCard
                key={group}
                label={GROUP_LABEL[group]}
                count={byGroup[group].length}
                accent={GROUP_ACCENT[group]}
                active={groupFilter === group}
                onClick={() => setGroupFilter((prev) => (prev === group ? null : group))}
              />
            ))}
          </div>

          <RiskBanner expiredValue={valueOf(byGroup.expired)} soonValue={valueOf(byGroup.soon30)} />

          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-600">
              {groupFilter ? GROUP_LABEL[groupFilter] : "All active stock"}
              <span className="ml-2 text-slate-400">({visibleStock.length})</span>
            </h2>
            {groupFilter && (
              <button
                onClick={() => setGroupFilter(null)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Clear filter
              </button>
            )}
          </div>

          <MedicineTable medicines={visibleStock} onReturn={handleReturn} />
        </div>
      ) : (
        <MedicineTable medicines={returned} showReturnAction={false} />
      )}
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { getMedicines, markAsReturned, resetToInitialState } from "@/lib/data";
import { classify, monthlyBuckets } from "@/lib/classify";
import { ExpiryGroup, Medicine } from "@/lib/types";
import AppHeader from "@/components/AppHeader";
import StockByExpiryCard from "@/components/StockByExpiryCard";
import ValueAtRiskCard from "@/components/ValueAtRiskCard";
import InsightCard from "@/components/InsightCard";
import RiskChart from "@/components/RiskChart";
import ExpiringSoonCard from "@/components/ExpiringSoonCard";
import ActiveStockCard from "@/components/ActiveStockCard";
import MedicineTable from "@/components/MedicineTable";
import SearchBox from "@/components/SearchBox";
import QuickAddForm from "@/components/QuickAddForm";

type Tab = "stock" | "returned";

export default function DashboardPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("stock");
  const [groupFilter, setGroupFilter] = useState<ExpiryGroup | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getMedicines()
      .then((data) => {
        if (!cancelled) setMedicines(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load stock from Supabase.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  const monthly = useMemo(() => monthlyBuckets(active, 6), [active]);

  const valueOf = (items: Medicine[]) =>
    items.reduce((sum, m) => sum + m.quantity * m.unit_price_bdt, 0);

  const totalActiveValue = valueOf(active);
  const atRiskValue = valueOf(byGroup.expired) + valueOf(byGroup.soon30);
  const atRiskPct = totalActiveValue > 0 ? (atRiskValue / totalActiveValue) * 100 : 0;
  const atRiskItemCount = byGroup.expired.length + byGroup.soon30.length;

  const searchFiltered = (items: Medicine[]) => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (m) => m.name.toLowerCase().includes(term) || m.batch.toLowerCase().includes(term)
    );
  };

  const visibleStock = searchFiltered(groupFilter ? byGroup[groupFilter] : active);
  const visibleReturned = searchFiltered(returned);

  async function handleReturn(id: string) {
    const snapshot = medicines;
    setError(null);
    setPendingId(id);
    setMedicines((prev) => prev.map((m) => (m.id === id ? { ...m, status: "returned" } : m)));
    try {
      await markAsReturned(id);
    } catch (err) {
      setMedicines(snapshot);
      setError(err instanceof Error ? err.message : "Couldn't mark item as returned.");
    } finally {
      setPendingId(null);
    }
  }

  function handleAdded(newMedicine: Medicine) {
    setMedicines((prev) => [...prev, newMedicine]);
  }

  async function handleReset() {
    const confirmed = window.confirm(
      "Reset all stock to the original seeded data? This deletes every item you've added and undoes every return."
    );
    if (!confirmed) return;

    setResetting(true);
    setError(null);
    try {
      const data = await resetToInitialState();
      setMedicines(data);
      setGroupFilter(null);
      setSearch("");
      setTab("stock");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reset stock.");
    } finally {
      setResetting(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm text-clay-ink2">Loading stock from Supabase…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <AppHeader onReset={handleReset} resetting={resetting} />

      {error && (
        <div className="clay-surface mb-6 border-l-4 border-clay-terracotta px-4 py-3 text-sm text-clay-terracotta-dark">
          {error}
        </div>
      )}

      {!error && medicines.length === 0 && (
        <div className="clay-surface mb-6 border-l-4 border-clay-mustard px-4 py-3 text-sm text-clay-ink">
          No rows came back from the medicines table. Check that supabase/seed.sql has been run
          against this project.
        </div>
      )}

      <div className="space-y-4">
        {/* Row 1: expiry breakdown + value at risk + insight — heights are
            forced to match across the row so no card trails off into a
            block of empty clay below it. */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StockByExpiryCard
              byGroup={byGroup}
              groupFilter={groupFilter}
              onSelect={(group) => setGroupFilter((prev) => (prev === group ? null : group))}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <ValueAtRiskCard expiredValue={valueOf(byGroup.expired)} soonValue={valueOf(byGroup.soon30)} />
            <InsightCard atRiskPct={atRiskPct} atRiskItemCount={atRiskItemCount} atRiskValue={atRiskValue} />
          </div>
        </div>

        {/* Row 2: monthly value chart + items-expiring histogram + composition */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RiskChart data={monthly} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <ExpiringSoonCard buckets={monthly} />
            <ActiveStockCard byGroup={byGroup} />
          </div>
        </div>

        {/* Row 3: table controls + table */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="clay-pill inline-flex bg-clay-surface2 p-1">
            {(["stock", "returned"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`clay-pill px-4 py-1.5 text-sm font-medium transition ${
                  tab === t ? "bg-clay-terracotta text-white" : "bg-transparent text-clay-ink2 shadow-none hover:text-clay-ink"
                }`}
              >
                {t === "stock" ? "Active stock" : `Returned (${returned.length})`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <SearchBox value={search} onChange={setSearch} />
            {tab === "stock" && <QuickAddForm onAdded={handleAdded} />}
          </div>
        </div>

        {tab === "stock" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-clay-ink2">
                {groupFilter ? "Filtered stock" : "All active stock"}
                <span className="ml-2 text-clay-ink2/70">({visibleStock.length})</span>
              </h2>
              {groupFilter && (
                <button
                  onClick={() => setGroupFilter(null)}
                  className="text-sm font-medium text-clay-terracotta-dark hover:brightness-90"
                >
                  Clear filter
                </button>
              )}
            </div>
            <MedicineTable medicines={visibleStock} onReturn={handleReturn} pendingId={pendingId} />
          </div>
        ) : (
          <MedicineTable medicines={visibleReturned} showReturnAction={false} />
        )}
      </div>
    </main>
  );
}

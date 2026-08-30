"use client";

import { useState } from "react";
import { addMedicine } from "@/lib/data";
import { Medicine } from "@/lib/types";

const SHELF_LIFE_OPTIONS = [
  { label: "6 months", months: 6 },
  { label: "1 year", months: 12 },
  { label: "2 years", months: 24 },
  { label: "3 years", months: 36 },
];

const DEFAULT_MONTHS = 24; // most common shelf life for the seed catalog's tablet/syrup mix

function shelfLifeExpiry(months: number): string {
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

export default function QuickAddForm({ onAdded }: { onAdded: (medicine: Medicine) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [batch, setBatch] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [shelfLifeMonths, setShelfLifeMonths] = useState(DEFAULT_MONTHS);
  const [expiryDate, setExpiryDate] = useState(() => shelfLifeExpiry(DEFAULT_MONTHS));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleShelfLifeChange(months: number) {
    setShelfLifeMonths(months);
    setExpiryDate(shelfLifeExpiry(months));
  }

  function resetForm() {
    setName("");
    setBatch("");
    setQuantity("");
    setUnitPrice("");
    setShelfLifeMonths(DEFAULT_MONTHS);
    setExpiryDate(shelfLifeExpiry(DEFAULT_MONTHS));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const qty = Number(quantity);
    const price = Number(unitPrice);

    if (!name.trim() || !batch.trim()) {
      setError("Name and batch are required.");
      return;
    }
    if (!Number.isFinite(qty) || qty <= 0) {
      setError("Quantity must be a positive number.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setError("Unit price must be a positive number.");
      return;
    }
    if (!expiryDate) {
      setError("Expiry date is required.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await addMedicine({
        name: name.trim(),
        batch: batch.trim(),
        quantity: qty,
        unit_price_bdt: price,
        expiry_date: expiryDate,
      });
      onAdded(created);
      resetForm();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't add this item.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="clay-pill inline-flex items-center gap-1.5 bg-clay-sage px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-105"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add medicine
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="clay-surface p-6"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-clay-ink">Add medicine</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-clay-ink2 hover:text-clay-ink"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-clay-ink2">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="clay-surface-pressed !rounded-xl border-0 bg-clay-surface2 px-3 py-2 text-sm text-clay-ink focus:outline-none"
            placeholder="e.g. Napa 500mg"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-clay-ink2">
          Batch
          <input
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            className="clay-surface-pressed !rounded-xl border-0 bg-clay-surface2 px-3 py-2 text-sm text-clay-ink focus:outline-none"
            placeholder="e.g. B2451-3"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-clay-ink2">
          Quantity
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="clay-surface-pressed !rounded-xl border-0 bg-clay-surface2 px-3 py-2 text-sm text-clay-ink focus:outline-none"
            placeholder="e.g. 100"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-clay-ink2">
          Unit price (BDT)
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            className="clay-surface-pressed !rounded-xl border-0 bg-clay-surface2 px-3 py-2 text-sm text-clay-ink focus:outline-none"
            placeholder="e.g. 5.50"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-clay-ink2">
          Shelf life
          <select
            value={shelfLifeMonths}
            onChange={(e) => handleShelfLifeChange(Number(e.target.value))}
            className="clay-surface-pressed !rounded-xl border-0 bg-clay-surface2 px-3 py-2 text-sm text-clay-ink focus:outline-none"
          >
            {SHELF_LIFE_OPTIONS.map((opt) => (
              <option key={opt.months} value={opt.months}>
                {opt.label}
                {opt.months === DEFAULT_MONTHS ? " (common)" : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-clay-ink2">
          Expiry date
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="clay-surface-pressed !rounded-xl border-0 bg-clay-surface2 px-3 py-2 text-sm text-clay-ink focus:outline-none"
          />
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={submitting}
            className="clay-pill w-full !rounded-xl bg-clay-terracotta px-3 py-2 text-sm font-medium text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Adding…" : "Add to shelf"}
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs text-clay-ink2">
        Shelf life defaults to {DEFAULT_MONTHS / 12} years and fills in the expiry date — pick a
        different preset or edit the date directly for anything unusual.
      </p>

      {error && <p className="mt-2 text-xs font-medium text-clay-terracotta-dark">{error}</p>}
    </form>
  );
}

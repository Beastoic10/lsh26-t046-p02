import { ExpiryGroup } from "./types";

/**
 * Strip the time component so "days left" is a whole-day count regardless
 * of what time it is right now. Comparing raw Date objects (with time
 * components) is the most common source of off-by-one bucket errors.
 */
function toMidnightUTC(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function daysLeft(expiryDateISO: string, today: Date = new Date()): number {
  const expiry = toMidnightUTC(new Date(expiryDateISO));
  const now = toMidnightUTC(today);
  return Math.round((expiry - now) / (1000 * 60 * 60 * 24));
}

/**
 * Ruling R-04: "expiring soon" is 0 to 30 days left, inclusive on both ends.
 * Expired is its own group (days left < 0), not folded into "soon".
 */
export function classify(expiryDateISO: string, today: Date = new Date()): ExpiryGroup {
  const left = daysLeft(expiryDateISO, today);
  if (left < 0) return "expired";
  if (left <= 30) return "soon30";
  if (left <= 90) return "mid90";
  return "safe";
}

export const GROUP_LABEL: Record<ExpiryGroup, string> = {
  expired: "Expired",
  soon30: "Expiring within 30 days",
  mid90: "Expiring within 90 days",
  safe: "Safe",
};

export interface MonthlyBucket {
  label: string; // e.g. "Aug 2026"
  value: number; // taka value at risk
  count: number; // number of items expiring that month
}

/**
 * Buckets active items by calendar month of expiry, starting with the
 * current month, for `monthsAhead` months. Used by the six-month risk
 * chart and the items-expiring histogram, so both read the same numbers.
 * Items already expired earlier than the current month are intentionally
 * excluded — this is a forward-looking view, not a restatement of the
 * expired-group total.
 */
export function monthlyBuckets<T extends { expiry_date: string; quantity: number; unit_price_bdt: number }>(
  items: T[],
  monthsAhead: number = 6,
  today: Date = new Date()
): MonthlyBucket[] {
  const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  const buckets: MonthlyBucket[] = Array.from({ length: monthsAhead }, (_, i) => {
    const d = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, 1));
    return {
      label: d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }),
      value: 0,
      count: 0,
    };
  });

  for (const item of items) {
    const expiry = new Date(item.expiry_date);
    const monthIndex =
      (expiry.getUTCFullYear() - start.getUTCFullYear()) * 12 + (expiry.getUTCMonth() - start.getUTCMonth());
    if (monthIndex >= 0 && monthIndex < monthsAhead) {
      buckets[monthIndex].value += item.quantity * item.unit_price_bdt;
      buckets[monthIndex].count += 1;
    }
  }

  return buckets;
}

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

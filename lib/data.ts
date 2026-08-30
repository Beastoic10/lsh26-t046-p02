import { Medicine } from "./types";

/**
 * ---------------------------------------------------------------------
 * Wiring up Supabase later:
 *
 * 1. `npm install @supabase/supabase-js` (already in package.json).
 * 2. Create lib/supabase.ts:
 *
 *      import { createClient } from "@supabase/supabase-js";
 *      export const supabase = createClient(
 *        process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 *      );
 *
 * 3. Replace the body of getMedicines() below with:
 *
 *      const { data, error } = await supabase.from("medicines").select("*");
 *      if (error) throw error;
 *      return data as Medicine[];
 *
 * 4. In app/page.tsx, the "mark as returned" handler currently just
 *    updates React state. Add alongside it:
 *
 *      await supabase.from("medicines").update({ status: "returned" }).eq("id", id);
 *
 * Nothing else in the app needs to change — every component reads
 * Medicine[] shapes, not the mock data directly.
 * ---------------------------------------------------------------------
 */

const NAMES: [string, string][] = [
  ["Napa 500mg", "Beximco Pharma"],
  ["Napa Extra", "Beximco Pharma"],
  ["Seclo 20mg", "Square Pharma"],
  ["Fexo 120mg", "Square Pharma"],
  ["Ace 500mg", "Beximco Pharma"],
  ["Losectil 20mg", "Incepta Pharma"],
  ["Monas 10mg", "Beacon Pharma"],
  ["Sergel 20mg", "Healthcare Pharma"],
  ["Antasid Plus", "ACI Limited"],
  ["Histacin 10mg", "Opsonin Pharma"],
  ["Fexofast 120mg", "Renata Limited"],
  ["Calcimax D", "Renata Limited"],
  ["Zimax 500mg", "Square Pharma"],
  ["Amodis 400mg", "Square Pharma"],
  ["Rivotril 2mg", "Novartis"],
  ["Neksium 20mg", "Square Pharma"],
  ["Maxpro 20mg", "Aristopharma"],
  ["Ecosprin 75mg", "USV Limited"],
  ["Xetil 200mg", "Beximco Pharma"],
  ["Flexibact 500mg", "Incepta Pharma"],
  ["Emistat 4mg", "Opsonin Pharma"],
  ["Provair 5mg", "Beacon Pharma"],
  ["Ranidin 150mg", "Square Pharma"],
  ["Cef-3 1gm Inj", "Aristopharma"],
  ["Tozyl 500mg", "ACI Limited"],
  ["Bicozin Syrup", "Square Pharma"],
  ["Zinc-B Syrup", "ACI Limited"],
  ["Orsaline-N", "ACME Laboratories"],
  ["Paracin 500mg", "ACME Laboratories"],
  ["Difenac 50mg", "Square Pharma"],
  ["Tulip 20mg", "Julphar Bangladesh"],
  ["Rosuva 10mg", "Beximco Pharma"],
  ["Glucored 5mg", "Sun Pharma"],
  ["Insugen 30/70", "Sun Pharma"],
  ["Amdocal 5mg", "Renata Limited"],
  ["Concor 5mg", "Merck"],
  ["Ativan 1mg", "Pfizer"],
  ["Ketorol DT", "Beximco Pharma"],
  ["Cotrim Forte", "ACME Laboratories"],
  ["Vitamin D3 Plus", "Incepta Pharma"],
];

// Day offsets from "today", hand-picked to guarantee a spread across all
// four groups plus a safety margin around the 0/30/90 boundaries so the
// classifier's edge cases (R-04) are visibly exercised in the demo data.
const OFFSETS: number[] = [
  -90, -60, -45, -30, -14, -7, -3, -1, // expired (8)
  0, 2, 5, 9, 14, 18, 22, 26, 29, 30, // soon: within 30 days, inclusive (10)
  31, 35, 40, 48, 55, 62, 70, 78, 85, 90, // mid: within 90 days, inclusive (10)
  95, 110, 130, 160, 200, 240, 280, 320, 400, 500, 540, 600, // safe (12)
];

function isoDateFromToday(offsetDays: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

// Simple deterministic pseudo-random so the demo looks the same on every
// load instead of reshuffling prices/quantities on every render.
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9973) * 10000;
  return x - Math.floor(x);
}

function buildSeedMedicines(): Medicine[] {
  return NAMES.map(([name, company], i) => {
    const offset = OFFSETS[i % OFFSETS.length];
    const quantity = 5 + Math.floor(seededRandom(i) * 400);
    const unit_price_bdt = Math.round((8 + seededRandom(i + 100) * 300) * 100) / 100;
    return {
      id: `med-${i + 1}`,
      name,
      company,
      batch: `B${(2400 + i).toString()}-${(i % 9) + 1}`,
      quantity,
      unit_price_bdt,
      expiry_date: isoDateFromToday(offset),
      status: "active",
    };
  });
}

/**
 * Synchronous for now because it's just an in-memory array. Swap the body
 * for the Supabase `select` call shown above — the return type doesn't
 * change, so no caller needs to change. Once it's a real fetch, call this
 * from a Server Component or inside useEffect and drop the "sync" framing.
 */
export function getMedicines(): Medicine[] {
  return buildSeedMedicines();
}

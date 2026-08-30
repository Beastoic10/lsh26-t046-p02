/**
 * A literal copy of supabase/seed.sql's rows, kept in application code so
 * the "Reset to initial state" button can restore the exact judging fixture
 * without touching anything under supabase/. If seed.sql ever changes,
 * update this list to match — it is not read from the .sql file at runtime.
 */
export interface SeedRow {
  name: string;
  batch: string;
  quantity: number;
  expiry_date: string;
  unit_price_bdt: number;
}

export const INITIAL_SEED: SeedRow[] = [
  // Expired (< Aug 30, 2026)
  { name: "Napa Extend", batch: "NX-25A", quantity: 120, expiry_date: "2026-06-15", unit_price_bdt: 2.0 },
  { name: "Seclo 20mg", batch: "SC-99B", quantity: 50, expiry_date: "2026-07-20", unit_price_bdt: 5.5 },
  { name: "Monas 10", batch: "MN-11X", quantity: 30, expiry_date: "2026-08-20", unit_price_bdt: 17.0 },
  { name: "Cef-3 250mg", batch: "CF-01", quantity: 15, expiry_date: "2025-12-01", unit_price_bdt: 35.0 },
  { name: "Fexo 120", batch: "FX-22C", quantity: 200, expiry_date: "2026-08-29", unit_price_bdt: 8.0 },
  { name: "Maxpro 20", batch: "MP-44", quantity: 80, expiry_date: "2026-05-10", unit_price_bdt: 7.0 },
  { name: "Calbo D", batch: "CD-88", quantity: 45, expiry_date: "2026-08-25", unit_price_bdt: 4.5 },
  { name: "Losectil 20", batch: "LS-09", quantity: 110, expiry_date: "2026-01-30", unit_price_bdt: 5.0 },

  // Expiring soon, 0-30 days
  { name: "Pantonix 20", batch: "PT-01", quantity: 60, expiry_date: "2026-08-30", unit_price_bdt: 7.0 },
  { name: "Ecosprin 75", batch: "ES-75", quantity: 300, expiry_date: "2026-09-01", unit_price_bdt: 1.5 },
  { name: "Ace Plus", batch: "AP-99", quantity: 150, expiry_date: "2026-09-05", unit_price_bdt: 2.5 },
  { name: "Tufnil", batch: "TF-20", quantity: 40, expiry_date: "2026-09-10", unit_price_bdt: 12.0 },
  { name: "Rivotril 0.5mg", batch: "RV-05", quantity: 90, expiry_date: "2026-09-12", unit_price_bdt: 8.5 },
  { name: "Alatrol", batch: "AL-10", quantity: 100, expiry_date: "2026-09-15", unit_price_bdt: 3.5 },
  { name: "Finix 20", batch: "FN-20", quantity: 75, expiry_date: "2026-09-18", unit_price_bdt: 6.0 },
  { name: "A-Mox 500", batch: "AM-500", quantity: 120, expiry_date: "2026-09-22", unit_price_bdt: 14.0 },
  { name: "Bizoran", batch: "BZ-50", quantity: 50, expiry_date: "2026-09-25", unit_price_bdt: 11.0 },
  { name: "Bextrum Gold", batch: "BG-01", quantity: 30, expiry_date: "2026-09-29", unit_price_bdt: 9.0 },

  // Expiring in 90 days, 31-90 days
  { name: "Xinc", batch: "XN-02", quantity: 80, expiry_date: "2026-09-30", unit_price_bdt: 2.0 },
  { name: "Osartil 50", batch: "OS-50", quantity: 140, expiry_date: "2026-10-05", unit_price_bdt: 6.5 },
  { name: "Neobion", batch: "NB-99", quantity: 200, expiry_date: "2026-10-10", unit_price_bdt: 3.0 },
  { name: "Napa Extra", batch: "NE-45", quantity: 400, expiry_date: "2026-10-15", unit_price_bdt: 2.5 },
  { name: "Ceevit", batch: "CV-250", quantity: 150, expiry_date: "2026-10-20", unit_price_bdt: 1.8 },
  { name: "Cometa", batch: "CM-10", quantity: 95, expiry_date: "2026-10-25", unit_price_bdt: 5.5 },
  { name: "Deslor", batch: "DL-05", quantity: 110, expiry_date: "2026-11-01", unit_price_bdt: 4.0 },
  { name: "Emistat", batch: "EM-08", quantity: 60, expiry_date: "2026-11-10", unit_price_bdt: 4.5 },
  { name: "Entacyd", batch: "EN-00", quantity: 300, expiry_date: "2026-11-15", unit_price_bdt: 1.5 },
  { name: "Flamyd", batch: "FL-400", quantity: 70, expiry_date: "2026-11-28", unit_price_bdt: 2.2 },

  // Safe, > 90 days
  { name: "Geston", batch: "GS-10", quantity: 45, expiry_date: "2026-12-15", unit_price_bdt: 18.0 },
  { name: "Histacin", batch: "HS-04", quantity: 250, expiry_date: "2027-01-10", unit_price_bdt: 1.0 },
  { name: "I-cap", batch: "IC-22", quantity: 80, expiry_date: "2027-02-15", unit_price_bdt: 6.0 },
  { name: "Joy 20", batch: "JY-20", quantity: 50, expiry_date: "2027-03-20", unit_price_bdt: 5.5 },
  { name: "Keto", batch: "KT-10", quantity: 120, expiry_date: "2027-04-10", unit_price_bdt: 4.0 },
  { name: "Lebac", batch: "LB-500", quantity: 35, expiry_date: "2027-05-05", unit_price_bdt: 25.0 },
  { name: "Mofluren", batch: "MF-01", quantity: 65, expiry_date: "2027-06-30", unit_price_bdt: 15.0 },
  { name: "Nidre", batch: "ND-03", quantity: 100, expiry_date: "2027-07-25", unit_price_bdt: 12.0 },
  { name: "Orsaline-N", batch: "OR-10", quantity: 500, expiry_date: "2027-08-30", unit_price_bdt: 6.0 },
  { name: "Pevisone", batch: "PV-02", quantity: 40, expiry_date: "2027-10-15", unit_price_bdt: 45.0 },
  { name: "Rolac", batch: "RL-10", quantity: 85, expiry_date: "2027-12-01", unit_price_bdt: 8.0 },
  { name: "S-Amlopin", batch: "SA-05", quantity: 130, expiry_date: "2028-02-28", unit_price_bdt: 5.0 },
];

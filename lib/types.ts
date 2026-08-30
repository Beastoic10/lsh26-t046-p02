export type MedicineStatus = "active" | "returned";

export type ExpiryGroup = "expired" | "soon30" | "mid90" | "safe";

export interface Medicine {
  id: string;
  name: string;
  company: string;
  batch: string;
  quantity: number;
  unit_price_bdt: number;
  expiry_date: string; // ISO date string, e.g. "2026-09-14"
  status: MedicineStatus;
}

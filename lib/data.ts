import { supabase, returnToDistributor } from "../supabaseClient";
import { Medicine } from "./types";

/**
 * Fetches every row (active + returned) so the dashboard can derive both
 * the four active groups and the separate Returned list from one query.
 * supabaseClient.js's getActiveInventory() only returns active rows, which
 * isn't enough on its own for the Returned tab, so this queries the same
 * `supabase` client directly instead of duplicating logic in that file.
 */
export async function getMedicines(): Promise<Medicine[]> {
  const { data, error } = await supabase
    .from("medicines")
    .select("*")
    .order("expiry_date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Medicine[];
}

// Thin re-export so callers only ever import from lib/data, not the
// Supabase client directly — keeps the swap-points obvious in one place.
export async function markAsReturned(id: string): Promise<void> {
  await returnToDistributor(id);
}

export interface NewMedicineInput {
  name: string;
  batch: string;
  quantity: number;
  unit_price_bdt: number;
  expiry_date: string;
}

export async function addMedicine(input: NewMedicineInput): Promise<Medicine> {
  const { data, error } = await supabase
    .from("medicines")
    .insert([{ ...input, status: "active" }])
    .select()
    .single();

  if (error) throw error;
  return data as Medicine;
}

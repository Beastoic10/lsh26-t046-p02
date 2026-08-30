import { supabase, returnToDistributor } from "../supabaseClient";
import { Medicine } from "./types";
import { INITIAL_SEED } from "./seedData";

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

/**
 * Wipes the medicines table and re-inserts the exact rows from
 * supabase/seed.sql (mirrored in lib/seedData.ts), so judges — or anyone
 * testing the app — can undo every return and every quick-added item with
 * one click and get back to the fixture the app ships with.
 */
export async function resetToInitialState(): Promise<Medicine[]> {
  // Supabase requires a filter on delete; every row has a non-null id, so
  // this clears the whole table without needing to know any ids up front.
  const { error: deleteError } = await supabase.from("medicines").delete().not("id", "is", null);
  if (deleteError) throw deleteError;

  const rows = INITIAL_SEED.map((row) => ({ ...row, status: "active" as const }));
  const { error: insertError } = await supabase.from("medicines").insert(rows);
  if (insertError) throw insertError;

  return getMedicines();
}

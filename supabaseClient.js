import { createClient } from '@supabase/supabase-js';

// Retrieve these from your Supabase project settings -> API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Utility function to fetch only active inventory.
 * Fulfills constraint R-24 by filtering out 'returned' items at the query level.
 */
export async function getActiveInventory() {
    const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .eq('status', 'active');

    if (error) throw error;
    return data;
}

/**
 * Utility function to mark an item as returned.
 * Instantly triggers removal from active lists.
 */
export async function returnToDistributor(medicineId) {
    const { data, error } = await supabase
        .from('medicines')
        .update({ status: 'returned' })
        .eq('id', medicineId)
        .select();

    if (error) throw error;
    return data;
}
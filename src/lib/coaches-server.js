// Server-only Coach-Reader. Verwende dies in Server-Components / Route-Handlern,
// um Coach-Daten aus Supabase zu laden.
//
// Beispiel (in einer Server-Component):
//   import { loadCoaches } from '@/lib/coaches-server';
//   const coaches = await loadCoaches();

import { createClient } from '@/lib/supabase/server';
import { dbCoachToUi } from './coaches';

/** Lädt alle aktiven Coaches sortiert nach sort_order. */
export async function loadCoaches({ includeInactive = false } = {}) {
  const supabase = createClient();
  let query = supabase.from('coaches').select('*').order('sort_order', { ascending: true });
  if (!includeInactive) {
    query = query.eq('is_active', true);
  }
  const { data, error } = await query;
  if (error) {
    console.error('[coaches-server] loadCoaches error:', error);
    return [];
  }
  return (data || []).map(dbCoachToUi);
}

/** Lädt einen einzelnen Coach per ID. */
export async function loadCoachById(id) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('coaches').select('*').eq('id', id).maybeSingle();
  if (error) {
    console.error('[coaches-server] loadCoachById error:', error);
    return null;
  }
  return dbCoachToUi(data);
}

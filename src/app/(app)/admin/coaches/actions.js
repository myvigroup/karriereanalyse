'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Helper: stellt sicher dass der aktuelle User Admin oder Coach ist.
async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht angemeldet');
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'coach'].includes(profile.role)) {
    throw new Error('Keine Berechtigung');
  }
  return supabase;
}

// Mapping UI-camelCase → DB-snake_case
function uiToDb(payload) {
  const out = {};
  const map = {
    id: 'id',
    name: 'name',
    role: 'role',
    title: 'title',
    initials: 'initials',
    gradient: 'gradient',
    photoUrl: 'photo_url',
    status: 'status',
    sinceYear: 'since_year',
    experience: 'experience',
    rating: 'rating',
    sessionCount: 'session_count',
    responseTime: 'response_time',
    location: 'location',
    languages: 'languages',
    short: 'short',
    bio: 'bio',
    successStory: 'success_story',
    specialties: 'specialties',
    industries: 'industries',
    slots: 'slots',
    seminarIds: 'seminar_ids',
    masterclassIds: 'masterclass_ids',
    external: 'external',
    poweredBy: 'powered_by',
    isActive: 'is_active',
    sortOrder: 'sort_order',
  };
  for (const [uiKey, dbKey] of Object.entries(map)) {
    if (payload[uiKey] !== undefined) {
      out[dbKey] = payload[uiKey];
    }
  }
  return out;
}

export async function saveCoach(payload) {
  const supabase = await requireAdmin();
  const dbPayload = uiToDb(payload);
  if (!dbPayload.id) throw new Error('ID fehlt');
  if (!dbPayload.name) throw new Error('Name fehlt');
  if (!dbPayload.initials) throw new Error('Initialen fehlen');

  const { data, error } = await supabase
    .from('coaches')
    .upsert(dbPayload, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/admin/coaches');
  revalidatePath('/coach');
  revalidatePath('/cv-check');
  revalidatePath('/masterclass');
  return { ok: true, coach: data };
}

export async function deleteCoach(coachId) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from('coaches').delete().eq('id', coachId);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/coaches');
  revalidatePath('/coach');
  revalidatePath('/cv-check');
  revalidatePath('/masterclass');
  return { ok: true };
}

export async function toggleCoachActive(coachId, isActive) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from('coaches')
    .update({ is_active: isActive })
    .eq('id', coachId);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/coaches');
  revalidatePath('/coach');
  return { ok: true };
}

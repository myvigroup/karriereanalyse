'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const admin = createAdminClient();
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') redirect('/advisor');
  return admin;
}

// ── Messen ───────────────────────────────────────────────────────────────────

export async function createFair(formData) {
  const admin = await requireAdmin();
  const name = formData.get('name')?.trim();
  const city = formData.get('city')?.trim();
  const start_date = formData.get('start_date');
  const end_date = formData.get('end_date') || start_date;
  const status = formData.get('status') || 'upcoming';

  if (!name || !start_date) return { error: 'Name und Startdatum sind erforderlich.' };

  const { data, error } = await admin
    .from('fairs')
    .insert({ name, city, start_date, end_date, status })
    .select('id')
    .single();

  if (error) return { error: error.message };
  redirect(`/advisor/admin/fairs/${data.id}`);
}

export async function updateFair(formData) {
  const admin = await requireAdmin();
  const id = formData.get('id');
  const name = formData.get('name')?.trim();
  const city = formData.get('city')?.trim();
  const start_date = formData.get('start_date');
  const end_date = formData.get('end_date') || start_date;
  const status = formData.get('status');

  const { error } = await admin
    .from('fairs')
    .update({ name, city, start_date, end_date, status })
    .eq('id', id);

  if (error) return { error: error.message };
  redirect(`/advisor/admin/fairs/${id}`);
}

// ── Berater ──────────────────────────────────────────────────────────────────

export async function createAdvisorAccount(formData) {
  const admin = await requireAdmin();
  const email = formData.get('email')?.trim().toLowerCase();
  const name = formData.get('name')?.trim();
  const password = formData.get('password');
  const returnFair = formData.get('returnFair');

  if (!email || !name || !password) return { error: 'Alle Felder sind erforderlich.' };

  // Supabase Auth User erstellen
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });

  if (authError) return { error: authError.message };

  const userId = authData.user.id;

  // Profil setzen
  await admin.from('profiles').upsert({
    id: userId,
    email,
    name,
    role: 'advisor',
  });

  // Advisor-Eintrag
  const { data: newAdvisor } = await admin.from('advisors').insert({
    user_id: userId,
    display_name: name,
  }).select('id').single();

  // Wenn von einer Messe aus aufgerufen: direkt zuweisen und zurück
  if (returnFair) {
    await admin.from('fair_advisors').upsert({ fair_id: returnFair, advisor_user_id: userId, is_manager: false });
    redirect(`/advisor/admin/fairs/${returnFair}`);
  }

  redirect('/advisor/admin');
}

// ── Messe ↔ Berater ──────────────────────────────────────────────────────────

export async function assignAdvisorToFair(formData) {
  const admin = await requireAdmin();
  const fair_id = formData.get('fair_id');
  const advisor_user_id = formData.get('advisor_user_id');

  const { error } = await admin
    .from('fair_advisors')
    .upsert({ fair_id, advisor_user_id, is_manager: false });

  if (error) return { error: error.message };
  redirect(`/advisor/admin/fairs/${fair_id}`);
}

export async function removeAdvisorFromFair(formData) {
  const admin = await requireAdmin();
  const fair_id = formData.get('fair_id');
  const advisor_user_id = formData.get('advisor_user_id');

  await admin
    .from('fair_advisors')
    .delete()
    .eq('fair_id', fair_id)
    .eq('advisor_user_id', advisor_user_id);

  redirect(`/advisor/admin/fairs/${fair_id}`);
}

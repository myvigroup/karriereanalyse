'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

// Quick-Lead — Berater erstellt CV-Check ohne Messe-Kontext.
// fair_id bleibt NULL, source='direct'. Lead-ID dient als Upload-Token.
export async function createQuickLead(formData) {
  const supabase = createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht angemeldet' };

  // Advisor-ID aus profile/advisors-Tabelle ermitteln
  const { data: advisor } = await admin
    .from('advisors')
    .select('id, user_id, display_name')
    .eq('user_id', user.id)
    .maybeSingle();

  // Auch Admins ohne advisor-Eintrag dürfen Quick-Leads erstellen
  const { data: profile } = await admin
    .from('profiles').select('role').eq('id', user.id).maybeSingle();
  const isAdmin = ['admin', 'messeleiter'].includes(profile?.role);
  if (!advisor && !isAdmin) return { error: 'Kein Berater-Profil gefunden.' };

  const name = (formData.get('name') || '').trim();
  const email = (formData.get('email') || '').trim().toLowerCase() || null;
  const phone = (formData.get('phone') || '').trim() || null;
  const target_position = (formData.get('target_position') || '').trim() || null;

  if (!name) return { error: 'Vorname ist Pflicht.' };

  const { data: lead, error: insertError } = await admin
    .from('fair_leads')
    .insert({
      fair_id: null,
      advisor_id: advisor?.id || null,
      advisor_user_id: user.id,
      first_name: name,
      last_name: '',
      email,
      phone,
      target_position,
      source: 'direct',
      status: 'new',
    })
    .select('id')
    .single();

  if (insertError) return { error: insertError.message };

  // Analytics-Event (best-effort)
  admin.from('analytics_events').insert({
    event_name: 'quick_lead_created',
    advisor_id: advisor?.id || null,
    metadata: { lead_id: lead.id, source: 'direct' },
  }).then(() => {}, () => {});

  revalidatePath('/advisor/quick-lead');
  return { ok: true, leadId: lead.id };
}

export async function deleteQuickLead(leadId) {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Nicht angemeldet' };

  // Nur Lead-Owner oder Admin darf löschen
  const { data: lead } = await admin.from('fair_leads')
    .select('advisor_user_id, fair_id').eq('id', leadId).maybeSingle();
  if (!lead) return { error: 'Lead nicht gefunden' };

  const { data: profile } = await admin
    .from('profiles').select('role').eq('id', user.id).maybeSingle();
  const isAdmin = profile?.role === 'admin';
  if (lead.advisor_user_id !== user.id && !isAdmin) {
    return { error: 'Keine Berechtigung' };
  }

  const { error } = await admin.from('fair_leads').delete().eq('id', leadId);
  if (error) return { error: error.message };

  revalidatePath('/advisor/quick-lead');
  return { ok: true };
}

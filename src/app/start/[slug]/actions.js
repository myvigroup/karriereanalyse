'use server';

import { createAdminClient } from '@/lib/supabase/admin';

// Erstellt einen Quick-Lead direkt aus dem Affiliate-Landing-Flow.
// Lead wird dem Berater (via Slug) zugeordnet und landet sofort in dessen Dashboard.
export async function createSelfServiceLead(slug, formData) {
  if (!slug) return { error: 'Kein Berater-Slug' };

  const admin = createAdminClient();

  const { data: advisor } = await admin
    .from('advisors')
    .select('id, user_id, status, display_name')
    .ilike('slug', slug)
    .maybeSingle();

  if (!advisor || advisor.status === 'inactive') {
    return { error: 'Berater nicht gefunden' };
  }

  const name = (formData.get('name') || '').trim();
  const email = (formData.get('email') || '').trim().toLowerCase() || null;
  const phone = (formData.get('phone') || '').trim() || null;
  const target_position = (formData.get('target_position') || '').trim() || null;

  if (!name) return { error: 'Vorname ist Pflicht.' };
  if (!email) return { error: 'E-Mail wird für die Auswertung benötigt.' };

  const { data: lead, error: insertError } = await admin
    .from('fair_leads')
    .insert({
      fair_id: null,
      advisor_id: advisor.id,
      advisor_user_id: advisor.user_id,
      first_name: name,
      last_name: '',
      email,
      phone,
      target_position,
      source: 'affiliate',
      status: 'new',
    })
    .select('id')
    .single();

  if (insertError) return { error: insertError.message };

  // Affiliate-Conversion-Counter (best-effort)
  admin
    .from('advisors')
    .select('affiliate_signups')
    .eq('id', advisor.id).single()
    .then(({ data }) => {
      if (data) {
        admin.from('advisors')
          .update({ affiliate_signups: (data.affiliate_signups || 0) + 1 })
          .eq('id', advisor.id)
          .then(() => {}, () => {});
      }
    });

  // Analytics
  admin.from('analytics_events').insert({
    event_name: 'affiliate_lead_created',
    advisor_id: advisor.id,
    metadata: { lead_id: lead.id, slug, source: 'affiliate' },
  }).then(() => {}, () => {});

  return { ok: true, leadId: lead.id };
}

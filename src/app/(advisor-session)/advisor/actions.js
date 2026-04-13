'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email';
import { redirect } from 'next/navigation';

// Hole advisor-ID des eingeloggten Users
async function getAdvisorId() {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: advisor } = await admin
    .from('advisors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!advisor) return null;
  return { advisorId: advisor.id, userId: user.id };
}

// Lead erstellen — nur mit Vorname, ohne Email/User
export async function createLead(fairId, formData) {
  const advisor = await getAdvisorId();
  if (!advisor) return { error: 'Kein Berater-Profil gefunden. Bitte neu einloggen.' };

  const admin = createAdminClient();
  const name = formData.get('name');
  const target_position = formData.get('target_position')?.trim() || null;
  if (!name) return { error: 'Name ist ein Pflichtfeld' };

  // Fair-Lead erstellen (ohne email, ohne user_id)
  const { data: lead, error: leadError } = await admin.from('fair_leads').insert({
    fair_id: fairId,
    advisor_user_id: advisor.userId,
    first_name: name,
    last_name: '',
    target_position,
    status: 'new',
  }).select('id').single();

  if (leadError) return { error: `Fehler beim Speichern: ${leadError.message}` };

  // Funnel-Event loggen (Fehler ignorieren, nicht blockieren)
  await admin.from('analytics_events').insert({
    event_name: 'fair_registered',
    fair_id: fairId,
    advisor_id: advisor.advisorId,
    metadata: { lead_id: lead.id, source: 'messe' },
  }).then(() => {}).catch(() => {});

  redirect(`/advisor/fair/${fairId}/lead/${lead.id}/upload`);
}

// Kontaktdaten erfassen + User erstellen (nach dem CV-Check)
export async function saveContactDetails(leadId, formData) {
  const admin = createAdminClient();

  const email = formData.get('email')?.toLowerCase().trim();
  const phone = formData.get('phone') || null;

  if (!email) return { error: 'E-Mail ist ein Pflichtfeld' };

  // Lead laden
  const { data: lead } = await admin.from('fair_leads')
    .select('id, first_name, last_name, fair_id')
    .eq('id', leadId)
    .maybeSingle();

  if (!lead) return { error: 'Lead nicht gefunden' };

  const leadName = `${lead.first_name} ${lead.last_name || ''}`.trim();

  // Prüfe ob User existiert
  const { data: existingUsers } = await admin.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find(u => u.email === email);

  if (!existingUser) {
    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { name: leadName, source: 'fair' },
    });
    if (createError) return { error: `User-Erstellung fehlgeschlagen: ${createError.message}` };

    await admin.from('profiles').update({
      name: leadName,
      membership_type: 'basis',
    }).eq('id', newUser.user.id).then(() => {}).catch(() => {});
  }

  // Lead updaten mit Email + Phone
  await admin.from('fair_leads').update({
    email,
    phone,
    updated_at: new Date().toISOString(),
  }).eq('id', leadId);

  redirect(`/advisor/fair/${lead.fair_id}/lead/${leadId}/summary`);
}

// Feedback speichern (Auto-Save)
export async function saveFeedback(feedbackId, data) {
  const supabase = createClient();
  const { error } = await supabase.from('cv_feedback').update({
    overall_rating: data.overallRating || null,
    summary: data.summary || null,
    updated_at: new Date().toISOString(),
  }).eq('id', feedbackId);

  if (error) throw new Error(`Feedback-Speicherung fehlgeschlagen: ${error.message}`);
  return { success: true };
}

// Feedback-Item togglen (Preset)
export async function toggleFeedbackItem(feedbackId, preset, isActive) {
  const supabase = createClient();

  if (isActive) {
    // Hinzufügen
    await supabase.from('cv_feedback_items').insert({
      cv_feedback_id: feedbackId,
      category: preset.category,
      type: 'preset',
      content: preset.label,
      sort_order: preset.sort_order,
    });
  } else {
    // Entfernen
    await supabase.from('cv_feedback_items')
      .delete()
      .eq('cv_feedback_id', feedbackId)
      .eq('type', 'preset')
      .eq('content', preset.label);
  }
  return { success: true };
}

// Freitext-Feedback speichern
export async function saveFeedbackFreetext(feedbackId, category, content) {
  const supabase = createClient();

  // Prüfe ob es bereits einen Freitext-Eintrag gibt
  const { data: existing } = await supabase.from('cv_feedback_items')
    .select('id')
    .eq('cv_feedback_id', feedbackId)
    .eq('category', category)
    .eq('type', 'freetext')
    .maybeSingle();

  if (existing) {
    if (content.trim()) {
      await supabase.from('cv_feedback_items').update({ content }).eq('id', existing.id);
    } else {
      await supabase.from('cv_feedback_items').delete().eq('id', existing.id);
    }
  } else if (content.trim()) {
    await supabase.from('cv_feedback_items').insert({
      cv_feedback_id: feedbackId,
      category,
      type: 'freetext',
      content,
    });
  }
  return { success: true };
}

// Kategorie-Rating speichern
export async function saveCategoryRating(feedbackId, category, rating) {
  const supabase = createClient();

  // Suche nach vorhandenem Rating-Item für Kategorie
  const { data: existing } = await supabase.from('cv_feedback_items')
    .select('id')
    .eq('cv_feedback_id', feedbackId)
    .eq('category', category)
    .eq('type', 'preset')
    .eq('content', `__rating_${category}`)
    .maybeSingle();

  if (existing) {
    await supabase.from('cv_feedback_items').update({ rating }).eq('id', existing.id);
  } else {
    await supabase.from('cv_feedback_items').insert({
      cv_feedback_id: feedbackId,
      category,
      type: 'preset',
      content: `__rating_${category}`,
      rating,
    });
  }
  return { success: true };
}

// Gespräch abschließen + Magic Link senden
export async function completeFeedback(leadId) {
  const { advisorId } = await getAdvisorId();
  const admin = createAdminClient();
  const supabase = createClient();

  // Lead laden
  const { data: lead } = await admin.from('fair_leads')
    .select('*, fairs(name)')
    .eq('id', leadId)
    .maybeSingle();

  if (!lead) throw new Error('Lead nicht gefunden');

  // Feedback abschließen
  await supabase.from('cv_feedback')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('fair_lead_id', leadId);

  // Lead abschließen
  await admin.from('fair_leads').update({
    status: 'completed',
    completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('id', leadId);

  // Magic Link generieren
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.daskarriereinstitut.de';
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: lead.email,
    options: { redirectTo: `${appUrl}/cv-check` },
  });

  if (linkError) {
    console.error('Magic Link Fehler:', linkError);
    throw new Error('Magic Link konnte nicht generiert werden');
  }

  const magicLinkUrl = linkData?.properties?.action_link;

  // E-Mail senden
  const fairName = lead.fairs?.name || 'der Karrieremesse';
  const leadName = `${lead.first_name} ${lead.last_name || ''}`.trim();

  await sendEmail({
    to: lead.email,
    subject: 'Dein Lebenslauf-Check – Ergebnisse ansehen',
    html: buildCvCheckEmail(leadName, fairName, 'Dein Karriere-Coach', magicLinkUrl),
  });

  // Funnel-Events loggen (Fehler ignorieren)
  await admin.from('analytics_events').insert([
    { event_name: 'feedback_completed', fair_id: lead.fair_id, metadata: { lead_id: leadId } },
    { event_name: 'magic_link_sent', fair_id: lead.fair_id, metadata: { lead_id: leadId } },
  ]).then(() => {}).catch(() => {});

  redirect(`/advisor/fair/${lead.fair_id}/lead/${leadId}/done`);
}

function buildCvCheckEmail(name, fairName, advisorName, magicLinkUrl) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.daskarriereinstitut.de';
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f5f5f7;color:#1d1d1f">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px">
    <div style="text-align:center;margin-bottom:32px">
      <span style="font-size:11px;font-weight:700;letter-spacing:2px;color:#CC1426;text-transform:uppercase">KARRIERE-INSTITUT</span>
    </div>
    <div style="background:white;border-radius:16px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
      <h2 style="font-size:22px;font-weight:700;margin:0 0 12px">Dein Lebenslauf-Check</h2>
      <p style="color:#86868b;line-height:1.6">Hallo ${name},</p>
      <p style="color:#86868b;line-height:1.6">Danke für deinen Besuch bei uns auf der <strong>${fairName}</strong>! ${advisorName} hat deinen Lebenslauf analysiert und dir konkretes Feedback zusammengestellt.</p>
      <p style="color:#86868b;line-height:1.6">Klicke hier, um deine persönlichen Ergebnisse zu sehen:</p>
      <div style="text-align:center;margin:24px 0">
        <a href="${magicLinkUrl}" style="display:inline-block;padding:14px 32px;background:#CC1426;color:white;border-radius:980px;text-decoration:none;font-weight:600;font-size:15px">Ergebnisse ansehen</a>
      </div>
      <p style="color:#86868b;line-height:1.6;font-size:14px"><strong>Tipp:</strong> Nutze das Feedback direkt, um deinen Lebenslauf zu verbessern. Und wenn du tiefer gehen willst – starte deine kostenlose Karriereanalyse.</p>
    </div>
    <div style="text-align:center;margin-top:24px;font-size:12px;color:#86868b">
      <p>&copy; 2026 - Das Karriere-Institut | +49 511 5468 4547</p>
      <p>info@daskarriereinstitut.de</p>
      <p style="margin-top:12px"><a href="${appUrl}/datenschutz" style="color:#86868b;text-decoration:underline">Datenschutz</a> &middot; <a href="${appUrl}/impressum" style="color:#86868b;text-decoration:underline">Impressum</a></p>
    </div>
  </div>
</body>
</html>`;
}

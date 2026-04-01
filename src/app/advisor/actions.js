'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email';
import { redirect } from 'next/navigation';

// Hole advisor-ID des eingeloggten Users
async function getAdvisorId() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht eingeloggt');

  const { data: advisor } = await supabase
    .from('advisors')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!advisor) throw new Error('Kein Berater-Profil');
  return { advisorId: advisor.id, userId: user.id };
}

// Lead erstellen + User anlegen falls nötig
export async function createLead(fairId, formData) {
  const { advisorId } = await getAdvisorId();
  const admin = createAdminClient();

  const name = formData.get('name');
  const email = formData.get('email')?.toLowerCase().trim();
  const phone = formData.get('phone') || null;

  if (!name || !email) throw new Error('Name und E-Mail sind Pflichtfelder');

  // Prüfe ob User existiert
  const { data: existingUsers } = await admin.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find(u => u.email === email);

  let userId;

  if (existingUser) {
    userId = existingUser.id;
  } else {
    // Neuen User erstellen (ohne E-Mail-Bestätigung)
    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
      email,
      email_confirm: true, // Setze bestätigt, damit Magic Link funktioniert
      user_metadata: { name, source: 'fair' },
    });
    if (createError) throw new Error(`User-Erstellung fehlgeschlagen: ${createError.message}`);
    userId = newUser.user.id;

    // Profile-Eintrag wird automatisch durch trigger erstellt,
    // aber wir aktualisieren membership_type
    await admin.from('profiles').update({
      name,
      membership_type: 'basis',
    }).eq('id', userId);
  }

  // Fair-Lead erstellen
  const { data: lead, error: leadError } = await admin.from('fair_leads').insert({
    fair_id: fairId,
    advisor_id: advisorId,
    user_id: userId,
    name,
    email,
    phone,
    status: 'registered',
  }).select('id').single();

  if (leadError) throw new Error(`Lead-Erstellung fehlgeschlagen: ${leadError.message}`);

  // Funnel-Event loggen
  await admin.from('analytics_events').insert({
    user_id: userId,
    event_name: 'fair_registered',
    fair_id: fairId,
    advisor_id: advisorId,
    metadata: { lead_id: lead.id, source: 'messe' },
  });

  redirect(`/advisor/fair/${fairId}/lead/${lead.id}/upload`);
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
    .select('*, fairs(name), advisors(display_name)')
    .eq('id', leadId)
    .single();

  if (!lead) throw new Error('Lead nicht gefunden');

  // Feedback abschließen
  await supabase.from('cv_feedback')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('fair_lead_id', leadId);

  // Lead abschließen
  await admin.from('fair_leads').update({
    status: 'completed',
    conversation_ended_at: new Date().toISOString(),
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
  const advisorName = lead.advisors?.display_name || 'Dein Karriere-Coach';

  await sendEmail({
    to: lead.email,
    subject: 'Dein Lebenslauf-Check – Ergebnisse ansehen',
    html: buildCvCheckEmail(lead.name, fairName, advisorName, magicLinkUrl),
  });

  // Funnel-Events loggen
  await admin.from('analytics_events').insert([
    {
      user_id: lead.user_id,
      event_name: 'feedback_completed',
      fair_id: lead.fair_id,
      advisor_id: advisorId,
      metadata: { lead_id: leadId },
    },
    {
      user_id: lead.user_id,
      event_name: 'magic_link_sent',
      fair_id: lead.fair_id,
      advisor_id: advisorId,
      metadata: { lead_id: leadId },
    },
  ]);

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

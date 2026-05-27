// =====================================================
// Demo-Account-Verwaltung
// =====================================================
// Demo läuft auf dem Admin-Account l.jacob@myvi.de — wir legen ihm einen
// Advisor-Eintrag mit Slug 'demo' an und seeden fiktive Leads + Self-Service-Checks
// auf seine advisor_id. Sein User-Account wird NICHT verändert (Passwort, Rolle bleiben).
//
// Funktionen:
//   - ensureDemoAdvisor(): findet den User in auth.users, stellt sicher dass er
//     einen advisor-Eintrag hat (idempotent). Kein createUser, kein Passwort-Update.
//   - seedDemoData(): erstellt 5 fiktive Leads + 3 Self-Service-Checks + Affiliate-Stats.
//   - wipeDemoData(): löscht ausschließlich die Demo-Daten (per Email-Match auf
//     die fiktiven Personen-Emails). Echte Leads bleiben unangetastet.
//   - resetDemo(): wipe + seed.
//
// Server-only — niemals client-seitig importieren.

import { createAdminClient } from '@/lib/supabase/admin';

export const DEMO_EMAIL = 'l.jacob@myvi.de';
export const DEMO_DISPLAY_NAME = 'Louis Jacob (Demo)';
export const DEMO_SLUG = 'demo';
export const DEMO_PHONE = '+49 511 5468 4547';

// Email-Adressen aller fiktiven Demo-Personen — werden für sicheren wipe verwendet.
// Nur Datensätze mit diesen Emails werden bei resetDemo() gelöscht.
const DEMO_LEAD_EMAILS = [
  'anna.mueller@beispiel.de',
  'marcus.berger@beispiel.de',
  'sarah.vogt@beispiel.de',
  'tobias.klein@beispiel.de',
  'christina.walter@beispiel.de',
];

const DEMO_SELF_SERVICE_EMAILS = [
  'julian.hoffmann@beispiel.de',
  'lena.krause@beispiel.de',
  'robin.schmidt@beispiel.de',
];

export function isDemoEmail(email) {
  return (email || '').toLowerCase() === DEMO_EMAIL;
}

// -----------------------------------------------------
// ensureDemoAdvisor — idempotent: findet den User, stellt advisor-Eintrag sicher
// User-Account (Passwort, Rolle) wird NICHT verändert.
// Returns: { userId, advisorId }
// -----------------------------------------------------
export async function ensureDemoAdvisor() {
  const admin = createAdminClient();

  // 1) User in auth.users finden — wenn nicht da, ist das ein Setup-Fehler
  const { data: existingUsers } = await admin.auth.admin.listUsers({ perPage: 500 });
  const user = (existingUsers?.users || []).find(u => u.email?.toLowerCase() === DEMO_EMAIL);
  if (!user) {
    throw new Error(`Admin-Account ${DEMO_EMAIL} existiert nicht in Supabase. Bitte erst manuell anlegen.`);
  }
  const userId = user.id;

  // 2) Profile-Eintrag sicherstellen (ohne role oder Namen zu überschreiben)
  const { data: existingProfile } = await admin
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (!existingProfile) {
    await admin.from('profiles').insert({
      id: userId,
      email: DEMO_EMAIL,
      name: 'Louis Jacob',
      role: 'admin',
      onboarding_complete: true,
    });
  }

  // 3) Advisor-Eintrag (Upsert per user_id) — slug='demo' für Affiliate-Route
  const { data: existingAdvisor } = await admin
    .from('advisors')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  let advisorId;
  if (existingAdvisor) {
    advisorId = existingAdvisor.id;
    await admin.from('advisors').update({
      display_name: DEMO_DISPLAY_NAME,
      email: DEMO_EMAIL,
      phone: DEMO_PHONE,
      status: 'active',
      slug: DEMO_SLUG,
    }).eq('id', advisorId);
  } else {
    const { data: newAdvisor, error: advErr } = await admin
      .from('advisors')
      .insert({
        user_id: userId,
        display_name: DEMO_DISPLAY_NAME,
        email: DEMO_EMAIL,
        phone: DEMO_PHONE,
        status: 'active',
        slug: DEMO_SLUG,
      })
      .select('id')
      .single();
    if (advErr) throw new Error(`Advisor-Insert fehlgeschlagen: ${advErr.message}`);
    advisorId = newAdvisor.id;
  }

  return { userId, advisorId };
}

// -----------------------------------------------------
// Demo-Daten-Vorlage — fiktive Leads in verschiedenen Stadien
// -----------------------------------------------------
const DEMO_LEADS = [
  {
    first_name: 'Anna', last_name: 'Müller',
    email: 'anna.mueller@beispiel.de', phone: '+49 170 1234567',
    target_position: 'Senior Brand Manager',
    status: 'converted',
    source: 'affiliate',
    days_ago: 12,
    cv_summary: 'Erfahrene Markenmanagerin mit 7 Jahren Konsumgüter-Erfahrung. Starke analytische Fähigkeiten, klarer Aufstiegsweg. Empfehlung: Senior-Position mit Budgetverantwortung — Marktwert-Potenzial €78–92k.',
    cv_rating: 5,
  },
  {
    first_name: 'Marcus', last_name: 'Berger',
    email: 'marcus.berger@beispiel.de', phone: '+49 171 2345678',
    target_position: 'Geschäftsführer Vertrieb Mittelstand',
    status: 'feedback_given',
    source: 'affiliate',
    days_ago: 5,
    cv_summary: 'Vertriebsleiter mit 12 Jahren Mittelstands-Expertise (Maschinenbau). Führungsstärke nachgewiesen, P&L-Verantwortung €18 Mio. Empfehlung: GF-Position oder Bereichsleiter Großkonzern — Marktwert €130–160k.',
    cv_rating: 4,
  },
  {
    first_name: 'Sarah', last_name: 'Vogt',
    email: 'sarah.vogt@beispiel.de', phone: '+49 172 3456789',
    target_position: 'Tech Lead / Engineering Manager',
    status: 'cv_uploaded',
    source: 'direct',
    days_ago: 1,
    cv_summary: null,
    cv_rating: null,
  },
  {
    first_name: 'Tobias', last_name: 'Klein',
    email: 'tobias.klein@beispiel.de', phone: '+49 173 4567890',
    target_position: 'Operations Manager Logistik',
    status: 'new',
    source: 'direct',
    days_ago: 0,
    cv_summary: null,
    cv_rating: null,
  },
  {
    first_name: 'Christina', last_name: 'Walter',
    email: 'christina.walter@beispiel.de', phone: '+49 174 5678901',
    target_position: 'HR Business Partner Konzern',
    status: 'completed',
    source: 'affiliate',
    days_ago: 18,
    cv_summary: 'Personalreferentin mit 6 Jahren Generalist-Erfahrung im Mittelstand. Möchte in HRBP-Rolle wechseln. CV solide, Skills passend — Coaching empfohlen zur Stärkung des Profils für Konzern-Bewerbungen.',
    cv_rating: 4,
  },
];

// -----------------------------------------------------
// seedDemoData — befüllt Demo-Account mit realistischen Daten
// -----------------------------------------------------
export async function seedDemoData() {
  const admin = createAdminClient();
  const { userId, advisorId } = await ensureDemoAdvisor();

  // Erst aufräumen (nur Demo-Daten), damit Re-Seed sauber ist
  await wipeDemoData();

  const now = Date.now();

  // 1) Leads anlegen
  const leadInserts = DEMO_LEADS.map(lead => ({
    fair_id: null,
    advisor_id: advisorId,
    advisor_user_id: userId,
    first_name: lead.first_name,
    last_name: lead.last_name,
    email: lead.email,
    phone: lead.phone,
    target_position: lead.target_position,
    status: lead.status,
    source: lead.source,
    created_at: new Date(now - lead.days_ago * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(now - lead.days_ago * 24 * 60 * 60 * 1000).toISOString(),
  }));

  const { data: insertedLeads, error: leadErr } = await admin
    .from('fair_leads')
    .insert(leadInserts)
    .select('id, first_name');
  if (leadErr) throw new Error(`Lead-Seed fehlgeschlagen: ${leadErr.message}`);

  // 2) CV-Dokumente + AI-Auswertung für Leads mit cv_summary
  for (let i = 0; i < DEMO_LEADS.length; i++) {
    const tpl = DEMO_LEADS[i];
    const lead = insertedLeads[i];
    if (!tpl.cv_summary) continue;

    const { data: doc, error: docErr } = await admin
      .from('cv_documents')
      .insert({
        fair_lead_id: lead.id,
        file_path: `demo/${lead.id}/${tpl.first_name.toLowerCase()}-cv.pdf`,
        file_name: `${tpl.first_name}_${tpl.last_name}_CV.pdf`,
        file_type: 'pdf',
        file_size_bytes: 245000,
        version: 1,
        is_current: true,
        extraction_status: 'success',
        extracted_text: `[Demo-CV: ${tpl.first_name} ${tpl.last_name}, ${tpl.target_position}]`,
      })
      .select('id')
      .single();
    if (docErr) {
      console.error('CV-Doc-Insert error:', docErr.message);
      continue;
    }

    await admin.from('cv_feedback').insert({
      cv_document_id: doc.id,
      fair_lead_id: lead.id,
      advisor_id: advisorId,
      overall_rating: tpl.cv_rating,
      summary: tpl.cv_summary,
      status: 'completed',
      ai_parsed_at: new Date(now - tpl.days_ago * 24 * 60 * 60 * 1000).toISOString(),
      ai_analysis: {
        overall_score: tpl.cv_rating * 20,
        strengths: ['Klare Karriereentwicklung', 'Quantifizierte Erfolge', 'Branchen-Expertise'],
        improvements: ['Soft Skills stärker herausarbeiten', 'Zertifikate ergänzen'],
        market_value_eur: tpl.cv_rating >= 5 ? '78.000 – 92.000 €' : '65.000 – 85.000 €',
      },
    });
  }

  // 3) Self-Service-Checks (Kunden haben sich selbst ausgewertet)
  const selfChecks = [
    { name: 'Julian Hoffmann', email: 'julian.hoffmann@beispiel.de', target_position: 'Junior Controller', overall_rating: 4, days_ago: 3 },
    { name: 'Lena Krause',     email: 'lena.krause@beispiel.de',     target_position: 'UX Designer',      overall_rating: 5, days_ago: 7 },
    { name: 'Robin Schmidt',   email: 'robin.schmidt@beispiel.de',   target_position: 'Sales Manager',    overall_rating: 3, days_ago: 14 },
  ];
  try {
    await admin.from('self_service_checks').insert(
      selfChecks.map(sc => ({
        fair_id: null,
        name: sc.name,
        email: sc.email,
        target_position: sc.target_position,
        overall_rating: sc.overall_rating,
        summary: `Auswertung für ${sc.name}: solider CV mit klarem Profil für ${sc.target_position}.`,
        status: 'completed',
        ai_analysis: {
          overall_score: sc.overall_rating * 20,
          strengths: ['Klare Struktur', 'Relevante Erfahrung'],
          improvements: ['Mehr quantifizierte Erfolge', 'Skill-Sektion ausbauen'],
        },
        created_at: new Date(now - sc.days_ago * 24 * 60 * 60 * 1000).toISOString(),
      }))
    );
  } catch (err) {
    console.warn('Self-Service-Seed übersprungen:', err?.message);
  }

  // 4) Affiliate-Counter (defensiv — Spalten existieren u.U. nicht)
  try {
    await admin.from('advisors').update({
      affiliate_signups: 12,
      affiliate_clicks: 47,
    }).eq('id', advisorId);
  } catch (err) {
    console.warn('Affiliate-Counter-Update übersprungen:', err?.message);
  }

  // 5) Analytics-Events (47 fiktive Klicks über 30 Tage)
  const clickEvents = [];
  for (let i = 0; i < 47; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    clickEvents.push({
      event_name: 'affiliate_click',
      advisor_id: advisorId,
      metadata: { source: 'demo_seed', slug: DEMO_SLUG },
      created_at: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  await admin.from('analytics_events').insert(clickEvents);

  return {
    ok: true,
    leadsCreated: insertedLeads.length,
    cvsAnalyzed: DEMO_LEADS.filter(l => l.cv_summary).length,
    selfChecks: selfChecks.length,
    clicksTracked: 47,
  };
}

// -----------------------------------------------------
// wipeDemoData — löscht NUR die Demo-Daten (per Email-Match)
// Echte Leads/CVs des Beraters bleiben unangetastet.
// -----------------------------------------------------
export async function wipeDemoData() {
  const admin = createAdminClient();
  const { data: advisor } = await admin
    .from('advisors')
    .select('id, user_id')
    .eq('email', DEMO_EMAIL)
    .maybeSingle();

  if (!advisor) return { ok: true, note: 'Demo-Advisor existiert nicht — nichts zu löschen' };

  // Nur Demo-Leads per Email-Match löschen (cascaded löscht cv_documents + cv_feedback)
  await admin
    .from('fair_leads')
    .delete()
    .eq('advisor_id', advisor.id)
    .in('email', DEMO_LEAD_EMAILS);

  // Analytics-Events des Demo-Seeds löschen (markiert durch metadata.source='demo_seed')
  try {
    // Supabase erlaubt JSONB-Match via .contains
    await admin
      .from('analytics_events')
      .delete()
      .eq('advisor_id', advisor.id)
      .contains('metadata', { source: 'demo_seed' });
  } catch (err) {
    console.warn('Analytics-Wipe übersprungen:', err?.message);
  }

  // Self-Service-Demo-Checks löschen (per Email)
  try {
    await admin.from('self_service_checks').delete().in('email', DEMO_SELF_SERVICE_EMAILS);
  } catch (err) {
    console.warn('Self-Service-Wipe übersprungen:', err?.message);
  }

  // Affiliate-Counter zurücksetzen (defensiv)
  try {
    await admin.from('advisors').update({
      affiliate_signups: 0,
      affiliate_clicks: 0,
    }).eq('id', advisor.id);
  } catch (err) {
    console.warn('Affiliate-Counter-Reset übersprungen:', err?.message);
  }

  return { ok: true };
}

// -----------------------------------------------------
// resetDemo — wipe + seed (für den Bühnen-Knopf)
// -----------------------------------------------------
export async function resetDemo() {
  await wipeDemoData();
  return await seedDemoData();
}

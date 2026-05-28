// =====================================================
// Demo-Account-Verwaltung
// =====================================================
// Separater Demo-Berater-Account: demo@daskarriereinstitut.de
// Auto-Login via /demo Route — Passwort liegt in Vercel Env-Var DEMO_PASSWORD,
// niemals im Code.
//
// Funktionen:
//   - ensureDemoAdvisor(): legt Auth-User + Profile + Advisor an (idempotent).
//     Setzt das Account-Passwort beim jedem Aufruf auf den aktuellen ENV-Wert,
//     damit Passwort-Rotation per Env-Var-Update funktioniert.
//   - seedDemoData(): 5 fiktive Leads + 3 Self-Service + Affiliate-Stats.
//   - wipeDemoData(): löscht alle Daten des Demo-Accounts (sicher, weil
//     separater Account — keine echten Leads betroffen).
//   - resetDemo(): wipe + seed.
//
// Server-only — niemals client-seitig importieren.

import { createAdminClient } from '@/lib/supabase/admin';

export const DEMO_EMAIL = 'demo@daskarriereinstitut.de';
// WICHTIG: Passwort kommt aus Vercel Environment Variable DEMO_PASSWORD.
// Fallback nur für lokale Entwicklung; in Production MUSS die Env-Var gesetzt sein.
export const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'local-dev-only-change-in-prod';
export const DEMO_DISPLAY_NAME = 'Demo Berater';
export const DEMO_SLUG = 'demo';
export const DEMO_PHONE = '+49 511 5468 4547';

if (!process.env.DEMO_PASSWORD && process.env.NODE_ENV === 'production') {
  console.warn('[demo.js] WARN: DEMO_PASSWORD env-var nicht gesetzt — Demo-Login wird scheitern.');
}

export function isDemoEmail(email) {
  return (email || '').toLowerCase() === DEMO_EMAIL;
}

// -----------------------------------------------------
// ensureDemoAdvisor — idempotent: User + Profile + Advisor anlegen
// Returns: { userId, advisorId, created }
// -----------------------------------------------------
export async function ensureDemoAdvisor() {
  const admin = createAdminClient();

  // 1) Auth-User suchen oder anlegen
  let userId;
  let created = false;
  const { data: existingUsers } = await admin.auth.admin.listUsers({ perPage: 500 });
  const existing = (existingUsers?.users || []).find(u => u.email?.toLowerCase() === DEMO_EMAIL);

  if (existing) {
    userId = existing.id;
    // Passwort auf aktuellen ENV-Wert setzen (für Rotation)
    await admin.auth.admin.updateUserById(userId, {
      password: DEMO_PASSWORD,
      email_confirm: true,
    });
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: {
        first_name: 'Demo',
        last_name: 'Berater',
        company: 'Karriere-Institut',
        position: 'Senior Karriere-Berater',
      },
    });
    if (error) throw new Error(`Auth-User anlegen fehlgeschlagen: ${error.message}`);
    userId = data.user.id;
    created = true;
  }

  // 2) Profile-Eintrag (Upsert)
  await admin.from('profiles').upsert({
    id: userId,
    email: DEMO_EMAIL,
    first_name: 'Demo',
    last_name: 'Berater',
    name: DEMO_DISPLAY_NAME,
    avatar_initials: 'DB',
    role: 'advisor',
    phase: 'pre_coaching',
    onboarding_complete: true,
  }, { onConflict: 'id' });

  // 3) Advisor-Eintrag (Upsert per user_id)
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

  return { userId, advisorId, created };
}

// -----------------------------------------------------
// Demo-Daten-Vorlage
// -----------------------------------------------------
const DEMO_LEADS = [
  {
    first_name: 'Anna', last_name: 'Müller',
    email: 'anna.mueller@beispiel.de', phone: '+49 170 1234567',
    target_position: 'Senior Brand Manager',
    status: 'converted', source: 'affiliate', days_ago: 12,
    cv_summary: 'Erfahrene Markenmanagerin mit 7 Jahren Konsumgüter-Erfahrung. Starke analytische Fähigkeiten, klarer Aufstiegsweg. Empfehlung: Senior-Position mit Budgetverantwortung — Marktwert-Potenzial €78–92k.',
    cv_rating: 5,
  },
  {
    first_name: 'Marcus', last_name: 'Berger',
    email: 'marcus.berger@beispiel.de', phone: '+49 171 2345678',
    target_position: 'Geschäftsführer Vertrieb Mittelstand',
    status: 'feedback_given', source: 'affiliate', days_ago: 5,
    cv_summary: 'Vertriebsleiter mit 12 Jahren Mittelstands-Expertise (Maschinenbau). Führungsstärke nachgewiesen, P&L-Verantwortung €18 Mio. Empfehlung: GF-Position oder Bereichsleiter Großkonzern — Marktwert €130–160k.',
    cv_rating: 4,
  },
  {
    first_name: 'Sarah', last_name: 'Vogt',
    email: 'sarah.vogt@beispiel.de', phone: '+49 172 3456789',
    target_position: 'Tech Lead / Engineering Manager',
    status: 'cv_uploaded', source: 'direct', days_ago: 1,
    cv_summary: null, cv_rating: null,
  },
  {
    first_name: 'Tobias', last_name: 'Klein',
    email: 'tobias.klein@beispiel.de', phone: '+49 173 4567890',
    target_position: 'Operations Manager Logistik',
    status: 'new', source: 'direct', days_ago: 0,
    cv_summary: null, cv_rating: null,
  },
  {
    first_name: 'Christina', last_name: 'Walter',
    email: 'christina.walter@beispiel.de', phone: '+49 174 5678901',
    target_position: 'HR Business Partner Konzern',
    status: 'completed', source: 'affiliate', days_ago: 18,
    cv_summary: 'Personalreferentin mit 6 Jahren Generalist-Erfahrung im Mittelstand. Möchte in HRBP-Rolle wechseln. CV solide, Skills passend — Coaching empfohlen zur Stärkung des Profils für Konzern-Bewerbungen.',
    cv_rating: 4,
  },
];

const DEMO_SELF_SERVICE_EMAILS = [
  'julian.hoffmann@beispiel.de',
  'lena.krause@beispiel.de',
  'robin.schmidt@beispiel.de',
];

// -----------------------------------------------------
// seedDemoData
// -----------------------------------------------------
export async function seedDemoData() {
  const admin = createAdminClient();
  const { userId, advisorId } = await ensureDemoAdvisor();

  // Erst aufräumen, damit Re-Seed sauber ist
  await wipeDemoData();

  const now = Date.now();

  // 1) Leads
  // Hinweis: fair_leads hat in der Live-DB nur advisor_user_id (kein advisor_id-FK)
  const leadInserts = DEMO_LEADS.map(lead => ({
    fair_id: null,
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

  // 2) CV-Docs + Feedback
  for (let i = 0; i < DEMO_LEADS.length; i++) {
    const tpl = DEMO_LEADS[i];
    const lead = insertedLeads[i];
    if (!tpl.cv_summary) continue;

    // Live-DB: cv_documents hat lead_id (nicht fair_lead_id), storage_path (nicht file_path), kein version
    const { data: doc, error: docErr } = await admin
      .from('cv_documents')
      .insert({
        lead_id: lead.id,
        user_id: userId,
        storage_path: `demo/${lead.id}/${tpl.first_name.toLowerCase()}-cv.pdf`,
        file_name: `${tpl.first_name}_${tpl.last_name}_CV.pdf`,
        file_type: 'pdf',
        file_size_bytes: 245000,
        is_current: true,
        extraction_status: 'success',
        extracted_text: `[Demo-CV: ${tpl.first_name} ${tpl.last_name}, ${tpl.target_position}]`,
      })
      .select('id')
      .single();
    if (docErr) { console.error('CV-Doc-Insert error:', docErr.message); continue; }

    await admin.from('cv_feedback').insert({
      cv_document_id: doc.id,
      fair_lead_id: lead.id,
      advisor_id: advisorId,   // cv_feedback hat advisor_id (anders als fair_leads!)
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

  // 3) Self-Service-Checks
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

  // 4) Affiliate-Counter (defensiv)
  try {
    await admin.from('advisors').update({
      affiliate_signups: 12,
      affiliate_clicks: 47,
    }).eq('id', advisorId);
  } catch (err) {
    console.warn('Affiliate-Counter-Update übersprungen:', err?.message);
  }

  // 5) Analytics-Events
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
// wipeDemoData — separater Account, alles weg
// -----------------------------------------------------
export async function wipeDemoData() {
  const admin = createAdminClient();
  const { data: advisor } = await admin
    .from('advisors')
    .select('id, user_id')
    .eq('email', DEMO_EMAIL)
    .maybeSingle();

  if (!advisor) return { ok: true, note: 'Demo-Advisor existiert nicht — nichts zu löschen' };

  // fair_leads hat advisor_user_id (kein advisor_id-FK in der Live-DB)
  await admin.from('fair_leads').delete().eq('advisor_user_id', advisor.user_id);

  // cv_feedback hat advisor_id (echter advisors.id-FK) — separat löschen
  // (cascaded normalerweise via fair_leads, aber sicherheitshalber explizit)
  try {
    await admin.from('cv_feedback').delete().eq('advisor_id', advisor.id);
  } catch (err) {
    console.warn('cv_feedback-Wipe übersprungen:', err?.message);
  }

  await admin.from('analytics_events').delete().eq('advisor_id', advisor.id);
  try {
    await admin.from('self_service_checks').delete().in('email', DEMO_SELF_SERVICE_EMAILS);
  } catch (err) {
    console.warn('Self-Service-Wipe übersprungen:', err?.message);
  }
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
// resetDemo — wipe + seed
// -----------------------------------------------------
export async function resetDemo() {
  await wipeDemoData();
  return await seedDemoData();
}

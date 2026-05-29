/**
 * Bulk-Invite: 7 Berater anlegen + Jobmesse Berlin zuordnen
 *
 * Ausführen:
 *   SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_KEY=eyJ... node scripts/bulk-invite-advisors.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL        = process.env.SUPABASE_URL        || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const APP_URL             = process.env.NEXT_PUBLIC_APP_URL  || 'https://app.daskarriereinstitut.de';
const BREVO_API_KEY       = process.env.BREVO_API_KEY;
const FAIR_NAME           = 'Jobmesse Berlin';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌  Fehlende Umgebungsvariablen: SUPABASE_URL und SUPABASE_SERVICE_KEY setzen');
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ADVISORS = [
  { name: 'Katharina Gillich', email: 'k.gillich@mitnorm.com',    role: 'messeleiter' },
  { name: 'Mario Schulze',     email: 'm.schulze@mitnorm.com',    role: 'messeleiter' },
  { name: 'Martin Kaplar',     email: 'm.kaplar@mitnorm.com',     role: 'advisor' },
  { name: 'Felix Hoeneck',     email: 'f.hoeneck@mitnorm.com',    role: 'advisor' },
  { name: 'René Schneemann',   email: 'r.schneemann@mitnorm.com', role: 'advisor' },
  { name: 'Jeremy Oehler',     email: 'j.oehler@mitnorm.com',     role: 'advisor' },
  { name: 'Johannes Thiele',   email: 'j.thiele@mitnorm.com',     role: 'advisor' },
];

function generateTempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let pw = 'KI-';
  for (let i = 0; i < 10; i++) pw += chars[Math.floor(Math.random() * chars.length)];
  return pw;
}

function buildInviteEmail(name, email, tempPassword) {
  const firstName = name.split(' ')[0];
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f5f5f7;color:#1d1d1f">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px">
    <div style="text-align:center;margin-bottom:32px">
      <span style="font-size:11px;font-weight:700;letter-spacing:2px;color:#CC1426;text-transform:uppercase">KARRIERE-INSTITUT</span>
    </div>
    <div style="background:white;border-radius:16px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
      <h2 style="font-size:22px;font-weight:700;margin:0 0 16px">Dein Zugang zum Berater-Portal</h2>
      <p style="color:#86868b;line-height:1.6;margin:0 0 20px">Hallo ${firstName},<br><br>
      hier sind deine Zugangsdaten für die <strong>Jobmesse Berlin</strong>:</p>
      <div style="background:#F5F5F7;border-radius:12px;padding:20px 24px;margin-bottom:24px">
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">E-Mail</div>
          <div style="font-size:15px;font-weight:600;color:#1d1d1f;font-family:monospace">${email}</div>
        </div>
        <div>
          <div style="font-size:11px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Temporäres Passwort</div>
          <div style="font-size:18px;font-weight:700;color:#CC1426;font-family:monospace;letter-spacing:2px">${tempPassword}</div>
        </div>
      </div>
      <div style="text-align:center;margin:24px 0">
        <a href="${APP_URL}/advisor/login" style="display:inline-block;padding:14px 36px;background:#CC1426;color:white;border-radius:980px;text-decoration:none;font-weight:600;font-size:15px">Jetzt einloggen →</a>
      </div>
      <p style="color:#86868b;line-height:1.6;font-size:13px;margin:0;background:#FFF9E6;border-radius:8px;padding:12px 14px;border-left:3px solid #F59E0B">
        <strong style="color:#92400E">Wichtig:</strong> Nach dem ersten Login bitte eigenes Passwort setzen.
      </p>
    </div>
    <div style="text-align:center;margin-top:24px;font-size:12px;color:#86868b">
      <p>© 2026 - Das Karriere-Institut | info@daskarriereinstitut.de</p>
    </div>
  </div>
</body>
</html>`;
}

async function sendEmail(to, subject, html) {
  if (!BREVO_API_KEY) {
    console.log(`   📧  [Mock] E-Mail an ${to} — kein BREVO_API_KEY gesetzt`);
    return;
  }
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Karriere-Institut', email: 'noreply@daskarriereinstitut.de' },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo Fehler: ${err}`);
  }
}

async function main() {
  console.log(`\n🔍  Suche Messe: "${FAIR_NAME}"…`);

  const { data: fair, error: fairErr } = await admin
    .from('fairs')
    .select('id, name')
    .ilike('name', `%${FAIR_NAME}%`)
    .maybeSingle();

  if (fairErr || !fair) {
    // Alle Messen anzeigen zur Auswahl
    const { data: allFairs } = await admin.from('fairs').select('id, name, start_date').order('start_date', { ascending: false });
    console.error(`❌  Messe "${FAIR_NAME}" nicht gefunden.`);
    console.log('\nVorhandene Messen:');
    allFairs?.forEach(f => console.log(`   ${f.id}  ${f.name}  (${f.start_date || '–'})`));
    console.log('\nFAIR_NAME in diesem Skript anpassen und erneut ausführen.');
    process.exit(1);
  }

  console.log(`✓  Messe gefunden: ${fair.name} (${fair.id})\n`);

  const results = [];

  for (const adv of ADVISORS) {
    process.stdout.write(`👤  ${adv.name} (${adv.email}) … `);
    const tempPassword = generateTempPassword();

    try {
      // 1. Auth-User anlegen oder vorhandenen finden
      let userId;
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: adv.email,
        email_confirm: true,
        password: tempPassword,
        user_metadata: { name: adv.name, needs_password_setup: true },
      });

      if (createErr) {
        if (createErr.message.includes('already been registered')) {
          // Vorhandenen User finden
          const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 1000 });
          const existing = users.find(u => u.email === adv.email);
          if (!existing) throw new Error('User nicht auffindbar');
          userId = existing.id;
          // Passwort aktualisieren
          await admin.auth.admin.updateUserById(userId, {
            password: tempPassword,
            user_metadata: { needs_password_setup: true },
          });
          process.stdout.write('[bereits vorhanden, Passwort aktualisiert] ');
        } else {
          throw createErr;
        }
      } else {
        userId = created.user.id;
      }

      // 2. Profil + Advisor
      await admin.from('profiles').upsert({ id: userId, email: adv.email, name: adv.name, role: adv.role });
      await admin.from('advisors').upsert({ user_id: userId, display_name: adv.name, email: adv.email });

      // 3. Messe zuordnen
      await admin.from('fair_advisors').upsert({
        fair_id: fair.id,
        advisor_user_id: userId,
        is_manager: adv.role === 'messeleiter',
      });

      // 4. Einladungs-E-Mail
      await sendEmail(adv.email, 'Dein Zugang zum Karriere-Institut Portal – Jobmesse Berlin', buildInviteEmail(adv.name, adv.email, tempPassword));

      results.push({ name: adv.name, email: adv.email, role: adv.role, tempPassword, status: '✓' });
      console.log('✓');
    } catch (err) {
      results.push({ name: adv.name, email: adv.email, role: adv.role, status: `❌ ${err.message}` });
      console.log(`❌  ${err.message}`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  ERGEBNIS');
  console.log('═══════════════════════════════════════════════════════');
  for (const r of results) {
    const roleLabel = r.role === 'messeleiter' ? 'Messeleiter' : 'Berater  ';
    console.log(`${r.status}  ${roleLabel}  ${r.name.padEnd(22)}  ${r.email}`);
    if (r.tempPassword) console.log(`          Temp-Passwort: ${r.tempPassword}`);
  }
  console.log('═══════════════════════════════════════════════════════\n');

  const ok    = results.filter(r => r.status === '✓').length;
  const fail  = results.filter(r => r.status !== '✓').length;
  console.log(`✓ ${ok} Berater angelegt   ${fail > 0 ? `❌ ${fail} Fehler` : ''}`);
  console.log(`✓ Alle der Messe "${fair.name}" zugeordnet\n`);
}

main().catch(err => { console.error(err); process.exit(1); });

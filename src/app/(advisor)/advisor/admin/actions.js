'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { sendEmail } from '@/lib/email';

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const admin = createAdminClient();
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (!['admin', 'messeleiter'].includes(profile?.role)) redirect('/advisor');
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
  const role = formData.get('role') || 'advisor';
  const returnFair = formData.get('returnFair');

  if (!email || !name) return { error: 'Name und E-Mail sind erforderlich.' };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.daskarriereinstitut.de';

  // User anlegen — falls bereits vorhanden, bestehenden User verwenden
  let userId;
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { name, needs_password_setup: true },
  });

  if (authError) {
    if (!authError.message.includes('already been registered')) return { error: authError.message };
    // Berater existiert bereits → KEIN automatischer Resend (würde alte Links ungültig machen)
    const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const existing = users.find(u => u.email === email);
    if (!existing) return { error: 'Benutzer konnte nicht gefunden werden.' };
    // Profil + Advisor aktualisieren, aber KEINE neue Einladung senden
    await admin.from('profiles').upsert({ id: existing.id, email, name, role });
    await admin.from('advisors').upsert({ user_id: existing.id, display_name: name, email });
    return {
      alreadyExists: true,
      userId: existing.id,
      email,
      name,
      returnFair: returnFair || null,
    };
  }

  userId = authData.user.id;

  // Profil + Advisor-Eintrag anlegen
  await admin.from('profiles').upsert({ id: userId, email, name, role });
  await admin.from('advisors').upsert({ user_id: userId, display_name: name, email });

  // Einladungslink generieren + senden (nur für NEUE Berater)
  await generateAndSendInvite(admin, email, name, appUrl);

  // Wenn von einer Messe aus aufgerufen: direkt zuweisen
  if (returnFair) {
    await admin.from('fair_advisors').upsert({ fair_id: returnFair, advisor_user_id: userId, is_manager: false });
    redirect(`/advisor/admin/fairs/${returnFair}`);
  }

  redirect('/advisor/admin');
}

// Neue separate Action: Einladung explizit erneut senden
export async function resendAdvisorInvite(formData) {
  const admin = await requireAdmin();
  const email = formData.get('email')?.trim().toLowerCase();
  const name = formData.get('name')?.trim();
  const returnFair = formData.get('returnFair');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.daskarriereinstitut.de';

  if (!email) return { error: 'E-Mail fehlt.' };

  await generateAndSendInvite(admin, email, name, appUrl);

  if (returnFair) redirect(`/advisor/admin/fairs/${returnFair}`);
  redirect('/advisor/admin');
}

async function generateAndSendInvite(admin, email, name, appUrl) {
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    // Über /auth/callback routen damit der PKCE-Code server-seitig
    // ausgetauscht wird — funktioniert in ALLEN Browsern (inkl. WhatsApp, Mail-Apps)
    options: { redirectTo: `${appUrl}/auth/callback?next=/auth/set-password` },
  });

  if (linkError) throw new Error(`Einladungslink konnte nicht erstellt werden: ${linkError.message}`);

  const inviteUrl = linkData?.properties?.action_link;

  await sendEmail({
    to: email,
    subject: 'Dein Zugang zum Karriere-Institut Portal',
    html: buildAdvisorInviteEmail(name, inviteUrl, appUrl),
  });
}

function buildAdvisorInviteEmail(name, inviteUrl, appUrl) {
  const firstName = name?.split(' ')[0] || name;
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f5f5f7;color:#1d1d1f">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px">
    <div style="text-align:center;margin-bottom:32px">
      <span style="font-size:11px;font-weight:700;letter-spacing:2px;color:#CC1426;text-transform:uppercase">KARRIERE-INSTITUT</span>
    </div>
    <div style="background:white;border-radius:16px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
      <h2 style="font-size:22px;font-weight:700;margin:0 0 16px">Willkommen im Berater-Portal</h2>
      <p style="color:#86868b;line-height:1.6;margin:0 0 12px">Hallo ${firstName},</p>
      <p style="color:#86868b;line-height:1.6;margin:0 0 12px">du wurdest als Berater zum Karriere-Institut Messe-Portal eingeladen. Klicke auf den Button unten, um dein Passwort zu setzen und loszulegen.</p>
      <p style="color:#86868b;line-height:1.6;margin:0 0 24px">Im Portal kannst du Messegespräche erfassen, Lebensläufe analysieren und Feedback an Besucher senden.</p>
      <div style="text-align:center;margin:24px 0">
        <a href="${inviteUrl}" style="display:inline-block;padding:14px 32px;background:#CC1426;color:white;border-radius:980px;text-decoration:none;font-weight:600;font-size:15px">Passwort setzen & Portal öffnen</a>
      </div>
      <p style="color:#86868b;line-height:1.6;font-size:13px;margin:0">Der Link ist 24 Stunden gültig. Falls du diese E-Mail nicht erwartet hast, kannst du sie ignorieren.</p>
    </div>
    <div style="text-align:center;margin-top:24px;font-size:12px;color:#86868b">
      <p>&copy; 2026 - Das Karriere-Institut | +49 511 5468 4547</p>
      <p>info@daskarriereinstitut.de</p>
      <p style="margin-top:12px">
        <a href="${appUrl}/datenschutz" style="color:#86868b;text-decoration:underline">Datenschutz</a> &middot;
        <a href="${appUrl}/impressum" style="color:#86868b;text-decoration:underline">Impressum</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function changeAdvisorRole(formData) {
  const admin = await requireAdmin();
  const userId = formData.get('user_id');
  const role = formData.get('role');

  await admin.from('profiles').update({ role }).eq('id', userId);
  redirect(`/advisor/admin/advisors/${userId}`);
}

export async function deleteAdvisor(formData) {
  const admin = await requireAdmin();
  const userId = formData.get('user_id');

  // Aus allen Messen entfernen
  await admin.from('fair_advisors').delete().eq('advisor_user_id', userId);
  // Advisor-Eintrag löschen
  await admin.from('advisors').delete().eq('user_id', userId);
  // Auth-User deaktivieren (nicht löschen, um Datenkonsistenz zu wahren)
  await admin.auth.admin.updateUserById(userId, { ban_duration: '876600h' });

  redirect('/advisor/admin');
}

// ── Messe ↔ Berater ──────────────────────────────────────────────────────────

export async function assignAdvisorToFair(formData) {
  const admin = await requireAdmin();
  const fair_id = formData.get('fair_id');
  const advisor_user_id = formData.get('advisor_user_id');
  const redirectTo = formData.get('redirectTo');

  const { error } = await admin
    .from('fair_advisors')
    .upsert({ fair_id, advisor_user_id, is_manager: false });

  if (error) return { error: error.message };
  redirect(redirectTo || `/advisor/admin/fairs/${fair_id}`);
}

export async function removeAdvisorFromFair(formData) {
  const admin = await requireAdmin();
  const fair_id = formData.get('fair_id');
  const advisor_user_id = formData.get('advisor_user_id');
  const redirectTo = formData.get('redirectTo');

  await admin
    .from('fair_advisors')
    .delete()
    .eq('fair_id', fair_id)
    .eq('advisor_user_id', advisor_user_id);

  redirect(redirectTo || `/advisor/admin/fairs/${fair_id}`);
}

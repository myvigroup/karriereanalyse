import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const admin = createAdminClient();

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 }); }

  const { token, phone } = body;
  if (!token) return NextResponse.json({ error: 'Token fehlt' }, { status: 400 });
  if (!phone?.trim()) return NextResponse.json({ error: 'Telefonnummer ist erforderlich' }, { status: 400 });

  // Check laden
  const { data: check, error: findError } = await admin
    .from('self_service_checks')
    .select('*')
    .eq('result_token', token)
    .single();

  if (findError || !check) return NextResponse.json({ error: 'Ungültiger Token' }, { status: 404 });
  if (check.registered) return NextResponse.json({ success: true, alreadyRegistered: true });

  try {
    // Prüfen ob User schon existiert (über profiles, da listUsers paginiert)
    const { data: existingProfile } = await admin.from('profiles').select('id').eq('email', check.email).maybeSingle();

    let userId;
    if (existingProfile) {
      userId = existingProfile.id;
      // Profil updaten falls vorhanden
      await admin.from('profiles').upsert({
        id: userId,
        full_name: check.name,
        phone: phone.trim(),
        membership_type: 'basis',
      }, { onConflict: 'id' });
    } else {
      // Neuen User anlegen
      const { data: newUser, error: createError } = await admin.auth.admin.createUser({
        email: check.email,
        email_confirm: true,
        user_metadata: { full_name: check.name },
      });
      if (createError) throw new Error(createError.message);
      userId = newUser.user.id;

      // Profil anlegen
      await admin.from('profiles').upsert({
        id: userId,
        full_name: check.name,
        phone: phone.trim(),
        membership_type: 'basis',
        role: 'user',
      }, { onConflict: 'id' });
    }

    // Check als registriert markieren + Telefon speichern
    await admin.from('self_service_checks').update({
      registered: true,
      phone: phone.trim(),
      user_id: userId,
    }).eq('id', check.id);

    // Magic Link generieren damit User sich direkt einloggen kann
    const { data: linkData } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: check.email,
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` },
    });

    return NextResponse.json({
      success: true,
      loginUrl: linkData?.properties?.action_link || null,
    });
  } catch (err) {
    console.error('self-check/register error:', err);
    const msg = err.message || '';
    if (msg.includes('already been registered') || msg.includes('already registered')) {
      // User existiert bereits → Magic Link generieren statt Fehler
      try {
        const { data: linkData } = await admin.auth.admin.generateLink({
          type: 'magiclink',
          email: check.email,
          options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` },
        });
        await admin.from('self_service_checks').update({ registered: true, phone: phone.trim() }).eq('id', check.id);
        return NextResponse.json({ success: true, existingUser: true, loginUrl: linkData?.properties?.action_link || '/auth/login' });
      } catch {
        return NextResponse.json({ success: true, existingUser: true, loginUrl: '/auth/login' });
      }
    }
    return NextResponse.json({ error: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.' }, { status: 500 });
  }
}

import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const admin = createAdminClient();

  try {
    const { token, name, email, password } = await request.json();

    if (!token || !email || !password) {
      return NextResponse.json({ error: 'Felder fehlen' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Passwort muss mindestens 6 Zeichen haben' }, { status: 400 });
    }

    // Token validieren und Lead laden
    const { data: lead } = await admin
      .from('fair_leads')
      .select('id, user_id, email, fair_id, advisor_id')
      .eq('upload_token', token)
      .single();

    if (!lead) {
      return NextResponse.json({ error: 'Ungültiger Link' }, { status: 404 });
    }

    // Prüfe ob User bereits existiert
    if (lead.user_id) {
      // User existiert schon — Passwort setzen
      await admin.auth.admin.updateUserById(lead.user_id, { password });
      await admin.from('profiles').update({
        name,
        membership_type: 'basis',
      }).eq('id', lead.user_id);
    } else {
      // Neuen User erstellen mit Passwort
      const { data: newUser, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, source: 'fair_self_signup' },
      });

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 400 });
      }

      // Profile updaten
      await admin.from('profiles').update({
        name,
        membership_type: 'basis',
      }).eq('id', newUser.user.id);

      // Lead mit User verknüpfen
      await admin.from('fair_leads').update({
        user_id: newUser.user.id,
      }).eq('id', lead.id);

      // CV-Dokumente dem User zuordnen
      await admin.from('cv_documents').update({
        user_id: newUser.user.id,
      }).eq('fair_lead_id', lead.id);
    }

    // Lead-Status aktualisieren
    await admin.from('fair_leads').update({
      status: 'activated',
      updated_at: new Date().toISOString(),
    }).eq('id', lead.id);

    // Funnel-Event
    await admin.from('analytics_events').insert({
      user_id: lead.user_id,
      event_name: 'fair_self_signup',
      fair_id: lead.fair_id,
      advisor_id: lead.advisor_id,
      metadata: { lead_id: lead.id },
    });

    return NextResponse.json({ success: true, email });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Registrierung fehlgeschlagen' }, { status: 500 });
  }
}

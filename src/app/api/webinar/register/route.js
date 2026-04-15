import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'info@daskarriereinstitut.de';

export async function POST(request) {
  try {
    const supabase = createClient();
    const admin = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

    const { seminarId } = await request.json();
    if (!seminarId) return NextResponse.json({ error: 'seminarId fehlt' }, { status: 400 });

    // Get seminar
    const { data: seminar } = await admin
      .from('seminars')
      .select('id, title, next_date')
      .eq('id', seminarId)
      .single();

    if (!seminar) return NextResponse.json({ error: 'Seminar nicht gefunden' }, { status: 404 });

    // Check if already registered
    const { data: existing } = await admin
      .from('webinar_registrations')
      .select('id')
      .eq('user_id', user.id)
      .eq('seminar_id', seminarId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ alreadyRegistered: true });
    }

    // Access check: Premium or SEMINAR purchased
    const { data: profile } = await admin
      .from('profiles')
      .select('first_name, last_name, name, email, phone, subscription_plan, purchased_products')
      .eq('id', user.id)
      .single();

    const plan = profile?.subscription_plan || 'FREE';
    const purchased = profile?.purchased_products || [];
    const hasAccess = plan !== 'FREE' || purchased.includes('SEMINAR');

    if (!hasAccess) {
      return NextResponse.json({ error: 'Kein Zugang — bitte erst Seminar kaufen oder Mitgliedschaft abschließen', needsPayment: true }, { status: 403 });
    }

    // Create registration
    await admin.from('webinar_registrations').insert({
      user_id: user.id,
      seminar_id: seminarId,
    });

    // Get user display info
    const userName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || profile?.name || 'Unbekannt';
    const userEmail = profile?.email || user.email;
    const userPhone = profile?.phone || '—';
    const seminarDate = seminar.next_date
      ? new Date(seminar.next_date + 'T00:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : 'Termin offen';

    // Send admin notification email
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `Neue Seminar-Buchung: ${seminar.title}`,
      html: `
        <h2>Neue Seminar-Buchung</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Seminar:</td><td>${seminar.title}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Termin:</td><td>${seminarDate}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Name:</td><td>${userName}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">E-Mail:</td><td><a href="mailto:${userEmail}">${userEmail}</a></td></tr>
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Telefon:</td><td>${userPhone}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Zugang:</td><td>${plan !== 'FREE' ? 'Premium-Mitglied' : 'Einzelkauf'}</td></tr>
        </table>
        <p style="margin-top:20px;font-size:13px;color:#666;">Bitte den Webinar-Link manuell an den Teilnehmer senden.</p>
      `,
    });

    return NextResponse.json({ success: true, seminarTitle: seminar.title });
  } catch (error) {
    console.error('Webinar registration error:', error);
    return NextResponse.json({ error: error.message || 'Registrierung fehlgeschlagen' }, { status: 500 });
  }
}

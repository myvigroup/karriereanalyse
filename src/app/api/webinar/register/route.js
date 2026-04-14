import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { registerForWebinar } from '@/lib/webinargeek';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = createClient();
    const admin = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

    const { seminarId } = await request.json();
    if (!seminarId) return NextResponse.json({ error: 'seminarId fehlt' }, { status: 400 });

    // Get seminar with WebinarGeek ID
    const { data: seminar } = await admin
      .from('seminars')
      .select('id, title, webinargeek_webinar_id')
      .eq('id', seminarId)
      .single();

    if (!seminar?.webinargeek_webinar_id) {
      return NextResponse.json({ error: 'Dieses Seminar ist nicht mit WebinarGeek verknüpft' }, { status: 400 });
    }

    // Check if already registered
    const { data: existing } = await admin
      .from('webinar_registrations')
      .select('id, watch_link')
      .eq('user_id', user.id)
      .eq('seminar_id', seminarId)
      .maybeSingle();

    if (existing?.watch_link) {
      return NextResponse.json({ alreadyRegistered: true, watchLink: existing.watch_link });
    }

    // Get user profile for name
    const { data: profile } = await admin
      .from('profiles')
      .select('first_name, last_name, name, email, phone')
      .eq('id', user.id)
      .single();

    const firstName = profile?.first_name || profile?.name?.split(' ')[0] || '';
    const lastName = profile?.last_name || profile?.name?.split(' ').slice(1).join(' ') || '';

    // Register at WebinarGeek
    const result = await registerForWebinar(seminar.webinargeek_webinar_id, {
      firstName,
      lastName,
      email: profile?.email || user.email,
      phone: profile?.phone || '',
    });

    // Save registration
    await admin.from('webinar_registrations').insert({
      user_id: user.id,
      seminar_id: seminarId,
      webinargeek_subscription_id: result.subscription?.id?.toString(),
      watch_link: result.watchLink,
      broadcast_id: result.broadcastId?.toString(),
    });

    return NextResponse.json({
      success: true,
      watchLink: result.watchLink,
      seminarTitle: seminar.title,
    });
  } catch (error) {
    console.error('Webinar registration error:', error);
    return NextResponse.json({ error: error.message || 'Registrierung fehlgeschlagen' }, { status: 500 });
  }
}

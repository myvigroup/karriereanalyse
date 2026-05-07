import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { getTemplate } from '@/lib/email-templates';

export async function GET(req) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
  );

  let sent = 0;

  try {
    const { data: users } = await supabase
      .from('profiles')
      .select('id, email, first_name, name, email_notifications, unsubscribe_token, streak_count, total_points')
      .eq('email_notifications', true)
      .eq('onboarding_complete', true);

    if (!users) return NextResponse.json({ sent: 0 });

    for (const user of users) {
      const name = user.first_name || user.name || 'dort';

      // Count wins this week
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const { count: wins } = await supabase
        .from('salary_log')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', weekAgo);

      const stats = {
        streak: user.streak_count || 0,
        xp: user.total_points || 0,
        wins: wins || 0,
        recommendation: !user.total_points ? 'Starte mit der Karriereanalyse' : wins === 0 ? 'Trage einen Win ein!' : null,
      };

      const tmpl = getTemplate('weekly_digest', name, stats, user.unsubscribe_token);
      if (tmpl && user.email) {
        await sendEmail({ to: user.email, ...tmpl });
        await supabase.from('email_log').insert({ user_id: user.id, template: 'weekly_digest' });
        sent++;
      }
    }

    return NextResponse.json({ sent });
  } catch (error) {
    console.error('Weekly digest error:', error);
    return NextResponse.json({ error: 'Digest failed' }, { status: 500 });
  }
}

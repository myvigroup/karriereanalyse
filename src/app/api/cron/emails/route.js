import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { getTemplate } from '@/lib/email-templates';

export async function GET(req) {
  // Verify cron secret (required for Vercel Cron)
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
  );

  const sent = [];
  const now = new Date();

  try {
    const { data: users } = await supabase
      .from('profiles')
      .select('id, email, first_name, name, email_notifications, unsubscribe_token, onboarding_complete, streak_count, last_streak_date, total_points, subscription_status, subscription_ends_at, updated_at')
      .eq('email_notifications', true);

    if (!users) return NextResponse.json({ sent: 0 });

    for (const user of users) {
      const name = user.first_name || user.name || 'dort';
      const token = user.unsubscribe_token;
      const daysSinceActive = Math.floor((now - new Date(user.updated_at)) / 86400000);

      // Check email_log to avoid duplicates
      const alreadySent = async (template) => {
        const cutoff = new Date(now - 86400000).toISOString();
        const { count } = await supabase
          .from('email_log')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('template', template)
          .gte('sent_at', cutoff);
        return (count || 0) > 0;
      };

      // Onboarding incomplete (24h)
      if (!user.onboarding_complete && daysSinceActive >= 1 && !(await alreadySent('onboarding_incomplete'))) {
        const tmpl = getTemplate('onboarding_incomplete', name, token);
        if (tmpl && user.email) {
          await sendEmail({ to: user.email, ...tmpl });
          await supabase.from('email_log').insert({ user_id: user.id, template: 'onboarding_incomplete' });
          sent.push({ user: user.id, template: 'onboarding_incomplete' });
        }
      }

      // Streak broken
      if (user.last_streak_date) {
        const streakDays = Math.floor((now - new Date(user.last_streak_date)) / 86400000);
        if (streakDays >= 2 && user.streak_count > 2 && !(await alreadySent('streak_broken'))) {
          const tmpl = getTemplate('streak_broken', name, token);
          if (tmpl && user.email) {
            await sendEmail({ to: user.email, ...tmpl });
            await supabase.from('email_log').insert({ user_id: user.id, template: 'streak_broken' });
            sent.push({ user: user.id, template: 'streak_broken' });
          }
        }
      }

      // Inactive 7d
      if (daysSinceActive >= 7 && daysSinceActive < 30 && !(await alreadySent('inactive_7d'))) {
        const tmpl = getTemplate('inactive_7d', name, token);
        if (tmpl && user.email) {
          await sendEmail({ to: user.email, ...tmpl });
          await supabase.from('email_log').insert({ user_id: user.id, template: 'inactive_7d' });
          sent.push({ user: user.id, template: 'inactive_7d' });
        }
      }

      // Inactive 30d
      if (daysSinceActive >= 30 && !(await alreadySent('inactive_30d'))) {
        const tmpl = getTemplate('inactive_30d', name, token);
        if (tmpl && user.email) {
          await sendEmail({ to: user.email, ...tmpl });
          await supabase.from('email_log').insert({ user_id: user.id, template: 'inactive_30d' });
          sent.push({ user: user.id, template: 'inactive_30d' });
        }
      }

      // Trial ending (2 days before)
      if (user.subscription_status === 'trialing' && user.subscription_ends_at) {
        const daysLeft = Math.ceil((new Date(user.subscription_ends_at) - now) / 86400000);
        if (daysLeft <= 2 && daysLeft > 0 && !(await alreadySent('trial_ending'))) {
          const tmpl = getTemplate('trial_ending', name, daysLeft, token);
          if (tmpl && user.email) {
            await sendEmail({ to: user.email, ...tmpl });
            await supabase.from('email_log').insert({ user_id: user.id, template: 'trial_ending' });
            sent.push({ user: user.id, template: 'trial_ending' });
          }
        }
      }
    }

    return NextResponse.json({ sent: sent.length, details: sent });
  } catch (error) {
    console.error('Cron email error:', error);
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 });
  }
}

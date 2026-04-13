import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ADVISORS = [
  { email: 's.boufarache@mitnorm.com', name: 'Siham Boufarache' },
  { email: 't.thiele@mitnorm.com', name: 'Tim Thiele' },
  { email: 'j.fiore@mitnorm.com', name: 'Robert Fiore' },
  { email: 'j.jasiulek@mitnorm.com', name: 'Jessica Jasiulek' },
  { email: 'j.teufel@mitnorm.com', name: 'Jonas Teufel' },
  { email: 'k.zekan@mitnorm.com', name: 'Kristijan Zekan' },
  { email: 'v.mast@mitnorm.com', name: 'Valerie Mast' },
  { email: 'l.weidebach@mitnorm.com', name: 'Lena Weidebach' },
  { email: 'p.moyo@mitnorm.com', name: 'Patrick Moyo' },
  { email: 'k.munisi@mitnorm.com', name: 'Kim Noah Munisi' },
  { email: 'a.zill@mitnorm.com', name: 'Alexander Zill' },
  { email: 'm.jatzke@mitnorm.com', name: 'Mario Jatzke' },
  { email: 'a.hochmann@mitnorm.com', name: 'Adrian Hochmann' },
  { email: 'c.geipel@mitnorm.com', name: 'Christopher Geipel' },
  { email: 'p.muenzer@mitnorm.com', name: 'Patrick Münzer' },
  { email: 'e.legros@mitnorm.com', name: 'Elisa Legros' },
  { email: 'a.pertsovski@mitnorm.com', name: 'Alexander Pertsovski' },
  { email: 's.sharifimehr@mitnorm.com', name: 'Shania Sharifimehr' },
];

export async function GET(req) {
  // Only allow admins
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const results = [];

  for (const advisor of ADVISORS) {
    // Check if already exists
    const { data: existing } = await admin.from('profiles').select('id').eq('email', advisor.email).maybeSingle();
    if (existing) {
      results.push({ email: advisor.email, status: 'skipped (already exists)' });
      continue;
    }

    // Invite user — sends email with set-password link
    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(advisor.email, {
      data: { name: advisor.name },
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/set-password`,
    });

    if (inviteError || !invited?.user) {
      results.push({ email: advisor.email, status: `error: ${inviteError?.message}` });
      continue;
    }

    const userId = invited.user.id;

    // Set profile role
    await admin.from('profiles').upsert({
      id: userId,
      email: advisor.email,
      name: advisor.name,
      role: 'advisor',
    });

    // Create advisor entry
    const { error: advisorError } = await admin.from('advisors').insert({
      user_id: userId,
      display_name: advisor.name,
    });

    if (advisorError) {
      results.push({ email: advisor.email, status: `user created, advisor insert error: ${advisorError.message}` });
    } else {
      results.push({ email: advisor.email, status: 'invited' });
    }
  }

  return NextResponse.json({ results });
}

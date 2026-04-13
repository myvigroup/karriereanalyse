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
      // Generate a new invite link for existing users too
      const { data: linkData } = await admin.auth.admin.generateLink({
        type: 'recovery',
        email: advisor.email,
        options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/set-password` },
      });
      results.push({ email: advisor.email, name: advisor.name, status: 'already exists', link: linkData?.properties?.action_link || null });
      continue;
    }

    // Create user without sending email
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: advisor.email,
      email_confirm: true,
      user_metadata: { name: advisor.name },
    });

    if (createError || !created?.user) {
      results.push({ email: advisor.email, name: advisor.name, status: `error: ${createError?.message}` });
      continue;
    }

    const userId = created.user.id;

    // Set profile role
    await admin.from('profiles').upsert({
      id: userId,
      email: advisor.email,
      name: advisor.name,
      role: 'advisor',
    });

    // Create advisor entry (with email to satisfy NOT NULL)
    const { error: advisorError } = await admin.from('advisors').insert({
      user_id: userId,
      display_name: advisor.name,
      email: advisor.email,
    });

    // Generate invite/set-password link
    const { data: linkData } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email: advisor.email,
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/set-password` },
    });

    results.push({
      email: advisor.email,
      name: advisor.name,
      status: advisorError ? `user created, advisor error: ${advisorError.message}` : 'created',
      link: linkData?.properties?.action_link || null,
    });
  }

  return NextResponse.json({ results }, {
    headers: { 'Content-Type': 'application/json' },
  });
}

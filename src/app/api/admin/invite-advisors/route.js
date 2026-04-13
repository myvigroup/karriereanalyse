import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';

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
    // Generate fresh set-password link
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email: advisor.email,
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/set-password` },
    });

    if (linkError || !linkData?.properties?.action_link) {
      results.push({ email: advisor.email, name: advisor.name, status: `link error: ${linkError?.message}` });
      continue;
    }

    const link = linkData.properties.action_link;

    // Send email via Brevo
    const emailResult = await sendEmail({
      to: advisor.email,
      subject: 'Dein Zugang zum Karriere-Institut Berater-Portal',
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
          <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.12em; color: #CC1426; text-transform: uppercase; margin-bottom: 24px;">Das Karriere-Institut</div>
          <h1 style="font-size: 24px; font-weight: 700; color: #1A1A1A; margin: 0 0 12px;">Hallo ${advisor.name.split(' ')[0]},</h1>
          <p style="font-size: 16px; color: #444; line-height: 1.6; margin: 0 0 24px;">
            dein Berater-Account ist bereit. Klicke auf den Button, um dein Passwort zu setzen und dich einzuloggen.
          </p>
          <a href="${link}" style="display: inline-block; background: #CC1426; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 15px; margin-bottom: 24px;">
            Passwort setzen →
          </a>
          <p style="font-size: 13px; color: #86868b; margin: 0 0 8px;">
            Nach dem Setzen deines Passworts kannst du dich jederzeit unter <a href="${process.env.NEXT_PUBLIC_APP_URL}/advisor/login" style="color: #CC1426;">${process.env.NEXT_PUBLIC_APP_URL}/advisor/login</a> einloggen.
          </p>
          <p style="font-size: 12px; color: #aaa; margin: 16px 0 0;">Dieser Link ist 24 Stunden gültig.</p>
        </div>
      `,
    });

    results.push({
      email: advisor.email,
      name: advisor.name,
      status: emailResult?.error ? `email error: ${emailResult.error}` : 'email sent',
    });
  }

  return NextResponse.json({ results });
}

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json();
    const admin = createAdminClient();

    const { error } = await admin.from('profiles').upsert({
      id: user.id,
      email: user.email,
      first_name: body.firstName,
      last_name: body.lastName,
      name: `${body.firstName} ${body.lastName}`.trim(),
      avatar_initials: ((body.firstName?.[0] || '') + (body.lastName?.[0] || 'X')).toUpperCase(),
      role: 'user',
      phase: 'pre_coaching',
      industry: body.industry,
      current_salary: body.currentSalary,
      target_salary: body.targetSalary,
      career_obstacle: body.obstacle,
      experience_years: body.experience,
      onboarding_complete: true,
      total_points: 50,
      dsgvo_consent_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    if (error) {
      console.error('Onboarding upsert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('complete-onboarding error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

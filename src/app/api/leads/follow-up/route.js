import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { leadId, status } = await request.json();
    if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 });

    const admin = createAdminClient();

    // Verify the lead belongs to this advisor
    const { data: lead } = await admin
      .from('fair_leads')
      .select('advisor_user_id')
      .eq('id', leadId)
      .single();

    if (!lead || lead.advisor_user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await admin
      .from('fair_leads')
      .update({ follow_up_status: status || null })
      .eq('id', leadId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

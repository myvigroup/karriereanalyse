import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request, context) {
  try {
    const leadId = context.params.leadId;
    const supabase = createClient();
    const admin = createAdminClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

    const { data: lead } = await admin
      .from('fair_leads').select('*').eq('id', leadId).maybeSingle();

    const { data: doc } = await admin
      .from('cv_documents').select('*').eq('lead_id', leadId)
      .order('created_at', { ascending: false }).limit(1).maybeSingle();

    const { data: fb } = await admin
      .from('cv_feedback').select('*').eq('fair_lead_id', leadId).maybeSingle();

    let items = [];
    if (fb?.id) {
      const { data: fbItems } = await admin
        .from('cv_feedback_items').select('*')
        .eq('cv_feedback_id', fb.id).order('sort_order');
      items = fbItems || [];
    }

    return NextResponse.json({ lead, document: doc, feedback: fb, items });
  } catch (err) {
    console.error('Summary API error:', err);
    return NextResponse.json({ error: err.message, lead: null, document: null, feedback: null, items: [] }, { status: 500 });
  }
}

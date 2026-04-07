import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST: Feedback für einen Lead laden oder erstellen
export async function POST(request) {
  const { leadId, documentId } = await request.json();
  if (!leadId || !documentId) {
    return NextResponse.json({ error: 'leadId und documentId erforderlich' }, { status: 400 });
  }

  const supabase = createClient();
  const admin = createAdminClient();

  // Auth prüfen
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

  // Vorhandenes Feedback suchen
  const { data: existing } = await admin
    .from('cv_feedback')
    .select('*')
    .eq('fair_lead_id', leadId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ feedback: existing });
  }

  // Advisor-ID ermitteln (optional)
  const { data: advisor } = await admin
    .from('advisors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  // Neues Feedback erstellen
  const insertData = {
    cv_document_id: documentId,
    fair_lead_id: leadId,
    status: 'draft',
  };
  if (advisor?.id) insertData.advisor_id = advisor.id;

  const { data: newFeedback, error } = await admin
    .from('cv_feedback')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ feedback: newFeedback });
}

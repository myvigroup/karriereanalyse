import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { leadId } = params;
  const supabase = createClient();

  const { data: doc } = await supabase
    .from('cv_documents')
    .select('id')
    .eq('fair_lead_id', leadId)
    .limit(1)
    .maybeSingle();

  return NextResponse.json({
    uploaded: !!doc,
    document_id: doc?.id || null,
  });
}

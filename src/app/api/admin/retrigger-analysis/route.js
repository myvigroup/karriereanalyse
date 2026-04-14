import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { runCVAnalysis } from '@/lib/cv-analysis-worker';
import { NextResponse } from 'next/server';

export const maxDuration = 300; // 5 Minuten für Batch-Verarbeitung

export async function POST(request) {
  // Nur Admins
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

  const admin = createAdminClient();
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Kein Zugriff' }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const { leadId } = body; // Optional: einzelnen Lead angeben

  // CVs finden die noch keine KI-Analyse haben
  let docQuery = admin
    .from('cv_documents')
    .select('id, lead_id, storage_path, file_type, extraction_status')
    .or('extraction_status.is.null,extraction_status.eq.failed,extraction_status.neq.success');

  if (leadId) {
    docQuery = docQuery.eq('lead_id', leadId);
  }

  const { data: docs, error } = await docQuery.limit(50); // Max 50 auf einmal

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!docs || docs.length === 0) {
    return NextResponse.json({ message: 'Keine ausstehenden CVs gefunden', processed: 0 });
  }

  const results = [];

  for (const doc of docs) {
    try {
      // Zugehöriges Lead und Feedback laden
      const { data: lead } = await admin
        .from('fair_leads')
        .select('target_position')
        .eq('id', doc.lead_id)
        .maybeSingle();

      // Feedback suchen oder erstellen
      let { data: feedback } = await admin
        .from('cv_feedback')
        .select('id, ai_parsed_at')
        .eq('fair_lead_id', doc.lead_id)
        .maybeSingle();

      if (!feedback) {
        const { data: newFeedback } = await admin.from('cv_feedback').insert({
          cv_document_id: doc.id,
          fair_lead_id: doc.lead_id,
          status: 'draft',
        }).select('id').single();
        feedback = newFeedback;
      }

      // Analyse starten
      const result = await runCVAnalysis({
        documentId: doc.id,
        feedbackId: feedback?.id,
        targetPosition: lead?.target_position || '',
      });

      results.push({ docId: doc.id, leadId: doc.lead_id, ...result });
    } catch (err) {
      console.error('Retrigger error for doc', doc.id, err);
      results.push({ docId: doc.id, leadId: doc.lead_id, error: err.message });
    }
  }

  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => r.error).length;

  return NextResponse.json({
    processed: results.length,
    succeeded,
    failed,
    results,
  });
}

// GET: Status der ausstehenden CVs anzeigen
export async function GET(request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

  const admin = createAdminClient();
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Kein Zugriff' }, { status: 403 });

  const { data: pending } = await admin
    .from('cv_documents')
    .select('id, lead_id, file_name, extraction_status, created_at')
    .or('extraction_status.is.null,extraction_status.eq.failed,extraction_status.neq.success')
    .order('created_at', { ascending: false })
    .limit(100);

  return NextResponse.json({ pending: pending || [], count: pending?.length || 0 });
}

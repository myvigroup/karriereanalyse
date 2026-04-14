export const maxDuration = 300;

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { runCVAnalysis } from '@/lib/cv-analysis-worker';
import { NextResponse } from 'next/server';

 // 5 Minuten für Batch-Verarbeitung

async function authAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single();
  if (!['admin', 'messeleiter'].includes(profile?.role)) return null;
  return admin;
}

// POST: KI-Analyse für ausstehende CVs nachholen
export async function POST(request) {
  const admin = await authAdmin();
  if (!admin) return NextResponse.json({ error: 'Kein Zugriff' }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const { leadId } = body;

  // Strategie: cv_feedback ohne ai_parsed_at finden
  let feedbacks = [];

  if (leadId) {
    const { data } = await admin
      .from('cv_feedback')
      .select('id, fair_lead_id, cv_document_id, ai_parsed_at')
      .eq('fair_lead_id', leadId)
      .limit(5);
    feedbacks = data || [];

    // Falls kein Feedback existiert aber ein CV: Feedback erstellen
    if (feedbacks.length === 0) {
      const { data: doc } = await admin
        .from('cv_documents')
        .select('id, lead_id')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (doc) {
        const { data: nf } = await admin.from('cv_feedback').insert({
          cv_document_id: doc.id,
          fair_lead_id: leadId,
          status: 'draft',
        }).select('id, fair_lead_id, cv_document_id').single();
        if (nf) feedbacks = [nf];
      }
    }
  } else {
    // Alle Feedbacks ohne KI-Analyse (max 50)
    const { data, error } = await admin
      .from('cv_feedback')
      .select('id, fair_lead_id, cv_document_id, ai_parsed_at')
      .is('ai_parsed_at', null)
      .limit(50);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    feedbacks = data || [];

    // Fallback: leads mit status 'analyzing' die noch kein Feedback haben
    if (feedbacks.length === 0) {
      const { data: analyzingLeads } = await admin
        .from('fair_leads')
        .select('id')
        .eq('status', 'analyzing')
        .limit(50);

      if (analyzingLeads && analyzingLeads.length > 0) {
        const leadIds = analyzingLeads.map(l => l.id);
        const { data: docs } = await admin
          .from('cv_documents')
          .select('id, lead_id')
          .in('lead_id', leadIds)
          .order('created_at', { ascending: false });

        for (const doc of docs || []) {
          let { data: fb } = await admin.from('cv_feedback').select('id').eq('fair_lead_id', doc.lead_id).maybeSingle();
          if (!fb) {
            const { data: nf } = await admin.from('cv_feedback').insert({
              cv_document_id: doc.id,
              fair_lead_id: doc.lead_id,
              status: 'draft',
            }).select('id, fair_lead_id, cv_document_id').single();
            if (nf) feedbacks.push(nf);
          } else {
            feedbacks.push({ ...fb, fair_lead_id: doc.lead_id, cv_document_id: doc.id });
          }
        }
      }
    }
  }

  if (feedbacks.length === 0) {
    return NextResponse.json({ message: 'Keine ausstehenden Analysen gefunden', processed: 0 });
  }

  // Analysen starten
  const results = [];
  for (const fb of feedbacks) {
    try {
      const { data: lead } = await admin
        .from('fair_leads').select('target_position').eq('id', fb.fair_lead_id).maybeSingle();

      // Dokument finden
      const { data: doc } = fb.cv_document_id
        ? await admin.from('cv_documents').select('id').eq('id', fb.cv_document_id).maybeSingle()
        : await admin.from('cv_documents').select('id').eq('lead_id', fb.fair_lead_id)
            .order('created_at', { ascending: false }).limit(1).maybeSingle();

      if (!doc) {
        results.push({ feedbackId: fb.id, leadId: fb.fair_lead_id, error: 'Kein Dokument gefunden' });
        continue;
      }

      const result = await runCVAnalysis({
        documentId: doc.id,
        feedbackId: fb.id,
        targetPosition: lead?.target_position || '',
      });
      results.push({ feedbackId: fb.id, docId: doc.id, leadId: fb.fair_lead_id, ...result });
    } catch (err) {
      console.error('Retrigger error:', err);
      results.push({ feedbackId: fb.id, leadId: fb.fair_lead_id, error: err.message });
    }
  }

  return NextResponse.json({
    processed: results.length,
    succeeded: results.filter(r => r.success).length,
    failed: results.filter(r => r.error).length,
    results,
  });
}

// GET: Status — wie viele ausstehend?
export async function GET() {
  const admin = await authAdmin();
  if (!admin) return NextResponse.json({ error: 'Kein Zugriff' }, { status: 403 });

  const { data: pending } = await admin
    .from('cv_feedback')
    .select('id, fair_lead_id, ai_parsed_at')
    .is('ai_parsed_at', null)
    .limit(100);

  return NextResponse.json({ pending: pending || [], count: pending?.length || 0 });
}

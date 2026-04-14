import { createAdminClient } from '@/lib/supabase/admin';
import { runCVAnalysis } from '@/lib/cv-analysis-worker';
import { NextResponse } from 'next/server';

// Längeres Timeout für AI-Analyse
export const maxDuration = 60;

const ACCEPTED_TYPES = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'image/jpeg': 'image',
  'image/jpg': 'image',
  'image/png': 'image',
  'image/heic': 'image',
};

export async function POST(request, { params }) {
  const { token } = params;
  const admin = createAdminClient();

  // Token validieren
  const { data: lead, error: leadError } = await admin
    .from('fair_leads')
    .select('id, email, fair_id, advisor_user_id, magic_token_expires_at, target_position')
    .eq('magic_token', token)
    .maybeSingle();

  if (leadError || !lead) {
    return NextResponse.json({ error: 'Ungültiger oder abgelaufener Link' }, { status: 404 });
  }

  // Token-Ablauf prüfen
  if (lead.magic_token_expires_at && new Date(lead.magic_token_expires_at) < new Date()) {
    return NextResponse.json({ error: 'Dieser Link ist abgelaufen' }, { status: 410 });
  }

  // Rate-Limiting: max 3 Dokumente pro Lead
  const { count } = await admin
    .from('cv_documents')
    .select('*', { count: 'exact', head: true })
    .eq('lead_id', lead.id);

  if (count >= 3) {
    return NextResponse.json({ error: 'Maximale Anzahl an Uploads erreicht' }, { status: 429 });
  }

  // Datei aus FormData lesen
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Keine Datei hochgeladen' }, { status: 400 });
  }

  const fileType = ACCEPTED_TYPES[file.type];
  if (!fileType) {
    return NextResponse.json({ error: 'Nicht unterstütztes Dateiformat' }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'Datei zu groß (max. 10 MB)' }, { status: 400 });
  }

  // Upload in Supabase Storage
  const docId = crypto.randomUUID();
  const filePath = `${lead.id}/${docId}/${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from('cv-documents')
    .upload(filePath, buffer, { contentType: file.type });

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    return NextResponse.json({ error: 'Upload fehlgeschlagen' }, { status: 500 });
  }

  // DB-Eintrag erstellen (mit ID zurückgeben)
  const { data: docRecord, error: dbError } = await admin.from('cv_documents').insert({
    lead_id: lead.id,
    storage_path: filePath,
    file_name: file.name,
    file_type: fileType,
    file_size_bytes: file.size,
  }).select('id').single();

  if (dbError) {
    console.error('DB insert error:', dbError);
    return NextResponse.json({ error: 'Speicherung fehlgeschlagen' }, { status: 500 });
  }

  // Lead-Status updaten
  await admin.from('fair_leads').update({
    status: 'analyzing',
    updated_at: new Date().toISOString(),
  }).eq('id', lead.id);

  // Feedback-Eintrag erstellen
  const { data: feedbackRecord } = await admin.from('cv_feedback').insert({
    cv_document_id: docRecord.id,
    fair_lead_id: lead.id,
    status: 'draft',
  }).select('id').single();

  // Funnel-Event
  await admin.from('analytics_events').insert({
    event_name: 'cv_uploaded',
    fair_id: lead.fair_id,
    metadata: { lead_id: lead.id, source: 'qr_upload' },
  }).then(() => {}).catch(() => {});

  // KI-Analyse direkt hier starten (synchron, kein separates HTTP-Request nötig)
  // Fehler werden ignoriert — Upload gilt trotzdem als erfolgreich
  try {
    await runCVAnalysis({
      documentId: docRecord.id,
      feedbackId: feedbackRecord?.id,
      targetPosition: lead.target_position || '',
    });
  } catch (analysisErr) {
    console.error('Auto-analysis error (non-fatal):', analysisErr);
  }

  return NextResponse.json({ success: true });
}

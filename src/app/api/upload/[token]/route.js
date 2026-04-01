import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

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
    .select('id, user_id, email, fair_id, advisor_id, upload_token_expires_at')
    .eq('upload_token', token)
    .single();

  if (leadError || !lead) {
    return NextResponse.json({ error: 'Ungültiger oder abgelaufener Link' }, { status: 404 });
  }

  // Token-Ablauf prüfen
  if (new Date(lead.upload_token_expires_at) < new Date()) {
    return NextResponse.json({ error: 'Dieser Link ist abgelaufen' }, { status: 410 });
  }

  // Rate-Limiting: max 3 Dokumente pro Lead
  const { count } = await admin
    .from('cv_documents')
    .select('*', { count: 'exact', head: true })
    .eq('fair_lead_id', lead.id);

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
  const filePath = `${lead.email}/${docId}/${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from('cv-documents')
    .upload(filePath, buffer, { contentType: file.type });

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    return NextResponse.json({ error: 'Upload fehlgeschlagen' }, { status: 500 });
  }

  // DB-Eintrag erstellen
  const { error: dbError } = await admin.from('cv_documents').insert({
    fair_lead_id: lead.id,
    user_id: lead.user_id,
    version: 1,
    file_path: filePath,
    file_name: file.name,
    file_type: fileType,
    file_size_bytes: file.size,
    is_current: true,
  });

  if (dbError) {
    console.error('DB insert error:', dbError);
    return NextResponse.json({ error: 'Speicherung fehlgeschlagen' }, { status: 500 });
  }

  // Lead-Status updaten
  await admin.from('fair_leads').update({
    status: 'cv_uploaded',
    updated_at: new Date().toISOString(),
  }).eq('id', lead.id);

  // Funnel-Event
  await admin.from('analytics_events').insert({
    user_id: lead.user_id,
    event_name: 'cv_uploaded',
    fair_id: lead.fair_id,
    advisor_id: lead.advisor_id,
    metadata: { lead_id: lead.id, source: 'qr_upload' },
  });

  return NextResponse.json({ success: true });
}

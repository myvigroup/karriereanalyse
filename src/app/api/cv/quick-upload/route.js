// Anonymer CV-Upload für Quick-Leads (kein Auth nötig).
// Berater erstellt im /advisor/quick-lead einen Lead → Kunde lädt unter /upload/[leadId] hoch.

import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import { sanitizeFilename } from '@/lib/utils';

export const maxDuration = 60;

const ACCEPTED_TYPES = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'image/jpeg': 'image',
  'image/jpg': 'image',
  'image/png': 'image',
  'image/heic': 'image',
};

export async function POST(request) {
  const admin = createAdminClient();
  const formData = await request.formData();
  const file = formData.get('file');
  const leadId = formData.get('leadId');

  if (!leadId) return NextResponse.json({ error: 'leadId fehlt' }, { status: 400 });
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Keine Datei' }, { status: 400 });
  }

  const fileType = ACCEPTED_TYPES[file.type];
  if (!fileType) {
    return NextResponse.json({ error: 'Nicht unterstütztes Format. Bitte PDF, DOCX, JPG oder PNG.' }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'Datei zu groß (max. 10 MB)' }, { status: 400 });
  }

  // Lead validieren (Live-DB: fair_leads hat advisor_user_id, kein advisor_id-FK)
  const { data: lead, error: leadErr } = await admin
    .from('fair_leads')
    .select('id, advisor_user_id, fair_id, first_name')
    .eq('id', leadId)
    .maybeSingle();

  if (leadErr) {
    console.error('[quick-upload] Lead-Query Fehler:', leadErr.message);
    return NextResponse.json({ error: 'Lead-Query fehlgeschlagen: ' + leadErr.message }, { status: 500 });
  }
  if (!lead) {
    return NextResponse.json({ error: 'Lead nicht gefunden' }, { status: 404 });
  }
  // Hinweis: fair_id-Check entfernt — Quick-Upload funktioniert für alle Leads,
  // auch Messe-Leads, denn /cv-upload ist der einheitliche Upload-Endpoint geworden.

  try {
    const docId = crypto.randomUUID();
    const safeFilename = sanitizeFilename(file.name);
    const storagePath = `quick-leads/${leadId}/${docId}/${safeFilename}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await admin.storage
      .from('cv-documents')
      .upload(storagePath, buffer, { contentType: file.type });

    if (uploadError) {
      return NextResponse.json({ error: 'Upload fehlgeschlagen: ' + uploadError.message }, { status: 500 });
    }

    // CV-Document anlegen (user_id null erlaubt, advisor_user_id ist Owner-Ersatz via lead.advisor_user_id)
    const { data: doc, error: docError } = await admin.from('cv_documents').insert({
      lead_id: leadId,
      user_id: lead.advisor_user_id || null,
      storage_path: storagePath,
      file_name: file.name,
      file_type: fileType,
      file_size_bytes: file.size,
      is_current: true,
    }).select('id').single();

    if (docError) {
      return NextResponse.json({ error: 'DB-Fehler: ' + docError.message }, { status: 500 });
    }

    // cv_feedback Eintrag (KI-Analyse triggert der Berater später im Dashboard)
    await admin.from('cv_feedback').insert({
      cv_document_id: doc.id,
      fair_lead_id: leadId,
      status: 'draft',
    });

    // Lead-Status auf "analyzing" setzen
    await admin.from('fair_leads')
      .update({ status: 'analyzing', updated_at: new Date().toISOString() })
      .eq('id', leadId);

    // Analytics-Event
    admin.from('analytics_events').insert({
      event_name: 'quick_lead_cv_uploaded',
      metadata: { lead_id: leadId, doc_id: doc.id },
    }).then(() => {}, () => {});

    return NextResponse.json({ success: true, docId: doc.id });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Unbekannter Fehler' }, { status: 500 });
  }
}

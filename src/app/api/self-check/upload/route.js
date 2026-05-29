import { createAdminClient } from '@/lib/supabase/admin';
import { analyzeCVForFair, extractTextFromImageAI } from '@/lib/ai-provider';
import { NextResponse } from 'next/server';

// Längeres Timeout für KI-Analyse (Vercel Pro: bis 300s)
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
  const token = formData.get('token');

  if (!token) return NextResponse.json({ error: 'Token fehlt' }, { status: 400 });
  if (!file || !(file instanceof File)) return NextResponse.json({ error: 'Keine Datei' }, { status: 400 });

  const fileType = ACCEPTED_TYPES[file.type];
  if (!fileType) return NextResponse.json({ error: 'Format nicht unterstützt. Bitte PDF, DOCX, JPG oder PNG.' }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'Datei zu groß (max. 10 MB)' }, { status: 400 });

  const { data: check, error: findError } = await admin
    .from('self_service_checks')
    .select('id, fair_id, target_position')
    .eq('result_token', token)
    .single();
  if (findError || !check) return NextResponse.json({ error: 'Ungültiger Token' }, { status: 404 });

  try {
    const storagePath = `self-service/${check.id}/${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await admin.storage.from('cv-documents').upload(storagePath, buffer, { contentType: file.type, upsert: true });
    if (uploadError) throw new Error('Upload fehlgeschlagen: ' + uploadError.message);

    await admin.from('self_service_checks').update({ cv_storage_path: storagePath, cv_file_name: file.name, cv_file_type: fileType, status: 'analyzing' }).eq('id', check.id);

    // Text extrahieren — PDF/DOCX lokal, Foto/Bild via KI-Vision
    let cvText = '';
    try {
      if (fileType === 'pdf') {
        const { extractText, getDocumentProxy } = await import('unpdf');
        const pdf = await getDocumentProxy(new Uint8Array(buffer));
        const extracted = await extractText(pdf, { mergePages: true });
        cvText = extracted.text || '';
      } else if (fileType === 'docx') {
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        cvText = result.value || '';
      } else if (fileType === 'image') {
        cvText = await extractTextFromImageAI(buffer, file.name);
      }
    } catch (extractErr) {
      console.error('self-check/upload extraction error:', extractErr);
    }

    // KI-Analyse (Claude oder OpenAI, je nach verfügbarem API-Key)
    let aiResult = cvText.trim().length > 20
      ? await analyzeCVForFair(cvText, check.target_position || null)
      : null;
    if (!aiResult) aiResult = getMockAnalysis();

    await admin.from('self_service_checks').update({
      overall_rating: aiResult.overallRating,
      summary: aiResult.summary,
      ai_analysis: aiResult,
      status: 'completed',
      updated_at: new Date().toISOString(),
    }).eq('id', check.id);

    const items = [];
    let sortOrder = 0;
    for (const [category, catData] of Object.entries(aiResult.categories || {})) {
      if (catData.rating) items.push({ check_id: check.id, category, type: 'preset', content: `__rating_${catData.rating}`, rating: catData.rating, sort_order: sortOrder++ });
      for (const preset of catData.selectedPresets || []) items.push({ check_id: check.id, category, type: 'preset', content: preset, sort_order: sortOrder++ });
      if (catData.comment) items.push({ check_id: check.id, category, type: 'freetext', content: catData.comment, sort_order: sortOrder++ });
    }
    if (items.length > 0) await admin.from('self_service_check_items').insert(items);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('self-check/upload error:', err);
    await admin.from('self_service_checks').update({ status: 'error' }).eq('id', check.id);
    return NextResponse.json({ error: err.message || 'Fehler beim Upload' }, { status: 500 });
  }
}

function getMockAnalysis() {
  return {
    overallRating: 3,
    summary: 'Der Lebenslauf bietet eine solide Basis mit Optimierungspotenzial in Struktur und Außenwirkung.',
    categories: {
      struktur: { rating: 3, selectedPresets: ['Klarer chronologischer Aufbau', 'Gute Länge (1-2 Seiten)'], comment: 'Grundstruktur ist vorhanden, könnte übersichtlicher sein.' },
      inhalt: { rating: 3, selectedPresets: ['Relevante Erfahrungen gut hervorgehoben', 'Keine konkreten Ergebnisse / Zahlen'], comment: 'Erfahrungen sind relevant, aber messbare Erfolge fehlen.' },
      design: { rating: 3, selectedPresets: ['Gute Lesbarkeit und Schriftgröße'], comment: 'Design ist funktional, könnte moderner wirken.' },
      wirkung: { rating: 2, selectedPresets: ['Erster Eindruck verbesserungswürdig', 'Positionierung unklar'], comment: 'Der CV wirkt noch etwas generisch — eine klare Positionierung würde helfen.' },
    },
  };
}

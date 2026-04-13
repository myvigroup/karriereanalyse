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

const ANALYSIS_SYSTEM = `Du bist ein erfahrener Karrierecoach. Analysiere den Lebenslauf und gib strukturiertes Feedback.

Antworte NUR als valides JSON-Objekt ohne Markdown-Backticks. Format:
{
  "overallRating": 3,
  "summary": "2-3 Sätze Gesamteinschätzung",
  "categories": {
    "struktur": { "rating": 3, "selectedPresets": ["Klarer chronologischer Aufbau"], "comment": "Kurzer Kommentar" },
    "inhalt": { "rating": 3, "selectedPresets": ["Relevante Erfahrungen gut hervorgehoben"], "comment": "Kurzer Kommentar" },
    "design": { "rating": 3, "selectedPresets": ["Professionelles, modernes Layout"], "comment": "Kurzer Kommentar" },
    "wirkung": { "rating": 3, "selectedPresets": ["Starker erster Eindruck"], "comment": "Kurzer Kommentar" }
  }
}

Verfügbare Presets:
Struktur: "Klarer chronologischer Aufbau", "Chronologische Lücken vorhanden", "Übersichtliche Gliederung", "Zu unübersichtlich / überladen", "Kontaktdaten vollständig", "Kontaktdaten unvollständig", "Gute Länge (1-2 Seiten)", "Zu lang / zu kurz"
Inhalt: "Relevante Erfahrungen gut hervorgehoben", "Wichtige Erfahrungen fehlen oder sind versteckt", "Kompetenzen klar formuliert", "Kompetenzen zu vage beschrieben", "Messbare Erfolge genannt", "Keine konkreten Ergebnisse / Zahlen", "Gute Keyword-Optimierung", "Keywords für Zielbranche fehlen"
Design: "Professionelles, modernes Layout", "Layout veraltet oder unprofessionell", "Gute Lesbarkeit und Schriftgröße", "Schwer lesbar / zu kleine Schrift", "Konsistente Formatierung", "Inkonsistente Formatierung", "Angemessenes Foto", "Foto fehlt oder unvorteilhaft"
Wirkung: "Starker erster Eindruck", "Erster Eindruck verbesserungswürdig", "Persönlichkeit kommt rüber", "Wirkt austauschbar / generisch", "Klare Positionierung erkennbar", "Positionierung unklar", "Motivierender Gesamteindruck", "Gesamteindruck eher schwach"

Ratings 1-5. Sei ehrlich aber konstruktiv.`;

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

  const { data: check, error: findError } = await admin.from('self_service_checks').select('id, fair_id').eq('result_token', token).single();
  if (findError || !check) return NextResponse.json({ error: 'Ungültiger Token' }, { status: 404 });

  try {
    const storagePath = `self-service/${check.id}/${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await admin.storage.from('cv-documents').upload(storagePath, buffer, { contentType: file.type, upsert: true });
    if (uploadError) throw new Error('Upload fehlgeschlagen: ' + uploadError.message);

    await admin.from('self_service_checks').update({ cv_storage_path: storagePath, cv_file_name: file.name, cv_file_type: fileType, status: 'analyzing' }).eq('id', check.id);

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    let aiResult = apiKey ? await analyzeWithClaude(buffer, ext, fileType, apiKey) : null;
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

async function analyzeWithClaude(buffer, ext, fileType, apiKey) {
  const base64 = buffer.toString('base64');
  try {
    if (fileType === 'docx') {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value?.trim();
      if (!text || text.length < 20) return null;
      return await callClaude([{ type: 'text', text: `Analysiere diesen Lebenslauf:\n\n${text.substring(0, 8000)}\n\nAntworte NUR als JSON.` }], apiKey);
    }
    if (fileType === 'pdf') {
      const result = await callClaude([
        { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
        { type: 'text', text: 'Analysiere diesen Lebenslauf und antworte NUR als JSON.' },
      ], apiKey, true);
      if (result) return result;
    }
    const mediaType = ext === 'png' ? 'image/png' : 'image/jpeg';
    return await callClaude([
      { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
      { type: 'text', text: 'Analysiere diesen Lebenslauf und antworte NUR als JSON.' },
    ], apiKey);
  } catch (e) {
    console.error('analyzeWithClaude error:', e);
    return null;
  }
}

async function callClaude(content, apiKey, withPdfBeta = false) {
  try {
    const headers = { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' };
    if (withPdfBeta) headers['anthropic-beta'] = 'pdfs-2024-09-25';
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers,
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 2500, system: ANALYSIS_SYSTEM, messages: [{ role: 'user', content }] }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    const clean = text.replace(/```json[\s\S]*?```|```[\s\S]*?```/g, m => m.replace(/```json|```/g, '')).trim();
    return JSON.parse(clean);
  } catch { return null; }
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

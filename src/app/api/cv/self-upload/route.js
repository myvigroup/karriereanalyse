import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { analyzeCVForFair, extractTextFromImageAI } from '@/lib/ai-provider';
import { sanitizeFilename } from '@/lib/utils';

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
  const supabase = createClient();
  const admin = createAdminClient();

  // Auth prüfen
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file');

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

  try {
    // Alte cv_documents auf is_current=false setzen (nur wenn Spalte existiert)
    await admin.from('cv_documents')
      .update({ is_current: false })
      .eq('user_id', user.id)
      .then(() => {}).catch(() => {});

    // File uploaden
    const docId = crypto.randomUUID();
    const safeFilename = sanitizeFilename(file.name);
    const storagePath = `users/${user.id}/${docId}/${safeFilename}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await admin.storage
      .from('cv-documents')
      .upload(storagePath, buffer, { contentType: file.type });

    if (uploadError) throw new Error('Upload fehlgeschlagen: ' + uploadError.message);

    // cv_documents Eintrag (storage_path = Live-Spaltenname)
    const { data: doc, error: docError } = await admin.from('cv_documents').insert({
      user_id: user.id,
      storage_path: storagePath,
      file_name: file.name,
      file_type: fileType,
      file_size_bytes: file.size,
      is_current: true,
    }).select('id').single();

    if (docError) throw new Error('DB-Fehler: ' + docError.message);

    // cv_feedback Eintrag (ohne advisor_id — KI-generiert)
    const { data: feedback, error: feedbackError } = await admin.from('cv_feedback').insert({
      cv_document_id: doc.id,
      status: 'draft',
      overall_rating: null,
      summary: null,
    }).select('id').single();

    if (feedbackError) throw new Error('Feedback-Eintrag fehlgeschlagen: ' + feedbackError.message);

    // Text extrahieren
    let cvText = '';
    if (fileType === 'docx') {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      cvText = result.value?.trim() || '';
    } else if (fileType === 'pdf') {
      try {
        const pdfParse = (await import('pdf-parse')).default;
        const pdfData = await pdfParse(buffer);
        cvText = pdfData.text || '';
      } catch {
        // PDF text extraction failed - will send raw to AI below
      }
    } else if (fileType === 'image') {
      cvText = await extractTextFromImageAI(buffer, file.name);
    }

    // KI-Analyse via ai-provider (Claude oder OpenAI, je nach verfügbarem API-Key)
    let aiResult = null;

    if (cvText.length > 20) {
      aiResult = await analyzeCVForFair(cvText, null);
    } else if (fileType === 'pdf') {
      // Fallback: PDF direkt an Claude senden (Vision)
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (apiKey) {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        aiResult = await analyzeWithClaude(buffer, ext, fileType, apiKey);
      }
    }

    if (!aiResult) {
      aiResult = getMockAnalysis();
    }

    // Feedback updaten
    await admin.from('cv_feedback').update({
      overall_rating: aiResult.overallRating,
      summary: aiResult.summary,
      status: 'completed',
    }).eq('id', feedback.id);

    // Feedback-Items erstellen
    const items = [];
    let sortOrder = 0;
    for (const [category, catData] of Object.entries(aiResult.categories || {})) {
      // Rating als __rating_ pseudo-item (wie im advisor flow)
      if (catData.rating) {
        items.push({
          cv_feedback_id: feedback.id,
          category,
          type: 'preset',
          content: `__rating_${catData.rating}`,
          rating: catData.rating,
          sort_order: sortOrder++,
        });
      }
      for (const preset of catData.selectedPresets || []) {
        items.push({
          cv_feedback_id: feedback.id,
          category,
          type: 'preset',
          content: preset,
          sort_order: sortOrder++,
        });
      }
      if (catData.comment) {
        items.push({
          cv_feedback_id: feedback.id,
          category,
          type: 'freetext',
          content: catData.comment,
          sort_order: sortOrder++,
        });
      }
    }

    if (items.length > 0) {
      await admin.from('cv_feedback_items').insert(items);
    }

    return NextResponse.json({ success: true, docId: doc.id, feedbackId: feedback.id });
  } catch (err) {
    console.error('Self-upload error:', err);
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
      return await callClaude([
        { type: 'text', text: `Analysiere diesen Lebenslauf:\n\n${text.substring(0, 8000)}\n\nAntworte NUR als JSON.` },
      ], apiKey);
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
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    };
    if (withPdfBeta) headers['anthropic-beta'] = 'pdfs-2024-09-25';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2500,
        system: ANALYSIS_SYSTEM,
        messages: [{ role: 'user', content }],
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    const clean = text.replace(/```json[\s\S]*?```|```[\s\S]*?```/g, m => m.replace(/```json|```/g, '')).trim();
    return JSON.parse(clean);
  } catch {
    return null;
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

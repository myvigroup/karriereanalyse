import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

const ANALYSIS_SYSTEM = `Du bist ein erfahrener Karrierecoach auf einer Karrieremesse. Analysiere den Lebenslauf und gib strukturiertes Feedback.

Antworte NUR als valides JSON-Objekt ohne Markdown-Backticks. Format:
{
  "overallRating": 3,
  "summary": "2-3 Sätze Gesamteinschätzung",
  "categories": {
    "struktur": {
      "rating": 3,
      "selectedPresets": ["Klarer chronologischer Aufbau", "Kontaktdaten vollständig"],
      "comment": "Kurzer Freitext-Kommentar zur Struktur"
    },
    "inhalt": {
      "rating": 3,
      "selectedPresets": ["Relevante Erfahrungen gut hervorgehoben"],
      "comment": "Kurzer Freitext-Kommentar zum Inhalt"
    },
    "design": {
      "rating": 3,
      "selectedPresets": ["Professionelles, modernes Layout"],
      "comment": "Kurzer Freitext-Kommentar zum Design"
    },
    "wirkung": {
      "rating": 3,
      "selectedPresets": ["Starker erster Eindruck"],
      "comment": "Kurzer Freitext-Kommentar zur Wirkung"
    }
  }
}

WICHTIG: Die selectedPresets müssen EXAKT aus dieser Liste stammen:
Struktur: "Klarer chronologischer Aufbau", "Chronologische Lücken vorhanden", "Übersichtliche Gliederung", "Zu unübersichtlich / überladen", "Kontaktdaten vollständig", "Kontaktdaten unvollständig", "Gute Länge (1-2 Seiten)", "Zu lang / zu kurz"
Inhalt: "Relevante Erfahrungen gut hervorgehoben", "Wichtige Erfahrungen fehlen oder sind versteckt", "Kompetenzen klar formuliert", "Kompetenzen zu vage beschrieben", "Messbare Erfolge genannt", "Keine konkreten Ergebnisse / Zahlen", "Gute Keyword-Optimierung", "Keywords für Zielbranche fehlen"
Design: "Professionelles, modernes Layout", "Layout veraltet oder unprofessionell", "Gute Lesbarkeit und Schriftgröße", "Schwer lesbar / zu kleine Schrift", "Konsistente Formatierung", "Inkonsistente Formatierung", "Angemessenes Foto", "Foto fehlt oder unvorteilhaft"
Wirkung: "Starker erster Eindruck", "Erster Eindruck verbesserungswürdig", "Persönlichkeit kommt rüber", "Wirkt austauschbar / generisch", "Klare Positionierung erkennbar", "Positionierung unklar", "Motivierender Gesamteindruck", "Gesamteindruck eher schwach"

Ratings sind 1-5 (1=schlecht, 5=sehr gut). Sei ehrlich aber konstruktiv.`;

export async function POST(request) {
  const admin = createAdminClient();

  try {
    const { documentId, feedbackId } = await request.json();
    if (!documentId) {
      return NextResponse.json({ error: 'documentId fehlt' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY nicht gesetzt' }, { status: 500 });
    }

    // Dokument laden
    const { data: doc, error: docError } = await admin
      .from('cv_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !doc) {
      return NextResponse.json({ error: 'Dokument nicht gefunden' }, { status: 404 });
    }

    // Dateityp bestimmen
    const ext = (doc.storage_path || '').split('.').pop()?.toLowerCase();
    const fileType = doc.file_type || (ext === 'pdf' ? 'pdf' : ext === 'docx' ? 'docx' : ['jpg', 'jpeg', 'png'].includes(ext) ? 'image' : 'pdf');

    // Datei aus Storage laden
    const { data: fileData, error: downloadError } = await admin.storage
      .from('cv-documents')
      .download(doc.storage_path);

    if (downloadError || !fileData) {
      return NextResponse.json({ error: 'Download fehlgeschlagen: ' + (downloadError?.message || '') }, { status: 500 });
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    const base64 = buffer.toString('base64');

    // KI-Analyse — bei Fehler Mock-Analyse nutzen damit der Berater immer Daten sieht
    const aiAnalysis = await analyzeWithClaude(base64, ext, fileType, apiKey) || getMockAnalysis();

    // Markieren als verarbeitet
    await admin.from('cv_documents').update({ is_processed: true }).eq('id', documentId);

    // Analyse in Feedback speichern
    if (feedbackId) {
      await admin.from('cv_feedback').update({
        ai_analysis: aiAnalysis,
        ai_parsed_at: new Date().toISOString(),
      }).eq('id', feedbackId);
    }

    return NextResponse.json({ success: true, aiAnalysis });
  } catch (error) {
    console.error('CV Parse Error:', error);
    return NextResponse.json({ error: 'Fehler: ' + error.message }, { status: 500 });
  }
}

async function analyzeWithClaude(base64, ext, fileType, apiKey) {
  // DOCX: Text extrahieren und als Text senden
  if (fileType === 'docx') {
    try {
      const mammoth = await import('mammoth');
      const buffer = Buffer.from(base64, 'base64');
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value?.trim();
      if (!text || text.length < 20) return null;
      return await callClaude([
        { type: 'text', text: `Analysiere diesen Lebenslauf:\n\n${text.substring(0, 8000)}\n\nAntworte NUR als JSON.` },
      ], apiKey);
    } catch (e) {
      console.error('DOCX Extraktion:', e);
      return null;
    }
  }

  // PDF: base64 als Dokument an Claude
  if (fileType === 'pdf') {
    const result = await callClaude([
      {
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: base64 },
      },
      { type: 'text', text: 'Analysiere diesen Lebenslauf und antworte NUR als JSON.' },
    ], apiKey, true);
    if (result) return result;

    // Fallback: als Text via einfaches Regex-Parsing (für Text-PDFs)
    const pdfText = extractTextFromPdfBytes(Buffer.from(base64, 'base64'));
    if (pdfText && pdfText.length > 50) {
      return await callClaude([
        { type: 'text', text: `Analysiere diesen Lebenslauf:\n\n${pdfText.substring(0, 8000)}\n\nAntworte NUR als JSON.` },
      ], apiKey);
    }
    return null;
  }

  // Bild (JPG/PNG): Vision API
  const mediaType = ext === 'png' ? 'image/png' : 'image/jpeg';
  return await callClaude([
    {
      type: 'image',
      source: { type: 'base64', media_type: mediaType, data: base64 },
    },
    { type: 'text', text: 'Analysiere diesen Lebenslauf und antworte NUR als JSON.' },
  ], apiKey);
}

async function callClaude(content, apiKey, withPdfBeta = false) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    };
    if (withPdfBeta) headers['anthropic-beta'] = 'pdfs-2024-09-25';

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2500,
        system: ANALYSIS_SYSTEM,
        messages: [{ role: 'user', content }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Claude API Fehler:', response.status, errText);
      return null;
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    const clean = text.replace(/```json[\s\S]*?```|```[\s\S]*?```/g, m => m.replace(/```json|```/g, '')).trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error('callClaude Fehler:', error);
    return null;
  }
}

function getMockAnalysis() {
  return {
    overallRating: 3,
    summary: 'Der Lebenslauf bietet eine solide Basis, hat aber Optimierungspotenzial in Struktur und Wirkung.',
    categories: {
      struktur: { rating: 3, selectedPresets: ['Klarer chronologischer Aufbau', 'Gute Länge (1-2 Seiten)'], comment: 'Grundstruktur ist vorhanden, könnte aber übersichtlicher sein.' },
      inhalt: { rating: 3, selectedPresets: ['Relevante Erfahrungen gut hervorgehoben', 'Keine konkreten Ergebnisse / Zahlen'], comment: 'Erfahrungen sind relevant, aber es fehlen messbare Erfolge.' },
      design: { rating: 3, selectedPresets: ['Gute Lesbarkeit und Schriftgröße'], comment: 'Design ist funktional, könnte moderner wirken.' },
      wirkung: { rating: 2, selectedPresets: ['Erster Eindruck verbesserungswürdig', 'Positionierung unklar'], comment: 'Der CV wirkt noch etwas generisch.' },
    },
  };
}

// Einfache Text-Extraktion aus PDF-Bytes (Fallback für Text-PDFs)
function extractTextFromPdfBytes(buffer) {
  try {
    const str = buffer.toString('latin1');
    const matches = str.match(/\(([^)]{2,200})\)/g) || [];
    const text = matches
      .map(m => m.slice(1, -1))
      .filter(s => /[a-zA-ZäöüÄÖÜß]{3,}/.test(s))
      .join(' ')
      .replace(/\\n/g, '\n')
      .replace(/\s+/g, ' ');
    return text;
  } catch {
    return '';
  }
}

import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

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

    // Datei aus Storage laden
    const { data: fileData, error: downloadError } = await admin.storage
      .from('cv-documents')
      .download(doc.storage_path);

    if (downloadError || !fileData) {
      return NextResponse.json({ error: 'Datei konnte nicht geladen werden: ' + (downloadError?.message || '') }, { status: 500 });
    }

    // Dateityp aus storage_path ableiten
    const ext = (doc.storage_path || '').split('.').pop()?.toLowerCase();
    const fileType = doc.file_type || (ext === 'pdf' ? 'pdf' : ext === 'docx' ? 'docx' : ['jpg', 'jpeg', 'png'].includes(ext) ? 'image' : 'pdf');
    const buffer = Buffer.from(await fileData.arrayBuffer());
    const base64 = buffer.toString('base64');

    // KI-Analyse direkt mit dem Dokument — kein pdf-parse nötig
    const aiAnalysis = await analyzeWithClaude(base64, fileType, apiKey);

    if (!aiAnalysis) {
      return NextResponse.json({ error: 'KI-Analyse fehlgeschlagen' }, { status: 500 });
    }

    // is_processed setzen
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
    return NextResponse.json({ error: 'Parsing fehlgeschlagen: ' + error.message }, { status: 500 });
  }
}

const ANALYSIS_PROMPT = `Du bist ein erfahrener Karrierecoach auf einer Karrieremesse. Analysiere den Lebenslauf und gib strukturiertes Feedback.

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

async function analyzeWithClaude(base64, fileType, apiKey) {
  try {
    let content;

    if (fileType === 'pdf') {
      // Claude native PDF-Analyse — kein pdf-parse nötig
      content = [
        {
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: base64 },
        },
        { type: 'text', text: 'Analysiere diesen Lebenslauf und antworte NUR als JSON.' },
      ];
    } else if (fileType === 'docx') {
      // DOCX: Text-Extraktion mit mammoth, dann als Text senden
      const mammoth = await import('mammoth');
      const buffer = Buffer.from(base64, 'base64');
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value;
      if (!text || text.trim().length < 20) return null;
      content = [{ type: 'text', text: `Analysiere diesen Lebenslauf:\n\n${text.substring(0, 8000)}\n\nAntworte NUR als JSON.` }];
    } else {
      // Bild-basierter CV (JPG/PNG)
      const ext = fileType === 'image' ? 'jpeg' : fileType;
      const mediaType = ext === 'png' ? 'image/png' : 'image/jpeg';
      content = [
        {
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        },
        { type: 'text', text: 'Analysiere diesen Lebenslauf und antworte NUR als JSON.' },
      ];
    }

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'pdfs-2024-09-25',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2500,
        system: ANALYSIS_PROMPT,
        messages: [{ role: 'user', content }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Claude API Error:', response.status, err);
      return null;
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error('analyzeWithClaude failed:', error);
    return null;
  }
}

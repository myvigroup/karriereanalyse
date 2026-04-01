import { createAdminClient } from '@/lib/supabase/admin';
import { analyzeCVForFair } from '@/lib/ai-provider';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const admin = createAdminClient();

  try {
    const { documentId, feedbackId } = await request.json();
    if (!documentId) {
      return NextResponse.json({ error: 'documentId fehlt' }, { status: 400 });
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

    // Status auf processing setzen
    await admin.from('cv_documents').update({ extraction_status: 'processing' }).eq('id', documentId);

    // Datei aus Storage laden
    const { data: fileData, error: downloadError } = await admin.storage
      .from('cv-documents')
      .download(doc.file_path);

    if (downloadError || !fileData) {
      await admin.from('cv_documents').update({ extraction_status: 'failed' }).eq('id', documentId);
      return NextResponse.json({ error: 'Datei konnte nicht geladen werden' }, { status: 500 });
    }

    // Text extrahieren
    let extractedText = '';
    const buffer = Buffer.from(await fileData.arrayBuffer());

    if (doc.file_type === 'pdf') {
      const pdfParse = (await import('pdf-parse')).default;
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (doc.file_type === 'docx') {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (doc.file_type === 'image') {
      // Claude Vision API für Bilder
      extractedText = await extractTextFromImage(buffer, doc.file_name);
    }

    if (!extractedText || extractedText.trim().length < 20) {
      await admin.from('cv_documents').update({
        extraction_status: 'failed',
        extracted_text: extractedText || null,
      }).eq('id', documentId);
      return NextResponse.json({ error: 'Kein Text extrahiert', extractedText }, { status: 422 });
    }

    // Text speichern
    await admin.from('cv_documents').update({
      extracted_text: extractedText,
      extraction_status: 'success',
    }).eq('id', documentId);

    // KI-Analyse starten
    const aiAnalysis = await analyzeCVForFair(extractedText);

    // Analyse in Feedback speichern
    if (feedbackId && aiAnalysis) {
      await admin.from('cv_feedback').update({
        ai_analysis: aiAnalysis,
        ai_parsed_at: new Date().toISOString(),
      }).eq('id', feedbackId);
    }

    return NextResponse.json({
      success: true,
      extractedText: extractedText.substring(0, 500) + '...',
      aiAnalysis,
    });
  } catch (error) {
    console.error('CV Parse Error:', error);
    return NextResponse.json({ error: 'Parsing fehlgeschlagen: ' + error.message }, { status: 500 });
  }
}

// Claude Vision für Bild-basierte CVs
async function extractTextFromImage(buffer, filename) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return '';

  const base64 = buffer.toString('base64');
  const ext = filename.split('.').pop()?.toLowerCase();
  const mediaType = ext === 'png' ? 'image/png' : 'image/jpeg';

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64 },
            },
            {
              type: 'text',
              text: 'Extrahiere den kompletten Text aus diesem Lebenslauf-Bild. Gib nur den extrahierten Text zurück, keine Kommentare.',
            },
          ],
        }],
      }),
    });

    const data = await response.json();
    return data.content?.[0]?.text || '';
  } catch (error) {
    console.error('Vision extraction failed:', error);
    return '';
  }
}

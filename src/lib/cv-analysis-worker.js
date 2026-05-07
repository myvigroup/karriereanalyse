import { createAdminClient } from '@/lib/supabase/admin';
import { analyzeCVForFair, extractTextFromImageAI } from '@/lib/ai-provider';

/**
 * Fallback: send PDF directly to Claude (Vision) when pdf-parse fails.
 * Returns extracted text or null.
 */
async function extractPdfViaClaudeVision(buffer) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  try {
    const base64 = buffer.toString('base64');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'pdfs-2024-09-25',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: [
            { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
            { type: 'text', text: 'Extrahiere den kompletten Text aus diesem Lebenslauf-PDF. Nur den Text, keine Kommentare.' },
          ],
        }],
      }),
    });
    if (!response.ok) {
      console.error('[cv-analysis] Claude PDF vision error:', response.status, await response.text());
      return null;
    }
    const data = await response.json();
    return data.content?.[0]?.text || null;
  } catch (e) {
    console.error('[cv-analysis] Claude PDF vision exception:', e);
    return null;
  }
}

/**
 * Extracts text + runs AI analysis for a CV document.
 * Updates cv_documents.extraction_status and cv_feedback.ai_analysis.
 * Can be called from anywhere server-side (upload route, review page, retrigger endpoint).
 */
export async function runCVAnalysis({ documentId, feedbackId, targetPosition }) {
  const admin = createAdminClient();

  // Dokument laden
  const { data: doc, error: docError } = await admin
    .from('cv_documents')
    .select('*')
    .eq('id', documentId)
    .single();

  if (docError || !doc) {
    console.error('[cv-analysis] Document not found:', documentId);
    return { error: 'Dokument nicht gefunden' };
  }

  // Bereits erfolgreich analysiert → überspringen
  if (doc.extraction_status === 'success' && doc.extracted_text) {
    // Nur AI-Analyse erneut starten, falls noch kein Feedback vorhanden
    if (feedbackId) {
      const { data: existing } = await admin
        .from('cv_feedback')
        .select('ai_parsed_at, ai_analysis')
        .eq('id', feedbackId)
        .maybeSingle();

      if (existing?.ai_parsed_at) {
        return { success: true, skipped: true, aiAnalysis: existing.ai_analysis };
      }

      const aiAnalysis = await analyzeCVForFair(doc.extracted_text, targetPosition);
      if (aiAnalysis) {
        await admin.from('cv_feedback').update({
          ai_analysis: aiAnalysis,
          ai_parsed_at: new Date().toISOString(),
        }).eq('id', feedbackId);
      }
      return { success: true, aiAnalysis };
    }
    return { success: true, skipped: true };
  }

  // Status auf processing setzen
  await admin.from('cv_documents').update({ extraction_status: 'processing' }).eq('id', documentId);

  // Datei aus Storage laden
  const storagePath = doc.storage_path || doc.file_path;
  const { data: fileData, error: downloadError } = await admin.storage
    .from('cv-documents')
    .download(storagePath);

  if (downloadError || !fileData) {
    console.error('[cv-analysis] Download failed:', downloadError);
    await admin.from('cv_documents').update({ extraction_status: 'failed' }).eq('id', documentId);
    return { error: 'Datei konnte nicht geladen werden' };
  }

  // Text extrahieren
  let extractedText = '';
  const buffer = Buffer.from(await fileData.arrayBuffer());

  try {
    if (doc.file_type === 'pdf') {
      try {
        const pdfParse = (await import('pdf-parse')).default;
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text;
      } catch (pdfErr) {
        console.warn('[cv-analysis] pdf-parse failed, trying Claude Vision fallback:', pdfErr.message);
      }
      // If pdf-parse yielded too little, try Claude Vision fallback (scanned PDFs)
      if (!extractedText || extractedText.trim().length < 20) {
        console.log('[cv-analysis] Attempting Claude Vision PDF fallback');
        const visionText = await extractPdfViaClaudeVision(buffer);
        if (visionText && visionText.trim().length >= 20) {
          extractedText = visionText;
          console.log('[cv-analysis] Vision fallback succeeded, length:', visionText.length);
        }
      }
    } else if (doc.file_type === 'docx') {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (doc.file_type === 'image') {
      extractedText = await extractTextFromImageAI(buffer, doc.file_name);
    }
  } catch (extractErr) {
    console.error('[cv-analysis] Extraction error:', extractErr);
    await admin.from('cv_documents').update({ extraction_status: 'failed' }).eq('id', documentId);
    return { error: 'Textextraktion fehlgeschlagen: ' + extractErr.message };
  }

  if (!extractedText || extractedText.trim().length < 20) {
    await admin.from('cv_documents').update({
      extraction_status: 'failed',
      extracted_text: extractedText || null,
    }).eq('id', documentId);
    return { error: 'Zu wenig Text extrahiert — bitte Bild-Scan statt PDF hochladen oder KI-Analyse erneut starten' };
  }

  // Text speichern
  await admin.from('cv_documents').update({
    extracted_text: extractedText,
    extraction_status: 'success',
  }).eq('id', documentId);

  // KI-Analyse starten
  const aiAnalysis = await analyzeCVForFair(extractedText, targetPosition);
  console.log('[cv-analysis] aiAnalysis result:', aiAnalysis ? 'OK' : 'null/failed');

  if (feedbackId && aiAnalysis) {
    await admin.from('cv_feedback').update({
      ai_analysis: aiAnalysis,
      ai_parsed_at: new Date().toISOString(),
    }).eq('id', feedbackId);
  }

  return {
    success: true,
    extractedLength: extractedText.length,
    hasAiAnalysis: !!aiAnalysis,
    aiAnalysis,
  };
}


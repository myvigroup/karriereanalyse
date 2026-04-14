import { createAdminClient } from '@/lib/supabase/admin';
import { analyzeCVForFair, extractTextFromImageAI } from '@/lib/ai-provider';

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
        .select('ai_parsed_at')
        .eq('id', feedbackId)
        .maybeSingle();

      if (existing?.ai_parsed_at) {
        return { success: true, skipped: true };
      }

      const aiAnalysis = await analyzeCVForFair(doc.extracted_text, targetPosition);
      if (aiAnalysis) {
        await admin.from('cv_feedback').update({
          ai_analysis: aiAnalysis,
          ai_parsed_at: new Date().toISOString(),
        }).eq('id', feedbackId);
      }
      return { success: true };
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
      const pdfParse = (await import('pdf-parse')).default;
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
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
    return { error: 'Zu wenig Text extrahiert' };
  }

  // Text speichern
  await admin.from('cv_documents').update({
    extracted_text: extractedText,
    extraction_status: 'success',
  }).eq('id', documentId);

  // KI-Analyse starten
  const aiAnalysis = await analyzeCVForFair(extractedText, targetPosition);

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
  };
}


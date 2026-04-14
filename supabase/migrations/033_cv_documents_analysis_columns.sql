-- cv_documents: Spalten für Textextraktion und KI-Analyse
ALTER TABLE cv_documents
  ADD COLUMN IF NOT EXISTS extracted_text text,
  ADD COLUMN IF NOT EXISTS extraction_status text DEFAULT 'pending';

-- Index für schnelle Suche nach ausstehenden Analysen
CREATE INDEX IF NOT EXISTS idx_cv_documents_extraction_status
  ON cv_documents (extraction_status);

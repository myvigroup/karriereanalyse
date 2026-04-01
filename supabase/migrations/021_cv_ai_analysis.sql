-- =====================================================
-- MIGRATION 021: KI-basiertes CV-Parsing
-- Erweitert cv_documents + cv_feedback um AI-Felder
-- =====================================================

ALTER TABLE cv_documents ADD COLUMN IF NOT EXISTS extracted_text text;
ALTER TABLE cv_documents ADD COLUMN IF NOT EXISTS extraction_status text DEFAULT 'pending'
  CHECK (extraction_status IN ('pending', 'processing', 'success', 'failed'));

ALTER TABLE cv_feedback ADD COLUMN IF NOT EXISTS ai_analysis jsonb;
ALTER TABLE cv_feedback ADD COLUMN IF NOT EXISTS ai_parsed_at timestamptz;

-- CV-Feedback: advisor_id optional machen (für KI-Self-Service-Analyse)
ALTER TABLE cv_feedback ALTER COLUMN advisor_id DROP NOT NULL;

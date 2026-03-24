-- =============================================
-- Zielgruppen-Update: 5 → 4 Phasen
-- student → studierende
-- einsteiger → berufseinsteiger
-- professional → berufserfahren
-- investor → fuehrungskraft (merged)
-- fuehrungskraft bleibt fuehrungskraft
-- =============================================

UPDATE profiles SET phase = 'studierende' WHERE phase = 'student';
UPDATE profiles SET phase = 'berufseinsteiger' WHERE phase = 'einsteiger';
UPDATE profiles SET phase = 'berufserfahren' WHERE phase = 'professional';
UPDATE profiles SET phase = 'fuehrungskraft' WHERE phase = 'investor';

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_phase_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_phase_check
  CHECK (phase IN ('studierende', 'berufseinsteiger', 'berufserfahren', 'fuehrungskraft'));

ALTER TABLE profiles ALTER COLUMN phase SET DEFAULT 'berufseinsteiger';

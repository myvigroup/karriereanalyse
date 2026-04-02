-- Migration 024: Messeleiter-Flag in fair_advisors
-- Messeleiter sehen alle Leads ihrer Messe, Berater nur ihre eigenen

ALTER TABLE fair_advisors
  ADD COLUMN IF NOT EXISTS is_manager boolean DEFAULT false;

COMMENT ON COLUMN fair_advisors.is_manager IS
  'true = Messeleiter (sieht alle Leads), false = Berater (nur eigene Leads)';

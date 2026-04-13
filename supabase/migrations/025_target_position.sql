-- Zielstelle / Zielbereich für Messe-Leads
ALTER TABLE fair_leads ADD COLUMN IF NOT EXISTS target_position TEXT NULL;

COMMENT ON COLUMN fair_leads.target_position IS 'Zielstelle oder Zielbereich des Besuchers (z.B. "Kaufmann im Einzelhandel", "Marketing Manager")';

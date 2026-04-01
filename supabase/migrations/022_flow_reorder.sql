-- Migration 022: Email nullable in fair_leads (Flow-Umstellung)
-- Kontaktdaten werden jetzt nach dem CV-Check erfasst, nicht davor
ALTER TABLE fair_leads ALTER COLUMN email DROP NOT NULL;

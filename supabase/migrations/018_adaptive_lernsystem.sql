-- =============================================
-- Adaptives Lernsystem: Streak + XP Weakness Bonus
-- =============================================

-- Streak-System Spalten (falls noch nicht vorhanden)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_activity_date DATE;

-- XP-Log erweitern: Weakness-Bonus Flag
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'xp_log') THEN
    ALTER TABLE xp_log ADD COLUMN IF NOT EXISTS is_weakness_bonus BOOLEAN DEFAULT false;
  END IF;
END $$;

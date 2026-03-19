-- Phase 2: Erweiterungen & Optimierungen
-- Action Items für Masterclass
ALTER TABLE lesson_progress ADD COLUMN IF NOT EXISTS action_item text;
ALTER TABLE lesson_progress ADD COLUMN IF NOT EXISTS action_deadline timestamptz;

-- Win-Kategorien für Gehalts-Tagebuch
ALTER TABLE salary_log ADD COLUMN IF NOT EXISTS win_category text DEFAULT 'general';

-- SSI Score Tracking
CREATE TABLE IF NOT EXISTS ssi_scores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  score integer CHECK (score >= 0 AND score <= 100),
  recorded_at timestamptz DEFAULT now()
);
ALTER TABLE ssi_scores ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users see own SSI" ON ssi_scores FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Burnout Assessment
CREATE TABLE IF NOT EXISTS burnout_assessments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  answers jsonb NOT NULL,
  total_score integer NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE burnout_assessments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users see own burnout" ON burnout_assessments FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Finanzielle Rücklagen
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS monthly_expenses numeric DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS savings numeric DEFAULT 0;

-- Netzwerk Interaktions-Log
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS last_contacted_at timestamptz;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS relationship_strength integer DEFAULT 3 CHECK (relationship_strength >= 1 AND relationship_strength <= 5);

-- Werte-Assessment
CREATE TABLE IF NOT EXISTS value_assessments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  top_values jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE value_assessments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users see own values" ON value_assessments FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

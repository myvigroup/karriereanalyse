-- =============================================
-- PHASE 3 COMPLETE: DSGVO + Coach + Tour + Rate Limiting
-- (Ergänzung zu 006_phase3_interactive.sql)
-- =============================================

-- Tour & DSGVO Felder (profiles)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tour_completed boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tour_step integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cookie_consent boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dsgvo_consent_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS monthly_expenses numeric DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS savings numeric DEFAULT 0;

-- Lesson Progress Action Items (falls nicht aus 005)
ALTER TABLE lesson_progress ADD COLUMN IF NOT EXISTS action_item text;
ALTER TABLE lesson_progress ADD COLUMN IF NOT EXISTS action_deadline timestamptz;

-- Contacts Erweiterungen (falls nicht aus 005)
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS last_contacted_at timestamptz;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS relationship_strength integer DEFAULT 3;

-- Salary Log Erweiterungen
ALTER TABLE salary_log ADD COLUMN IF NOT EXISTS win_category text DEFAULT 'general';

-- Coach Notes
CREATE TABLE IF NOT EXISTS coach_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id uuid REFERENCES profiles(id),
  client_id uuid REFERENCES profiles(id),
  content text,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(coach_id, client_id)
);
ALTER TABLE coach_notes ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Coaches see own notes" ON coach_notes FOR ALL USING (auth.uid() = coach_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Rate Limit Log
CREATE TABLE IF NOT EXISTS rate_limit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  endpoint text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE rate_limit_log ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users log own" ON rate_limit_log FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Users read own" ON rate_limit_log FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
CREATE INDEX IF NOT EXISTS idx_rate_limit_user_endpoint ON rate_limit_log(user_id, endpoint, created_at DESC);

-- SSI Scores (falls nicht aus 005)
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

-- Burnout Assessments (falls nicht aus 005)
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

-- Phase 3: Interaktive Module, Gamification, Onboarding
-- Onboarding & Gamification Felder
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS industry text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_salary numeric;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS target_salary numeric;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS career_obstacle text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience_years integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_complete boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak_count integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_streak_date date;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_points integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mood text;

-- Lesson Erweiterungen
ALTER TABLE lesson_progress ADD COLUMN IF NOT EXISTS quiz_score integer;
ALTER TABLE lesson_progress ADD COLUMN IF NOT EXISTS quiz_answers jsonb;
ALTER TABLE lesson_progress ADD COLUMN IF NOT EXISTS practice_response text;
ALTER TABLE lesson_progress ADD COLUMN IF NOT EXISTS practice_completed boolean DEFAULT false;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS lesson_type text DEFAULT 'video';
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS quiz_data jsonb;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS practice_prompt text;

-- Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  event_name text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users track own events" ON analytics_events FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Admins see all events" ON analytics_events FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'coach'))
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Value Assessments Ranking Spalte (Tabelle existiert schon aus 005)
ALTER TABLE value_assessments ADD COLUMN IF NOT EXISTS ranking jsonb;

-- Salary Log Impact Score
ALTER TABLE salary_log ADD COLUMN IF NOT EXISTS impact_score integer DEFAULT 3;

-- LinkedIn Posts
CREATE TABLE IF NOT EXISTS linkedin_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  template_type text,
  content text NOT NULL,
  optimized_content text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE linkedin_posts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users see own posts" ON linkedin_posts FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

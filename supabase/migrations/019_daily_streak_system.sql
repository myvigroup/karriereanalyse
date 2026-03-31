-- ============================================================
-- 019: Daily Streak System — Karriere-Streak à la Duolingo
-- Tägliche Missionen, Meilensteine, Phoenix-Comeback
-- ============================================================

-- ── Profile-Erweiterungen ──
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phoenix_mode BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS phoenix_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reminder_time TIME DEFAULT '18:00',
  ADD COLUMN IF NOT EXISTS streak_restored_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS streak_freeze_used_this_week INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS weekend_shield BOOLEAN DEFAULT FALSE;

-- ── Daily Missions ──
CREATE TABLE IF NOT EXISTS public.daily_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mission_date DATE NOT NULL,
  mission_type TEXT NOT NULL CHECK (mission_type IN ('primary', 'bonus_1', 'bonus_2')),
  title TEXT NOT NULL,
  description TEXT,
  action_type TEXT NOT NULL CHECK (action_type IN ('lesson', 'reflection', 'coach', 'quiz', 'salary_search')),
  target_course_id UUID REFERENCES public.courses(id),
  target_lesson_id UUID,
  xp_reward INTEGER DEFAULT 50,
  xp_multiplier NUMERIC DEFAULT 1.0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, mission_date, mission_type)
);

ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own missions" ON public.daily_missions
  FOR ALL USING (auth.uid() = user_id);

-- ── Streak Milestones ──
CREATE TABLE IF NOT EXISTS public.streak_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  milestone_days INTEGER NOT NULL CHECK (milestone_days IN (3, 7, 14, 30, 60, 100, 365)),
  reached_at TIMESTAMPTZ DEFAULT NOW(),
  bonus_xp_awarded INTEGER DEFAULT 0,
  UNIQUE(user_id, milestone_days)
);

ALTER TABLE public.streak_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own milestones" ON public.streak_milestones
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System insert milestones" ON public.streak_milestones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── Indices ──
CREATE INDEX IF NOT EXISTS idx_daily_missions_user_date ON public.daily_missions(user_id, mission_date);
CREATE INDEX IF NOT EXISTS idx_streak_milestones_user ON public.streak_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_date ON public.activity_log(user_id, created_at);

-- ── Streak Milestone Achievements (Seed) ──
INSERT INTO public.achievements (id, slug, title, description, icon, category, xp_reward)
VALUES
  (gen_random_uuid(), 'streak-3', 'Erster Schritt', '3 Tage in Folge aktiv', '🏃', 'streak', 50),
  (gen_random_uuid(), 'streak-14', 'Karriere-Momentum', '14 Tage in Folge aktiv', '🚀', 'streak', 200),
  (gen_random_uuid(), 'streak-60', 'Karriere-Maschine', '60 Tage in Folge aktiv', '⚡', 'streak', 1000),
  (gen_random_uuid(), 'streak-100', 'Elite', '100 Tage in Folge aktiv', '💎', 'streak', 2500),
  (gen_random_uuid(), 'streak-365', 'Legende', '365 Tage in Folge aktiv', '🏆', 'streak', 5000),
  (gen_random_uuid(), 'phoenix-comeback', 'Phoenix', 'Nach Pause zurückgekommen und 3 Tage durchgehalten', '🔥', 'streak', 150)
ON CONFLICT (slug) DO NOTHING;

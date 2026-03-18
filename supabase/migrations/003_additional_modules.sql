-- ============================================================
-- KARRIERE-INSTITUT OS — Migration 003
-- Neue Module: Decision Engine, Networking CRM, Gehalts-Tagebuch,
-- Exit-Planer, Report-Sharing, Coaching-Momentum, Audio-Bridging
-- ============================================================

-- ============================================================
-- 1. ENTSCHEIDUNGS-KOMPASS (Decision Engine)
-- ============================================================
CREATE TABLE public.decision_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  answers JSONB NOT NULL, -- { questionId: answer }
  result TEXT NOT NULL, -- 'stay_negotiate', 'stay_grow', 'exit_active', 'exit_passive'
  result_label TEXT,
  result_description TEXT,
  recommended_module UUID REFERENCES public.courses(id),
  score_stay NUMERIC DEFAULT 0,
  score_exit NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.decision_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own decisions" ON decision_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Coaches read decisions" ON decision_sessions FOR SELECT USING (public.is_admin());

-- ============================================================
-- 2. NETWORKING CRM (Stakeholder-Map)
-- ============================================================
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT, -- mentor, headhunter, ex_boss, colleague, friend
  company TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  notes TEXT,
  relationship_strength INTEGER DEFAULT 3 CHECK (relationship_strength BETWEEN 1 AND 5),
  last_contact_date DATE,
  next_followup_date DATE,
  tags TEXT[], -- ['mentor', 'tech', 'finance']
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own contacts" ON contacts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Coaches read contacts" ON contacts FOR SELECT USING (public.is_admin());

-- ============================================================
-- 3. GEHALTS-TAGEBUCH (Salary Negotiation Log)
-- ============================================================
CREATE TABLE public.salary_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  event_type TEXT NOT NULL, -- 'annual_review', 'promotion', 'offer', 'counter_offer', 'raise', 'bonus'
  company TEXT,
  my_ask NUMERIC, -- Was ich gefordert habe
  their_offer NUMERIC, -- Was angeboten wurde
  final_result NUMERIC, -- Was am Ende rauskam
  notes TEXT,
  lessons_learned TEXT,
  coach_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.salary_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own salary log" ON salary_log FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Coaches read salary log" ON salary_log FOR SELECT USING (public.is_admin());
CREATE POLICY "Coaches give feedback" ON salary_log FOR UPDATE USING (public.is_admin());

-- ============================================================
-- 4. EXIT-STRATEGIE-PLANER
-- ============================================================
CREATE TABLE public.exit_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  current_employer TEXT,
  employment_start DATE,
  contract_type TEXT DEFAULT 'unbefristet', -- unbefristet, befristet, probezeit
  notice_period_months INTEGER DEFAULT 3,
  notice_deadline_day INTEGER DEFAULT 15, -- Zum 15. oder Ende des Monats
  annual_salary NUMERIC,
  years_employed NUMERIC,
  estimated_severance NUMERIC, -- Auto-calculated
  checklist JSONB DEFAULT '[]'::jsonb, -- [{id, label, done, category}]
  target_exit_date DATE,
  status TEXT DEFAULT 'planning', -- planning, negotiating, resigned, completed
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.exit_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own exit plan" ON exit_plans FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Coaches read exit plans" ON exit_plans FOR SELECT USING (public.is_admin());

-- ============================================================
-- 5. REPORT SHARING (Vertrauenspersonen)
-- ============================================================
CREATE TABLE public.shared_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  share_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  recipient_name TEXT,
  recipient_email TEXT,
  is_anonymized BOOLEAN DEFAULT FALSE,
  sections_visible TEXT[] DEFAULT ARRAY['analysis', 'priorities', 'market_value'],
  comments JSONB DEFAULT '[]'::jsonb, -- [{author, text, timestamp}]
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.shared_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own shares" ON shared_reports FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- Public read for shared links (via API route with token check)

-- ============================================================
-- 6. COACHING MOMENTUM & ACTIVITY LOG
-- ============================================================
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- lesson, analysis, application, document, login, salary_log, contact_added
  activity_label TEXT,
  reference_id UUID, -- FK to the relevant table
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own activity" ON activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System inserts activity" ON activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Coaches read activity" ON activity_log FOR SELECT USING (public.is_admin());

-- Momentum View: Days since last activity + streak
CREATE OR REPLACE VIEW public.user_momentum AS
SELECT
  p.id AS user_id,
  p.name,
  p.xp,
  p.phase,
  MAX(a.created_at) AS last_activity_at,
  EXTRACT(DAY FROM NOW() - MAX(a.created_at))::INTEGER AS days_inactive,
  COUNT(DISTINCT DATE(a.created_at)) FILTER (WHERE a.created_at > NOW() - INTERVAL '21 days') AS active_days_21d,
  CASE
    WHEN COUNT(DISTINCT DATE(a.created_at)) FILTER (WHERE a.created_at > NOW() - INTERVAL '21 days') >= 15 THEN 'in_flow'
    WHEN COUNT(DISTINCT DATE(a.created_at)) FILTER (WHERE a.created_at > NOW() - INTERVAL '21 days') >= 7 THEN 'active'
    WHEN MAX(a.created_at) > NOW() - INTERVAL '3 days' THEN 'recent'
    WHEN MAX(a.created_at) > NOW() - INTERVAL '7 days' THEN 'cooling'
    ELSE 'inactive'
  END AS momentum_status
FROM profiles p
LEFT JOIN activity_log a ON a.user_id = p.id
GROUP BY p.id, p.name, p.xp, p.phase;

-- ============================================================
-- 7. INTERVIEW BRIEFINGS (Gesprächs-Vorbereitung)
-- ============================================================
CREATE TABLE public.interview_briefings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  company_research JSONB, -- {glassdoor_score, recent_news[], culture_notes}
  predicted_questions TEXT[],
  star_stories JSONB, -- [{situation, task, action, result}]
  strengths_match TEXT[], -- Matched from analysis
  preparation_notes TEXT,
  generated_by TEXT DEFAULT 'ai', -- ai, manual
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.interview_briefings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own briefings" ON interview_briefings FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Coaches read briefings" ON interview_briefings FOR SELECT USING (public.is_admin());

-- ============================================================
-- 8. AFTER-COACHING ROI (Alumni Tracking)
-- ============================================================
CREATE TABLE public.alumni_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  checkin_date DATE DEFAULT CURRENT_DATE,
  current_salary NUMERIC,
  current_position TEXT,
  current_company TEXT,
  satisfaction_score INTEGER CHECK (satisfaction_score BETWEEN 1 AND 10),
  salary_increase_since_start NUMERIC,
  would_recommend BOOLEAN,
  testimonial TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.alumni_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own checkins" ON alumni_checkins FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read all checkins" ON alumni_checkins FOR SELECT USING (public.is_admin());

-- ============================================================
-- 9. AUDIO-BRIDGING (Extend lessons table)
-- ============================================================
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS audio_url TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS transcript TEXT;

-- ============================================================
-- 10. IMPOSTOR-SCORE (Extend profiles)
-- ============================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS impostor_score NUMERIC;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS self_assessment_gap NUMERIC; -- Difference self vs market

-- ============================================================
-- 11. LINKEDIN BRANDING
-- ============================================================
CREATE TABLE public.linkedin_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  linkedin_url TEXT,
  current_headline TEXT,
  suggested_headlines TEXT[],
  visibility_score INTEGER CHECK (visibility_score BETWEEN 0 AND 100),
  keyword_score INTEGER,
  network_score INTEGER,
  activity_score INTEGER,
  content_suggestions TEXT[],
  ai_feedback TEXT,
  analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.linkedin_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own linkedin" ON linkedin_analysis FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Coaches read linkedin" ON linkedin_analysis FOR SELECT USING (public.is_admin());

-- ============================================================
-- 12. ACTIVITY LOG TRIGGER (Auto-log on key actions)
-- ============================================================
CREATE OR REPLACE FUNCTION public.log_lesson_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completed = TRUE THEN
    INSERT INTO activity_log (user_id, activity_type, activity_label, reference_id, xp_earned)
    VALUES (NEW.user_id, 'lesson', 'Lektion abgeschlossen', NEW.lesson_id, 25);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_lesson_activity ON lesson_progress;
CREATE TRIGGER on_lesson_activity
  AFTER INSERT OR UPDATE ON lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.log_lesson_activity();

-- Exit plan auto-calculate severance
CREATE OR REPLACE FUNCTION public.calculate_severance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.annual_salary IS NOT NULL AND NEW.years_employed IS NOT NULL THEN
    NEW.estimated_severance := ROUND(NEW.annual_salary / 12 * 0.5 * NEW.years_employed);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calc_severance
  BEFORE INSERT OR UPDATE ON exit_plans
  FOR EACH ROW EXECUTE FUNCTION public.calculate_severance();

-- ============================================================
-- 13. DEFAULT EXIT CHECKLIST ITEMS
-- ============================================================
-- These will be inserted via the app when a user creates their exit plan
-- Categories: documents, finance, network, legal, mental

-- ============================================================
-- KARRIERE-INSTITUT OS — Datenbank-Schema
-- Next.js 14 + Supabase (Frankfurt)
-- Apple-Design: #CC1426 Akzent, #353A3B Text, #F7F7F7 BG
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('user', 'coach', 'admin');
CREATE TYPE user_phase AS ENUM ('pre_coaching', 'active', 'alumni', 'inactive');
CREATE TYPE doc_status AS ENUM ('missing', 'pending', 'accepted', 'rejected', 'feedback');
CREATE TYPE app_status AS ENUM ('research', 'applied', 'interview', 'assessment', 'offer', 'rejected', 'accepted');

-- ============================================================
-- 2. PROFILES (Zentrale Nutzerdaten)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_initials TEXT DEFAULT 'XX',
  role user_role DEFAULT 'user',
  phase user_phase DEFAULT 'pre_coaching',
  level INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  company TEXT,
  position TEXT,
  phone TEXT,
  current_salary NUMERIC,
  target_salary NUMERIC,
  career_goal TEXT,
  coach_id UUID REFERENCES public.profiles(id),
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Authenticated read profiles" ON profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins manage all profiles" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'coach'))
  );

-- ============================================================
-- 3. KARRIERE-ANALYSE (13 Kompetenzfelder)
-- ============================================================
CREATE TABLE public.competency_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE public.competency_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_id UUID REFERENCES public.competency_fields(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE public.analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  field_id UUID REFERENCES public.competency_fields(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL CHECK (score >= 0 AND score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, field_id)
);

CREATE TABLE public.analysis_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  prio_1_field UUID REFERENCES public.competency_fields(id),
  prio_2_field UUID REFERENCES public.competency_fields(id),
  prio_3_field UUID REFERENCES public.competency_fields(id),
  overall_score NUMERIC
);

ALTER TABLE public.competency_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competency_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads fields" ON competency_fields FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone reads questions" ON competency_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users manage own results" ON analysis_results FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Coaches read results" ON analysis_results FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'coach'))
);
CREATE POLICY "Users manage own sessions" ON analysis_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 4. MASTERCLASS (Kurse, Module, Lektionen)
-- ============================================================
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  competency_field_id UUID REFERENCES public.competency_fields(id),
  thumbnail_url TEXT,
  market_value_impact NUMERIC DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  exercise TEXT,
  video_url TEXT,
  lesson_type TEXT DEFAULT 'video', -- video, lesson, exercise
  duration_min INTEGER DEFAULT 10,
  market_value_impact NUMERIC DEFAULT 0,
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads published courses" ON courses FOR SELECT TO authenticated USING (is_published = true);
CREATE POLICY "Admins manage courses" ON courses FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Anyone reads modules" ON modules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage modules" ON modules FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Anyone reads lessons" ON lessons FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage lessons" ON lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- 5. FORTSCHRITT & XP
-- ============================================================
CREATE TABLE public.lesson_progress (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, lesson_id)
);

CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  xp_reward INTEGER DEFAULT 0,
  condition_type TEXT, -- manual, course_complete, xp_threshold, analysis_complete
  condition_value TEXT
);

CREATE TABLE public.user_badges (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own progress" ON lesson_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Coaches read progress" ON lesson_progress FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'coach'))
);
CREATE POLICY "Anyone reads badges" ON badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users read own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System manages badges" ON user_badges FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- 6. PRE-COACHING (Dokumenten-Safe)
-- ============================================================
CREATE TABLE public.career_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL, -- cv, reference, certificate, linkedin, cover_letter
  doc_label TEXT NOT NULL,
  status doc_status DEFAULT 'missing',
  file_path TEXT,
  file_name TEXT,
  feedback_note TEXT,
  ai_analysis JSONB,
  is_required BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  uploaded_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.career_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own docs" ON career_documents FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Coaches manage docs" ON career_documents FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'coach'))
);

-- ============================================================
-- 7. BEWERBUNGS-TRACKER (Kanban)
-- ============================================================
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position TEXT,
  salary_range TEXT,
  salary_offered NUMERIC,
  status app_status DEFAULT 'research',
  priority INTEGER DEFAULT 2 CHECK (priority BETWEEN 1 AND 3),
  notes TEXT,
  interview_date TIMESTAMPTZ,
  coach_feedback TEXT,
  company_url TEXT,
  contact_person TEXT,
  applied_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own apps" ON applications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Coaches read apps" ON applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'coach'))
);
CREATE POLICY "Coaches give feedback" ON applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'coach'))
);

-- ============================================================
-- 8. MARKTWERT-TRACKING
-- ============================================================
CREATE TABLE public.market_value_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  base_value NUMERIC NOT NULL,
  skill_bonus NUMERIC DEFAULT 0,
  total_value NUMERIC GENERATED ALWAYS AS (base_value + skill_bonus) STORED,
  lessons_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.market_value_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own market value" ON market_value_log FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Coaches read market value" ON market_value_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'coach'))
);

-- ============================================================
-- 9. COACHING SESSIONS & NOTES
-- ============================================================
CREATE TABLE public.coaching_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES public.profiles(id),
  session_date TIMESTAMPTZ,
  session_type TEXT DEFAULT 'video', -- video, phone, in_person
  notes TEXT,
  action_items JSONB,
  status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own sessions" ON coaching_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Coaches manage sessions" ON coaching_sessions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'coach'))
);

-- ============================================================
-- 10. HELPER FUNCTIONS
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'coach')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Auto-create profile on registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, name, avatar_initials, role, phase)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(
      NEW.raw_user_meta_data->>'first_name' || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      split_part(NEW.email, '@', 1)
    ),
    UPPER(
      LEFT(COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)), 1) ||
      LEFT(COALESCE(NEW.raw_user_meta_data->>'last_name', 'X'), 1)
    ),
    'user',
    'pre_coaching'
  );

  -- Auto-create required document entries
  INSERT INTO public.career_documents (user_id, doc_type, doc_label, is_required, sort_order) VALUES
    (NEW.id, 'cv', 'Lebenslauf (aktuell)', TRUE, 1),
    (NEW.id, 'certificate', 'Höchster Bildungsabschluss', TRUE, 2),
    (NEW.id, 'reference', 'Arbeitszeugnisse', FALSE, 3),
    (NEW.id, 'linkedin', 'LinkedIn-Profil URL', FALSE, 4),
    (NEW.id, 'cover_letter', 'Muster-Anschreiben', FALSE, 5);

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update market value when lesson completed
CREATE OR REPLACE FUNCTION public.update_market_value()
RETURNS TRIGGER AS $$
DECLARE
  v_impact NUMERIC;
  v_current_salary NUMERIC;
  v_total_bonus NUMERIC;
  v_lesson_count INTEGER;
BEGIN
  IF NEW.completed = TRUE THEN
    SELECT COALESCE(l.market_value_impact, 0) INTO v_impact
    FROM lessons l WHERE l.id = NEW.lesson_id;

    SELECT COALESCE(p.current_salary, 50000) INTO v_current_salary
    FROM profiles p WHERE p.id = NEW.user_id;

    SELECT COALESCE(SUM(l.market_value_impact), 0), COUNT(*)
    INTO v_total_bonus, v_lesson_count
    FROM lesson_progress lp
    JOIN lessons l ON l.id = lp.lesson_id
    WHERE lp.user_id = NEW.user_id AND lp.completed = TRUE;

    INSERT INTO market_value_log (user_id, date, base_value, skill_bonus, lessons_completed)
    VALUES (NEW.user_id, CURRENT_DATE, v_current_salary, v_total_bonus, v_lesson_count)
    ON CONFLICT (user_id, date) DO UPDATE SET
      skill_bonus = EXCLUDED.skill_bonus,
      lessons_completed = EXCLUDED.lessons_completed;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add unique constraint for market_value_log
ALTER TABLE public.market_value_log ADD CONSTRAINT market_value_log_user_date_unique UNIQUE (user_id, date);

CREATE TRIGGER on_lesson_completed
  AFTER INSERT OR UPDATE ON public.lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_market_value();

-- Update XP on lesson completion
CREATE OR REPLACE FUNCTION public.update_xp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completed = TRUE THEN
    UPDATE profiles SET xp = xp + 25 WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_xp_update
  AFTER INSERT OR UPDATE ON public.lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_xp();

-- ============================================================
-- 11. STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('career-documents', 'career-documents', false)
ON CONFLICT DO NOTHING;

CREATE POLICY "Users upload own docs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'career-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users read own docs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'career-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Coaches read all docs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'career-documents' AND public.is_admin());

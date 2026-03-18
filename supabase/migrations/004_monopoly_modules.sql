-- ============================================================
-- KARRIERE-INSTITUT OS — Migration 004
-- Monopol-Module: Gehaltsdatenbank, KI-Coach-Bot,
-- Zertifikate, Notifications, Organizations, Peer-Matching
-- ============================================================

-- ============================================================
-- 1. GEHALTSDATENBANK (Anonymisierte Marktdaten)
-- ============================================================
CREATE TABLE public.salary_benchmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  -- Anonymisierte Pflichtfelder
  job_title TEXT NOT NULL,
  industry TEXT NOT NULL,
  seniority TEXT NOT NULL CHECK (seniority IN ('junior', 'mid', 'senior', 'lead', 'head', 'director', 'c_level')),
  region TEXT NOT NULL, -- bundesland or stadt
  company_size TEXT CHECK (company_size IN ('1-50', '51-200', '201-1000', '1001-5000', '5000+')),
  years_experience INTEGER,
  education TEXT CHECK (education IN ('ausbildung', 'bachelor', 'master', 'promotion', 'mba', 'sonstige')),
  -- Gehaltsdaten
  base_salary NUMERIC NOT NULL,
  bonus NUMERIC DEFAULT 0,
  total_compensation NUMERIC GENERATED ALWAYS AS (base_salary + bonus) STORED,
  benefits TEXT[], -- ['firmenwagen', 'homeoffice', 'aktien', 'weiterbildung']
  satisfaction INTEGER CHECK (satisfaction BETWEEN 1 AND 10),
  -- Kontext
  is_after_coaching BOOLEAN DEFAULT FALSE, -- Gehalt NACH dem Karriere-Institut Coaching?
  previous_salary NUMERIC, -- Gehalt VOR Coaching (für ROI-Berechnung)
  data_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  -- Meta
  is_verified BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE, -- Für anonyme Benchmarks sichtbar
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.salary_benchmarks ENABLE ROW LEVEL SECURITY;

-- Jeder authentifizierte User kann anonymisierte Daten lesen
CREATE POLICY "Anyone reads anonymized benchmarks" ON salary_benchmarks
  FOR SELECT TO authenticated
  USING (is_public = TRUE);
-- User können eigene Einträge verwalten
CREATE POLICY "Users manage own benchmarks" ON salary_benchmarks
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
-- Admins sehen alles
CREATE POLICY "Admins full access benchmarks" ON salary_benchmarks
  FOR ALL USING (public.is_admin());

-- Aggregierte View für öffentliche Benchmarks (keine individuellen Daten!)
CREATE OR REPLACE VIEW public.salary_benchmark_stats AS
SELECT
  job_title,
  industry,
  seniority,
  region,
  company_size,
  education,
  data_year,
  COUNT(*) AS sample_size,
  ROUND(PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY total_compensation)) AS p25,
  ROUND(PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY total_compensation)) AS median,
  ROUND(PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY total_compensation)) AS p75,
  ROUND(AVG(total_compensation)) AS average,
  ROUND(AVG(satisfaction), 1) AS avg_satisfaction,
  COUNT(*) FILTER (WHERE is_after_coaching) AS coaching_count,
  ROUND(AVG(total_compensation) FILTER (WHERE is_after_coaching)) AS avg_after_coaching,
  ROUND(AVG(total_compensation) FILTER (WHERE NOT is_after_coaching)) AS avg_before_coaching
FROM salary_benchmarks
WHERE is_public = TRUE
GROUP BY job_title, industry, seniority, region, company_size, education, data_year
HAVING COUNT(*) >= 3; -- Mindestens 3 Einträge für Anonymität

-- ============================================================
-- 2. KI-COACHING-BOT (Chat-Verlauf)
-- ============================================================
CREATE TABLE public.coaching_chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Neues Gespräch',
  context_type TEXT DEFAULT 'general', -- general, negotiation, interview, career_change, conflict
  is_archived BOOLEAN DEFAULT FALSE,
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.coaching_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID REFERENCES public.coaching_chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB, -- {tokens_used, model, context_sources}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.coaching_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own chats" ON coaching_chats
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own messages" ON coaching_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM coaching_chats WHERE id = chat_id AND user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM coaching_chats WHERE id = chat_id AND user_id = auth.uid())
  );
CREATE POLICY "Coaches read chats" ON coaching_chats
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Coaches read messages" ON coaching_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM coaching_chats c WHERE c.id = chat_id AND public.is_admin())
  );

-- ============================================================
-- 3. ZERTIFIKATE (Karriere-Institut Certified Professional)
-- ============================================================
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  cert_type TEXT NOT NULL, -- 'career_analysis', 'masterclass_complete', 'negotiation_pro', 'certified_professional'
  title TEXT NOT NULL,
  description TEXT,
  score NUMERIC, -- Prüfungsergebnis
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '2 years'),
  certificate_number TEXT UNIQUE DEFAULT 'KI-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0'),
  pdf_url TEXT,
  is_public BOOLEAN DEFAULT TRUE, -- Auf öffentlichem Profil sichtbar
  verified_by UUID REFERENCES public.profiles(id) -- Coach der verifiziert hat
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own certs" ON certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public certs readable" ON certificates FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Admins manage certs" ON certificates FOR ALL USING (public.is_admin());

-- ============================================================
-- 4. NOTIFICATIONS (Push & In-App)
-- ============================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'action', 'motivation', 'coaching', 'system', 'achievement')),
  link TEXT, -- Route zum Navigieren
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System creates notifications" ON notifications
  FOR INSERT WITH CHECK (TRUE); -- Trigger dürfen für alle User erstellen

-- Auto-Welcome Notification
CREATE OR REPLACE FUNCTION public.send_welcome_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, title, content, type, link) VALUES
    (NEW.id, 'Willkommen! 🚀', 'Starte jetzt mit dem Entscheidungs-Kompass — in 5 Minuten weißt du, wo du stehst.', 'action', '/strategy/decision'),
    (NEW.id, 'Tipp: Karriereanalyse', '65 Fragen, 10 Minuten — und du weißt genau, wo dein Potenzial liegt.', 'motivation', '/analyse');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_welcome ON profiles;
CREATE TRIGGER on_profile_welcome
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.send_welcome_notification();

-- ============================================================
-- 5. ORGANIZATIONS (B2B Multi-Tenant)
-- ============================================================
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT, -- z.B. 'siemens.com' für Auto-Zuordnung
  logo_url TEXT,
  primary_color TEXT DEFAULT '#CC1426',
  max_seats INTEGER DEFAULT 50,
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
  admin_user_id UUID REFERENCES public.profiles(id),
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members read own org" ON organizations
  FOR SELECT TO authenticated USING (
    id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    OR public.is_admin()
  );
CREATE POLICY "Admins manage orgs" ON organizations FOR ALL USING (public.is_admin());

-- Profil-Erweiterung für Org-Zuordnung
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- Org-Dashboard View
CREATE OR REPLACE VIEW public.org_dashboard_stats AS
SELECT
  o.id AS org_id,
  o.name AS org_name,
  COUNT(p.id) AS member_count,
  ROUND(AVG(p.xp)) AS avg_xp,
  ROUND(AVG(ar.score)) AS avg_analysis_score,
  COUNT(lp.lesson_id) FILTER (WHERE lp.completed) AS total_lessons_completed
FROM organizations o
LEFT JOIN profiles p ON p.organization_id = o.id
LEFT JOIN analysis_results ar ON ar.user_id = p.id
LEFT JOIN lesson_progress lp ON lp.user_id = p.id
GROUP BY o.id, o.name;

-- ============================================================
-- 6. PEER-MATCHING (Accountability-Paare)
-- ============================================================
CREATE TABLE public.peer_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_a UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_b UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'paused', 'ended')),
  match_reason TEXT, -- 'similar_goals', 'same_industry', 'complementary_skills'
  last_session_at TIMESTAMPTZ,
  session_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_a, user_b)
);

ALTER TABLE public.peer_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own matches" ON peer_matches
  FOR SELECT USING (auth.uid() = user_a OR auth.uid() = user_b);
CREATE POLICY "Users manage own matches" ON peer_matches
  FOR ALL USING (auth.uid() = user_a OR auth.uid() = user_b);

-- ============================================================
-- 7. COACHING ROI STATS (Aggregierte Marketing-Daten)
-- ============================================================
CREATE OR REPLACE VIEW public.coaching_roi_stats AS
SELECT
  COUNT(*) AS total_users,
  COUNT(*) FILTER (WHERE phase = 'alumni') AS alumni_count,
  ROUND(AVG(sb.total_compensation) FILTER (WHERE sb.is_after_coaching), 0) AS avg_salary_after,
  ROUND(AVG(sb.total_compensation) FILTER (WHERE NOT sb.is_after_coaching), 0) AS avg_salary_before,
  ROUND(
    (AVG(sb.total_compensation) FILTER (WHERE sb.is_after_coaching) -
     AVG(sb.total_compensation) FILTER (WHERE NOT sb.is_after_coaching)) /
    NULLIF(AVG(sb.total_compensation) FILTER (WHERE NOT sb.is_after_coaching), 0) * 100
  , 1) AS avg_salary_increase_pct,
  COUNT(DISTINCT sb.user_id) AS benchmark_contributors
FROM profiles p
LEFT JOIN salary_benchmarks sb ON sb.user_id = p.id;

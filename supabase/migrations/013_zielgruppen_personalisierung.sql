-- =============================================
-- Zielgruppen-Personalisierung: Neue Spalten + Tabellen
-- Phase, Lerntyp, WPM-Tracking, User Preferences
-- =============================================

-- Neue Spalten in profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phase TEXT DEFAULT 'einsteiger'
  CHECK (phase IN ('student', 'einsteiger', 'professional', 'fuehrungskraft', 'investor'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lerntyp TEXT
  CHECK (lerntyp IN ('visuell', 'auditiv', 'lesen_schreiben', 'kinaesthetisch'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wpm_start INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wpm_current INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_learn_minutes INTEGER DEFAULT 15;

-- User Preferences (individuelle Modul-Priorisierung)
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_slug TEXT NOT NULL,
  priority_level INTEGER DEFAULT 1 CHECK (priority_level BETWEEN 1 AND 3),
  is_bookmarked BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  last_interaction TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, module_slug)
);

CREATE INDEX IF NOT EXISTS idx_user_prefs_user ON user_preferences(user_id);

-- WPM History (Fortschritts-Tracking über Zeit)
CREATE TABLE IF NOT EXISTS wpm_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  wpm INTEGER NOT NULL,
  verstaendnis_score INTEGER DEFAULT 0,
  test_typ TEXT DEFAULT 'standard',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wpm_user ON wpm_history(user_id);

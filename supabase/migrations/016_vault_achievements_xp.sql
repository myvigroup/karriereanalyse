-- =============================================
-- MONOPOL-BRAND: Vault, Achievements & XP-System
-- Das "External Brain" + Gamification-Fundament
-- =============================================

-- 1. DIE VAULT: Das Archiv für wertvolle Business-Insights
CREATE TABLE IF NOT EXISTS user_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  source_module TEXT NOT NULL,
  entry_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  tags TEXT[],
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vault_user ON user_vault(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_created ON user_vault(user_id, created_at DESC);

-- 2. ACHIEVEMENTS: Visuelle Beweise der Meisterschaft
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  xp_reward INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. USER_ACHIEVEMENTS: Die Sammlung des Nutzers
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

-- 4. XP_LOG: Lückenlose XP-Historie
CREATE TABLE IF NOT EXISTS xp_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  source_module TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_xp_log_user ON xp_log(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_log_created ON xp_log(user_id, created_at DESC);

-- 5. Marktwert-XP Spalte in profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS marktwert_xp INTEGER DEFAULT 0;

-- 6. SEED: Basis-Achievements
INSERT INTO achievements (slug, title, description, icon, category, xp_reward) VALUES
('first-analysis', 'Karriere-Blutbild', 'Erste Karriere-Analyse abgeschlossen', '🔬', 'milestone', 200),
('first-course', 'Erster Kurs', 'Ein E-Learning komplett abgeschlossen', '📚', 'milestone', 500),
('three-courses', 'Wissensdurstig', '3 E-Learnings abgeschlossen', '🎓', 'milestone', 1000),
('all-courses', 'Lern-Architekt', 'Alle 6 E-Learnings abgeschlossen', '🏛️', 'milestone', 5000),
('boss-slayer', 'Boss-Bezwinger', '5 Boss-Fights gewonnen', '⚔️', 'combat', 500),
('boss-master', 'Endgegner', 'Alle 20 Boss-Fights gewonnen', '👑', 'combat', 2000),
('wpm-350', 'Speed-Aufsteiger', '350 WPM im Lesetest erreicht', '🚀', 'speed', 300),
('wpm-500', 'Speed-Reader', '500 WPM im Lesetest erreicht', '⚡', 'speed', 500),
('wpm-700', 'Elite-Leser', '700 WPM im Lesetest erreicht', '👑', 'speed', 1000),
('streak-7', 'Woche am Stück', '7 Tage in Folge aktiv', '🔥', 'streak', 200),
('streak-30', 'Monats-Krieger', '30 Tage in Folge aktiv', '💪', 'streak', 1000),
('streak-90', 'Unaufhaltsam', '90 Tage in Folge aktiv', '🏆', 'streak', 3000),
('vault-10', 'Sammler', '10 Einträge in der Schatzkammer', '💎', 'vault', 300),
('vault-50', 'Archivar', '50 Einträge in der Schatzkammer', '🗄️', 'vault', 1000),
('vault-100', 'External Brain', '100 Einträge in der Schatzkammer', '🧠', 'vault', 3000),
('network-20', 'Netzwerker', '20 Kontakte im CRM eingetragen', '🤝', 'networking', 300),
('ghost-10', 'Dickes Fell', '10 Networking-Absagen überstanden', '👻', 'networking', 200),
('ghost-25', 'Unerschütterlich', '25 Networking-Absagen überstanden', '💎', 'networking', 500)
ON CONFLICT (slug) DO NOTHING;

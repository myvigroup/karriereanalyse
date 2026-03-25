-- ══════════════════════════════════════════════════════════════
-- KOMPLETT-MIGRATION 009-018
-- Alle E-Learnings, Zielgruppen, Vault, XP, Streaks
--
-- ANLEITUNG:
-- 1. Öffne Supabase SQL Editor
-- 2. Kopiere dieses GESAMTE Script
-- 3. Drücke Run
-- 4. Am Ende siehst du die Verifikation
--
-- INHALT:
-- 009: 6 E-Learning Kurse (Basis-Module + Lessons)
-- 010: Module Restructure (Kommunikation + Prio erweitert)
-- 011: Speedreading (15 Module, ~45 Lessons)
-- 012: Typgerechtes Lernen (16 Module, ~62 Lessons)
-- 013: Zielgruppen-Personalisierung (Phase, Lerntyp, WPM)
-- 014: Work-Life-Balance (16 Module, ~62 Lessons)
-- 015: Networking (18 Module, ~62 Lessons)
-- 016: Vault, Achievements, XP-System
-- 017: 4 Phasen Update (student→studierende etc.)
-- 018: Streak + XP Weakness Bonus
-- ══════════════════════════════════════════════════════════════

-- =============================================
-- Masterclass: Echte Kurse mit Modulen
-- =============================================

-- Spalte für Kompetenz-Verknüpfung
ALTER TABLE courses ADD COLUMN IF NOT EXISTS competency_link text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS category text DEFAULT 'E-Learning';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS color text;

-- Lösche alte Placeholder-Kurse (falls vorhanden)
DELETE FROM lesson_progress WHERE lesson_id IN (SELECT id FROM lessons WHERE module_id IN (SELECT id FROM modules WHERE course_id IN (SELECT id FROM courses WHERE category = 'E-Learning' OR title IN ('Kommunikation', 'Work-Life-Balance', 'Networking', 'Speedreading', 'Typgerechtes Lernen', 'Prioritätenmanagement'))));
DELETE FROM lessons WHERE module_id IN (SELECT id FROM modules WHERE course_id IN (SELECT id FROM courses WHERE category = 'E-Learning' OR title IN ('Kommunikation', 'Work-Life-Balance', 'Networking', 'Speedreading', 'Typgerechtes Lernen', 'Prioritätenmanagement')));
DELETE FROM modules WHERE course_id IN (SELECT id FROM courses WHERE category = 'E-Learning' OR title IN ('Kommunikation', 'Work-Life-Balance', 'Networking', 'Speedreading', 'Typgerechtes Lernen', 'Prioritätenmanagement'));
DELETE FROM courses WHERE category = 'E-Learning' OR title IN ('Kommunikation', 'Work-Life-Balance', 'Networking', 'Speedreading', 'Typgerechtes Lernen', 'Prioritätenmanagement');

-- 6 E-Learning Kurse
INSERT INTO courses (id, title, description, icon, color, duration_minutes, is_published, sort_order, competency_link, category) VALUES
('c1000000-0000-0000-0000-000000000001', 'Kommunikation', 'Verständigung als Schlüssel zum Erfolg', '💬', '#2563EB', 55, true, 1, 'kommunikation', 'E-Learning'),
('c1000000-0000-0000-0000-000000000002', 'Work-Life-Balance', 'Leistung und Wohlbefinden im Einklang', '⚖️', '#10B981', 70, true, 2, 'selbstfuersorge', 'E-Learning'),
('c1000000-0000-0000-0000-000000000003', 'Networking', 'Kontakte knüpfen, Vertrauen aufbauen', '🤝', '#059669', 76, true, 3, 'sozialisationskompetenz', 'E-Learning'),
('c1000000-0000-0000-0000-000000000004', 'Speedreading', 'Schneller lesen, mehr behalten', '📖', '#F59E0B', 93, true, 4, 'kompetenzbewusstsein', 'E-Learning'),
('c1000000-0000-0000-0000-000000000005', 'Typgerechtes Lernen', 'Lerne so, wie dein Gehirn es braucht', '🧠', '#8B5CF6', 63, true, 5, 'selbstreflexion', 'E-Learning'),
('c1000000-0000-0000-0000-000000000006', 'Prioritätenmanagement', 'Nicht alles gleichzeitig, sondern das Richtige zuerst', '🎯', '#CC1426', 73, true, 6, 'prioritaeten', 'E-Learning');

-- Module für Kommunikation
INSERT INTO modules (id, course_id, title, sort_order) VALUES
('m1100000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Kommunikation', 1);

INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l1110000-0000-0000-0000-000000000001', 'm1100000-0000-0000-0000-000000000001', 'Grundlagen der Kommunikation', 1, 'video', 12),
('l1110000-0000-0000-0000-000000000002', 'm1100000-0000-0000-0000-000000000001', 'Notwendigkeit guter Kommunikation', 2, 'video', 10),
('l1110000-0000-0000-0000-000000000003', 'm1100000-0000-0000-0000-000000000001', 'Ansätze und Techniken erfolgreicher Kommunikation', 3, 'interactive', 15),
('l1110000-0000-0000-0000-000000000004', 'm1100000-0000-0000-0000-000000000001', 'Begeisterungsfähigkeit als Motor guter Kommunikation', 4, 'video', 10),
('l1110000-0000-0000-0000-000000000005', 'm1100000-0000-0000-0000-000000000001', 'Abschluss', 5, 'quiz', 8);

-- Module für Work-Life-Balance
INSERT INTO modules (id, course_id, title, sort_order) VALUES
('m2200000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 'Work-Life-Balance', 1);

INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l2210000-0000-0000-0000-000000000001', 'm2200000-0000-0000-0000-000000000001', 'Einführung und Überblick über die Module', 1, 'video', 5),
('l2210000-0000-0000-0000-000000000002', 'm2200000-0000-0000-0000-000000000001', 'Was ist Work-Life-Balance?', 2, 'video', 10),
('l2210000-0000-0000-0000-000000000003', 'm2200000-0000-0000-0000-000000000001', 'Entstehung von Zufriedenheit', 3, 'interactive', 12),
('l2210000-0000-0000-0000-000000000004', 'm2200000-0000-0000-0000-000000000001', 'Körper und Geist im Gleichgewicht', 4, 'video', 10),
('l2210000-0000-0000-0000-000000000005', 'm2200000-0000-0000-0000-000000000001', 'Work-Life-Planning', 5, 'exercise', 15),
('l2210000-0000-0000-0000-000000000006', 'm2200000-0000-0000-0000-000000000001', 'Einleitung theoretischer Abschlusstest', 6, 'video', 3),
('l2210000-0000-0000-0000-000000000007', 'm2200000-0000-0000-0000-000000000001', 'Theoretischer Abschlusstest', 7, 'quiz', 10),
('l2210000-0000-0000-0000-000000000008', 'm2200000-0000-0000-0000-000000000001', 'Zusammenfassung und Abschluss', 8, 'video', 5);

-- Module für Networking
INSERT INTO modules (id, course_id, title, sort_order) VALUES
('m3300000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003', 'Networking', 1);

INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l3310000-0000-0000-0000-000000000001', 'm3300000-0000-0000-0000-000000000001', 'Einführung', 1, 'video', 5),
('l3310000-0000-0000-0000-000000000002', 'm3300000-0000-0000-0000-000000000001', 'Networking — was ist das?', 2, 'video', 10),
('l3310000-0000-0000-0000-000000000003', 'm3300000-0000-0000-0000-000000000001', 'Warum ist Networking heutzutage so wichtig?', 3, 'video', 8),
('l3310000-0000-0000-0000-000000000004', 'm3300000-0000-0000-0000-000000000001', 'Wichtige Grundsätze für erfolgreiches und dauerhaftes Networking', 4, 'interactive', 12),
('l3310000-0000-0000-0000-000000000005', 'm3300000-0000-0000-0000-000000000001', 'Warum hilft es Expertenwissen zu haben?', 5, 'video', 8),
('l3310000-0000-0000-0000-000000000006', 'm3300000-0000-0000-0000-000000000001', 'Wie führe ich ein erfolgreiches Networking-Gespräch? — Theoretisch', 6, 'video', 10),
('l3310000-0000-0000-0000-000000000007', 'm3300000-0000-0000-0000-000000000001', 'Wie führe ich ein erfolgreiches Networking-Gespräch? — Praktisch', 7, 'exercise', 15),
('l3310000-0000-0000-0000-000000000008', 'm3300000-0000-0000-0000-000000000001', 'Abschluss', 8, 'quiz', 8);

-- Module für Speedreading
INSERT INTO modules (id, course_id, title, sort_order) VALUES
('m4400000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000004', 'Speedreading', 1);

INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l4410000-0000-0000-0000-000000000001', 'm4400000-0000-0000-0000-000000000001', 'Einführung ins Speedreading', 1, 'video', 8),
('l4410000-0000-0000-0000-000000000002', 'm4400000-0000-0000-0000-000000000001', 'Ermittlung der Lesegeschwindigkeit', 2, 'interactive', 10),
('l4410000-0000-0000-0000-000000000003', 'm4400000-0000-0000-0000-000000000001', 'Die Ermittlung deines Textverständnisses', 3, 'interactive', 8),
('l4410000-0000-0000-0000-000000000004', 'm4400000-0000-0000-0000-000000000001', 'Wie kannst du deine Lesegeschwindigkeit konkret verbessern?', 4, 'video', 12),
('l4410000-0000-0000-0000-000000000005', 'm4400000-0000-0000-0000-000000000001', 'Wie kannst du beim Lesen effektiv Zeit einsparen?', 5, 'video', 10),
('l4410000-0000-0000-0000-000000000006', 'm4400000-0000-0000-0000-000000000001', 'Wie halte ich die Lesegeschwindigkeit oben?', 6, 'exercise', 10),
('l4410000-0000-0000-0000-000000000007', 'm4400000-0000-0000-0000-000000000001', 'Der Sehspannentest und das periphere Sehen', 7, 'interactive', 12),
('l4410000-0000-0000-0000-000000000008', 'm4400000-0000-0000-0000-000000000001', 'Abschlusstest', 8, 'exercise', 5),
('l4410000-0000-0000-0000-000000000009', 'm4400000-0000-0000-0000-000000000001', 'Theoretischer Abschlusstest Einleitung', 9, 'video', 3),
('l4410000-0000-0000-0000-000000000010', 'm4400000-0000-0000-0000-000000000001', 'Theoretischer Abschlusstest', 10, 'quiz', 10),
('l4410000-0000-0000-0000-000000000011', 'm4400000-0000-0000-0000-000000000001', 'Zusammenfassung und Ausblick', 11, 'video', 5);

-- Module für Typgerechtes Lernen
INSERT INTO modules (id, course_id, title, sort_order) VALUES
('m5500000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000005', 'Typgerechtes Lernen', 1);

INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l5510000-0000-0000-0000-000000000001', 'm5500000-0000-0000-0000-000000000001', 'Einführung ins Typgerechte Lernen', 1, 'video', 8),
('l5510000-0000-0000-0000-000000000002', 'm5500000-0000-0000-0000-000000000001', 'Hirnbesitzer oder Hirnbenutzer?', 2, 'video', 12),
('l5510000-0000-0000-0000-000000000003', 'm5500000-0000-0000-0000-000000000001', 'Lernen und Vergessen', 3, 'interactive', 10),
('l5510000-0000-0000-0000-000000000004', 'm5500000-0000-0000-0000-000000000001', 'Wie lerne ich nun richtig?', 4, 'exercise', 15),
('l5510000-0000-0000-0000-000000000005', 'm5500000-0000-0000-0000-000000000001', 'Einleitung theoretischer Abschlusstest', 5, 'video', 3),
('l5510000-0000-0000-0000-000000000006', 'm5500000-0000-0000-0000-000000000001', 'Theoretischer Abschlusstest', 6, 'quiz', 10),
('l5510000-0000-0000-0000-000000000007', 'm5500000-0000-0000-0000-000000000001', 'Abschluss und Fazit', 7, 'video', 5);

-- Module für Prioritätenmanagement
INSERT INTO modules (id, course_id, title, sort_order) VALUES
('m6600000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000006', 'Prioritätenmanagement', 1);

INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l6610000-0000-0000-0000-000000000001', 'm6600000-0000-0000-0000-000000000001', 'Einführung ins Prioritätenmanagement', 1, 'video', 8),
('l6610000-0000-0000-0000-000000000002', 'm6600000-0000-0000-0000-000000000001', 'Warum Priorisierung über Erfolg entscheidet', 2, 'video', 10),
('l6610000-0000-0000-0000-000000000003', 'm6600000-0000-0000-0000-000000000001', 'Die Eisenhower-Matrix in der Praxis', 3, 'interactive', 12),
('l6610000-0000-0000-0000-000000000004', 'm6600000-0000-0000-0000-000000000001', 'Techniken gegen Aufschieberitis', 4, 'video', 10),
('l6610000-0000-0000-0000-000000000005', 'm6600000-0000-0000-0000-000000000001', 'Dein persönlicher Prioritäten-Plan', 5, 'exercise', 15),
('l6610000-0000-0000-0000-000000000006', 'm6600000-0000-0000-0000-000000000001', 'Einleitung Abschlusstest', 6, 'video', 3),
('l6610000-0000-0000-0000-000000000007', 'm6600000-0000-0000-0000-000000000001', 'Abschlusstest', 7, 'quiz', 10),
('l6610000-0000-0000-0000-000000000008', 'm6600000-0000-0000-0000-000000000001', 'Abschlussvideo', 8, 'video', 5);
-- ============================================================
-- 011: Module Restructure — Community, Contacts, Profiles
-- ============================================================

-- ─── Community Posts ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  post_type text DEFAULT 'text' CHECK (post_type IN ('text', 'success', 'question', 'poll', 'milestone')),
  content text NOT NULL,
  course_id uuid REFERENCES courses(id),
  poll_options jsonb,
  poll_votes jsonb DEFAULT '{}',
  badge_type text,
  likes integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Users create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own posts" ON community_posts FOR DELETE USING (auth.uid() = user_id);

-- ─── Community Comments ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES community_comments(id),
  content text NOT NULL,
  is_coach_answer boolean DEFAULT false,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads comments" ON community_comments FOR SELECT USING (true);
CREATE POLICY "Users create comments" ON community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── Community Likes ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES community_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id)
);
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own likes" ON community_likes FOR ALL USING (auth.uid() = user_id);

-- ─── Community Opt-in on Profiles ────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS community_visible boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS community_display_name text;

-- ─── Contacts Table Extensions ───────────────────────────────
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS xing_url text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS how_met text;

-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_course ON community_posts(course_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON community_comments(post_id, created_at);
-- =============================================
-- Speedreading E-Learning: 15 Module, 3 Boss-Fights, 10 Widgets, ~60 Lektionen
-- Kurs-ID: c1000000-0000-0000-0000-000000000004
-- =============================================

-- Lösche bestehende Speedreading-Daten
DELETE FROM lesson_progress WHERE lesson_id IN (
  SELECT id FROM lessons WHERE module_id IN (
    SELECT id FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000004'
  )
);
DELETE FROM lessons WHERE module_id IN (
  SELECT id FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000004'
);
DELETE FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000004';

-- Update Kursdauer auf ~230 Minuten
UPDATE courses SET duration_minutes = 230 WHERE id = 'c1000000-0000-0000-0000-000000000004';

-- =============================================
-- 15 MODULE
-- =============================================
INSERT INTO modules (id, course_id, title, sort_order) VALUES
('a4400000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000004', 'Selbstdiagnose: Wie schnell liest du wirklich?', 0),
('a4400000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000004', 'Warum wir langsam lesen', 1),
('a4400000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000004', 'Geschwindigkeit messen: Dein erster WPM-Test', 2),
('a4400000-0000-0000-0000-00000000000c', 'c1000000-0000-0000-0000-000000000004', 'Augengesundheit & Lese-Ergonomie', 3),
('a4400000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004', 'Die 4 Lese-Bremsen lösen', 4),
('a4400000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000004', 'Blickspanne erweitern', 5),
('a4400000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000004', 'Chunk-Reading: Wortgruppen statt Einzelwörter', 6),
('a4400000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000004', 'Skimming & Scanning meistern', 7),
('a4400000-0000-0000-0000-00000000000d', 'c1000000-0000-0000-0000-000000000004', 'Wann NICHT Speedreaden: Die Differenzierungs-Matrix', 8),
('a4400000-0000-0000-0000-00000000000e', 'c1000000-0000-0000-0000-000000000004', 'Der Relevanz-Filter: Die Kunst des Weglassens', 9),
('a4400000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000004', 'Textverständnis sichern & Notizen-System', 10),
('a4400000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000004', 'Digitales Lesen optimieren', 11),
('a4400000-0000-0000-0000-00000000000a', 'c1000000-0000-0000-0000-000000000004', 'Abschluss: Vorher/Nachher & Zertifikat', 12),
('a4400000-0000-0000-0000-00000000000b', 'c1000000-0000-0000-0000-000000000004', 'Führungskräfte: Speed-Briefings', 13),
('a4400000-0000-0000-0000-00000000000f', 'c1000000-0000-0000-0000-000000000004', 'Rückfall-Prävention & 30-Tage Challenge', 14);

-- =============================================
-- LEKTIONEN PRO MODUL
-- =============================================

-- Modul 0: Selbstdiagnose (sort_order=0)
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l4410000-0000-0000-0000-000000000101', 'a4400000-0000-0000-0000-000000000001', 'Selbstdiagnose: Dein Lese-Profil', 1, 'interactive', 5);

-- Modul 1: Warum wir langsam lesen (sort_order=1)
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l4410000-0000-0000-0000-000000000201', 'a4400000-0000-0000-0000-000000000002', 'Story: Die E-Mail die alles veränderte', 1, 'video', 4),
('l4410000-0000-0000-0000-000000000202', 'a4400000-0000-0000-0000-000000000002', 'Die 4 unsichtbaren Bremsen beim Lesen', 2, 'video', 8),
('l4410000-0000-0000-0000-000000000203', 'a4400000-0000-0000-0000-000000000002', 'Reflexion & Quiz', 3, 'quiz', 3);

-- Modul 2: Geschwindigkeit messen (sort_order=2)
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l4410000-0000-0000-0000-000000000301', 'a4400000-0000-0000-0000-000000000003', 'Atem-Übung: 30-Sekunden Fokus-Aktivierung', 1, 'interactive', 2),
('l4410000-0000-0000-0000-000000000302', 'a4400000-0000-0000-0000-000000000003', 'Dein erster WPM-Test', 2, 'interactive', 8),
('l4410000-0000-0000-0000-000000000303', 'a4400000-0000-0000-0000-000000000003', 'Dein Textverständnis messen', 3, 'interactive', 5);

-- Modul 3: Augengesundheit (sort_order=3)
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l4410000-0000-0000-0000-000000000401', 'a4400000-0000-0000-0000-00000000000c', 'Die 20-20-20 Regel: Augenpflege beim Lesen', 1, 'video', 4),
('l4410000-0000-0000-0000-000000000402', 'a4400000-0000-0000-0000-00000000000c', 'Ergonomie-Check: Licht, Abstand, Haltung, Blaulicht', 2, 'interactive', 4),
('l4410000-0000-0000-0000-000000000403', 'a4400000-0000-0000-0000-00000000000c', 'Augen-Yoga: 3 Übungen für zwischendurch', 3, 'exercise', 3),
('l4410000-0000-0000-0000-000000000404', 'a4400000-0000-0000-0000-00000000000c', 'Reflexion & Quiz', 4, 'quiz', 3);

-- Modul 4: Die 4 Lese-Bremsen (sort_order=4)
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l4410000-0000-0000-0000-000000000501', 'a4400000-0000-0000-0000-000000000004', 'Die 4 Bremsen: Subvokalisierung, Regression, Fixierung, Ablenkung', 1, 'video', 8),
('l4410000-0000-0000-0000-000000000502', 'a4400000-0000-0000-0000-000000000004', 'Pacer-Simulator: Führe deine Augen', 2, 'interactive', 5),
('l4410000-0000-0000-0000-000000000503', 'a4400000-0000-0000-0000-000000000004', 'Boss-Fight: Der Subvokalisierungs-Dämon', 3, 'interactive', 7);

-- Modul 5: Blickspanne erweitern (sort_order=5)
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l4410000-0000-0000-0000-000000000601', 'a4400000-0000-0000-0000-000000000005', 'Peripheres Sehen: So funktioniert deine Blickspanne', 1, 'video', 6),
('l4410000-0000-0000-0000-000000000602', 'a4400000-0000-0000-0000-000000000005', 'Sehspannen-Trainer: 4 Level', 2, 'interactive', 8),
('l4410000-0000-0000-0000-000000000603', 'a4400000-0000-0000-0000-000000000005', 'Reflexion & Quiz', 3, 'quiz', 4);

-- Modul 6: Chunk-Reading (sort_order=6)
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l4410000-0000-0000-0000-000000000701', 'a4400000-0000-0000-0000-000000000006', 'Von Wort-für-Wort zu Wortgruppen', 1, 'video', 5),
('l4410000-0000-0000-0000-000000000702', 'a4400000-0000-0000-0000-000000000006', 'Chunk-Reading Trainer', 2, 'interactive', 7),
('l4410000-0000-0000-0000-000000000703', 'a4400000-0000-0000-0000-000000000006', 'Reflexion & Quiz', 3, 'quiz', 3);

-- Modul 7: Skimming & Scanning (sort_order=7)
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l4410000-0000-0000-0000-000000000801', 'a4400000-0000-0000-0000-000000000007', 'Skimming vs. Scanning: Wann was?', 1, 'video', 6),
('l4410000-0000-0000-0000-000000000802', 'a4400000-0000-0000-0000-000000000007', 'Die OPIR-Methode für Sachtexte', 2, 'video', 5),
('l4410000-0000-0000-0000-000000000803', 'a4400000-0000-0000-0000-000000000007', 'Boss-Fight: Der Report-Berg', 3, 'interactive', 7);

-- Modul 8: Differenzierungs-Matrix (sort_order=8)
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l4410000-0000-0000-0000-000000000901', 'a4400000-0000-0000-0000-00000000000d', 'Nicht alles verdient Speedreading', 1, 'video', 5),
('l4410000-0000-0000-0000-000000000902', 'a4400000-0000-0000-0000-00000000000d', 'Die Lese-Modus Matrix: Drag & Drop', 2, 'interactive', 5),
('l4410000-0000-0000-0000-000000000903', 'a4400000-0000-0000-0000-00000000000d', 'Reflexion & Quiz', 3, 'quiz', 3);

-- Modul 9: Relevanz-Filter (sort_order=9)
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l4410000-0000-0000-0000-000000000a01', 'a4400000-0000-0000-0000-00000000000e', 'Story: Der CEO der aufhörte alles zu lesen', 1, 'video', 3),
('l4410000-0000-0000-0000-000000000a02', 'a4400000-0000-0000-0000-00000000000e', 'Die PARA-Methode: Was lese ich, was nicht?', 2, 'video', 5),
('l4410000-0000-0000-0000-000000000a03', 'a4400000-0000-0000-0000-00000000000e', 'Boss-Fight: Die Informationsflut', 3, 'interactive', 6),
('l4410000-0000-0000-0000-000000000a04', 'a4400000-0000-0000-0000-00000000000e', 'Praxis: Deine persönliche Lese-Diät erstellen', 4, 'exercise', 5),
('l4410000-0000-0000-0000-000000000a05', 'a4400000-0000-0000-0000-00000000000e', 'Reflexion & Quiz', 5, 'quiz', 3);

-- Modul 10: Textverständnis & Notizen (sort_order=10)
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l4410000-0000-0000-0000-000000000b01', 'a4400000-0000-0000-0000-000000000008', 'SQ3R: Die wissenschaftliche Lesemethode', 1, 'video', 5),
('l4410000-0000-0000-0000-000000000b02', 'a4400000-0000-0000-0000-000000000008', '4 Notizen-Methoden: 3-Satz, Cornell, Highlight, Teach-Back', 2, 'video', 5),
('l4410000-0000-0000-0000-000000000b03', 'a4400000-0000-0000-0000-000000000008', 'Praxis: Text lesen & Notiz erstellen', 3, 'exercise', 5);

-- Modul 11: Digitales Lesen (sort_order=11)
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l4410000-0000-0000-0000-000000000c01', 'a4400000-0000-0000-0000-000000000009', 'Digitales Lesen: E-Mails, PDFs, Bildschirm', 1, 'video', 6),
('l4410000-0000-0000-0000-000000000c02', 'a4400000-0000-0000-0000-000000000009', 'OPIR-Methode anwenden', 2, 'interactive', 5),
('l4410000-0000-0000-0000-000000000c03', 'a4400000-0000-0000-0000-000000000009', 'Reflexion & Quiz', 3, 'quiz', 4);

-- Modul 12: Abschluss (sort_order=12)
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l4410000-0000-0000-0000-000000000d01', 'a4400000-0000-0000-0000-00000000000a', 'WPM Re-Test: Lies gegen dein Ghost', 1, 'interactive', 8),
('l4410000-0000-0000-0000-000000000d02', 'a4400000-0000-0000-0000-00000000000a', 'Deine Shareable Progress Card', 2, 'interactive', 3),
('l4410000-0000-0000-0000-000000000d03', 'a4400000-0000-0000-0000-00000000000a', 'Abschlusstest', 3, 'quiz', 5);

-- Modul 13: Führungskräfte (sort_order=13)
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l4410000-0000-0000-0000-000000000e01', 'a4400000-0000-0000-0000-00000000000b', 'Speed-Briefings: 40 Seiten in 15 Minuten', 1, 'video', 5),
('l4410000-0000-0000-0000-000000000e02', 'a4400000-0000-0000-0000-00000000000b', 'Praxis: Report mit OPIR analysieren', 2, 'exercise', 5);

-- Modul 14: Rückfall-Prävention & Challenge (sort_order=14)
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l4410000-0000-0000-0000-000000000f01', 'a4400000-0000-0000-0000-00000000000f', '5 Warnsignale & Reset-Protokoll', 1, 'video', 4),
('l4410000-0000-0000-0000-000000000f02', 'a4400000-0000-0000-0000-00000000000f', '30-Tage Challenge starten', 2, 'exercise', 4);
-- =============================================
-- Typgerechtes Lernen E-Learning: 16 Module, 4 Boss-Fights, 14 Widgets, ~280 Min
-- Kurs-ID: c1000000-0000-0000-0000-000000000005
-- =============================================

-- Lösche bestehende Lernen-Daten
DELETE FROM lesson_progress WHERE lesson_id IN (
  SELECT id FROM lessons WHERE module_id IN (
    SELECT id FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000005'
  )
);
DELETE FROM lessons WHERE module_id IN (
  SELECT id FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000005'
);
DELETE FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000005';

-- Update Kursdauer
UPDATE courses SET duration_minutes = 280 WHERE id = 'c1000000-0000-0000-0000-000000000005';

-- =============================================
-- 16 MODULE
-- =============================================
INSERT INTO modules (id, course_id, title, sort_order) VALUES
('a5500000-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000005', 'Selbstdiagnose: Dein Lerntyp', 0),
('a5500000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000005', 'Hirnbesitzer oder Hirnbenutzer?', 1),
('a5500000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000005', 'Die 4 Lerntypen nach Vester', 2),
('a5500000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000005', 'Emotionen & Lernen: Angst, Neugier, Langeweile', 3),
('a5500000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000005', 'Lernen und Vergessen: Die Vergessenskurve', 4),
('a5500000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000005', 'Gehirngerechtes Lernen: Techniken die funktionieren', 5),
('a5500000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000005', 'Spaced Repetition & Aktives Erinnern', 6),
('a5500000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000005', 'Flow-State: Die Zone maximaler Leistung', 7),
('a5500000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000005', 'Schlaf, Bewegung & Kognition', 8),
('a5500000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000005', 'Lernumgebung & Digitale Ablenkungen', 9),
('a5500000-0000-0000-0000-00000000000a', 'c1000000-0000-0000-0000-000000000005', 'Die Kunst des Scheiterns: Fehler als Lern-Turbo', 10),
('a5500000-0000-0000-0000-00000000000b', 'c1000000-0000-0000-0000-000000000005', 'Transfer: Vom Wissen zum Tun', 11),
('a5500000-0000-0000-0000-00000000000c', 'c1000000-0000-0000-0000-000000000005', 'Lebenslanges Lernen: Karriere-Skill Nr. 1', 12),
('a5500000-0000-0000-0000-00000000000d', 'c1000000-0000-0000-0000-000000000005', 'Abschluss & 30-Tage Lern-Challenge', 13),
('a5500000-0000-0000-0000-00000000000e', 'c1000000-0000-0000-0000-000000000005', 'Führungskräfte: Wie Teams lernen', 14),
('a5500000-0000-0000-0000-00000000000f', 'c1000000-0000-0000-0000-000000000005', 'Rückfall-Prävention', 15);

-- =============================================
-- LEKTIONEN
-- =============================================

-- Modul 0: Selbstdiagnose
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l5510000-0000-0000-0000-000000000001', 'a5500000-0000-0000-0000-000000000000', 'Selbstdiagnose: Welcher Lerntyp bist du?', 1, 'interactive', 5);

-- Modul 1: Hirnbesitzer
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l5510000-0000-0000-0000-000000000101', 'a5500000-0000-0000-0000-000000000001', 'Story: Der Schüler der nie lernte — bis er verstand WIE', 1, 'video', 3),
('l5510000-0000-0000-0000-000000000102', 'a5500000-0000-0000-0000-000000000001', 'Dein Gehirn: 86 Milliarden Neuronen richtig nutzen', 2, 'video', 10),
('l5510000-0000-0000-0000-000000000103', 'a5500000-0000-0000-0000-000000000001', 'Mythen entlarvt: Multitasking, 10% Gehirn, Lerntypen-Dogma', 3, 'interactive', 8),
('l5510000-0000-0000-0000-000000000104', 'a5500000-0000-0000-0000-000000000001', 'Reflexion & Quiz', 4, 'quiz', 5);

-- Modul 2: Lerntypen
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l5510000-0000-0000-0000-000000000201', 'a5500000-0000-0000-0000-000000000002', 'Der Lerntyp-Test (VARK)', 1, 'interactive', 10),
('l5510000-0000-0000-0000-000000000202', 'a5500000-0000-0000-0000-000000000002', 'Dein persönlicher Lerntyp-Report', 2, 'interactive', 5),
('l5510000-0000-0000-0000-000000000203', 'a5500000-0000-0000-0000-000000000002', 'Strategien für JEDEN Typ', 3, 'video', 10),
('l5510000-0000-0000-0000-000000000204', 'a5500000-0000-0000-0000-000000000002', 'Reflexion & Quiz', 4, 'quiz', 5);

-- Modul 3: Emotionen & Lernen
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l5510000-0000-0000-0000-000000000301', 'a5500000-0000-0000-0000-000000000003', 'Warum du NICHTS lernst wenn du Angst hast', 1, 'video', 8),
('l5510000-0000-0000-0000-000000000302', 'a5500000-0000-0000-0000-000000000003', 'Neugier aktivieren: Die Frage VOR der Antwort', 2, 'video', 6),
('l5510000-0000-0000-0000-000000000303', 'a5500000-0000-0000-0000-000000000003', 'Boss-Fight: Der Langeweile-Drache', 3, 'interactive', 6),
('l5510000-0000-0000-0000-000000000304', 'a5500000-0000-0000-0000-000000000003', 'State-Management: In 60 Sekunden lernbereit', 4, 'interactive', 5),
('l5510000-0000-0000-0000-000000000305', 'a5500000-0000-0000-0000-000000000003', 'Reflexion & Quiz', 5, 'quiz', 5);

-- Modul 4: Vergessenskurve
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l5510000-0000-0000-0000-000000000401', 'a5500000-0000-0000-0000-000000000004', 'Die Ebbinghaus Vergessenskurve', 1, 'video', 8),
('l5510000-0000-0000-0000-000000000402', 'a5500000-0000-0000-0000-000000000004', 'Boss-Fight: Der Vergessens-Tsunami', 2, 'interactive', 6),
('l5510000-0000-0000-0000-000000000403', 'a5500000-0000-0000-0000-000000000004', 'Encoding: Infos ins Langzeitgedächtnis', 3, 'video', 8),
('l5510000-0000-0000-0000-000000000404', 'a5500000-0000-0000-0000-000000000004', 'Reflexion & Quiz', 4, 'quiz', 5);

-- Modul 5: Techniken
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l5510000-0000-0000-0000-000000000501', 'a5500000-0000-0000-0000-000000000005', 'Die Feynman-Methode: Erklären = Verstehen', 1, 'video', 8),
('l5510000-0000-0000-0000-000000000502', 'a5500000-0000-0000-0000-000000000005', 'Mind-Mapping & Sketchnotes', 2, 'interactive', 8),
('l5510000-0000-0000-0000-000000000503', 'a5500000-0000-0000-0000-000000000005', 'Pomodoro-Technik für Lern-Sessions', 3, 'video', 5),
('l5510000-0000-0000-0000-000000000504', 'a5500000-0000-0000-0000-000000000005', 'Praxis: Feynman-Methode anwenden', 4, 'exercise', 10),
('l5510000-0000-0000-0000-000000000505', 'a5500000-0000-0000-0000-000000000005', 'Reflexion & Quiz', 5, 'quiz', 5);

-- Modul 6: Spaced Repetition
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l5510000-0000-0000-0000-000000000601', 'a5500000-0000-0000-0000-000000000006', 'Wiederholen > Zusammenfassen', 1, 'video', 8),
('l5510000-0000-0000-0000-000000000602', 'a5500000-0000-0000-0000-000000000006', 'Spaced Repetition: Der Algorithmus gegen Vergessen', 2, 'video', 8),
('l5510000-0000-0000-0000-000000000603', 'a5500000-0000-0000-0000-000000000006', 'Active Recall vs. passives Durchlesen', 3, 'interactive', 8),
('l5510000-0000-0000-0000-000000000604', 'a5500000-0000-0000-0000-000000000006', 'Boss-Fight: Der Prüfungs-Panik-Boss', 4, 'interactive', 6),
('l5510000-0000-0000-0000-000000000605', 'a5500000-0000-0000-0000-000000000006', 'Reflexion & Quiz', 5, 'quiz', 5);

-- Modul 7: Flow
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l5510000-0000-0000-0000-000000000701', 'a5500000-0000-0000-0000-000000000007', 'Was ist Flow? (Csikszentmihalyi)', 1, 'video', 8),
('l5510000-0000-0000-0000-000000000702', 'a5500000-0000-0000-0000-000000000007', 'Die 4 Voraussetzungen für Flow', 2, 'video', 8),
('l5510000-0000-0000-0000-000000000703', 'a5500000-0000-0000-0000-000000000007', 'Praxis: Deine persönliche Flow-Formel', 3, 'exercise', 8),
('l5510000-0000-0000-0000-000000000704', 'a5500000-0000-0000-0000-000000000007', 'Reflexion & Quiz', 4, 'quiz', 5);

-- Modul 8: Schlaf & Bewegung
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l5510000-0000-0000-0000-000000000801', 'a5500000-0000-0000-0000-000000000008', 'Die Nacht entscheidet: Schlaf & Gedächtnis', 1, 'video', 8),
('l5510000-0000-0000-0000-000000000802', 'a5500000-0000-0000-0000-000000000008', '20 Min Bewegung vor dem Lernen (BDNF)', 2, 'video', 6),
('l5510000-0000-0000-0000-000000000803', 'a5500000-0000-0000-0000-000000000008', 'Praxis: Dein Pre-Learning Ritual', 3, 'exercise', 5),
('l5510000-0000-0000-0000-000000000804', 'a5500000-0000-0000-0000-000000000008', 'Reflexion & Quiz', 4, 'quiz', 5);

-- Modul 9: Lernumgebung
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l5510000-0000-0000-0000-000000000901', 'a5500000-0000-0000-0000-000000000009', 'Die perfekte Lernumgebung', 1, 'video', 8),
('l5510000-0000-0000-0000-000000000902', 'a5500000-0000-0000-0000-000000000009', 'Digital Detox beim Lernen', 2, 'video', 6),
('l5510000-0000-0000-0000-000000000903', 'a5500000-0000-0000-0000-000000000009', 'Musik beim Lernen: Hilfe oder Störung?', 3, 'interactive', 5),
('l5510000-0000-0000-0000-000000000904', 'a5500000-0000-0000-0000-000000000009', 'Reflexion & Quiz', 4, 'quiz', 5);

-- Modul 10: Fehler-Kultur
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l5510000-0000-0000-0000-000000000a01', 'a5500000-0000-0000-0000-00000000000a', 'Story: Der Schachgroßmeister der 10.000 Partien verlor', 1, 'video', 3),
('l5510000-0000-0000-0000-000000000a02', 'a5500000-0000-0000-0000-00000000000a', 'Desirable Difficulties: Schwer > Leicht', 2, 'video', 8),
('l5510000-0000-0000-0000-000000000a03', 'a5500000-0000-0000-0000-00000000000a', 'Die Fehler-Autopsie', 3, 'interactive', 8),
('l5510000-0000-0000-0000-000000000a04', 'a5500000-0000-0000-0000-00000000000a', 'Boss-Fight: Der Perfektionismus-Parasit', 4, 'interactive', 6),
('l5510000-0000-0000-0000-000000000a05', 'a5500000-0000-0000-0000-00000000000a', 'Reflexion & Quiz', 5, 'quiz', 5);

-- Modul 11: Transfer
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l5510000-0000-0000-0000-000000000b01', 'a5500000-0000-0000-0000-00000000000b', 'Warum 87% des Gelernten verloren geht', 1, 'video', 8),
('l5510000-0000-0000-0000-000000000b02', 'a5500000-0000-0000-0000-00000000000b', 'Die 24-Stunden-Regel & WENN-DANN Formel', 2, 'video', 6),
('l5510000-0000-0000-0000-000000000b03', 'a5500000-0000-0000-0000-00000000000b', 'Praxis: Was änderst du HEUTE?', 3, 'exercise', 8),
('l5510000-0000-0000-0000-000000000b04', 'a5500000-0000-0000-0000-00000000000b', 'Reflexion & Quiz', 4, 'quiz', 5);

-- Modul 12: Lebenslanges Lernen
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l5510000-0000-0000-0000-000000000c01', 'a5500000-0000-0000-0000-00000000000c', 'Story: Warum die besten CEOs nie aufhören zu lernen', 1, 'video', 3),
('l5510000-0000-0000-0000-000000000c02', 'a5500000-0000-0000-0000-00000000000c', 'Die T-shaped Skill Strategie', 2, 'video', 8),
('l5510000-0000-0000-0000-000000000c03', 'a5500000-0000-0000-0000-00000000000c', 'Dein 12-Monats Lernplan', 3, 'exercise', 10),
('l5510000-0000-0000-0000-000000000c04', 'a5500000-0000-0000-0000-00000000000c', 'Reflexion & Quiz', 4, 'quiz', 5);

-- Modul 13: Abschluss
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l5510000-0000-0000-0000-000000000d01', 'a5500000-0000-0000-0000-00000000000d', 'Zusammenfassung', 1, 'video', 5),
('l5510000-0000-0000-0000-000000000d02', 'a5500000-0000-0000-0000-00000000000d', 'Abschlusstest', 2, 'quiz', 10),
('l5510000-0000-0000-0000-000000000d03', 'a5500000-0000-0000-0000-00000000000d', '30-Tage Lern-Challenge starten', 3, 'interactive', 5);

-- Modul 14: Teams lernen
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l5510000-0000-0000-0000-000000000e01', 'a5500000-0000-0000-0000-00000000000e', 'Wissenstransfer & Lernkultur', 1, 'video', 10),
('l5510000-0000-0000-0000-000000000e02', 'a5500000-0000-0000-0000-00000000000e', 'Praxis: Lern-Routine für dein Team', 2, 'exercise', 8);

-- Modul 15: Rückfall-Prävention
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('l5510000-0000-0000-0000-000000000f01', 'a5500000-0000-0000-0000-00000000000f', '5 Warnsignale + Tägliche Lern-Routine', 1, 'video', 5),
('l5510000-0000-0000-0000-000000000f02', 'a5500000-0000-0000-0000-00000000000f', 'Dein Lern-Ritual: 20 Min pro Tag', 2, 'exercise', 5);
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
-- Work-Life-Balance E-Learning: 16 Module, 3 Boss-Fights, 7 Widgets, ~280 Min
-- Kurs-ID: c1000000-0000-0000-0000-000000000002

DELETE FROM lesson_progress WHERE lesson_id IN (
  SELECT id FROM lessons WHERE module_id IN (
    SELECT id FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000002'
  )
);
DELETE FROM lessons WHERE module_id IN (
  SELECT id FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000002'
);
DELETE FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000002';

UPDATE courses SET duration_minutes = 280 WHERE id = 'c1000000-0000-0000-0000-000000000002';

INSERT INTO modules (id, course_id, title, sort_order) VALUES
('a2200000-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000002', 'Selbstdiagnose: Dein Balance-Profil', 0),
('a2200000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 'Was ist Work-Life-Balance wirklich?', 1),
('a2200000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Die 4 Lebensbereiche: Das Lebensrad', 2),
('a2200000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', 'Stress verstehen: Akut vs. Chronisch', 3),
('a2200000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 'Grenzen setzen: Feierabend heißt Feierabend', 4),
('a2200000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000002', 'Energie-Management statt Zeitmanagement', 5),
('a2200000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002', 'Micro-Recovery: Erholung in Sekunden', 6),
('a2200000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000002', 'Körper & Geist: Schlaf, Bewegung, Ernährung', 7),
('a2200000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000002', 'Digitale Entgiftung & Revenge Bedtime', 8),
('a2200000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000002', 'Beziehungen pflegen: Das Beziehungs-Konto', 9),
('a2200000-0000-0000-0000-00000000000a', 'c1000000-0000-0000-0000-000000000002', 'Burnout-Prävention: Die 12 Stufen', 10),
('a2200000-0000-0000-0000-00000000000b', 'c1000000-0000-0000-0000-000000000002', 'Identity Shift: Du bist nicht dein Job', 11),
('a2200000-0000-0000-0000-00000000000c', 'c1000000-0000-0000-0000-000000000002', 'Abschluss & 30-Tage Balance-Challenge', 12),
('a2200000-0000-0000-0000-00000000000d', 'c1000000-0000-0000-0000-000000000002', 'Führungskräfte: Balance vorleben & Team schützen', 13),
('a2200000-0000-0000-0000-00000000000e', 'c1000000-0000-0000-0000-000000000002', 'Eltern-Track: Karriere & Familie', 14),
('a2200000-0000-0000-0000-00000000000f', 'c1000000-0000-0000-0000-000000000002', 'Rückfall-Prävention', 15);

-- Lessons for all modules (use lesson IDs starting with l2210000)
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
-- Modul 0
('l2210000-0000-0000-0000-000000000001', 'a2200000-0000-0000-0000-000000000000', 'Selbstdiagnose: Wie steht es um deine Balance?', 1, 'interactive', 5),
-- Modul 1
('l2210000-0000-0000-0000-000000000101', 'a2200000-0000-0000-0000-000000000001', 'Story: Der CEO der mit 38 zusammenbrach', 1, 'video', 3),
('l2210000-0000-0000-0000-000000000102', 'a2200000-0000-0000-0000-000000000001', 'Balance ≠ 50/50. Was es wirklich bedeutet.', 2, 'video', 10),
('l2210000-0000-0000-0000-000000000103', 'a2200000-0000-0000-0000-000000000001', 'Der Balance-Mythos: Perfektion ist unmöglich', 3, 'interactive', 6),
('l2210000-0000-0000-0000-000000000104', 'a2200000-0000-0000-0000-000000000001', 'Reflexion & Quiz', 4, 'quiz', 5),
-- Modul 2
('l2210000-0000-0000-0000-000000000201', 'a2200000-0000-0000-0000-000000000002', 'Das Lebensrad: 4 Bereiche bewerten', 1, 'interactive', 10),
('l2210000-0000-0000-0000-000000000202', 'a2200000-0000-0000-0000-000000000002', 'Wo bist du im Ungleichgewicht?', 2, 'video', 8),
('l2210000-0000-0000-0000-000000000203', 'a2200000-0000-0000-0000-000000000002', 'Praxis: Dein Lebensrad ausfüllen', 3, 'exercise', 8),
('l2210000-0000-0000-0000-000000000204', 'a2200000-0000-0000-0000-000000000002', 'Reflexion & Quiz', 4, 'quiz', 5),
-- Modul 3
('l2210000-0000-0000-0000-000000000301', 'a2200000-0000-0000-0000-000000000003', 'Eustress vs. Distress: Nicht jeder Stress ist schlecht', 1, 'video', 8),
('l2210000-0000-0000-0000-000000000302', 'a2200000-0000-0000-0000-000000000003', 'Akuter vs. Chronischer Stress: Der neurologische Unterschied', 2, 'video', 8),
('l2210000-0000-0000-0000-000000000303', 'a2200000-0000-0000-0000-000000000003', 'Dein Stress-Profil: Die Stress-Ampel', 3, 'interactive', 8),
('l2210000-0000-0000-0000-000000000304', 'a2200000-0000-0000-0000-000000000003', 'Reflexion & Quiz', 4, 'quiz', 5),
-- Modul 4
('l2210000-0000-0000-0000-000000000401', 'a2200000-0000-0000-0000-000000000004', 'Story: Die Frau die nie Feierabend hatte', 1, 'video', 3),
('l2210000-0000-0000-0000-000000000402', 'a2200000-0000-0000-0000-000000000004', 'Das Shutdown-Ritual: Arbeit beenden als Gewohnheit', 2, 'interactive', 8),
('l2210000-0000-0000-0000-000000000403', 'a2200000-0000-0000-0000-000000000004', 'Boss-Fight: Der Always-On Dämon', 3, 'interactive', 6),
('l2210000-0000-0000-0000-000000000404', 'a2200000-0000-0000-0000-000000000004', '5 Grenz-Skripte (Chef, Kollegen, Kunden)', 4, 'interactive', 5),
('l2210000-0000-0000-0000-000000000405', 'a2200000-0000-0000-0000-000000000004', 'Reflexion & Quiz', 5, 'quiz', 5),
-- Modul 5
('l2210000-0000-0000-0000-000000000501', 'a2200000-0000-0000-0000-000000000005', 'Die 4 Energie-Quellen: Physisch, Emotional, Mental, Spirituell', 1, 'video', 10),
('l2210000-0000-0000-0000-000000000502', 'a2200000-0000-0000-0000-000000000005', 'Dein Energie-Protokoll: Wann bist du voll, wann leer?', 2, 'interactive', 8),
('l2210000-0000-0000-0000-000000000503', 'a2200000-0000-0000-0000-000000000005', 'Recovery-Strategien für jeden Energie-Typ', 3, 'video', 8),
('l2210000-0000-0000-0000-000000000504', 'a2200000-0000-0000-0000-000000000005', 'Reflexion & Quiz', 4, 'quiz', 5),
-- Modul 6
('l2210000-0000-0000-0000-000000000601', 'a2200000-0000-0000-0000-000000000006', 'Warum Urlaub NICHT reicht: Die Wissenschaft der Micro-Recovery', 1, 'video', 8),
('l2210000-0000-0000-0000-000000000602', 'a2200000-0000-0000-0000-000000000006', '10 Micro-Recovery Techniken für den Arbeitsalltag', 2, 'interactive', 8),
('l2210000-0000-0000-0000-000000000603', 'a2200000-0000-0000-0000-000000000006', 'Praxis: Dein persönlicher Recovery-Fahrplan', 3, 'exercise', 5),
('l2210000-0000-0000-0000-000000000604', 'a2200000-0000-0000-0000-000000000006', 'Reflexion & Quiz', 4, 'quiz', 5),
-- Modul 7
('l2210000-0000-0000-0000-000000000701', 'a2200000-0000-0000-0000-000000000007', 'Schlaf-Hygiene: Die 7 Regeln', 1, 'video', 8),
('l2210000-0000-0000-0000-000000000702', 'a2200000-0000-0000-0000-000000000007', 'Bewegung als Karriere-Booster', 2, 'video', 6),
('l2210000-0000-0000-0000-000000000703', 'a2200000-0000-0000-0000-000000000007', 'Ernährung für mentale Performance', 3, 'video', 6),
('l2210000-0000-0000-0000-000000000704', 'a2200000-0000-0000-0000-000000000007', 'Reflexion & Quiz', 4, 'quiz', 5),
-- Modul 8
('l2210000-0000-0000-0000-000000000801', 'a2200000-0000-0000-0000-000000000008', 'Bildschirmzeit: Die harte Wahrheit', 1, 'video', 8),
('l2210000-0000-0000-0000-000000000802', 'a2200000-0000-0000-0000-000000000008', 'Revenge Bedtime Procrastination: Der stille Killer', 2, 'video', 8),
('l2210000-0000-0000-0000-000000000803', 'a2200000-0000-0000-0000-000000000008', 'Boss-Fight: Der Mitternachts-Scrolleur', 3, 'interactive', 6),
('l2210000-0000-0000-0000-000000000804', 'a2200000-0000-0000-0000-000000000008', 'Praxis: Dein 7-Tage Digital-Detox Plan', 4, 'exercise', 8),
('l2210000-0000-0000-0000-000000000805', 'a2200000-0000-0000-0000-000000000008', 'Reflexion & Quiz', 5, 'quiz', 5),
-- Modul 9
('l2210000-0000-0000-0000-000000000901', 'a2200000-0000-0000-0000-000000000009', 'Das Beziehungs-Konto: Einzahlungen & Abhebungen', 1, 'video', 8),
('l2210000-0000-0000-0000-000000000902', 'a2200000-0000-0000-0000-000000000009', 'Szenario: Karriere vs. Freundschaft', 2, 'scenario', 6),
('l2210000-0000-0000-0000-000000000903', 'a2200000-0000-0000-0000-000000000009', 'Praxis: 3 Menschen denen du DIESE WOCHE Danke sagst', 3, 'exercise', 5),
('l2210000-0000-0000-0000-000000000904', 'a2200000-0000-0000-0000-000000000009', 'Reflexion & Quiz', 4, 'quiz', 5),
-- Modul 10
('l2210000-0000-0000-0000-000000000a01', 'a2200000-0000-0000-0000-00000000000a', 'Die 12 Burnout-Stufen nach Freudenberger', 1, 'video', 10),
('l2210000-0000-0000-0000-000000000a02', 'a2200000-0000-0000-0000-00000000000a', 'Selbsttest: Auf welcher Stufe stehst du?', 2, 'interactive', 8),
('l2210000-0000-0000-0000-000000000a03', 'a2200000-0000-0000-0000-00000000000a', 'Notfall-Plan: Wenn die Ampel auf Rot steht', 3, 'interactive', 5),
('l2210000-0000-0000-0000-000000000a04', 'a2200000-0000-0000-0000-00000000000a', 'Reflexion & Quiz', 4, 'quiz', 5),
-- Modul 11
('l2210000-0000-0000-0000-000000000b01', 'a2200000-0000-0000-0000-00000000000b', 'Story: Der Manager der nicht wusste wer er OHNE Job ist', 1, 'video', 3),
('l2210000-0000-0000-0000-000000000b02', 'a2200000-0000-0000-0000-00000000000b', 'Du bist nicht dein Jobtitel: Identität jenseits der Karriere', 2, 'video', 8),
('l2210000-0000-0000-0000-000000000b03', 'a2200000-0000-0000-0000-00000000000b', 'Praxis: Wer bist du wenn niemand fragt was du beruflich machst?', 3, 'exercise', 8),
('l2210000-0000-0000-0000-000000000b04', 'a2200000-0000-0000-0000-00000000000b', 'Reflexion & Quiz', 4, 'quiz', 5),
-- Modul 12
('l2210000-0000-0000-0000-000000000c01', 'a2200000-0000-0000-0000-00000000000c', 'Zusammenfassung', 1, 'video', 5),
('l2210000-0000-0000-0000-000000000c02', 'a2200000-0000-0000-0000-00000000000c', 'Abschlusstest', 2, 'quiz', 10),
('l2210000-0000-0000-0000-000000000c03', 'a2200000-0000-0000-0000-00000000000c', '30-Tage Balance-Challenge starten', 3, 'interactive', 5),
-- Modul 13
('l2210000-0000-0000-0000-000000000d01', 'a2200000-0000-0000-0000-00000000000d', 'Balance vorleben: Warum dein Team dich kopiert', 1, 'video', 10),
('l2210000-0000-0000-0000-000000000d02', 'a2200000-0000-0000-0000-00000000000d', 'Szenario: Der Mitarbeiter am Limit', 2, 'scenario', 6),
('l2210000-0000-0000-0000-000000000d03', 'a2200000-0000-0000-0000-00000000000d', 'Praxis: Team-Rituale für gesunde Kultur', 3, 'exercise', 8),
-- Modul 14
('l2210000-0000-0000-0000-000000000e01', 'a2200000-0000-0000-0000-00000000000e', 'Die Doppelbelastung: Karriere UND Elternschaft', 1, 'video', 10),
('l2210000-0000-0000-0000-000000000e02', 'a2200000-0000-0000-0000-00000000000e', 'Strategien: Elternzeit, Teilzeit, flexible Modelle', 2, 'video', 8),
('l2210000-0000-0000-0000-000000000e03', 'a2200000-0000-0000-0000-00000000000e', 'Praxis: Dein Familien-Karriere-Plan', 3, 'exercise', 8),
-- Modul 15
('l2210000-0000-0000-0000-000000000f01', 'a2200000-0000-0000-0000-00000000000f', '5 Warnsignale + Wöchentlicher Balance-Check', 1, 'video', 5),
('l2210000-0000-0000-0000-000000000f02', 'a2200000-0000-0000-0000-00000000000f', 'Dein Sonntags-Ritual: Woche reflektieren', 2, 'exercise', 5);
-- Networking E-Learning: 18 Module, 4 Boss-Fights, 8 Widgets, ~310 Min
-- Kurs-ID: c1000000-0000-0000-0000-000000000003

DELETE FROM lesson_progress WHERE lesson_id IN (
  SELECT id FROM lessons WHERE module_id IN (
    SELECT id FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000003'
  )
);
DELETE FROM lessons WHERE module_id IN (
  SELECT id FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000003'
);
DELETE FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000003';

UPDATE courses SET duration_minutes = 310 WHERE id = 'c1000000-0000-0000-0000-000000000003';

-- 18 modules
INSERT INTO modules (id, course_id, title, sort_order) VALUES
('a3300000-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000003', 'Selbstdiagnose: Dein Networking-Profil', 0),
('a3300000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003', 'Die Networking-Wahrheit: 80% der Jobs werden nie ausgeschrieben', 1),
('a3300000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000003', 'Dein Netzwerk-Audit: Wen kennst du wirklich?', 2),
('a3300000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'Die Wert-zuerst Philosophie: Geben vor Nehmen', 3),
('a3300000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000003', 'Der erste Kontakt: Gespräche starten die bleiben', 4),
('a3300000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000003', 'LinkedIn-Mastery: Dein digitales Netzwerk', 5),
('a3300000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000003', 'Follow-Up: Die vergessene Superkraft', 6),
('a3300000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000003', 'Event-Networking: Konferenzen, Messen, After-Works', 7),
('a3300000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000003', 'Dein Kontakt-CRM: Beziehungen systematisch pflegen', 8),
('a3300000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000003', 'Mentoren & Sponsoren finden', 9),
('a3300000-0000-0000-0000-00000000000a', 'c1000000-0000-0000-0000-000000000003', 'Super-Connectors & Hub-Strategie', 10),
('a3300000-0000-0000-0000-00000000000b', 'c1000000-0000-0000-0000-000000000003', 'Abschluss & 30-Tage Networking-Challenge', 11),
('a3300000-0000-0000-0000-00000000000c', 'c1000000-0000-0000-0000-000000000003', 'Networking für Introvertierte', 12),
('a3300000-0000-0000-0000-00000000000d', 'c1000000-0000-0000-0000-000000000003', 'Digital Deep-Dive: XING, Dark Social, Communities', 13),
('a3300000-0000-0000-0000-00000000000e', 'c1000000-0000-0000-0000-000000000003', 'Führungskräfte: C-Level Networking', 14),
('a3300000-0000-0000-0000-00000000000f', 'c1000000-0000-0000-0000-000000000003', 'Branchen-Networking: Finanz, Tech, Gesundheit', 15),
('a3300000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000003', 'Networking-Ethik & Krisenzeiten', 16),
('a3300000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000003', 'Rückfall-Prävention: Wenn das Netzwerk einschläft', 17);

-- ALL LESSONS (use l3310000 IDs)
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES
-- Modul 0
('l3310000-0000-0000-0000-000000000001', 'a3300000-0000-0000-0000-000000000000', 'Selbstdiagnose: Dein Networking-Typ', 1, 'interactive', 5),
-- Modul 1
('l3310000-0000-0000-0000-000000000101', 'a3300000-0000-0000-0000-000000000001', 'Story: Der Job der nie ausgeschrieben wurde', 1, 'video', 3),
('l3310000-0000-0000-0000-000000000102', 'a3300000-0000-0000-0000-000000000001', 'Weak Ties vs. Strong Ties: Granovetters Entdeckung', 2, 'video', 10),
('l3310000-0000-0000-0000-000000000103', 'a3300000-0000-0000-0000-000000000001', 'Die 6 Networking-Mythen entlarvt', 3, 'interactive', 8),
('l3310000-0000-0000-0000-000000000104', 'a3300000-0000-0000-0000-000000000001', 'Reflexion & Quiz', 4, 'quiz', 5),
-- Modul 2
('l3310000-0000-0000-0000-000000000201', 'a3300000-0000-0000-0000-000000000002', 'Die Netzwerk-Landkarte: Wer kennt wen?', 1, 'video', 8),
('l3310000-0000-0000-0000-000000000202', 'a3300000-0000-0000-0000-000000000002', 'Interaktiv: Deine Netzwerk-Map erstellen', 2, 'interactive', 10),
('l3310000-0000-0000-0000-000000000203', 'a3300000-0000-0000-0000-000000000002', 'Die 5 Kreise: Kernteam, Allies, Brücken, Schlafende, Wunsch', 3, 'video', 8),
('l3310000-0000-0000-0000-000000000204', 'a3300000-0000-0000-0000-000000000002', 'Praxis: Deine 3 wichtigsten Brücken-Kontakte', 4, 'exercise', 8),
('l3310000-0000-0000-0000-000000000205', 'a3300000-0000-0000-0000-000000000002', 'Reflexion & Quiz', 5, 'quiz', 5),
-- Modul 3
('l3310000-0000-0000-0000-000000000301', 'a3300000-0000-0000-0000-000000000003', 'Story: Der Mann der 1000 Gefallen tat', 1, 'video', 3),
('l3310000-0000-0000-0000-000000000302', 'a3300000-0000-0000-0000-000000000003', 'Give-Give-Give-Ask: Die Geber-Formel', 2, 'video', 10),
('l3310000-0000-0000-0000-000000000303', 'a3300000-0000-0000-0000-000000000003', 'Die 12 Wert-Geschenke die nichts kosten', 3, 'interactive', 8),
('l3310000-0000-0000-0000-000000000304', 'a3300000-0000-0000-0000-000000000003', 'Boss-Fight: Der Netzwerk-Vampir', 4, 'interactive', 6),
('l3310000-0000-0000-0000-000000000305', 'a3300000-0000-0000-0000-000000000003', 'Reflexion & Quiz', 5, 'quiz', 5),
-- Modul 4
('l3310000-0000-0000-0000-000000000401', 'a3300000-0000-0000-0000-000000000004', 'Die 7-Sekunden Regel & Impostor-Syndrom überwinden', 1, 'video', 10),
('l3310000-0000-0000-0000-000000000402', 'a3300000-0000-0000-0000-000000000004', 'Gesprächs-Opener die funktionieren (12 Vorlagen)', 2, 'interactive', 8),
('l3310000-0000-0000-0000-000000000403', 'a3300000-0000-0000-0000-000000000004', 'Boss-Fight: Die Networking-Hölle', 3, 'interactive', 6),
('l3310000-0000-0000-0000-000000000404', 'a3300000-0000-0000-0000-000000000004', 'Dein 30-Sekunden Networking-Intro', 4, 'exercise', 8),
('l3310000-0000-0000-0000-000000000405', 'a3300000-0000-0000-0000-000000000004', 'Reflexion & Quiz', 5, 'quiz', 5),
-- Modul 5
('l3310000-0000-0000-0000-000000000501', 'a3300000-0000-0000-0000-000000000005', 'Profil-Optimierung: Die 8 Hebel', 1, 'video', 12),
('l3310000-0000-0000-0000-000000000502', 'a3300000-0000-0000-0000-000000000005', 'Vernetzungsanfragen die angenommen werden (8 Templates)', 2, 'interactive', 8),
('l3310000-0000-0000-0000-000000000503', 'a3300000-0000-0000-0000-000000000005', 'Praxis: Dein LinkedIn-Profil in 15 Min optimieren', 3, 'exercise', 15),
('l3310000-0000-0000-0000-000000000504', 'a3300000-0000-0000-0000-000000000005', 'Reflexion & Quiz', 4, 'quiz', 5),
-- Modul 6
('l3310000-0000-0000-0000-000000000601', 'a3300000-0000-0000-0000-000000000006', 'Die 48-Stunden Regel & Touchpoint-Strategie', 1, 'video', 10),
('l3310000-0000-0000-0000-000000000602', 'a3300000-0000-0000-0000-000000000006', '7 Follow-Up Templates (Copy & Paste)', 2, 'interactive', 8),
('l3310000-0000-0000-0000-000000000603', 'a3300000-0000-0000-0000-000000000006', 'Reflexion & Quiz', 3, 'quiz', 5),
-- Modul 7
('l3310000-0000-0000-0000-000000000701', 'a3300000-0000-0000-0000-000000000007', 'Vor dem Event: Recherche & Ziel setzen', 1, 'video', 8),
('l3310000-0000-0000-0000-000000000702', 'a3300000-0000-0000-0000-000000000007', 'Boss-Fight: Der Networking-Marathon', 2, 'interactive', 6),
('l3310000-0000-0000-0000-000000000703', 'a3300000-0000-0000-0000-000000000007', 'Praxis: Dein Event-Gameplan', 3, 'exercise', 8),
('l3310000-0000-0000-0000-000000000704', 'a3300000-0000-0000-0000-000000000007', 'Reflexion & Quiz', 4, 'quiz', 5),
-- Modul 8
('l3310000-0000-0000-0000-000000000801', 'a3300000-0000-0000-0000-000000000008', 'Das Ampel-System + Deep Context Speicher', 1, 'interactive', 10),
('l3310000-0000-0000-0000-000000000802', 'a3300000-0000-0000-0000-000000000008', 'Praxis: Deine Top 20 Kontakte eintragen', 2, 'exercise', 10),
('l3310000-0000-0000-0000-000000000803', 'a3300000-0000-0000-0000-000000000008', 'Reflexion & Quiz', 3, 'quiz', 5),
-- Modul 9
('l3310000-0000-0000-0000-000000000901', 'a3300000-0000-0000-0000-000000000009', 'Mentor vs. Sponsor vs. Coach', 1, 'video', 8),
('l3310000-0000-0000-0000-000000000902', 'a3300000-0000-0000-0000-000000000009', 'Die Mentor-Anfrage: 3 Templates', 2, 'interactive', 5),
('l3310000-0000-0000-0000-000000000903', 'a3300000-0000-0000-0000-000000000009', 'Reflexion & Quiz', 3, 'quiz', 5),
-- Modul 10
('l3310000-0000-0000-0000-000000000a01', 'a3300000-0000-0000-0000-00000000000a', 'Was sind Hubs und warum sind sie 100x wertvoller?', 1, 'video', 8),
('l3310000-0000-0000-0000-000000000a02', 'a3300000-0000-0000-0000-00000000000a', 'Hub-Finder: Wer sind die Multiplikatoren deiner Branche?', 2, 'interactive', 8),
('l3310000-0000-0000-0000-000000000a03', 'a3300000-0000-0000-0000-00000000000a', 'Reflexion & Quiz', 3, 'quiz', 5),
-- Modul 11
('l3310000-0000-0000-0000-000000000b01', 'a3300000-0000-0000-0000-00000000000b', 'Zusammenfassung aller Module', 1, 'video', 5),
('l3310000-0000-0000-0000-000000000b02', 'a3300000-0000-0000-0000-00000000000b', 'Abschlusstest', 2, 'quiz', 10),
('l3310000-0000-0000-0000-000000000b03', 'a3300000-0000-0000-0000-00000000000b', '30-Tage Networking-Challenge starten', 3, 'interactive', 5),
-- Modul 12: Introvertierte
('l3310000-0000-0000-0000-000000000c01', 'a3300000-0000-0000-0000-00000000000c', 'Networking ohne Energieverlust', 1, 'video', 10),
('l3310000-0000-0000-0000-000000000c02', 'a3300000-0000-0000-0000-00000000000c', 'Praxis: Dein Introvert-Networking-Plan', 2, 'exercise', 8),
-- Modul 13: Digital
('l3310000-0000-0000-0000-000000000d01', 'a3300000-0000-0000-0000-00000000000d', 'Dark Social: WhatsApp-Gruppen, Slack, Masterminds', 1, 'video', 8),
('l3310000-0000-0000-0000-000000000d02', 'a3300000-0000-0000-0000-00000000000d', 'Praxis: Dein erster LinkedIn-Post', 2, 'exercise', 10),
-- Modul 14: C-Level
('l3310000-0000-0000-0000-000000000e01', 'a3300000-0000-0000-0000-00000000000e', 'Board-Room Networking: Andere Regeln', 1, 'video', 10),
('l3310000-0000-0000-0000-000000000e02', 'a3300000-0000-0000-0000-00000000000e', 'Boss-Fight: Der Gatekeeper', 2, 'interactive', 6),
-- Modul 15: Branchen
('l3310000-0000-0000-0000-000000000f01', 'a3300000-0000-0000-0000-00000000000f', 'Finanzbranche: Verbände, IHK, Netzwerk-Events', 1, 'video', 8),
('l3310000-0000-0000-0000-000000000f02', 'a3300000-0000-0000-0000-00000000000f', 'Tech: Meetups, Open Source, Hackathons', 2, 'video', 8),
-- Modul 16: Ethik
('l3310000-0000-0000-0000-000000001001', 'a3300000-0000-0000-0000-000000000010', 'Networking-Ethik: Grenzen, DSGVO, kein Stalking', 1, 'video', 8),
('l3310000-0000-0000-0000-000000001002', 'a3300000-0000-0000-0000-000000000010', 'Das Airbag-Prinzip: Netzwerk VOR der Krise aufbauen', 2, 'video', 8),
-- Modul 17: Rückfall
('l3310000-0000-0000-0000-000000001101', 'a3300000-0000-0000-0000-000000000011', '5 Warnsignale + Geister-Counter', 1, 'interactive', 5),
('l3310000-0000-0000-0000-000000001102', 'a3300000-0000-0000-0000-000000000011', 'Der 3-in-3 Netzwerk-Reset', 2, 'exercise', 5);
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
-- =============================================
-- Zielgruppen-Update: 5 → 4 Phasen
-- student → studierende
-- einsteiger → berufseinsteiger
-- professional → berufserfahren
-- investor → fuehrungskraft (merged)
-- fuehrungskraft bleibt fuehrungskraft
-- =============================================

UPDATE profiles SET phase = 'studierende' WHERE phase = 'student';
UPDATE profiles SET phase = 'berufseinsteiger' WHERE phase = 'einsteiger';
UPDATE profiles SET phase = 'berufserfahren' WHERE phase = 'professional';
UPDATE profiles SET phase = 'fuehrungskraft' WHERE phase = 'investor';

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_phase_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_phase_check
  CHECK (phase IN ('studierende', 'berufseinsteiger', 'berufserfahren', 'fuehrungskraft'));

ALTER TABLE profiles ALTER COLUMN phase SET DEFAULT 'berufseinsteiger';
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

-- ══════════════════════════════════════════════════════════════
-- VERIFIKATION: Prüfe ob alles korrekt angelegt wurde
-- ══════════════════════════════════════════════════════════════
SELECT 'Kurse total' AS check_name, count(*) AS result FROM courses
UNION ALL SELECT 'Kurse published', count(*) FROM courses WHERE is_published = true
UNION ALL SELECT 'Module total', count(*) FROM modules
UNION ALL SELECT 'Lessons total', count(*) FROM lessons
UNION ALL SELECT '-- Kommunikation Module', count(*) FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000001'
UNION ALL SELECT '-- Balance Module', count(*) FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000002'
UNION ALL SELECT '-- Networking Module', count(*) FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000003'
UNION ALL SELECT '-- Speedreading Module', count(*) FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000004'
UNION ALL SELECT '-- Lernen Module', count(*) FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000005'
UNION ALL SELECT '-- Prio Module', count(*) FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000006';

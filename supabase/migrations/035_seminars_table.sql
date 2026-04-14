-- Seminars table: replaces hardcoded SEMINARE array in MasterclassClient
CREATE TABLE IF NOT EXISTS public.seminars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  icon TEXT DEFAULT '📘',
  teams_link TEXT,
  next_date DATE,
  stripe_price_id TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.seminars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can read active seminars" ON public.seminars FOR SELECT USING (true);
CREATE POLICY "Admins can manage seminars" ON public.seminars FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'coach'))
);

-- Seed data from the existing hardcoded array
INSERT INTO public.seminars (title, subtitle, description, icon, teams_link, next_date, sort_order) VALUES
  ('Typgerechtes Lernen', 'Finde deinen Weg zum Wissen', 'Warum lernen, denken und vergessen wir unterschiedlich? Was motiviert uns zum Lernen?', '🧠', NULL, '2026-04-18', 1),
  ('Work-Life-Balance', 'Gesundheit trifft Leistung', 'Ausgewogene Balance zwischen beruflichen und privaten Verpflichtungen.', '⚖️', NULL, '2026-05-09', 2),
  ('Personal Leadership', 'Authentisch führen, wirksam bleiben', 'Wie du aus Wünschen echte Ziele machst und diese erreichen kannst.', '👑', NULL, '2026-06-13', 3),
  ('Speedreading', 'Geschwindigkeit trifft Verständnis', 'Grundlagen des überdurchschnittlich schnellen Lesens mit hohem Textverständnis.', '📖', NULL, '2026-07-11', 4),
  ('Achtsamkeit', 'Gelassenheit ist trainierbar', 'Nur selten nimmt man sich neben dem Beruf und reizüberfluteten Alltag Zeit für sich und die eigenen Bedürfnisse.', '🧘', NULL, '2026-08-08', 5),
  ('Rhetorik, Dialektik, Kinesik', 'Überzeugen mit Worten und Wirkung', 'Wirkungsvoll, passend und adressatengerecht kommunizieren in jeder Situation.', '🎤', NULL, '2026-09-12', 6),
  ('Selbstmotivation', 'Dein Warum, dein Motor', 'Wie du dich effektiv motivierst, langfristig und diszipliniert an eigenen Zielen arbeitest.', '🔥', NULL, '2026-10-10', 7),
  ('Kommunikation', 'Verständigung als Schlüssel zum Erfolg', 'Effektive Kommunikation mit Kollegen und Geschäftspartnern.', '💬', NULL, '2026-11-14', 8),
  ('Konfliktmanagement', 'Aus Krisen Chancen machen', 'Strategien und Techniken zur erfolgreichen Konfliktbewältigung.', '🤜', NULL, '2026-12-12', 9),
  ('Arbeiten aus dem Home Office', 'Effizient arbeiten, flexibel leben', 'Strategien und Impulse, um auch von zu Hause aus ausgeglichen und effektiv deiner Arbeit nachzugehen.', '🏠', NULL, NULL, 10),
  ('Business Knigge', 'Der erste Eindruck zählt, der zweite bleibt', 'Die richtigen Formen und Kommunikationsfähigkeiten im Berufs- und Geschäftsumfeld.', '👔', NULL, NULL, 11),
  ('Networking', 'Kontakte knüpfen, Vertrauen aufbauen', 'Fähigkeiten im Aufbau und der Pflege von beruflichen Beziehungen verbessern.', '🤝', NULL, NULL, 12),
  ('Prioritätenmanagement', 'Nicht alles gleichzeitig, sondern das Richtige zuerst', 'Bewusster Umgang mit unserer Zeit als Schlüssel zum beruflichen Erfolg.', '🎯', NULL, NULL, 13);

-- =====================================================
-- MIGRATION 020: Messe CV-Check Module
-- Tabellen für Messe-Lebenslauf-Checks durch Berater
-- =====================================================

-- 1. Role ENUM um 'advisor' erweitern
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'advisor';

-- 2. Membership-Type Feld in profiles (für Basis-Mitglieder)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS membership_type text DEFAULT 'free';

-- =====================================================
-- NEUE TABELLEN
-- =====================================================

-- Messen
CREATE TABLE IF NOT EXISTS fairs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text,
  date_start date NOT NULL,
  date_end date,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Berater-Profil (zusätzlich zu profiles)
CREATE TABLE IF NOT EXISTS advisors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name text NOT NULL,
  email text NOT NULL,
  phone text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

-- Berater <-> Messe Zuordnung
CREATE TABLE IF NOT EXISTS fair_advisors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fair_id uuid REFERENCES fairs(id) ON DELETE CASCADE NOT NULL,
  advisor_id uuid REFERENCES advisors(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(fair_id, advisor_id)
);

-- Messe-Leads (jedes Gespräch)
CREATE TABLE IF NOT EXISTS fair_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fair_id uuid REFERENCES fairs(id) ON DELETE CASCADE NOT NULL,
  advisor_id uuid REFERENCES advisors(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  status text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'cv_uploaded', 'feedback_given', 'completed', 'activated', 'converted')),
  upload_token uuid DEFAULT gen_random_uuid(),
  upload_token_expires_at timestamptz DEFAULT (now() + interval '24 hours'),
  conversation_started_at timestamptz DEFAULT now(),
  conversation_ended_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fair_leads_fair ON fair_leads(fair_id);
CREATE INDEX IF NOT EXISTS idx_fair_leads_advisor ON fair_leads(advisor_id);
CREATE INDEX IF NOT EXISTS idx_fair_leads_email ON fair_leads(email);
CREATE INDEX IF NOT EXISTS idx_fair_leads_status ON fair_leads(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_fair_leads_upload_token ON fair_leads(upload_token);

-- CV-Dokumente mit Versionierung
CREATE TABLE IF NOT EXISTS cv_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  fair_lead_id uuid REFERENCES fair_leads(id) ON DELETE CASCADE,
  version integer NOT NULL DEFAULT 1,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('pdf', 'docx', 'image')),
  file_size_bytes integer,
  uploaded_by uuid REFERENCES auth.users(id),
  is_current boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cv_docs_user ON cv_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_docs_lead ON cv_documents(fair_lead_id);

-- Feedback (übergeordnet pro Gespräch)
CREATE TABLE IF NOT EXISTS cv_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_document_id uuid REFERENCES cv_documents(id) ON DELETE CASCADE NOT NULL,
  fair_lead_id uuid REFERENCES fair_leads(id) ON DELETE CASCADE,
  advisor_id uuid REFERENCES advisors(id) NOT NULL,
  overall_rating integer CHECK (overall_rating BETWEEN 1 AND 5),
  summary text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Einzelne Feedback-Punkte
CREATE TABLE IF NOT EXISTS cv_feedback_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_feedback_id uuid REFERENCES cv_feedback(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL CHECK (category IN ('struktur', 'inhalt', 'design', 'wirkung')),
  type text NOT NULL CHECK (type IN ('preset', 'freetext')),
  content text NOT NULL,
  rating integer CHECK (rating BETWEEN 1 AND 5),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_items_feedback ON cv_feedback_items(cv_feedback_id);

-- Vordefinierte Feedback-Bausteine
CREATE TABLE IF NOT EXISTS cv_feedback_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('struktur', 'inhalt', 'design', 'wirkung')),
  label text NOT NULL,
  description text,
  sentiment text NOT NULL DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true
);

-- =====================================================
-- analytics_events um fair-Felder erweitern
-- =====================================================
ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS fair_id uuid REFERENCES fairs(id);
ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS advisor_id uuid REFERENCES advisors(id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_fair ON analytics_events(fair_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE fairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE fair_advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE fair_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_feedback_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_feedback_presets ENABLE ROW LEVEL SECURITY;

-- Fairs: Alle authentifizierten User können Messen lesen
CREATE POLICY "fairs_read" ON fairs FOR SELECT TO authenticated USING (true);

-- Advisors: Berater sehen nur sich selbst
CREATE POLICY "advisors_read_own" ON advisors FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Fair_advisors: Berater sehen ihre eigenen Zuordnungen
CREATE POLICY "fair_advisors_read" ON fair_advisors FOR SELECT TO authenticated
  USING (advisor_id IN (SELECT id FROM advisors WHERE user_id = auth.uid()));

-- Fair_leads: Berater sehen eigene Leads, Nutzer sehen eigenen Lead
CREATE POLICY "fair_leads_advisor_read" ON fair_leads FOR SELECT TO authenticated
  USING (
    advisor_id IN (SELECT id FROM advisors WHERE user_id = auth.uid())
    OR user_id = auth.uid()
  );
CREATE POLICY "fair_leads_advisor_insert" ON fair_leads FOR INSERT TO authenticated
  WITH CHECK (advisor_id IN (SELECT id FROM advisors WHERE user_id = auth.uid()));
CREATE POLICY "fair_leads_advisor_update" ON fair_leads FOR UPDATE TO authenticated
  USING (advisor_id IN (SELECT id FROM advisors WHERE user_id = auth.uid()));

-- CV Documents: Berater + eigener User
CREATE POLICY "cv_docs_read" ON cv_documents FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR fair_lead_id IN (SELECT id FROM fair_leads WHERE advisor_id IN (SELECT id FROM advisors WHERE user_id = auth.uid()))
  );
CREATE POLICY "cv_docs_insert" ON cv_documents FOR INSERT TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid()
    OR fair_lead_id IN (SELECT id FROM fair_leads WHERE advisor_id IN (SELECT id FROM advisors WHERE user_id = auth.uid()))
  );

-- CV Feedback: Berater + eigener User
CREATE POLICY "cv_feedback_read" ON cv_feedback FOR SELECT TO authenticated
  USING (
    advisor_id IN (SELECT id FROM advisors WHERE user_id = auth.uid())
    OR cv_document_id IN (SELECT id FROM cv_documents WHERE user_id = auth.uid())
  );
CREATE POLICY "cv_feedback_insert" ON cv_feedback FOR INSERT TO authenticated
  WITH CHECK (advisor_id IN (SELECT id FROM advisors WHERE user_id = auth.uid()));
CREATE POLICY "cv_feedback_update" ON cv_feedback FOR UPDATE TO authenticated
  USING (advisor_id IN (SELECT id FROM advisors WHERE user_id = auth.uid()));

-- Feedback Items: Gleiche Logik wie cv_feedback
CREATE POLICY "cv_feedback_items_read" ON cv_feedback_items FOR SELECT TO authenticated
  USING (
    cv_feedback_id IN (SELECT id FROM cv_feedback WHERE advisor_id IN (SELECT id FROM advisors WHERE user_id = auth.uid()))
    OR cv_feedback_id IN (SELECT id FROM cv_feedback WHERE cv_document_id IN (SELECT id FROM cv_documents WHERE user_id = auth.uid()))
  );
CREATE POLICY "cv_feedback_items_insert" ON cv_feedback_items FOR INSERT TO authenticated
  WITH CHECK (cv_feedback_id IN (SELECT id FROM cv_feedback WHERE advisor_id IN (SELECT id FROM advisors WHERE user_id = auth.uid())));
CREATE POLICY "cv_feedback_items_delete" ON cv_feedback_items FOR DELETE TO authenticated
  USING (cv_feedback_id IN (SELECT id FROM cv_feedback WHERE advisor_id IN (SELECT id FROM advisors WHERE user_id = auth.uid())));

-- Presets: Alle authentifizierten User können lesen
CREATE POLICY "presets_read" ON cv_feedback_presets FOR SELECT TO authenticated USING (true);

-- =====================================================
-- STORAGE BUCKET
-- =====================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('cv-documents', 'cv-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies: Berater können hochladen, User können eigene Dateien lesen
CREATE POLICY "cv_storage_advisor_upload" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'cv-documents'
    AND (auth.uid() IN (SELECT user_id FROM advisors WHERE status = 'active'))
  );

CREATE POLICY "cv_storage_read" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'cv-documents'
    AND (
      auth.uid() IN (SELECT user_id FROM advisors WHERE status = 'active')
      OR (storage.foldername(name))[1] = auth.uid()::text
    )
  );

-- Service-Role kann immer zugreifen (für QR-Upload API Route)
-- Das ist automatisch der Fall, da service_role RLS umgeht.

-- =====================================================
-- SEED-DATEN: Feedback-Presets
-- =====================================================
INSERT INTO cv_feedback_presets (category, label, sentiment, sort_order) VALUES
-- Struktur
('struktur', 'Klarer chronologischer Aufbau', 'positive', 1),
('struktur', 'Chronologische Lücken vorhanden', 'negative', 2),
('struktur', 'Übersichtliche Gliederung', 'positive', 3),
('struktur', 'Zu unübersichtlich / überladen', 'negative', 4),
('struktur', 'Kontaktdaten vollständig', 'positive', 5),
('struktur', 'Kontaktdaten unvollständig', 'negative', 6),
('struktur', 'Gute Länge (1-2 Seiten)', 'positive', 7),
('struktur', 'Zu lang / zu kurz', 'negative', 8),
-- Inhalt
('inhalt', 'Relevante Erfahrungen gut hervorgehoben', 'positive', 1),
('inhalt', 'Wichtige Erfahrungen fehlen oder sind versteckt', 'negative', 2),
('inhalt', 'Kompetenzen klar formuliert', 'positive', 3),
('inhalt', 'Kompetenzen zu vage beschrieben', 'negative', 4),
('inhalt', 'Messbare Erfolge genannt', 'positive', 5),
('inhalt', 'Keine konkreten Ergebnisse / Zahlen', 'negative', 6),
('inhalt', 'Gute Keyword-Optimierung', 'positive', 7),
('inhalt', 'Keywords für Zielbranche fehlen', 'negative', 8),
-- Design
('design', 'Professionelles, modernes Layout', 'positive', 1),
('design', 'Layout veraltet oder unprofessionell', 'negative', 2),
('design', 'Gute Lesbarkeit und Schriftgröße', 'positive', 3),
('design', 'Schwer lesbar / zu kleine Schrift', 'negative', 4),
('design', 'Konsistente Formatierung', 'positive', 5),
('design', 'Inkonsistente Formatierung', 'negative', 6),
('design', 'Angemessenes Foto', 'positive', 7),
('design', 'Foto fehlt oder unvorteilhaft', 'negative', 8),
-- Wirkung
('wirkung', 'Starker erster Eindruck', 'positive', 1),
('wirkung', 'Erster Eindruck verbesserungswürdig', 'negative', 2),
('wirkung', 'Persönlichkeit kommt rüber', 'positive', 3),
('wirkung', 'Wirkt austauschbar / generisch', 'negative', 4),
('wirkung', 'Klare Positionierung erkennbar', 'positive', 5),
('wirkung', 'Positionierung unklar', 'negative', 6),
('wirkung', 'Motivierender Gesamteindruck', 'positive', 7),
('wirkung', 'Gesamteindruck eher schwach', 'negative', 8);

-- =====================================================
-- SEED: Test-Messe
-- =====================================================
INSERT INTO fairs (name, location, date_start, date_end, status) VALUES
('Stuzubi Berlin 2026', 'Berlin', '2026-04-13', '2026-04-13', 'upcoming');

-- ============================================================
-- KARRIERE-INSTITUT OS — Seed Data
-- 13 Kompetenzfelder, Fragen, Kurse, Badges
-- ============================================================

-- ============================================================
-- 1. KOMPETENZFELDER (13 Felder aus der Karriereanalyse)
-- ============================================================
INSERT INTO public.competency_fields (id, slug, title, description, icon, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'selbstmarketing', 'Selbstmarketing & Personal Branding', 'Wie sichtbar und überzeugend präsentierst du dich auf dem Arbeitsmarkt?', '🎯', 1),
  ('c0000001-0000-0000-0000-000000000002', 'fuehrung', 'Führungskompetenz', 'Kannst du Teams inspirieren, delegieren und Verantwortung übernehmen?', '👑', 2),
  ('c0000001-0000-0000-0000-000000000003', 'kommunikation', 'Kommunikation & Rhetorik', 'Wie klar, überzeugend und empathisch kommunizierst du?', '💬', 3),
  ('c0000001-0000-0000-0000-000000000004', 'verhandlung', 'Verhandlung & Gehalt', 'Kannst du deinen Wert durchsetzen und strategisch verhandeln?', '💰', 4),
  ('c0000001-0000-0000-0000-000000000005', 'netzwerk', 'Netzwerk & Beziehungen', 'Wie stark und strategisch ist dein berufliches Netzwerk?', '🤝', 5),
  ('c0000001-0000-0000-0000-000000000006', 'fachkompetenz', 'Fachkompetenz & Expertise', 'Wie tief ist dein Fachwissen und deine Branchenexpertise?', '📚', 6),
  ('c0000001-0000-0000-0000-000000000007', 'digitalkompetenz', 'Digitalkompetenz & KI', 'Wie souverän nutzt du digitale Tools und KI im Berufsalltag?', '💻', 7),
  ('c0000001-0000-0000-0000-000000000008', 'zeitmanagement', 'Zeitmanagement & Produktivität', 'Wie effizient organisierst du dich und setzt Prioritäten?', '⏰', 8),
  ('c0000001-0000-0000-0000-000000000009', 'resilienz', 'Resilienz & Stressmanagement', 'Wie gehst du mit Druck, Rückschlägen und Veränderung um?', '🛡️', 9),
  ('c0000001-0000-0000-0000-000000000010', 'innovation', 'Innovation & Kreativität', 'Wie kreativ löst du Probleme und treibst Neues voran?', '💡', 10),
  ('c0000001-0000-0000-0000-000000000011', 'strategie', 'Strategisches Denken', 'Wie gut erkennst du Muster, planst langfristig und triffst Entscheidungen?', '🧭', 11),
  ('c0000001-0000-0000-0000-000000000012', 'international', 'Internationale Kompetenz', 'Wie sicher bewegst du dich in internationalen und interkulturellen Kontexten?', '🌍', 12),
  ('c0000001-0000-0000-0000-000000000013', 'sinnziel', 'Sinn & Zielfindung', 'Wie klar sind deine beruflichen Ziele und dein persönlicher Antrieb?', '🔥', 13);

-- ============================================================
-- 2. FRAGEN (5 pro Feld = 65 total)
-- ============================================================

-- Selbstmarketing
INSERT INTO public.competency_questions (field_id, question_text, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'Ich kann meine beruflichen Stärken in 30 Sekunden überzeugend zusammenfassen.', 1),
  ('c0000001-0000-0000-0000-000000000001', 'Mein LinkedIn-Profil ist aktuell, vollständig und spiegelt meinen Marktwert wider.', 2),
  ('c0000001-0000-0000-0000-000000000001', 'Ich weiß, wie ich mich von anderen Kandidaten in meinem Bereich differenziere.', 3),
  ('c0000001-0000-0000-0000-000000000001', 'Ich habe eine klare Personal-Brand-Strategie für meine Karriere.', 4),
  ('c0000001-0000-0000-0000-000000000001', 'Ich erhalte regelmäßig Anfragen von Headhuntern oder Unternehmen.', 5);

-- Führungskompetenz
INSERT INTO public.competency_questions (field_id, question_text, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000002', 'Ich kann Aufgaben effektiv delegieren und Verantwortung übertragen.', 1),
  ('c0000001-0000-0000-0000-000000000002', 'Mein Team würde mich als inspirierend und unterstützend beschreiben.', 2),
  ('c0000001-0000-0000-0000-000000000002', 'Ich treffe auch unter Unsicherheit klare Entscheidungen.', 3),
  ('c0000001-0000-0000-0000-000000000002', 'Ich gebe konstruktives Feedback und fördere die Entwicklung anderer.', 4),
  ('c0000001-0000-0000-0000-000000000002', 'Ich habe Erfahrung mit Change-Management und Veränderungsprozessen.', 5);

-- Kommunikation
INSERT INTO public.competency_questions (field_id, question_text, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000003', 'Ich kann komplexe Sachverhalte einfach und verständlich erklären.', 1),
  ('c0000001-0000-0000-0000-000000000003', 'Ich fühle mich sicher bei Präsentationen vor größerem Publikum.', 2),
  ('c0000001-0000-0000-0000-000000000003', 'Ich höre aktiv zu und stelle die richtigen Fragen.', 3),
  ('c0000001-0000-0000-0000-000000000003', 'Ich kann Konflikte souverän und lösungsorientiert moderieren.', 4),
  ('c0000001-0000-0000-0000-000000000003', 'Meine schriftliche Kommunikation ist professionell und wirkungsvoll.', 5);

-- Verhandlung & Gehalt
INSERT INTO public.competency_questions (field_id, question_text, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000004', 'Ich kenne meinen Marktwert und kann ihn mit Zahlen belegen.', 1),
  ('c0000001-0000-0000-0000-000000000004', 'Ich bereite Verhandlungen systematisch vor (BATNA, Zielzone, Argumente).', 2),
  ('c0000001-0000-0000-0000-000000000004', 'Ich fühle mich wohl dabei, über Gehalt zu sprechen.', 3),
  ('c0000001-0000-0000-0000-000000000004', 'Ich habe in der Vergangenheit erfolgreich Gehaltserhöhungen durchgesetzt.', 4),
  ('c0000001-0000-0000-0000-000000000004', 'Ich kann Zusatzleistungen (Bonus, Benefits) strategisch verhandeln.', 5);

-- Netzwerk
INSERT INTO public.competency_questions (field_id, question_text, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000005', 'Ich pflege mein berufliches Netzwerk regelmäßig und proaktiv.', 1),
  ('c0000001-0000-0000-0000-000000000005', 'Ich besuche Branchenevents und nutze sie strategisch.', 2),
  ('c0000001-0000-0000-0000-000000000005', 'Ich habe mindestens 3 Mentoren oder Sparringspartner in meinem Netzwerk.', 3),
  ('c0000001-0000-0000-0000-000000000005', 'Mein Netzwerk bringt mir regelmäßig berufliche Chancen.', 4),
  ('c0000001-0000-0000-0000-000000000005', 'Ich kann schnell relevante Kontakte in neuen Branchen aufbauen.', 5);

-- Fachkompetenz
INSERT INTO public.competency_questions (field_id, question_text, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000006', 'Ich bin in meinem Fachgebiet auf dem neuesten Stand.', 1),
  ('c0000001-0000-0000-0000-000000000006', 'Ich bilde mich regelmäßig fachlich weiter (Kurse, Zertifikate, Lektüre).', 2),
  ('c0000001-0000-0000-0000-000000000006', 'Kollegen kommen zu mir, wenn sie fachliche Expertise brauchen.', 3),
  ('c0000001-0000-0000-0000-000000000006', 'Ich kann mein Fachwissen branchenübergreifend anwenden.', 4),
  ('c0000001-0000-0000-0000-000000000006', 'Ich habe relevante Zertifizierungen oder Zusatzqualifikationen.', 5);

-- Digitalkompetenz
INSERT INTO public.competency_questions (field_id, question_text, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000007', 'Ich nutze KI-Tools (ChatGPT, Claude etc.) effektiv im Arbeitsalltag.', 1),
  ('c0000001-0000-0000-0000-000000000007', 'Ich bin sicher im Umgang mit gängigen Analyse- und Projekttools.', 2),
  ('c0000001-0000-0000-0000-000000000007', 'Ich verstehe aktuelle Technologie-Trends in meiner Branche.', 3),
  ('c0000001-0000-0000-0000-000000000007', 'Ich kann datenbasierte Entscheidungen treffen und Dashboards lesen.', 4),
  ('c0000001-0000-0000-0000-000000000007', 'Ich automatisiere repetitive Aufgaben wo möglich.', 5);

-- Zeitmanagement
INSERT INTO public.competency_questions (field_id, question_text, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000008', 'Ich priorisiere meine Aufgaben nach Wirkung, nicht nach Dringlichkeit.', 1),
  ('c0000001-0000-0000-0000-000000000008', 'Ich halte Deadlines konsequent ein.', 2),
  ('c0000001-0000-0000-0000-000000000008', 'Ich sage "Nein" zu Aufgaben die nicht auf meine Ziele einzahlen.', 3),
  ('c0000001-0000-0000-0000-000000000008', 'Ich nutze ein System (digital oder analog) um meinen Tag zu strukturieren.', 4),
  ('c0000001-0000-0000-0000-000000000008', 'Ich schaffe es, Deep Work von mindestens 2h/Tag einzuplanen.', 5);

-- Resilienz
INSERT INTO public.competency_questions (field_id, question_text, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000009', 'Ich erhöre mich schnell von beruflichen Rückschlägen.', 1),
  ('c0000001-0000-0000-0000-000000000009', 'Ich kann unter hohem Druck klar denken und handeln.', 2),
  ('c0000001-0000-0000-0000-000000000009', 'Ich habe effektive Strategien zur Stressbewältigung.', 3),
  ('c0000001-0000-0000-0000-000000000009', 'Ich sehe Veränderungen als Chance, nicht als Bedrohung.', 4),
  ('c0000001-0000-0000-0000-000000000009', 'Meine Work-Life-Balance ist nachhaltig und gesund.', 5);

-- Innovation
INSERT INTO public.competency_questions (field_id, question_text, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000010', 'Ich bringe regelmäßig neue Ideen in mein Team ein.', 1),
  ('c0000001-0000-0000-0000-000000000010', 'Ich hinterfrage bestehende Prozesse und suche nach besseren Wegen.', 2),
  ('c0000001-0000-0000-0000-000000000010', 'Ich habe bereits Projekte initiiert oder Verbesserungen umgesetzt.', 3),
  ('c0000001-0000-0000-0000-000000000010', 'Ich bin offen für Methoden aus anderen Branchen und Disziplinen.', 4),
  ('c0000001-0000-0000-0000-000000000010', 'Ich experimentiere lieber als ewig zu planen.', 5);

-- Strategie
INSERT INTO public.competency_questions (field_id, question_text, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000011', 'Ich kann langfristige Karrierepläne entwickeln und verfolgen.', 1),
  ('c0000001-0000-0000-0000-000000000011', 'Ich erkenne Markttrends bevor sie Mainstream werden.', 2),
  ('c0000001-0000-0000-0000-000000000011', 'Ich treffe Entscheidungen basierend auf Daten und Analyse.', 3),
  ('c0000001-0000-0000-0000-000000000011', 'Ich kann komplexe Situationen schnell einordnen und priorisieren.', 4),
  ('c0000001-0000-0000-0000-000000000011', 'Ich denke in Szenarien und plane Alternativen mit ein.', 5);

-- International
INSERT INTO public.competency_questions (field_id, question_text, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000012', 'Ich bin sicher in englischsprachiger Geschäftskommunikation.', 1),
  ('c0000001-0000-0000-0000-000000000012', 'Ich habe Erfahrung in internationalen Teams oder Projekten.', 2),
  ('c0000001-0000-0000-0000-000000000012', 'Ich verstehe kulturelle Unterschiede im Geschäftsleben.', 3),
  ('c0000001-0000-0000-0000-000000000012', 'Ich bin bereit für internationale Karriereschritte (Ausland, Remote).', 4),
  ('c0000001-0000-0000-0000-000000000012', 'Ich spreche mindestens eine weitere Fremdsprache fließend.', 5);

-- Sinn & Ziel
INSERT INTO public.competency_questions (field_id, question_text, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000013', 'Ich weiß genau, wo ich in 3 Jahren beruflich stehen will.', 1),
  ('c0000001-0000-0000-0000-000000000013', 'Mein aktueller Job passt zu meinen Werten und meiner Vision.', 2),
  ('c0000001-0000-0000-0000-000000000013', 'Ich kann klar benennen, was mich antreibt und motiviert.', 3),
  ('c0000001-0000-0000-0000-000000000013', 'Ich habe einen konkreten Karriereplan mit Meilensteinen.', 4),
  ('c0000001-0000-0000-0000-000000000013', 'Ich treffe Karriereentscheidungen bewusst und nicht reaktiv.', 5);

-- ============================================================
-- 3. KURSE (13 Module, mapped auf Kompetenzfelder)
-- ============================================================
INSERT INTO public.courses (id, title, description, category, competency_field_id, market_value_impact, sort_order, is_published) VALUES
  ('d0000001-0000-0000-0000-000000000001', 'Personal Branding Masterclass', 'Werde sichtbar: LinkedIn, CV, Elevator Pitch & digitale Präsenz', 'Selbstmarketing', 'c0000001-0000-0000-0000-000000000001', 3200, 1, true),
  ('d0000001-0000-0000-0000-000000000002', 'Leadership Excellence', 'Vom Fachexperten zur Führungskraft: Delegation, Vision & Impact', 'Führung', 'c0000001-0000-0000-0000-000000000002', 5500, 2, true),
  ('d0000001-0000-0000-0000-000000000003', 'Kommunikation auf C-Level', 'Rhetorik, Storytelling & Executive Presence für Entscheider', 'Kommunikation', 'c0000001-0000-0000-0000-000000000003', 3800, 3, true),
  ('d0000001-0000-0000-0000-000000000004', 'Gehaltsverhandlung Intensiv', 'Marktwert kennen, BATNA aufbauen, Gehalt verdoppeln', 'Verhandlung', 'c0000001-0000-0000-0000-000000000004', 8000, 4, true),
  ('d0000001-0000-0000-0000-000000000005', 'Strategisches Netzwerken', 'Von Kontakten zu Karrierechancen: Networking für Top-Performer', 'Netzwerk', 'c0000001-0000-0000-0000-000000000005', 2800, 5, true),
  ('d0000001-0000-0000-0000-000000000006', 'Expertise sichtbar machen', 'Thought Leadership, Fachvorträge & Zertifizierungsstrategie', 'Fachkompetenz', 'c0000001-0000-0000-0000-000000000006', 4200, 6, true),
  ('d0000001-0000-0000-0000-000000000007', 'Digital & KI für Führungskräfte', 'KI-Tools, Datenanalyse & digitale Transformation verstehen', 'Digital', 'c0000001-0000-0000-0000-000000000007', 4500, 7, true),
  ('d0000001-0000-0000-0000-000000000008', 'Produktivität & Deep Work', 'Zeitmanagement-Systeme, Fokus & High-Performance-Routinen', 'Produktivität', 'c0000001-0000-0000-0000-000000000008', 2200, 8, true),
  ('d0000001-0000-0000-0000-000000000009', 'Resilienz & Mental Fitness', 'Stressresistenz aufbauen, Krisen meistern, nachhaltig performen', 'Resilienz', 'c0000001-0000-0000-0000-000000000009', 2500, 9, true),
  ('d0000001-0000-0000-0000-000000000010', 'Innovation & Intrapreneurship', 'Kreative Problemlösung, Design Thinking & Projekte starten', 'Innovation', 'c0000001-0000-0000-0000-000000000010', 3500, 10, true),
  ('d0000001-0000-0000-0000-000000000011', 'Strategisches Karrieredesign', 'Karrierepfade analysieren, Szenarien planen, Entscheidungen treffen', 'Strategie', 'c0000001-0000-0000-0000-000000000011', 4000, 11, true),
  ('d0000001-0000-0000-0000-000000000012', 'International Career Accelerator', 'Global mindset, cross-cultural leadership & international mobility', 'International', 'c0000001-0000-0000-0000-000000000012', 3800, 12, true),
  ('d0000001-0000-0000-0000-000000000013', 'Purpose & Career Alignment', 'Werte klären, Vision entwickeln, den richtigen Weg finden', 'Sinn & Ziel', 'c0000001-0000-0000-0000-000000000013', 2000, 13, true);

-- ============================================================
-- 4. MODULE & LEKTIONEN (4 Lektionen pro Kurs = 52 total)
-- ============================================================

-- Personal Branding
INSERT INTO public.modules (id, course_id, title, sort_order) VALUES
  ('m0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'Personal Branding Grundlagen', 1);

INSERT INTO public.lessons (module_id, title, description, lesson_type, duration_min, market_value_impact, sort_order) VALUES
  ('m0000001-0000-0000-0000-000000000001', 'Dein Elevator Pitch', 'In 30 Sekunden überzeugen: So formulierst du deinen persönlichen Pitch.', 'video', 12, 800, 1),
  ('m0000001-0000-0000-0000-000000000001', 'LinkedIn-Profil Optimierung', 'Headline, Summary, Erfahrung: Jedes Element zählt für Headhunter.', 'lesson', 15, 900, 2),
  ('m0000001-0000-0000-0000-000000000001', 'Der perfekte Lebenslauf', 'ATS-optimiert, visuell ansprechend, inhaltlich schlagkräftig.', 'lesson', 14, 800, 3),
  ('m0000001-0000-0000-0000-000000000001', 'Praxis: Brand Audit', 'Analysiere deine aktuelle Online-Präsenz und identifiziere Lücken.', 'exercise', 18, 700, 4);

-- Gehaltsverhandlung (als Beispiel für High-Impact)
INSERT INTO public.modules (id, course_id, title, sort_order) VALUES
  ('m0000001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000004', 'Gehaltsverhandlung Masterplan', 1);

INSERT INTO public.lessons (module_id, title, description, lesson_type, duration_min, market_value_impact, sort_order) VALUES
  ('m0000001-0000-0000-0000-000000000004', 'Deinen Marktwert bestimmen', 'Gehaltsbenchmarks, Glassdoor, Kununu & persönliche Kalkulation.', 'video', 14, 2000, 1),
  ('m0000001-0000-0000-0000-000000000004', 'BATNA & Verhandlungsstrategie', 'Die Harvard-Methode für Gehaltsverhandlungen.', 'lesson', 16, 2500, 2),
  ('m0000001-0000-0000-0000-000000000004', 'Die Verhandlung führen', 'Timing, Anker, Gegenangebote & Schweigen als Waffe.', 'video', 13, 2000, 3),
  ('m0000001-0000-0000-0000-000000000004', 'Praxis: Verhandlungssimulation', 'Bereite deine echte Verhandlung vor: Argumente, Zahlen & Haltung.', 'exercise', 20, 1500, 4);

-- ============================================================
-- 5. BADGES
-- ============================================================
INSERT INTO public.badges (slug, title, description, icon, xp_reward, condition_type, condition_value) VALUES
  ('analyse_complete', 'Selbsterkenner', 'Karriereanalyse vollständig abgeschlossen', '🔍', 100, 'analysis_complete', NULL),
  ('first_lesson', 'Wissensdurst', 'Erste Lektion abgeschlossen', '📖', 25, 'course_complete', '1'),
  ('branding_master', 'Brand Architect', 'Personal Branding Modul abgeschlossen', '🎯', 200, 'course_complete', 'd0000001-0000-0000-0000-000000000001'),
  ('negotiator', 'Verhandlungsprofi', 'Gehaltsverhandlung Modul abgeschlossen', '💰', 300, 'course_complete', 'd0000001-0000-0000-0000-000000000004'),
  ('xp_500', 'Rising Star', '500 KI-Points erreicht', '⭐', 0, 'xp_threshold', '500'),
  ('xp_1000', 'High Potential', '1000 KI-Points erreicht', '🌟', 0, 'xp_threshold', '1000'),
  ('cv_uploaded', 'Profil-Start', 'Lebenslauf hochgeladen', '📄', 50, 'manual', NULL),
  ('first_application', 'Opportunity Seeker', 'Erste Bewerbung im Tracker', '✉️', 75, 'manual', NULL),
  ('offer_received', 'Deal Closer', 'Erstes Angebot erhalten', '🏆', 500, 'manual', NULL),
  ('all_modules', 'Masterclass Graduate', 'Alle 13 Module abgeschlossen', '🎓', 1000, 'manual', NULL);

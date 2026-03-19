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

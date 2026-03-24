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

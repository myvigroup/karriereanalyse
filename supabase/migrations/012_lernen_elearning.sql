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

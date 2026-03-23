-- ═══════════════════════════════════════════════════════
-- Prioritätenmanagement E-Learning: Module & Lessons Setup
-- Kurs-ID: c1000000-0000-0000-0000-000000000006
-- ═══════════════════════════════════════════════════════

-- Alte Daten löschen
DELETE FROM lesson_progress WHERE lesson_id IN (
  SELECT id FROM lessons WHERE module_id IN (
    SELECT id FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000006'
  )
);
DELETE FROM lessons WHERE module_id IN (
  SELECT id FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000006'
);
DELETE FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000006';

-- 14 Module
INSERT INTO modules (id, course_id, title, sort_order) VALUES
('a6600000-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000006', 'Selbstdiagnose: Wo stehst du?', 0),
('a6600000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000006', 'Der Urzeit-Code', 1),
('a6600000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000006', 'Die Sortier-Maschine', 2),
('a6600000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000006', 'Energetisches Design', 3),
('a6600000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000006', 'Second Brain', 4),
('a6600000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000006', 'Mission Control', 5),
('a6600000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000006', 'Der Sichtbarkeits-Hebel', 6),
('a6600000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000006', 'Grenzen setzen & Team-Fokus', 7),
('a6600000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000006', 'Abschluss & 30-Tage Plan', 8),
('a6600000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000006', 'Delegations-Masterclass', 9),
('a6600000-0000-0000-0000-00000000000a', 'c1000000-0000-0000-0000-000000000006', 'Change-Prioritäten', 10),
('a6600000-0000-0000-0000-00000000000b', 'c1000000-0000-0000-0000-000000000006', 'Das priorisierte Team', 11),
('a6600000-0000-0000-0000-00000000000c', 'c1000000-0000-0000-0000-000000000006', 'Remote-Work Spezial', 12),
('a6600000-0000-0000-0000-00000000000d', 'c1000000-0000-0000-0000-000000000006', 'Rückfall-Prävention', 13);

-- Modul 0: Selbstdiagnose
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a6600000-0000-0000-0000-000000000000', 'Selbstdiagnose: Dein Prioritäten-Profil', 1, 'interactive', 5);

-- Modul 1: Der Urzeit-Code
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a6600000-0000-0000-0000-000000000001', 'Story: Der verpasste Anruf', 1, 'video', 2),
('a6600000-0000-0000-0000-000000000001', 'System 1 vs System 2: Warum dein Gehirn dich austrickst', 2, 'video', 8),
('a6600000-0000-0000-0000-000000000001', 'Der Posteingang der Apokalypse', 3, 'scenario', 5),
('a6600000-0000-0000-0000-000000000001', 'Boss-Fight: Cypher der Aufmerksamkeits-Dieb', 4, 'interactive', 5),
('a6600000-0000-0000-0000-000000000001', 'Reflexion & Quiz', 5, 'quiz', 5);

-- Modul 2: Die Sortier-Maschine
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a6600000-0000-0000-0000-000000000002', 'Die Eisenhower-Matrix 2.0', 1, 'video', 8),
('a6600000-0000-0000-0000-000000000002', 'Drag & Drop: Aufgaben sortieren', 2, 'interactive', 8),
('a6600000-0000-0000-0000-000000000002', 'Das 80/20 Prinzip & Warren Buffetts 25/5 Regel', 3, 'video', 5),
('a6600000-0000-0000-0000-000000000002', 'Praxis: Deine Not-To-Do Liste', 4, 'exercise', 5),
('a6600000-0000-0000-0000-000000000002', 'Reflexion & Quiz', 5, 'quiz', 5);

-- Modul 3: Energetisches Design
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a6600000-0000-0000-0000-000000000003', 'Chronotyp-Test: Lerche, Eule oder Kolibri?', 1, 'interactive', 5),
('a6600000-0000-0000-0000-000000000003', 'Bio-Rhythmus & Ultradian Cycles', 2, 'video', 8),
('a6600000-0000-0000-0000-000000000003', 'Dein optimaler Tagesplan (Generator)', 3, 'interactive', 5),
('a6600000-0000-0000-0000-000000000003', 'Reflexion & Quiz', 4, 'quiz', 5);

-- Modul 4: Second Brain
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a6600000-0000-0000-0000-000000000004', 'Brain-Dump: 60-Sekunden Challenge', 1, 'interactive', 3),
('a6600000-0000-0000-0000-000000000004', 'GTD & Inbox Zero', 2, 'video', 8),
('a6600000-0000-0000-0000-000000000004', 'Die 2-Minuten-Regel', 3, 'video', 4),
('a6600000-0000-0000-0000-000000000004', 'Reflexion & Quiz', 4, 'quiz', 5);

-- Modul 5: Mission Control
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a6600000-0000-0000-0000-000000000005', 'Der 5-Minuten Morgen-Check', 1, 'video', 5),
('a6600000-0000-0000-0000-000000000005', 'Der 3-Minuten Abend-Review', 2, 'video', 4),
('a6600000-0000-0000-0000-000000000005', 'Praxis: Dein Weekly Review Template', 3, 'exercise', 8),
('a6600000-0000-0000-0000-000000000005', 'Reflexion & Quiz', 4, 'quiz', 5);

-- Modul 6: Sichtbarkeits-Hebel
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a6600000-0000-0000-0000-000000000006', 'Story: Der unsichtbare Held', 1, 'video', 2),
('a6600000-0000-0000-0000-000000000006', 'Die Fleiß-Falle & Stakeholder-Matrix', 2, 'video', 8),
('a6600000-0000-0000-0000-000000000006', 'Szenario: Der Tag der Entscheidung', 3, 'scenario', 5),
('a6600000-0000-0000-0000-000000000006', 'Praxis: Stakeholder-Matrix ausfüllen', 4, 'exercise', 8),
('a6600000-0000-0000-0000-000000000006', 'Reflexion & Quiz', 5, 'quiz', 5);

-- Modul 7: Grenzen setzen
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a6600000-0000-0000-0000-000000000007', 'Die Ja-wenn-Methode', 1, 'video', 8),
('a6600000-0000-0000-0000-000000000007', '5 Copy-Paste Skripte für den Alltag', 2, 'interactive', 5),
('a6600000-0000-0000-0000-000000000007', 'Boss-Fight: Dr. Dringend', 3, 'interactive', 5),
('a6600000-0000-0000-0000-000000000007', 'Praxis: Dein persönliches Nein formulieren', 4, 'exercise', 5),
('a6600000-0000-0000-0000-000000000007', 'Reflexion & Quiz', 5, 'quiz', 5);

-- Modul 8: Abschluss
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a6600000-0000-0000-0000-000000000008', 'Zusammenfassung aller Module', 1, 'video', 5),
('a6600000-0000-0000-0000-000000000008', 'Dein persönlicher Aktionsplan', 2, 'exercise', 8),
('a6600000-0000-0000-0000-000000000008', 'Abschlusstest (10 Fragen)', 3, 'quiz', 10),
('a6600000-0000-0000-0000-000000000008', '30-Tage Transfer-Challenge starten', 4, 'interactive', 5);

-- Modul 9: Delegations-Masterclass (Bonus Führungskräfte)
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a6600000-0000-0000-0000-000000000009', 'Delegation als Karriere-Multiplikator', 1, 'video', 8),
('a6600000-0000-0000-0000-000000000009', 'Die 4 Delegations-Stufen', 2, 'interactive', 5),
('a6600000-0000-0000-0000-000000000009', 'Reflexion & Quiz', 3, 'quiz', 5);

-- Modul 10: Change-Prioritäten (Bonus Führungskräfte)
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a6600000-0000-0000-0000-00000000000a', 'Prioritäten in Veränderungsphasen', 1, 'video', 8),
('a6600000-0000-0000-0000-00000000000a', 'Szenario: Der Change-Sturm', 2, 'scenario', 5),
('a6600000-0000-0000-0000-00000000000a', 'Reflexion & Quiz', 3, 'quiz', 5);

-- Modul 11: Das priorisierte Team (Bonus Führungskräfte)
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a6600000-0000-0000-0000-00000000000b', 'Team-Fokus etablieren', 1, 'video', 8),
('a6600000-0000-0000-0000-00000000000b', 'Praxis: Team-Prioritäten-Board', 2, 'exercise', 8),
('a6600000-0000-0000-0000-00000000000b', 'Reflexion & Quiz', 3, 'quiz', 5);

-- Modul 12: Remote-Work Spezial
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a6600000-0000-0000-0000-00000000000c', 'Fokus im Homeoffice', 1, 'video', 8),
('a6600000-0000-0000-0000-00000000000c', 'Die perfekte Remote-Routine', 2, 'interactive', 5),
('a6600000-0000-0000-0000-00000000000c', 'Reflexion & Quiz', 3, 'quiz', 5);

-- Modul 13: Rückfall-Prävention
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a6600000-0000-0000-0000-00000000000d', 'Die 5 Rückfall-Signale', 1, 'video', 5),
('a6600000-0000-0000-0000-00000000000d', 'Dein Reset-Ritual', 2, 'interactive', 5),
('a6600000-0000-0000-0000-00000000000d', 'Reflexion & Quiz', 3, 'quiz', 5);

-- ═══════════════════════════════════════════════════════
-- Kommunikation E-Learning: Module & Lessons Setup
-- Kurs-ID: c1000000-0000-0000-0000-000000000001
-- ═══════════════════════════════════════════════════════

-- Alte Daten löschen
DELETE FROM lesson_progress WHERE lesson_id IN (
  SELECT id FROM lessons WHERE module_id IN (
    SELECT id FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000001'
  )
);
DELETE FROM lessons WHERE module_id IN (
  SELECT id FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000001'
);
DELETE FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000001';

-- 16 Module
INSERT INTO modules (id, course_id, title, sort_order) VALUES
('a1100000-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000001', 'Selbstdiagnose: Dein Kommunikations-Profil', 0),
('a1100000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Die 4 Ohren', 1),
('a1100000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Aktives Zuhören', 2),
('a1100000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'Körpersprache senden & lesen', 3),
('a1100000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'Stimme & Tonfall', 4),
('a1100000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'Feedback geben & empfangen', 5),
('a1100000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000001', 'Schwierige Gespräche & Stress', 6),
('a1100000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000001', 'Überzeugen & Storytelling', 7),
('a1100000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000001', 'Schriftliche Kommunikation', 8),
('a1100000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000001', 'Digitale Kommunikation', 9),
('a1100000-0000-0000-0000-00000000000a', 'c1000000-0000-0000-0000-000000000001', 'Smalltalk & Gesprächseinstiege', 10),
('a1100000-0000-0000-0000-00000000000b', 'c1000000-0000-0000-0000-000000000001', 'Abschluss & 30-Tage Challenge', 11),
('a1100000-0000-0000-0000-00000000000c', 'c1000000-0000-0000-0000-000000000001', 'Führungskommunikation', 12),
('a1100000-0000-0000-0000-00000000000d', 'c1000000-0000-0000-0000-000000000001', 'Konflikte lösen als FK', 13),
('a1100000-0000-0000-0000-00000000000e', 'c1000000-0000-0000-0000-000000000001', 'Interkulturelle Kommunikation', 14),
('a1100000-0000-0000-0000-00000000000f', 'c1000000-0000-0000-0000-000000000001', 'Rückfall-Prävention', 15);

-- Modul 0: Selbstdiagnose: Dein Kommunikations-Profil
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a1100000-0000-0000-0000-000000000000', 'Selbstdiagnose: Dein Kommunikations-Profil', 1, 'interactive', 5);

-- Modul 1: Die 4 Ohren
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a1100000-0000-0000-0000-000000000001', 'Story: Das Meeting das alles veränderte', 1, 'video', 2),
('a1100000-0000-0000-0000-000000000001', 'Schulz von Thun: 4 Seiten einer Nachricht', 2, 'video', 8),
('a1100000-0000-0000-0000-000000000001', 'Drag & Drop: 4-Ohren Übung', 3, 'interactive', 8),
('a1100000-0000-0000-0000-000000000001', 'Reflexion & Quiz', 4, 'quiz', 5);

-- Modul 2: Aktives Zuhören
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a1100000-0000-0000-0000-000000000002', 'Die 5 Stufen des Zuhörens', 1, 'video', 8),
('a1100000-0000-0000-0000-000000000002', 'Zuhör-Stufen Erkennen', 2, 'interactive', 5),
('a1100000-0000-0000-0000-000000000002', 'Praxis: Paraphrasier-Challenge', 3, 'exercise', 5),
('a1100000-0000-0000-0000-000000000002', 'Reflexion & Quiz', 4, 'quiz', 5);

-- Modul 3: Körpersprache senden & lesen
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a1100000-0000-0000-0000-000000000003', 'Körpersprache die wirkt', 1, 'video', 8),
('a1100000-0000-0000-0000-000000000003', 'Signale anderer lesen: 8 Cluster', 2, 'interactive', 5),
('a1100000-0000-0000-0000-000000000003', 'Szenario: Das stille Bewerbungsgespräch', 3, 'scenario', 5),
('a1100000-0000-0000-0000-000000000003', 'Reflexion & Quiz', 4, 'quiz', 5);

-- Modul 4: Stimme & Tonfall
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a1100000-0000-0000-0000-000000000004', 'Die 4 Stimmkiller', 1, 'video', 6),
('a1100000-0000-0000-0000-000000000004', 'Betonungs-Übung', 2, 'interactive', 5),
('a1100000-0000-0000-0000-000000000004', 'Der Spiegel-Test: Nimm dich auf', 3, 'exercise', 5),
('a1100000-0000-0000-0000-000000000004', 'Reflexion & Quiz', 4, 'quiz', 5);

-- Modul 5: Feedback geben & empfangen
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a1100000-0000-0000-0000-000000000005', 'Story: Das Feedback das zur Beförderung führte', 1, 'video', 2),
('a1100000-0000-0000-0000-000000000005', 'SBI-Methode: Situation, Behavior, Impact', 2, 'video', 8),
('a1100000-0000-0000-0000-000000000005', '5 Feedback-Templates', 3, 'interactive', 5),
('a1100000-0000-0000-0000-000000000005', 'Boss-Fight: Der Feedback-Tornado', 4, 'interactive', 6),
('a1100000-0000-0000-0000-000000000005', 'Reflexion & Quiz', 5, 'quiz', 5);

-- Modul 6: Schwierige Gespräche & Stress
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a1100000-0000-0000-0000-000000000006', 'Die STOPP-Methode', 1, 'video', 8),
('a1100000-0000-0000-0000-000000000006', 'Kommunikation unter Stress', 2, 'video', 5),
('a1100000-0000-0000-0000-000000000006', 'Boss-Fight: Der Konflikt-Vulkan', 3, 'interactive', 6),
('a1100000-0000-0000-0000-000000000006', 'Notfall-Sätze für Stress', 4, 'interactive', 5),
('a1100000-0000-0000-0000-000000000006', 'Reflexion & Quiz', 5, 'quiz', 5);

-- Modul 7: Überzeugen & Storytelling
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a1100000-0000-0000-0000-000000000007', 'Story: Die 90-Sekunden-Präsentation', 1, 'video', 2),
('a1100000-0000-0000-0000-000000000007', 'Aristoteles: Ethos, Pathos, Logos', 2, 'video', 8),
('a1100000-0000-0000-0000-000000000007', 'Elevator Pitch Builder', 3, 'interactive', 8),
('a1100000-0000-0000-0000-000000000007', 'STAR-Methode für Storytelling', 4, 'exercise', 5),
('a1100000-0000-0000-0000-000000000007', 'Reflexion & Quiz', 5, 'quiz', 5);

-- Modul 8: Schriftliche Kommunikation
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a1100000-0000-0000-0000-000000000008', 'BLUF: Bottom Line Up Front', 1, 'video', 6),
('a1100000-0000-0000-0000-000000000008', '5 E-Mail Templates', 2, 'interactive', 5),
('a1100000-0000-0000-0000-000000000008', 'Praxis: Schreibe eine BLUF-Mail', 3, 'exercise', 5),
('a1100000-0000-0000-0000-000000000008', 'Reflexion & Quiz', 4, 'quiz', 5);

-- Modul 9: Digitale Kommunikation
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a1100000-0000-0000-0000-000000000009', 'Slack, Teams & die neue Etikette', 1, 'video', 6),
('a1100000-0000-0000-0000-000000000009', 'Szenario: Der Slack-Krieg', 2, 'scenario', 6),
('a1100000-0000-0000-0000-000000000009', 'Wann Chat, wann Mail, wann Anruf?', 3, 'interactive', 5),
('a1100000-0000-0000-0000-000000000009', 'Reflexion & Quiz', 4, 'quiz', 5);

-- Modul 10: Smalltalk & Gesprächseinstiege
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a1100000-0000-0000-0000-00000000000a', 'Die FORD-Methode', 1, 'video', 5),
('a1100000-0000-0000-0000-00000000000a', 'Gesprächs-Opener: Copy & Paste', 2, 'interactive', 5),
('a1100000-0000-0000-0000-00000000000a', 'Reflexion & Quiz', 3, 'quiz', 5);

-- Modul 11: Abschluss & 30-Tage Challenge
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a1100000-0000-0000-0000-00000000000b', 'Zusammenfassung aller Module', 1, 'video', 5),
('a1100000-0000-0000-0000-00000000000b', 'Dein persönlicher Kommunikations-Plan', 2, 'exercise', 8),
('a1100000-0000-0000-0000-00000000000b', 'Abschlusstest (10 Fragen)', 3, 'quiz', 10),
('a1100000-0000-0000-0000-00000000000b', '30-Tage Kommunikations-Challenge starten', 4, 'interactive', 5);

-- Modul 12: Führungskommunikation (Bonus)
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a1100000-0000-0000-0000-00000000000c', 'Kommunikation als Führungsinstrument', 1, 'video', 8),
('a1100000-0000-0000-0000-00000000000c', 'Boss-Fight: Der Eskalations-Sturm', 2, 'interactive', 6),
('a1100000-0000-0000-0000-00000000000c', 'Reflexion & Quiz', 3, 'quiz', 5);

-- Modul 13: Konflikte lösen als FK (Bonus)
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a1100000-0000-0000-0000-00000000000d', 'Mediations-Grundlagen', 1, 'video', 8),
('a1100000-0000-0000-0000-00000000000d', 'Praxis: Konflikt-Moderation', 2, 'exercise', 8),
('a1100000-0000-0000-0000-00000000000d', 'Reflexion & Quiz', 3, 'quiz', 5);

-- Modul 14: Interkulturelle Kommunikation (Bonus)
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a1100000-0000-0000-0000-00000000000e', 'High-Context vs. Low-Context Kulturen', 1, 'video', 6),
('a1100000-0000-0000-0000-00000000000e', 'Szenario: Das internationale Meeting', 2, 'scenario', 5),
('a1100000-0000-0000-0000-00000000000e', 'Reflexion & Quiz', 3, 'quiz', 5);

-- Modul 15: Rückfall-Prävention
INSERT INTO lessons (module_id, title, sort_order, lesson_type, duration_minutes) VALUES
('a1100000-0000-0000-0000-00000000000f', '5 Warnsignale + Reset-Protokoll', 1, 'video', 5),
('a1100000-0000-0000-0000-00000000000f', 'Dein persönlicher Kommunikations-Pakt', 2, 'exercise', 5),
('a1100000-0000-0000-0000-00000000000f', 'Boss-Fight: Der Stumme Raum', 3, 'interactive', 6),
('a1100000-0000-0000-0000-00000000000f', 'Reflexion & Quiz', 4, 'quiz', 5);

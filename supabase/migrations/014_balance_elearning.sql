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

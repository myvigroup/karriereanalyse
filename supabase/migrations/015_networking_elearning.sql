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

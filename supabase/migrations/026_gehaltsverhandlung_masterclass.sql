-- Gehaltsverhandlung Mastery Masterclass
-- Kurs-ID: c1000000-0000-0000-0000-000000000007
-- 5 Module, 15 Lektionen, ~55 Minuten

-- Clean up existing data if re-running
DELETE FROM lesson_progress WHERE lesson_id IN (
  SELECT id FROM lessons WHERE module_id IN (
    SELECT id FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000007'
  )
);
DELETE FROM lessons WHERE module_id IN (
  SELECT id FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000007'
);
DELETE FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000007';
DELETE FROM courses WHERE id = 'c1000000-0000-0000-0000-000000000007';

-- Insert course
INSERT INTO courses (id, title, description, icon, color, duration_minutes, is_published, sort_order, competency_link, category)
VALUES (
  'c1000000-0000-0000-0000-000000000007',
  'Gehaltsverhandlung Mastery',
  'Von Angst zu Strategie: Lerne wie du dein Gehalt systematisch um 7-12% steigerst – mit konkreten Skripten, Simulations-Training und marktbasierter Argumentation.',
  '💰',
  '#CC1426',
  55,
  true,
  0,
  'marktwert',
  NULL
);

-- ===== MODULE IDs (a7000000-prefix) =====
INSERT INTO modules (id, course_id, title, sort_order) VALUES
('a7000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000007', 'Modul 1: Mindset — Die innere Blockade lösen', 1),
('a7000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000007', 'Modul 2: Marktwert — Deine Zahlen kennen', 2),
('a7000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000007', 'Modul 3: Vorbereitung — Der Fahrplan', 3),
('a7000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000007', 'Modul 4: Verhandlung — Die Taktik im Gespräch', 4),
('a7000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000007', 'Modul 5: Abschluss — Nach dem Ja', 5);

-- ===== LESSONS (b7010000-prefix) =====
INSERT INTO lessons (id, module_id, title, sort_order, lesson_type, duration_minutes) VALUES

-- Modul 1: Mindset (3 Lektionen)
('b7010000-0000-0000-0000-000000000101', 'a7000000-0000-0000-0000-000000000001', 'Warum du aktuell unterbezahlt bist', 1, 'video', 4),
('b7010000-0000-0000-0000-000000000102', 'a7000000-0000-0000-0000-000000000001', 'Warum die meisten Angst vor Gehaltsgesprächen haben', 2, 'interactive', 5),
('b7010000-0000-0000-0000-000000000103', 'a7000000-0000-0000-0000-000000000001', 'Wie Gewinner in Gehaltsverhandlungen denken', 3, 'interactive', 4),

-- Modul 2: Marktwert (3 Lektionen)
('b7010000-0000-0000-0000-000000000201', 'a7000000-0000-0000-0000-000000000002', 'Was du wirklich wert bist', 1, 'interactive', 5),
('b7010000-0000-0000-0000-000000000202', 'a7000000-0000-0000-0000-000000000002', 'Wie Arbeitgeber dein Gehalt wirklich bestimmen', 2, 'video', 4),
('b7010000-0000-0000-0000-000000000203', 'a7000000-0000-0000-0000-000000000002', 'Dein Marktwert in 3 Faktoren', 3, 'exercise', 5),

-- Modul 3: Vorbereitung (4 Lektionen)
('b7010000-0000-0000-0000-000000000301', 'a7000000-0000-0000-0000-000000000003', 'Warum du ohne Vorbereitung verlierst', 1, 'video', 3),
('b7010000-0000-0000-0000-000000000302', 'a7000000-0000-0000-0000-000000000003', 'Dein persönlicher Gehalts-Pitch', 2, 'exercise', 6),
('b7010000-0000-0000-0000-000000000303', 'a7000000-0000-0000-0000-000000000003', 'Deine stärksten Argumente', 3, 'exercise', 5),
('b7010000-0000-0000-0000-000000000304', 'a7000000-0000-0000-0000-000000000003', 'Deine Strategie festlegen', 4, 'interactive', 5),

-- Modul 4: Verhandlung (5 Lektionen: 2 Videos + 3 Simulationen)
('b7010000-0000-0000-0000-000000000401', 'a7000000-0000-0000-0000-000000000004', 'So startest du das Gespräch richtig', 1, 'video', 3),
('b7010000-0000-0000-0000-000000000402', 'a7000000-0000-0000-0000-000000000004', 'Die häufigsten Arbeitgeber-Reaktionen', 2, 'video', 4),
('b7010000-0000-0000-0000-000000000403', 'a7000000-0000-0000-0000-000000000004', 'Simulation: „Das ist aktuell nicht drin"', 3, 'scenario', 5),
('b7010000-0000-0000-0000-000000000404', 'a7000000-0000-0000-0000-000000000004', 'Simulation: „Wir können dir 5% anbieten"', 4, 'scenario', 5),
('b7010000-0000-0000-0000-000000000405', 'a7000000-0000-0000-0000-000000000004', 'Simulation: „Warum denkst du, dass du mehr wert bist?"', 5, 'scenario', 6),

-- Modul 5: Abschluss (2 Lektionen)
('b7010000-0000-0000-0000-000000000501', 'a7000000-0000-0000-0000-000000000005', 'So schließt du die Verhandlung ab', 1, 'video', 4),
('b7010000-0000-0000-0000-000000000502', 'a7000000-0000-0000-0000-000000000005', 'Wenn sie Nein sagen — Dein Plan B', 2, 'exercise', 3);

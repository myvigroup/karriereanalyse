-- =============================================
-- DIAGNOSE: Was fehlt in der Datenbank?
-- =============================================
-- Führe NUR DIESE Diagnose zuerst aus.
-- Dann nutze scripts/KOMPLETT-MIGRATION-009-018.sql für den Fix!

SELECT 'Kurse total' AS check_name, count(*) AS result FROM courses
UNION ALL SELECT 'Kurse published', count(*) FROM courses WHERE is_published = true
UNION ALL SELECT 'Module total', count(*) FROM modules
UNION ALL SELECT 'Lessons total', count(*) FROM lessons
UNION ALL SELECT '-- Kommunikation Module', count(*) FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000001'
UNION ALL SELECT '-- Balance Module', count(*) FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000002'
UNION ALL SELECT '-- Networking Module', count(*) FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000003'
UNION ALL SELECT '-- Speedreading Module', count(*) FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000004'
UNION ALL SELECT '-- Lernen Module', count(*) FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000005'
UNION ALL SELECT '-- Prio Module', count(*) FROM modules WHERE course_id = 'c1000000-0000-0000-0000-000000000006'
UNION ALL SELECT 'Kompetenzfelder', count(*) FROM competency_fields
UNION ALL SELECT 'Analyse Results', count(*) FROM analysis_results
UNION ALL SELECT 'Profile', count(*) FROM profiles;

-- =============================================
-- WENN DATEN FEHLEN:
-- Führe scripts/KOMPLETT-MIGRATION-009-018.sql aus!
-- Das enthält ALLE echten Migrationen (009-018):
-- - 6 E-Learning Kurse
-- - 95+ Module
-- - 200+ Lessons
-- - Zielgruppen-Personalisierung
-- - Vault + Achievements + XP
-- - 4 Phasen Update
-- - Streak-System
-- =============================================

-- ===== Masterclass Video-URLs setzen =====
-- Ordnet die Supabase Storage Videos den richtigen Lektionen zu

-- Modul 1: Mindset
UPDATE lessons SET video_url = 'https://pvqpbvxmtpuwzfzuynyq.supabase.co/storage/v1/object/public/videos/1.1_Modul%201_Aktuell%20unterbezahlt.prproj.mp4', lesson_type = 'video'
  WHERE id = 'b7010000-0000-0000-0000-000000000101'; -- Warum du aktuell unterbezahlt bist

UPDATE lessons SET video_url = 'https://pvqpbvxmtpuwzfzuynyq.supabase.co/storage/v1/object/public/videos/1.2_Modul%201_Mindset.prproj.mp4', lesson_type = 'video'
  WHERE id = 'b7010000-0000-0000-0000-000000000102'; -- Warum die meisten Angst vor Gehaltsgesprächen haben

UPDATE lessons SET video_url = 'https://pvqpbvxmtpuwzfzuynyq.supabase.co/storage/v1/object/public/videos/1.3_Modul%201_Gewinner%20denken.prproj.mp4', lesson_type = 'video'
  WHERE id = 'b7010000-0000-0000-0000-000000000103'; -- Wie Gewinner in Gehaltsverhandlungen denken

-- Modul 2: Marktwert
UPDATE lessons SET video_url = 'https://pvqpbvxmtpuwzfzuynyq.supabase.co/storage/v1/object/public/videos/2.1_Modul%202_Kenne%20deinen%20Wert.prproj.mp4', lesson_type = 'video'
  WHERE id = 'b7010000-0000-0000-0000-000000000201'; -- Was du wirklich wert bist

UPDATE lessons SET video_url = 'https://pvqpbvxmtpuwzfzuynyq.supabase.co/storage/v1/object/public/videos/2.2_Modul%202_Wie%20AG%20Gehalt%20bestimmt.prproj.mp4', lesson_type = 'video'
  WHERE id = 'b7010000-0000-0000-0000-000000000202'; -- Wie Arbeitgeber dein Gehalt wirklich bestimmen

UPDATE lessons SET video_url = 'https://pvqpbvxmtpuwzfzuynyq.supabase.co/storage/v1/object/public/videos/2.3_Modul%202_Dein%20Marktwert.prproj.mp4', lesson_type = 'video'
  WHERE id = 'b7010000-0000-0000-0000-000000000203'; -- Dein Marktwert in 3 Faktoren

-- Modul 4: Verhandlung
UPDATE lessons SET video_url = 'https://pvqpbvxmtpuwzfzuynyq.supabase.co/storage/v1/object/public/videos/4.2_Modul%204_Arbeitgeber_Reaktion.mp4', lesson_type = 'video'
  WHERE id = 'b7010000-0000-0000-0000-000000000402'; -- Die häufigsten Arbeitgeber-Reaktionen

-- Modul 5: Abschluss
UPDATE lessons SET video_url = 'https://pvqpbvxmtpuwzfzuynyq.supabase.co/storage/v1/object/public/videos/5.2_Modul%205_wenn%20sie%20Nein%20sagen.mp4', lesson_type = 'video'
  WHERE id = 'b7010000-0000-0000-0000-000000000502'; -- Wenn sie Nein sagen — Dein Plan B

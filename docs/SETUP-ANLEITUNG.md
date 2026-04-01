# Messe-CV-Check — Setup-Anleitung

## 1. Branch holen

```bash
git fetch origin
git checkout claude/suspicious-driscoll
npm install
```

## 2. Environment Variables

In `.env.local` müssen folgende Werte stehen:

```
NEXT_PUBLIC_SUPABASE_URL=https://pvqpbvxmtpuwzfzuynyq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
RESEND_API_KEY=<resend-key>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- **Service Role Key**: Supabase Dashboard → Settings → API → `service_role` (secret)
- **Resend Key**: Falls nicht vorhanden, werden E-Mails nur in der Console geloggt (funktioniert trotzdem zum Testen)

## 3. Datenbank-Migration ausführen

Öffne den **Supabase SQL Editor**: https://supabase.com/dashboard/project/pvqpbvxmtpuwzfzuynyq/sql/new

Kopiere den **gesamten Inhalt** von `supabase/migrations/020_messe_cv_check.sql` und führe ihn aus.

Erwartetes Ergebnis: Keine Fehler. Neue Tabellen: `fairs`, `advisors`, `fair_advisors`, `fair_leads`, `cv_documents`, `cv_feedback`, `cv_feedback_items`, `cv_feedback_presets`. Storage Bucket `cv-documents`. Test-Messe "Stuzubi Berlin 2026".

## 4. Test-Berater anlegen

Im selben SQL Editor ausführen:

```sql
-- 1. Wähle einen bestehenden User aus (z.B. deinen eigenen)
-- Finde deine User-ID:
SELECT id, email, role FROM profiles LIMIT 20;

-- 2. Ersetze <USER_ID> und <EMAIL> mit den Werten deines Users:
UPDATE profiles SET role = 'advisor' WHERE id = '<USER_ID>';

INSERT INTO advisors (user_id, display_name, email)
VALUES ('<USER_ID>', 'Dein Name', '<EMAIL>');

-- 3. Berater der Test-Messe zuordnen:
INSERT INTO fair_advisors (fair_id, advisor_id)
SELECT f.id, a.id
FROM fairs f, advisors a
WHERE f.name = 'Stuzubi Berlin 2026'
AND a.user_id = '<USER_ID>';
```

## 5. Dev-Server starten

```bash
npm run dev
```

Öffne http://localhost:3000/advisor — du solltest die Messe "Stuzubi Berlin 2026" sehen.

## 6. Deine Aufgaben

Siehe `docs/AUFGABEN-BLOCK-B.md` für die vollständige Aufgabenliste:

1. **Berater-Flow durchklicken** — Neues Gespräch → CV-Upload → Feedback → Abschluss
2. **QR-Upload auf Handy testen** — QR-Code scannen, Datei hochladen
3. **Magic Link E-Mail testen** — Versand + Login über Magic Link
4. **User-Dashboard prüfen** — `/cv-check` mit Feedback-Anzeige + CTA
5. **UI-Feinschliff** — Responsive (Tablet + Handy), Touch-Targets, Farben

## Dateistruktur

```
src/app/advisor/           → Berater-Bereich (geschützt, role=advisor)
src/app/upload/[token]/    → Öffentliche QR-Upload-Seite
src/app/api/upload/[token] → Upload-API (Service-Role, kein Auth)
src/app/api/lead/[leadId]  → Upload-Status Polling
src/app/(app)/cv-check/    → User-Dashboard (CV-Ergebnisse)
src/app/advisor/actions.js → Alle Server Actions
src/lib/supabase/admin.js  → Supabase Admin/Service-Role Client
supabase/migrations/020_*  → SQL-Migration
```

## Bei Problemen

- **"Nicht eingeloggt" auf /advisor**: Du bist nicht als `advisor` in profiles markiert
- **Upload schlägt fehl**: Storage Bucket `cv-documents` prüfen (Supabase Dashboard → Storage)
- **Magic Link E-Mail kommt nicht**: `RESEND_API_KEY` prüfen. Ohne Key wird die E-Mail in der Server-Console geloggt — Magic Link URL von dort kopieren
- **QR-Upload 404**: Middleware prüfen — `/upload` muss als öffentliche Route durchgelassen werden

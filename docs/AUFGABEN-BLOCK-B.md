# Block B — Frontend/Testing (Messe-CV-Check)

## Kontext
Das Messe-CV-Check-Modul wurde implementiert und liegt auf dem Branch `claude/suspicious-driscoll`. Es erlaubt Beratern auf Karrieremessen 15-minütige Lebenslauf-Checks durchzuführen, Feedback zu geben und Besuchern per Magic Link Zugang zu ihren Ergebnissen zu senden.

**Voraussetzung:** Block A (Datenbank/Backend) muss abgeschlossen sein — Migration ausgeführt, Test-Berater angelegt, Env-Variablen gesetzt.

---

## Aufgabe 1: Dev-Server starten & Berater-Flow durchklicken

1. Branch auschecken: `git checkout claude/suspicious-driscoll`
2. `npm install` (neue Dependency: `qrcode.react`)
3. `.env.local` muss vorhanden sein mit:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY` (oder Platzhalter — dann werden E-Mails nur geloggt)
4. `npm run dev`
5. Als Berater einloggen (User mit `role = 'advisor'` in profiles)
6. `/advisor` aufrufen — Test-Messe "Stuzubi Berlin 2026" sollte erscheinen
7. Kompletten Flow durchspielen:
   - Messe auswählen
   - "Neues Gespräch starten"
   - Name + E-Mail eingeben → Weiter
   - CV hochladen (PDF oder Bild testen)
   - Feedback geben (Chips togglen, Sterne setzen, Freitext)
   - Zusammenfassung prüfen
   - "Gespräch abschließen & Magic Link senden"
   - Erfolgsscreen prüfen

**Worauf achten:**
- Formular-Validierung (leere Felder, ungültige E-Mail)
- Upload funktioniert mit PDF, DOCX, JPG, PNG
- Auto-Save im Feedback-Screen (Chips + Freitext werden gespeichert)
- Status-Chips in der Lead-Liste aktualisieren sich korrekt

---

## Aufgabe 2: QR-Upload auf Handy testen

1. Im Berater-Flow bei "CV-Upload" auf "QR-Code" klicken
2. QR-Code mit dem Handy scannen
3. Die Upload-Seite (`/upload/[token]`) muss OHNE Login funktionieren
4. Datei hochladen (Foto aufnehmen oder PDF auswählen)
5. Erfolgsscreen: "Danke! Dein Karriere-Coach sieht deinen Lebenslauf jetzt."
6. Auf dem Berater-Tablet: Automatischer Redirect zum Review (Polling alle 3 Sek.)

**Worauf achten:**
- Seite ist mobile-optimiert
- Kamera-Button funktioniert auf iOS + Android
- Abgelaufener Token zeigt Fehlermeldung
- Max 3 Uploads pro Token (Rate-Limiting)

---

## Aufgabe 3: Magic Link E-Mail testen

1. Nach Abschluss eines Gesprächs wird eine E-Mail gesendet
2. Prüfe:
   - E-Mail kommt an (oder wird in Console geloggt wenn kein RESEND_API_KEY)
   - Betreff: "Dein Lebenslauf-Check – Ergebnisse ansehen"
   - Absender: "Karriere-Institut"
   - Button "Ergebnisse ansehen" enthält gültigen Magic Link
   - Klick auf Button loggt den User ein und leitet zu `/cv-check` weiter

**Falls RESEND_API_KEY fehlt:** E-Mail wird in der Server-Console geloggt. Magic Link URL aus dem Log kopieren und manuell testen.

---

## Aufgabe 4: User-Dashboard `/cv-check` prüfen

1. Magic Link aus der E-Mail klicken (oder manuell als der erstellte User einloggen)
2. `/cv-check` aufrufen
3. Prüfe:
   - Willkommens-Banner wird beim ersten Besuch angezeigt
   - CV-Preview (PDF im iframe, Bild als img)
   - Feedback wird korrekt angezeigt (Kategorien, Chips grün/rot, Sterne, Freitext)
   - Gesamtbewertung prominent sichtbar
   - CTA "Karriereanalyse starten" ist vorhanden und verlinkt zu `/analyse`
   - "Lebenslauf-Check" erscheint in der Sidebar-Navigation

---

## Aufgabe 5: UI-Feinschliff

Teste auf folgenden Geräten/Größen:
- **iPad** (1024x768) — Hauptgerät für Berater
- **Desktop** (1440px+)
- **Handy** (375px) — QR-Upload-Seite

Prüfe und ggf. fixen:
- Touch-Targets mindestens 44px auf Tablet
- Feedback-Chips sind gut tappbar
- Split-View im Review-Screen stackt auf kleinen Screens
- Farben konsistent (#CC1426 für Buttons, Instrument Sans Font)
- Keine abgeschnittenen Texte oder Overflow-Probleme
- Loading-States (kein Flash of empty content)

---

## Dateistruktur (Referenz)

```
src/app/advisor/
  layout.js              → Berater-Layout + Rollenprüfung
  page.js                → Messe-Auswahl
  actions.js             → Server Actions (createLead, saveFeedback, completeFeedback, ...)
  fair/[fairId]/
    page.js              → Messe-Dashboard
    new-lead/page.js     → Lead-Erfassung
    lead/[leadId]/
      upload/page.js     → CV-Upload (Drag&Drop + Kamera + QR)
      review/page.js     → Split-View: CV + Feedback
      summary/page.js    → Zusammenfassung + Abschluss
      done/page.js       → Erfolgsscreen

src/app/upload/[token]/page.js      → Öffentliche QR-Upload-Seite
src/app/api/upload/[token]/route.js → Upload-API (Service-Role)
src/app/api/lead/[leadId]/upload-status/route.js → Polling-Endpoint
src/app/(app)/cv-check/page.js     → User-Dashboard
```

---

## Bugs/Issues bitte tracken als

- **[BUG]** Beschreibung + Screenshot + Gerät/Browser
- **[UI]** Design-Abweichung + erwartetes Verhalten
- **[FEATURE]** Fehlende Funktionalität

Bei Fragen: Die Server Actions in `src/app/advisor/actions.js` sind der zentrale Einstiegspunkt für die Backend-Logik.

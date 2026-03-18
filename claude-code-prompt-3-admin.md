# Claude Code Prompt: Admin-Bereich & Coaching-Dashboard

## Projektkontext
Projekt: Karriere-Institut OS (Next.js 14 + Supabase)
Design: Apple-Ästhetik — globals.css lesen, bestehende Klassen nutzen
Rollen: admin (voller Zugriff), coach (Team-Zugriff), user (eigene Daten)
ÄNDERE NICHTS am Design-System, Sidebar oder Layout

---

## Aufgabe 1: Coaching-Dashboard (/admin/coaching)

### Datenbank
- `profiles` — alle Coachees mit phase, level, xp
- `career_documents` — Dokumentenstatus pro User
- `analysis_results` — Analyseergebnisse
- `lesson_progress` — Lernfortschritt
- `applications` — Bewerbungsstatus
- `coaching_sessions` — geplante/abgeschlossene Sessions

### UI
Erstelle src/app/(app)/admin/coaching/CoachingClient.js

**Stat-Cards (4er Grid):**
- Aktive Coachees (phase = active)
- Durchschn. Analyse-Score
- Lektionen abgeschlossen (gesamt)
- Angebote erhalten (applications.status = offer)

**Coachee-Liste:**
- Tabelle: Name, Phase-Pill, Analyse-Score, Fortschritt %, Dokumente %, Letzte Aktivität
- Farbcodierung: Grün (alles on track), Gelb (>3 Tage inaktiv), Rot (>7 Tage inaktiv)
- Klick öffnet Detail-Panel rechts (Slide-in)

**Detail-Panel (pro Coachee):**
- Profil-Info + Avatar
- Tab 1: Analyse-Ergebnisse (Mini-Radar + PRIOs)
- Tab 2: Masterclass-Fortschritt (Kurs-Liste mit Haken)
- Tab 3: Bewerbungen (Mini-Kanban)
- Tab 4: Coaching-Notizen (Textarea + Action-Items)
- "Nächste Session planen" Button → Datum + Typ (Video/Telefon) eingeben

**Frühwarnsystem:**
- Banner oben: "3 Coachees brauchen Aufmerksamkeit"
- Rote Cards für User die >5 Tage inaktiv sind oder bei einem Modul feststecken

---

## Aufgabe 2: Nutzerverwaltung (/admin/users)

### UI
Erstelle src/app/(app)/admin/users/AdminUsersClient.js

**User-Tabelle:**
- Spalten: Avatar, Name, E-Mail, Rolle (Pill), Phase (Pill), Level, XP, Registriert
- Such-/Filterfeld
- Filter: Alle | Pre-Coaching | Active | Alumni

**Aktionen pro User:**
- Rolle ändern (user/coach/admin) → Dropdown
- Phase ändern → Dropdown
- Dokumente prüfen → Link zu Dokument-Detail

**Dokument-Prüfung (Modal):**
- Alle Dokumente des Users als Liste
- Pro Dokument: Status-Badge + Dateiname
- "Datei ansehen" → öffnet Supabase Storage URL im neuen Tab
- Buttons: "Akzeptieren" (grün) / "Ablehnen" (rot, mit Textfeld für Grund)
- Update: career_documents.status + reviewed_at

**User hinzufügen (Modal):**
- Name, E-Mail, Rolle, Phase
- Erstellt User via Supabase Admin API (oder Einladungslink)

---

## Aufgabe 3: Kursverwaltung (/admin/courses)

### UI
Erstelle src/app/(app)/admin/courses/AdminCoursesClient.js

**Kurs-Übersicht:**
- 13 Kurse als aufklappbare Accordion-Cards
- Pro Kurs: Titel, Kategorie-Pill, Lektionen-Count, Video-Status ("3/4 Videos hinterlegt")
- Published-Toggle (Schalter)

**Kurs-Editor (aufgeklappt):**
- Felder editieren: Titel, Beschreibung, Kategorie, Marktwert-Impact, Sort-Order
- Lektionen-Liste darunter

**Lektion-Editor (pro Lektion):**
- Titel, Beschreibung, Content (Textarea), Exercise (Textarea)
- Video-URL Feld mit Auto-Erkennung (YouTube/Vimeo/Wistia → Vorschau-Thumbnail)
- Typ: Dropdown (video/lesson/exercise)
- Dauer (Minuten)
- Marktwert-Impact (€)
- Speichern-Button mit Success-Toast

**Video-Status-Counter:**
- Oben rechts: "🎬 X/52 Videos verlinkt"
- Pro Lektion: Grüner Dot wenn video_url vorhanden, roter wenn nicht

---

## Implementierungsreihenfolge
1. AdminUsersClient.js (Tabelle + Dokument-Prüfung)
2. AdminCoursesClient.js (Kurs-Editor + Video-URLs)
3. CoachingClient.js (Dashboard + Detail-Panel)
4. Git commit + push

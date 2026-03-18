# Claude Code Prompt: Karriereanalyse + Masterclass

## Projektkontext
Projekt: Karriere-Institut OS (Next.js 14 + Supabase)
Pfad: ~/karriere-institut/
Design: Apple-Ästhetik — Instrument Sans, #CC1426 Akzent, #353A3B Text, #FBFBFD Background
CSS: Alles in src/app/globals.css definiert (Variablen: --ki-red, --ki-charcoal, --ki-bg etc.)
Bestehend: Login, Register, Sidebar, Dashboard (alles funktional)

## WICHTIG: Design-Regeln
- Lies zuerst src/app/globals.css um das Design-System zu verstehen
- Lies src/app/(app)/dashboard/DashboardClient.js als Pattern-Referenz
- Nutze die bestehenden CSS-Klassen: .card, .btn, .btn-primary, .pill, .progress-bar, .page-container, .page-title, .page-subtitle, .grid-2, .grid-3, .animate-in
- Apple-Look: Viel Weißraum, borderRadius: var(--r-pill) für Buttons, subtile Schatten, keine harten Borders
- ÄNDERE NICHTS am bestehenden Design, Sidebar oder Layout

---

## Aufgabe 1: Karriereanalyse (Route /analyse)

### Datenbank (bereits vorhanden)
- `competency_fields` — 13 Felder mit slug, title, icon
- `competency_questions` — 65 Fragen (5 pro Feld), FK auf field_id
- `analysis_results` — user_id + field_id + score (0-100)
- `analysis_sessions` — Gesamtscore + prio_1/2/3 Felder

### UI-Flow
Die Seite src/app/(app)/analyse/page.js existiert als Server Component.
Erstelle src/app/(app)/analyse/AnalyseClient.js als Client Component.

**Zustand 1 — Noch keine Analyse:**
- Hero mit Headline "Entdecke dein Potenzial" + Subtext
- 3 Info-Cards: "13 Felder", "65 Fragen", "~10 Minuten"
- CTA "Analyse starten" → wechselt zu Zustand 2
- Alternativ: "Schnell-Einstufung" → Slider pro Feld (0-100), speichert direkt

**Zustand 2 — Analyse läuft:**
- Progress Bar oben (Feld X von 13)
- Aktuelles Feld: Icon + Titel + Beschreibung
- 5 Fragen pro Feld, Likert-Skala 1-10
- Antwort-Buttons als Pill-Row (1-10), aktiver Button: var(--ki-red) mit scale(1.05)
- "Weiter" Button disabled solange nicht alle 5 beantwortet
- Smooth Transition zwischen Feldern (opacity + translateY)

**Zustand 3 — Ergebnis:**
- Großer Score: "Dein Gesamtscore: 68%"
- Radar-Chart (SVG, 13 Achsen) — Apple-Style: thin lines, filled area mit 10% opacity
- PRIO 1-3: Die 3 niedrigsten Felder mit rotem Badge "PRIO 1/2/3"
- Alle 13 Felder als Karten mit Progress-Bar + Score
- CTA: "Masterclass starten" → navigiert zu /masterclass

**Speicherung:**
- Nach Abschluss: Upsert in analysis_results (pro Feld)
- Upsert in analysis_sessions (Gesamt + PRIOs)
- Score pro Feld = Durchschnitt der 5 Antworten × 10

---

## Aufgabe 2: Masterclass (Route /masterclass)

### Datenbank (bereits vorhanden)
- `courses` — 13 Kurse, je mapped auf ein competency_field
- `modules` → `lessons` (4 Lektionen pro Kurs, mit video_url, market_value_impact)
- `lesson_progress` — user_id + lesson_id + completed + notes
- Trigger: Bei Completion → XP +25 + market_value_log Update (automatisch)

### Masterclass Dashboard (/masterclass)
Erstelle src/app/(app)/masterclass/MasterclassClient.js

- **Empfohlener Pfad** (oben, hervorgehoben):
  - Wenn Analyse vorhanden: Zeige PRIO 1-3 Kurse als "Dein Fokus" Cards
  - Card: Kursname + Feld-Icon + Score + Fortschritt + Marktwert-Impact ("+ €3.200")
  - Roter Akzent-Border links

- **Alle Module** (darunter, Grid):
  - 13 Kurs-Cards sortiert nach sort_order
  - Pro Card: Icon, Titel, Kategorie-Pill, Fortschritt (X/4 Lektionen), Marktwert-Badge
  - Completed: Grüner Haken
  - Klick → /masterclass/[courseId]

### Kurs-Player (/masterclass/[id])
Erstelle src/app/(app)/masterclass/[id]/page.js (Server) + CourseClient.js (Client)

**Layout: 2 Spalten**
- Links (70%): Video-Player + Content
- Rechts (30%): Lektionsliste als Sidebar

**Video-Player:**
- Erkennung: YouTube, Vimeo, Wistia, Loom, .mp4 → passender iframe/video-Tag
- Kein Video: Platzhalter mit "Video wird noch hinzugefügt"
- Responsive 16:9 Ratio

**Content-Bereich (unter Video):**
- Lektion-Titel (H2) + Typ-Pill (Video/Lektion/Übung)
- Beschreibung
- Kerninhalt (content Feld)
- Übungsaufgabe (exercise Feld) in hervorgehobener Box
- Notizfeld (Textarea, speichert in lesson_progress.notes)
- "Als erledigt markieren" Button → Upsert in lesson_progress
- Marktwert-Badge: "+ €800 Marktwert"

**Lektions-Sidebar:**
- Alle Lektionen des Kurses
- Status: ✓ (completed grün), ▶ (current), ○ (locked/open)
- Klick navigiert zwischen Lektionen
- Fortschritts-Header: "2 / 4 abgeschlossen"

---

## Implementierungsreihenfolge
1. AnalyseClient.js (Fragen-Flow + Score-Berechnung + Speicherung)
2. Radar-Chart SVG Komponente
3. Ergebnis-Anzeige mit PRIO-Logik
4. MasterclassClient.js (Dashboard mit Kurs-Grid)
5. CourseClient.js (Player mit Video-Embed + Lektionsliste)
6. Fortschritts-Tracking (lesson_progress Upsert)
7. Git commit + push

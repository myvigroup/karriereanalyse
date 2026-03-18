# MASTER BUILD PROMPT — Karriere-Institut OS v3

## Kontext
Du arbeitest am Karriere-Institut OS — ein Karriere-Betriebssystem für Fach- und Führungskräfte (18-40 Jahre).
Tech: Next.js 14 (App Router) + Supabase + Vercel.
Design: Apple-Ästhetik — lies `src/app/globals.css` für CSS-Variablen und Klassen.
Pattern-Referenz: `src/app/(app)/dashboard/DashboardClient.js` zeigt wie Client-Komponenten aufgebaut sind.

## REGEL #1: Design NICHT ändern
- Lies globals.css ZUERST
- Nutze bestehende Klassen: .card, .btn, .btn-primary, .btn-secondary, .pill, .progress-bar, .page-container, .page-title, .page-subtitle, .grid-2, .grid-3, .grid-4, .animate-in
- Font: Instrument Sans (bereits geladen)
- Farben: var(--ki-red) #CC1426, var(--ki-charcoal) #353A3B, var(--ki-bg) #FBFBFD
- Buttons: borderRadius var(--r-pill), Cards: borderRadius var(--r-lg)
- ÄNDERE NICHTS an globals.css, Sidebar.js oder layout.js

## Was bereits existiert (NICHT neu bauen)
Fertige Seiten mit Client-Komponenten:
- /auth/* (Login, Register, Passwort-Reset, Callback)
- /dashboard (DashboardClient.js — 8 Datenquellen)
- /analyse (AnalyseClient.js — 65-Fragen-Flow, Radar-Chart, PRIO 1-3)
- /masterclass (MasterclassClient.js — Kurs-Grid mit ROI-Badges)
- /pre-coaching (PreCoachingClient.js — Upload, Status, KI-CV-Check)
- /applications (ApplicationsClient.js — 5-Spalten Kanban, Drag&Drop)
- /marktwert (MarktwertClient.js — CountUp, Area-Chart, Gehaltslücke)
- /salary-log (SalaryLogClient.js — Verhandlungs-Log)
- /network (NetworkClient.js — Stakeholder-Map, Re-Connect)
- /branding (BrandingClient.js — LinkedIn-Headline, Sichtbarkeits-Score)
- /strategy/decision (DecisionClient.js — 10-Fragen Entscheidungskompass)
- /strategy/exit (ExitPlannerClient.js — Abfindungsrechner, Checkliste)
- /coach (CoachClient.js — KI-Chat mit Context)
- /gehalt (GehaltClient.js — Benchmarks, Perzentile, Beitragen)

Fertige API-Routes:
- /api/analyze-cv, /api/generate-report, /api/linkedin-analyze
- /api/interview-briefing, /api/coach-chat

Fertige Logik:
- src/lib/career-logic.js (Scoring, PRIO, Marktwert, Level, Empfehlungen)
- src/lib/ai-provider.js (Claude API + Mock-Fallback)

Datenbank: 4 SQL-Migrationen mit 27+ Tabellen (bereits in Supabase ausgeführt)
Sidebar: 15 Nav-Items + 3 Admin (bereits konfiguriert)

---

## DEINE AUFGABEN — Was noch gebaut werden muss

### Phase 1: Masterclass-Player (PRIORITÄT)
Datei: `src/app/(app)/masterclass/[id]/page.js` + `CoursePlayerClient.js`

Server-Component (`page.js`):
- Lade Kurs mit Modulen + Lektionen: `courses.select('*, modules(*, lessons(*))').eq('id', params.id)`
- Lade lesson_progress für den User
- Lade analysis_results für Stärken-Match

Client-Component (`CoursePlayerClient.js`):
Layout: 2 Spalten — Links (70%) Video+Content, Rechts (30%) Lektionsliste

Video-Player:
- Erkennung: YouTube (youtube.com, youtu.be) → iframe, Vimeo → iframe, Wistia → iframe, .mp4 → video-Tag
- Kein Video: Platzhalter "Video wird noch hinzugefügt"
- Audio-Toggle: [📺 Video | 🎧 Audio] — wenn lessons.audio_url vorhanden
- Responsive 16:9

Content (unter Video):
- Lektions-Titel (h2) + Typ-Pill (Video/Lektion/Übung) + Dauer
- Beschreibung (lessons.description)
- Kerninhalt (lessons.content) in styled Box
- Übung (lessons.exercise) in hervorgehobener Box mit Icon
- Notizfeld (textarea → speichert in lesson_progress.notes via Supabase upsert)
- "Als erledigt markieren" Button → upsert lesson_progress(completed: true)
- Marktwert-Badge: "+€{lessons.market_value_impact} Marktwert"
- Navigation: "← Zurück" / "Weiter →" zwischen Lektionen

Lektions-Sidebar (rechts):
- Kurs-Titel + Fortschritt "X/Y abgeschlossen"
- Progress-Bar
- Alle Lektionen als Liste: ✓ (grün, completed), ▶ (aktuelle), ○ (offen)
- Klick navigiert zur Lektion
- Sticky (position: sticky, top: 24px)

### Phase 2: Profil-Seite
Datei: `src/app/(app)/profile/page.js` überschreiben + `ProfileClient.js` erstellen

Lade: profile, user_badges + badges, analysis_session, lesson_progress count, certificates

UI:
- Avatar (Initialen-Kreis, 80px, var(--ki-red))
- Name, E-Mail, Unternehmen, Position — editierbar (Inline-Edit oder Modal)
- Gehalt-Einstellungen: Aktuelles Gehalt + Zielgehalt + Karriereziel
- Stat-Grid (4 Kacheln): KI-Points, Level, Lektionen abgeschlossen, Zertifikate

Badge-Showcase:
- Alle Badges aus der badges-Tabelle als Grid
- Verdiente: Hervorgehoben, farbig, mit earned_at Datum
- Offene: Ausgegraut, bei Hover: "Was muss ich tun?" Tooltip mit condition_type

XP-Verlauf (wenn xp_history Tabelle existiert):
- Timeline der letzten 20 XP-Events

Alumni Check-in (wenn phase === 'alumni'):
- Formular: Aktuelles Gehalt, Position, Firma, Zufriedenheit (1-10), Testimonial
- Speichert in alumni_checkins

### Phase 3: Karrierepfad
Datei: `src/app/(app)/career/page.js` überschreiben + `CareerClient.js` erstellen

UI:
- Level-Timeline: 6 Stufen vertikal (Newcomer → Executive)
- Aktuelles Level hervorgehoben (var(--ki-red) Border + Scale)
- Pro Level: Icon, Titel, Min-XP, beschriebene Benefits
- Fortschrittsbalken zum nächsten Level (nutze getLevelProgress aus career-logic.js)
- "Was fehlt noch?" Checkliste: Lektionen, Analyse, Zertifikate

Zertifikate-Sektion:
- Verdiente Zertifikate als Cards mit Download-Button
- Verfügbare Zertifikate mit Anforderungen
- "Prüfung starten" Button (für certified_professional)

### Phase 4: Admin-Bereich

#### /admin/coaching — Coaching-Cockpit
Lade: Alle profiles, user_momentum View, activity_log, analysis_results aggregiert

Stat-Cards (4er Grid):
- Aktive Coachees, Ø Analyse-Score, Lektionen gesamt, Angebote erhalten

Frühwarnsystem:
- Banner: "X Coachees brauchen Aufmerksamkeit"
- Rote Cards für User mit >5 Tagen Inaktivität

Coachee-Liste:
- Tabelle: Name, Phase-Pill, Score, Fortschritt %, Momentum-Status (farbig)
- Klick → Detail-Panel (Slide-in):
  - Analyse-Ergebnisse (Mini-Liste mit Scores)
  - Masterclass-Fortschritt
  - Bewerbungen (Status-Übersicht)
  - Coaching-Notizen (Textarea, speichert in coaching_sessions)
  - "Impuls senden" Button → erstellt Notification für den User

#### /admin/users — Nutzerverwaltung
Lade: Alle profiles mit career_documents count

Tabelle: Avatar, Name, E-Mail, Rolle (Pill), Phase (Pill), Level, XP, Registriert
Suchfeld + Filter (Alle/Pre-Coaching/Active/Alumni)

Aktionen pro User:
- Rolle ändern (user/coach/admin) → Dropdown → Supabase update
- Phase ändern → Dropdown
- "Dokumente prüfen" → Modal:
  - Alle career_documents des Users als Liste
  - Pro Dokument: Status-Badge + Dateiname
  - "Datei ansehen" → öffnet Supabase Storage URL (supabase.storage.from('career-documents').getPublicUrl(path))
  - Buttons: "Akzeptieren" (→ status: accepted) / "Ablehnen" (→ status: rejected + Grund-Input)

#### /admin/courses — Kursverwaltung
Lade: Alle courses mit modules + lessons

Kurs-Übersicht:
- Aufklappbare Cards (Accordion)
- Pro Kurs: Titel, Kategorie, Lektionen-Count, "X/Y Videos hinterlegt"
- Published-Toggle

Lektion-Editor (pro Lektion):
- Titel, Beschreibung, Content (Textarea), Exercise (Textarea)
- Video-URL + Audio-URL Felder
- Typ-Dropdown (video/lesson/exercise), Dauer, Marktwert-Impact
- Sortierung (Nummer oder ▲▼ Buttons)
- Speichern → Supabase update

### Phase 5: Verbleibende Integrationen

#### Interview-Briefing im Kanban
In ApplicationsClient.js erweitern:
- Wenn status === 'interview': Zeige "📋 Briefing" Button
- Klick → fetch /api/interview-briefing mit company_name + position
- Ergebnis als Modal: Firmen-Info, 5 Fragen, STAR-Template, Stärken-Match

#### Notification Center
In Sidebar.js erweitern:
- Glocken-Icon oben rechts mit Badge (ungelesene Anzahl)
- Klick → Dropdown mit Notifications aus der notifications-Tabelle
- Pro Notification: Typ-Icon, Titel, Content, Zeitstempel
- Klick → markiert als gelesen + navigiert zu link
- "Alle gelesen" Button

#### Impostor-Score
In AnalyseClient.js erweitern (Ergebnis-Seite):
- Berechne gap = market_value_percentile - self_assessment_score
- Wenn gap > 15%: Zeige "Confidence-Box":
  "Du unterschätzt deinen Marktwert um {gap}%. Modul-Empfehlung: Gehaltsverhandlung"
- Speichere in profiles.impostor_score

#### Report Sharing
Auf Analyse-Ergebnisseite:
- Button "📤 Report teilen"
- Modal: Name + E-Mail eingeben, Toggle "Anonymisiert"
- Erstellt Eintrag in shared_reports mit share_token
- Zeigt kopierbaren Link: /shared/{token}

Neue Route: /shared/[token]/page.js (NICHT im (app) Layout, kein Auth!)
- Lädt shared_reports by token
- Zeigt Analyse-Radar + PRIOs + Marktwert (basierend auf sections_visible)
- Kommentar-Box: Text eingeben → speichert in comments JSONB

---

## Implementierungsreihenfolge
1. Masterclass-Player (/masterclass/[id]) — das brauchen die User am dringendsten
2. Admin Kursverwaltung — damit Videos eingetragen werden können
3. Profil-Seite — Badge-Showcase + Settings
4. Admin Users — Dokument-Prüfung
5. Admin Coaching — Frühwarnsystem
6. Karrierepfad — Level-Timeline
7. Interview-Briefing Integration
8. Notification Center
9. Impostor-Score + Report Sharing
10. Git add, commit "🚀 Full build: Player, Admin, Profil, Karrierepfad, Notifications", push

## WICHTIG
- Lies globals.css BEVOR du anfängst
- Lies die bestehenden Client-Komponenten als Pattern-Referenz
- Nutze `createClient` aus `@/lib/supabase/client` für Client-Komponenten
- Nutze `createClient` aus `@/lib/supabase/server` für Server-Komponenten
- Jede Seite: Server-Component (page.js) lädt Daten, Client-Component rendert UI
- Alle Supabase-Calls mit Error-Handling (|| [] fallback)
- Apple-Design: Viel Weißraum, subtile Schatten, keine harten Borders

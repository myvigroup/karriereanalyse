# Claude Code Prompt: Strategische Module (Phase 2)

## Projektkontext
Projekt: Karriere-Institut OS (Next.js 14 + Supabase)
Neue Tabellen: 003_additional_modules.sql (bereits ausgeführt)
Design: Apple-Ästhetik, globals.css, bestehende Klassen nutzen
ÄNDERE NICHTS am Design-System, Sidebar oder Layout

---

## Modul 1: Interview-Briefing-Generator

### Trigger
Wenn im Bewerbungs-Kanban (/applications) ein Eintrag den Status "interview" hat:
- Zeige einen "📋 Briefing generieren" Button auf der Kanban-Card
- Klick → ruft /api/interview-briefing auf
- Ergebnis wird als Modal oder Detail-Panel angezeigt

### UI (im ApplicationsClient.js erweitern)
- **Briefing-Panel** (Slide-in von rechts):
  - Firmen-Infos (company_research)
  - 5 vorhergesagte Fragen (predicted_questions)
  - STAR-Story Template (vorausgefüllt mit Platzhaltern)
  - "Deine Top-Stärken für diese Stelle" (aus Analyse)
  - Notizfeld für eigene Vorbereitung
  - "Als PDF exportieren" Button

### Datenbank
- `interview_briefings` Tabelle bereits angelegt
- Verknüpfung über application_id

---

## Modul 2: Report Sharing (Vertrauenspersonen-Netzwerk)

### Neue Route: /api/share-report
- POST: Erstellt einen share_token, speichert in shared_reports
- Generiert einen öffentlichen Link: /shared/[token]

### Neue Route: /shared/[token] (NICHT hinter Auth!)
- Lädt Report über share_token
- Zeigt: Analyse-Radar, PRIO 1-3, Marktwert (je nach sections_visible)
- Kommentar-Box: Vertrauensperson kann Text hinterlassen
- Kein Login nötig

### UI auf Analyse-Ergebnisseite
- Button "📤 Report teilen" 
- Modal: Name + E-Mail der Vertrauensperson eingeben
- Toggle: "Anonymisiert teilen" (versteckt den Namen)
- Link wird generiert und kopierbar

---

## Modul 3: Impostor-Score Integration

### In AnalyseClient.js erweitern
- Nach der Ergebnis-Berechnung: Vergleiche self-assessment (Analyse-Score) mit market_value
- Berechnung: `impostor_gap = market_value_score - self_assessment_score`
- Wenn gap > 15%: Zeige "Confidence-Box":
  ```
  "Du unterschätzt deinen Marktwert um {gap}%. 
   Dein objektiver Wert liegt {gap}% über deiner Selbsteinschätzung.
   Modul-Empfehlung: Gehaltsverhandlung Intensiv"
  ```
- Speichere impostor_score und self_assessment_gap in profiles

---

## Modul 4: Coaching-Momentum (Dashboard-Widget)

### In DashboardClient.js erweitern
- Lade user_momentum View (days_inactive, momentum_status, active_days_21d)
- Zeige Momentum-Card:
  - Status: "In Flow" (grün, 15+ aktive Tage), "Aktiv" (blau), "Abkühlend" (gelb), "Inaktiv" (rot)
  - Text: "Dein letzter Fortschritt war vor {X} Tagen. Eine 15-Min-Lektion bringt dich +€{Y} näher."
  - Mini-Kalender: Letzte 21 Tage als Dot-Grid (grün = aktiv, grau = inaktiv)
  
---

## Modul 5: After-Coaching ROI (Alumni Check-in)

### Neue Route: /profile (erweitern)
- Wenn profile.phase === 'alumni':
  - Zeige "Quartals-Check-in" Card
  - Formular: Aktuelles Gehalt, Position, Unternehmen, Zufriedenheit (1-10), Testimonial
  - Speichert in alumni_checkins
  - Zeige historische Check-ins als Timeline

### Admin-Dashboard erweitern
- Aggregierte Stats: "Durchschn. Gehaltssteigerung: +34%"
- Testimonials-Sammlung für Marketing

---

## Modul 6: Audio-Bridging (Masterclass erweitern)

### Im Kurs-Player
- Toggle: [📺 Video | 🎧 Audio]
- Audio-Modus: 
  - Großes Cover-Art (Kurs-Thumbnail oder Gradient)
  - HTML5 Audio Player (play/pause, scrub, +/-15s)
  - Verwendet lessons.audio_url
- XP wird bei >90% Abspielzeit vergeben (gleiche Logik wie Video)

### Admin Kursverwaltung erweitern
- Neues Feld pro Lektion: "Audio-URL" (neben Video-URL)

---

## Implementierungsreihenfolge
1. Interview-Briefing in ApplicationsClient integrieren
2. Report Sharing API + /shared/[token] Route
3. Impostor-Score in AnalyseClient
4. Momentum-Widget im Dashboard
5. Alumni Check-in im Profil
6. Audio-Toggle im Masterclass-Player
7. Git commit + push

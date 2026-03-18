# Claude Code Prompt: Pre-Coaching, Bewerbungs-Tracker & Marktwert

## Projektkontext
Projekt: Karriere-Institut OS (Next.js 14 + Supabase)
Design: Apple-Ästhetik — globals.css lesen, bestehende Klassen nutzen
ÄNDERE NICHTS am Design-System, Sidebar oder Layout

---

## Aufgabe 1: Dokumenten-Safe (/pre-coaching)

### Datenbank (bereits vorhanden)
- `career_documents` — user_id, doc_type, doc_label, status (missing/pending/accepted/rejected/feedback), file_path, ai_analysis
- Storage Bucket: `career-documents` mit RLS
- Trigger: Bei Registrierung werden automatisch 5 Dokument-Einträge erstellt

### UI
Erstelle src/app/(app)/pre-coaching/PreCoachingClient.js

**Fortschrittsbalken oben:**
- "Noch X Dokumente bis zum Profil-Check"
- Progress: akzeptierte / pflicht-dokumente
- Bei 100%: Konfetti-Animation + "Dein Profil ist komplett!"

**Dokumenten-Liste (5 Cards):**
Jedes Dokument als Card mit Status-Indikator:
- `missing` → Graue Card, Upload-Button (Drag & Drop oder Click)
- `pending` → Gelbe Card "Wird geprüft..." mit Spinner
- `accepted` → Grüne Card mit Haken + Dateiname
- `rejected` → Rote Card mit Ablehnungsgrund + Re-Upload Button
- `feedback` → Blaue Card mit KI-Analyse-Ergebnis (ai_analysis JSON)

**Upload-Logik:**
```javascript
// 1. File in Supabase Storage hochladen
const path = `${userId}/${docType}/${file.name}`;
await supabase.storage.from('career-documents').upload(path, file);

// 2. DB-Eintrag aktualisieren
await supabase.from('career_documents').update({
  status: 'pending',
  file_path: path,
  file_name: file.name,
  uploaded_at: new Date().toISOString()
}).eq('user_id', userId).eq('doc_type', docType);
```

**"KI-Analyse starten" Button** (nur bei Lebenslauf):
- Zeigt Lade-Animation
- Speichert Ergebnis als JSON in ai_analysis
- Zeigt 3 Kategorien: Stärken (grün), Optimierung (gelb), Fehlende Keywords (rot)
- Für MVP: Mock-Response, echte Claude API kommt in Phase 2

---

## Aufgabe 2: Bewerbungs-Tracker (/applications)

### Datenbank (bereits vorhanden)
- `applications` — company_name, position, status (research/applied/interview/assessment/offer/rejected/accepted), priority, salary_range, notes, interview_date, coach_feedback

### UI: Kanban-Board
Erstelle src/app/(app)/applications/ApplicationsClient.js

**Layout: 5 Spalten horizontal scrollbar**
- 🔍 Recherche
- ✉️ Beworben
- 📅 Interview
- 🏆 AC / Finale
- 🤝 Angebot

**Karten-Design (Apple Glassmorphism):**
- Firmen-Initial als Avatar (erstes Zeichen, farbiger Kreis)
- Firmenname (bold) + Position
- Gehaltsrange als dezentes Label
- Priorität als farbiger Dot (1=rot, 2=gelb, 3=grau)
- Interview-Datum falls vorhanden
- Coach-Feedback Icon falls vorhanden

**Drag & Drop:**
- Nutze native HTML5 Drag & Drop (kein externes Package nötig)
- onDragStart: Card wird halbtransparent
- onDrop: Status in Supabase updaten
- Wenn Card auf "Angebot" gezogen: Dezente Erfolgs-Animation

**Quick-Add Button:**
- Floating "+ Neue Bewerbung" unten rechts
- Modal mit: Firma, Position, Gehaltsrange, Notizen
- Speichert als `research` Status

**Empty State:**
- "Noch keine Bewerbungen" + CTA "Erste Opportunity hinzufügen"

---

## Aufgabe 3: Marktwert-Cockpit (/marktwert)

### Datenbank (bereits vorhanden)
- `market_value_log` — base_value, skill_bonus, total_value (computed), lessons_completed, date
- `profiles` — current_salary, target_salary
- Trigger: Bei lesson_progress Completion → automatisch market_value_log Update

### UI
Erstelle src/app/(app)/marktwert/MarktwertClient.js

**Hauptzahl (Hero):**
- Große animierte Zahl: "Dein aktueller Marktwert: €92.450"
- Animiert von 0 hochzählen (CountUp Effekt mit requestAnimationFrame)
- Darunter: Differenz zum Ziel in Pill ("Noch €27.550 bis €120.000")

**Marktwert-Chart:**
- SVG Area-Chart: X = Datum, Y = total_value
- Letzte 30 Tage aus market_value_log
- Filled area mit var(--ki-red) bei 10% opacity
- Hover: Tooltip mit Datum + Wert

**Gehaltslücke:**
- Horizontaler Balken: Aktuell → Ziel
- Markierung wo der User steht
- "Noch X Lektionen für +€Y Marktwert"

**Leistungs-Impact-Liste:**
- Abgeschlossene Lektionen sortiert nach market_value_impact
- Pro Lektion: Titel + "+ €800 Marktwert"
- Noch offene Lektionen ausgegraut: "Potenzial: + €2.500"

**Gehalt-Einstellungen:**
- Felder: Aktuelles Gehalt + Zielgehalt (editierbar)
- Speichert in profiles.current_salary / target_salary

---

## Aufgabe 4: Profil (/profile)

### UI
Erstelle src/app/(app)/profile/ProfileClient.js

- Avatar (Initialen-Kreis, var(--ki-red))
- Name, E-Mail, Unternehmen, Position (editierbar)
- Stat-Grid: KI-Points, Level, Lektionen, Badges
- Badge-Showcase: Verdiente Badges hervorgehoben, offene ausgegraut mit "Was muss ich tun?"
- Abmelden-Button

---

## Implementierungsreihenfolge
1. PreCoachingClient.js (Upload + Status-Cards)
2. ApplicationsClient.js (Kanban + Drag & Drop)
3. MarktwertClient.js (CountUp + Chart + Gehaltslücke)
4. ProfileClient.js (Profil + Badges)
5. Git commit + push

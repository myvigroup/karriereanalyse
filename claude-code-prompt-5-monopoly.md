# Claude Code Prompt: Monopol-Features (Phase 3)

## Projektkontext
Projekt: Karriere-Institut OS (Next.js 14 + Supabase)
Neue Tabellen: 004_monopoly_modules.sql (bereits ausgeführt)
Design: Apple-Ästhetik, globals.css, bestehende Klassen nutzen

---

## Modul 1: Zertifikate (Karriere-Institut Certified Professional)

### Neue Route: /career (erweitern)
- Zeige Zertifikate-Sektion: Verdiente + verfügbare Zertifikate
- Zertifikatstypen:
  - "Analyse abgeschlossen" → Automatisch nach 13-Felder-Analyse
  - "Masterclass Graduate" → Automatisch nach allen 13 Kursen
  - "Negotiation Pro" → Nach Gehaltsverhandlungs-Modul + Score > 80%
  - "Certified Professional" → Prüfung (30 Min, KI-generiert, Score > 70%)

### Zertifikat-Design (PDF/HTML):
- Clean, Apple-style: Großes KI-Logo, Zertifikatsnummer, Name, Datum
- QR-Code der auf /verify/[certificate_number] verweist
- "Als PDF herunterladen" Button

### Prüfungs-Engine:
- 20 Multiple-Choice-Fragen (aus allen 13 Feldern)
- 30 Minuten Zeitlimit
- Score > 70% = bestanden
- Speichert in certificates Tabelle

---

## Modul 2: Notification Center

### UI: Glocken-Icon in der Sidebar (oben rechts)
- Badge mit ungelesener Anzahl
- Klick öffnet Dropdown/Panel mit Notifications
- Pro Notification: Icon (nach type), Titel, Text, Zeitstempel, Link
- "Alle gelesen" Button
- Klick auf Notification → markiert als gelesen + navigiert zu link

### Trigger-Punkte (wo Notifications erstellt werden):
- Welcome (bereits via DB-Trigger)
- Lektion abgeschlossen → "Weiter so! Nächste Lektion: ..."
- 3 Tage inaktiv → "Dein Marktwert wartet auf dich — 15 Min reichen."
- Bewerbungsstatus geändert → "Deine Bewerbung bei X ist jetzt im Interview."
- Coach-Feedback → "Daniel hat Feedback zu deinem CV hinterlassen."

---

## Modul 3: Organizations (B2B Dashboard)

### Admin Route: /admin/organizations (neue Seite)
- Org-Übersicht: Name, Mitglieder, Plan, Erstellungsdatum
- "Neue Organisation" anlegen
- Org-Detail: Mitglieder-Liste, aggregierte Stats (avg XP, avg Score)
- "User zu Org zuweisen" (Dropdown in User-Verwaltung)

### Org-Admin Dashboard (für HR-Abteilungen):
- Login als User mit role 'admin' und organization_id
- Sieht NUR User der eigenen Org
- Stats: Durchschn. Analyse-Score, Kursfortschritt, Zertifikate
- Kann Kurse für die Org freischalten

---

## Modul 4: Peer-Matching

### Neue Route: /network (erweitern)
- Neuer Tab: "Accountability Partner"
- System schlägt Match vor basierend auf:
  - Ähnliches Level (±1)
  - Ähnliche Branche oder Region
  - Komplementäre Schwächen (User A stark wo User B schwach)
- Match-Card: Name (optional anonym), Level, Top-3-Stärken
- "Verbinden" Button → erstellt peer_match
- "15-Min Weekly Check-in" Erinnerung

### Datenschutz:
- Opt-in erforderlich (Toggle in Profil-Settings)
- Nur Vorname + Level + Stärken sichtbar (keine E-Mail)
- Chat über die Plattform (nicht extern)

---

## Modul 5: XP-History & Gamification

### In Profil erweitern:
- "XP-Verlauf" Tab: Timeline aller XP-Events
- Pro Event: Datum, Typ, Beschreibung, +XP
- Gesamt-Statistik: Total XP, XP diese Woche, XP diesen Monat

### XP-Events (in activity_log loggen):
- Lektion: +25 XP
- Kurs abgeschlossen: +100 XP
- Analyse abgeschlossen: +100 XP
- Dokument hochgeladen: +50 XP
- Gehaltsdaten beigetragen: +50 XP
- Bewerbung hinzugefügt: +10 XP
- Angebot erhalten: +200 XP
- Zertifikat erhalten: +500 XP

---

## Implementierungsreihenfolge
1. Notification Center (Sidebar-Integration + Panel)
2. Zertifikate (Prüfungs-Engine + PDF)
3. Organizations (Admin-Seite + Org-Dashboard)
4. Peer-Matching (Matching-Algorithmus + UI)
5. XP-History (Profil-Erweiterung)
6. Git commit + push

# Klausurtagung — Prozess-Map Karriere-Institut

## Ziel dieses Dokuments
Wir gehen den gesamten Prozess einmal durch — vom Erstkontakt auf der Karrieremesse bis zum zahlenden Masterclass-Kunden. Für jeden Schritt klären wir: Was passiert? Wo ist der Absatz (Upsell/Conversion-Punkt)? Was muss automatisiert werden?

---

## Phase 0: Erstkontakt — Karrieremesse

**Touchpoint:** Stand auf der Karrieremesse, Vortrag, Workshop

**Was passiert:**
- Besucher kommt an den Stand / hört den Vortrag
- Erstes Gespräch, Pain-Point wird identifiziert (Gehalt zu niedrig, keine Klarheit, Bewerbungsfrust)
- Angebot: "Kostenloser Lebenslauf-Check — scann den QR-Code"

**Conversion-Ziel:** QR-Code scannen → Landing Page → E-Mail eintragen

**Offene Fragen für die Klausur:**
- Wie sieht die Landing Page aus? Gibt es sie schon oder müssen wir sie bauen?
- Welche Daten erfassen wir beim Erstkontakt? (Nur E-Mail? Oder auch Name, Beruf, Gehaltsspanne?)
- Gibt es ein Messe-spezifisches Angebot / Goodie als Incentive?
- Tracken wir, von welcher Messe der Lead kommt? (UTM-Parameter, QR-Code pro Messe)

---

## Phase 1: Lebenslauf-Check (Lead-Magnet)

**Touchpoint:** E-Mail mit Link zum CV-Upload oder direkt auf der Landing Page

**Was passiert:**
1. User lädt seinen Lebenslauf hoch
2. KI-Analyse läuft (euer `/api/analyze-cv` Endpoint existiert bereits)
3. User bekommt Ergebnis: Stärken, Schwächen, konkretes Feedback

**Conversion-Ziel:** Von anonymem Messe-Lead → registrierter Portal-Nutzer

**Absatz-Punkt #1 — Auf der Ergebnis-Seite des CV-Checks:**
- "Dein Lebenslauf hat Potenzial. Aber weißt du, was du wirklich wert bist? → Starte die kostenlose Karriereanalyse (65 Fragen)"
- "Dein CV zeigt Lücken bei [X]. Unsere Masterclass [Y] schließt genau diese Lücke."
- CTA: "Jetzt kostenlos registrieren und dein volles Ergebnis freischalten"

**Offene Fragen für die Klausur:**
- Ist der CV-Check komplett kostenlos und ohne Registrierung? Oder braucht man schon einen Account?
- Wie viel vom Ergebnis zeigen wir ohne Registrierung? (Teaser vs. Vollversion)
- Gibt es eine E-Mail-Sequenz nach dem CV-Check, wenn der User sich NICHT registriert?
- Zeitfenster: Wie lange nach der Messe ist das Angebot gültig?

---

## Phase 2: Portal-Registrierung

**Touchpoint:** Sign-up auf dem Karriere-Institut OS

**Was passiert:**
1. User registriert sich (Name, E-Mail, Passwort)
2. Onboarding-Flow: Beruf, Branche, Gehalt, Karriereziel
3. Welcome-Notification wird getriggert (existiert bereits in der DB)
4. Dashboard wird angezeigt

**Conversion-Ziel:** Vom registrierten Nutzer → aktiver Nutzer (erste Aktion im Portal)

**Absatz-Punkt #2 — Direkt nach der Registrierung:**
- Geführter Onboarding-Flow: "Was ist dein nächstes Ziel?" → Passende Empfehlung:
  - "Ich will mehr Gehalt" → Karriereanalyse + Masterclass Gehaltsverhandlung
  - "Ich will mich bewerben" → Lebenslauf-Check + Bewerbungs-Kanban
  - "Ich weiß nicht, ob ich bleiben oder gehen soll" → Entscheidungs-Kompass
  - "Ich will mich generell weiterentwickeln" → Karriereanalyse (65 Fragen)

**Offene Fragen für die Klausur:**
- Gibt es eine Freemium-Stufe? Was kann der User kostenlos nutzen vs. was ist hinter einer Paywall?
- Wie sieht das Pricing-Modell aus? (Einmalzahlung, Abo, Kurs-basiert?)
- Welche Module sind kostenlos, welche kostenpflichtig?

---

## Phase 3: Aktivierung — Erste Wertschöpfung

**Touchpoint:** User nutzt das erste kostenlose Tool im Portal

**Mögliche Einstiegspunkte (je nach Onboarding-Antwort):**

### Pfad A: Karriereanalyse (65 Fragen)
- User durchläuft den Fragebogen
- Ergebnis: Radar-Chart, PRIO 1-3, Marktwert-Einschätzung, Impostor-Score
- **Absatz-Punkt #3a:** "Deine Top-Priorität ist [Gehaltsverhandlung]. Starte jetzt die Masterclass dazu."

### Pfad B: Entscheidungs-Kompass
- 10 Fragen: Bleiben oder Gehen?
- Ergebnis: Klare Empfehlung mit Begründung
- **Absatz-Punkt #3b:** Je nach Ergebnis:
  - Gehen → "Bereite dich vor: Masterclass Bewerbungsstrategie + Exit-Strategie"
  - Bleiben → "Optimiere deine Position: Masterclass Gehaltsverhandlung"

### Pfad C: Marktwert-Cockpit
- User sieht seinen berechneten Marktwert
- Gehaltslücke wird visualisiert
- **Absatz-Punkt #3c:** "Du lässt €X.XXX auf dem Tisch liegen. Lerne verhandeln."

**Offene Fragen für die Klausur:**
- Welche Tools sind der "Aha-Moment" — wo sagt der User: "Das ist richtig gut, ich will mehr"?
- Wie messen wir den Aktivierungserfolg? (Erste Analyse abgeschlossen? Ersten Kurs gestartet?)

---

## Phase 4: Monetarisierung — Masterclass-Buchung

**Touchpoint:** User bucht eine kostenpflichtige Masterclass

**Bestehendes Angebot (13 Kurse im System):**
- Gehaltsverhandlung (5 Module, bereits vollständig mit Skripten)
- + 12 weitere Kurse (Bewerbungsstrategie, LinkedIn-Branding, Exit-Strategie, etc.)

**Absatz-Punkte — Wo im Portal die Buchung getriggert wird:**

| Trigger-Stelle | Empfohlener Kurs | Logik |
|---|---|---|
| Nach Karriereanalyse | Kurs mit höchster PRIO-Relevanz | Algorithmus aus `career-logic.js` |
| Nach CV-Check (Schwächen) | Kurs der die Schwäche adressiert | Mapping Schwäche → Kurs |
| Nach Entscheidungs-Kompass | Bewerbung ODER Gehaltsverhandlung | Je nach Ergebnis |
| Im Marktwert-Cockpit | Gehaltsverhandlung | Wenn Gehaltslücke > 10% |
| Nach X Tagen Inaktivität | Nudge per E-Mail/Notification | Re-Engagement |
| Im KI-Coach Chat | Kontextbasierte Empfehlung | Coach schlägt Kurs vor |
| Gehaltsdatenbank | Gehaltsverhandlung | Nach Benchmark-Vergleich |

**Offene Fragen für die Klausur:**
- Preis pro Masterclass? Bundle-Preis? All-Access-Pass?
- Gibt es eine kostenlose Lektion als Teaser pro Kurs?
- Zahlungsanbieter? (Stripe, Digistore, CopeCart?)
- Gibt es zeitlich begrenzte Angebote? (z.B. "Innerhalb von 48h nach Analyse: 30% Rabatt")

---

## Phase 5: Kurs-Durchführung & Engagement

**Touchpoint:** User arbeitet sich durch die Masterclass

**Was passiert:**
1. Video-Lektionen + Übungen + Notizen
2. XP-Punkte und Level-Ups (Gamification)
3. Marktwert steigt sichtbar im Cockpit
4. KI-Coach steht begleitend zur Verfügung
5. Badges werden freigeschaltet

**Absatz-Punkt #5 — Cross-Selling während des Kurses:**
- "Du hast Gehaltsverhandlung abgeschlossen. Nächster logischer Schritt: LinkedIn-Branding"
- "Dein Analyse-Score zeigt: Bewerbungsstrategie ist deine #2 Priorität"
- Zertifikat als Motivation: "Schließe noch 2 Kurse ab für das Certified Professional Zertifikat"

**Offene Fragen für die Klausur:**
- Gibt es Live-Coaching-Sessions als Add-on zu den Masterclasses?
- Begleit-Community (Slack, Discord, Forum)?
- Zeitliche Struktur: Selbstlern-Tempo oder wochenbasiert?

---

## Phase 6: Verhandlung & Ergebnis

**Touchpoint:** User setzt das Gelernte um

**Was passiert:**
1. Bewerbungs-Kanban wird aktiv genutzt
2. Interview-Briefings werden generiert
3. Gehaltsverhandlung wird geführt
4. Ergebnis wird im Gehalts-Tagebuch dokumentiert

**Absatz-Punkt #6 — Premium-Upsell:**
- 1:1 Coaching-Session vor der Verhandlung ("Generalprobe mit Coach Daniel")
- Exit-Strategie-Paket (Abfindungsrechner + juristische Checkliste)
- Peer-Matching: "Verhandle nicht allein — finde deinen Accountability Partner"

**Offene Fragen für die Klausur:**
- Gibt es ein 1:1-Coaching-Angebot? Wie ist das preislich positioniert?
- Erfolgsbasierte Komponente? ("Wenn du X€ mehr verhandelst, zahlst du Y%")

---

## Phase 7: Alumni & Retention

**Touchpoint:** User hat sein Ziel erreicht (neuer Job, höheres Gehalt)

**Was passiert:**
1. Alumni-Check-in (Quartals-Formular: neues Gehalt, Position, Zufriedenheit)
2. Testimonial wird gesammelt
3. User bleibt im System für den nächsten Karriereschritt

**Absatz-Punkt #7 — Langfristige Monetarisierung:**
- Alumni-Abo: "Behalte Zugriff auf alle Tools + Updates für €X/Monat"
- Nächste Stufe: Führungskräfte-Masterclass, Management-Skills
- Empfehlungsprogramm: "Empfiehl uns weiter → X€ Gutschrift"
- B2B-Brücke: "Bring das Karriere-Institut in dein Unternehmen"

**Offene Fragen für die Klausur:**
- Wie bleibt der Alumni-Zugang erhalten? Dauerhaft kostenlos oder Abo?
- Referral-Programm: Wie sieht das konkret aus?
- Alumni-Events (digital oder physisch)?

---

## Zusammenfassung: Die 7 Absatz-Punkte auf einen Blick

```
MESSE → CV-Check → Registrierung → Aktivierung → Masterclass → Umsetzung → Alumni
  |         |            |              |              |             |           |
  v         v            v              v              v             v           v
QR-Code   "Jetzt      Onboarding    Analyse →     Cross-Sell   1:1 Coach   Abo /
scannen   registrie-  "Was ist      Kurs-         während      Premium     Referral
          ren"        dein Ziel?"   Empfehlung    des Kurses   Upsell      B2B
```

---

## Nächste Schritte nach der Klausur

1. **Pricing-Modell definieren** — Was ist kostenlos, was kostet was?
2. **E-Mail-Automation aufsetzen** — Sequenzen für jeden Absatz-Punkt
3. **Landing Page bauen** — Messe-spezifisch mit CV-Check als Lead-Magnet
4. **Empfehlungslogik verfeinern** — Welcher Trigger führt zu welchem Kurs?
5. **Zahlungssystem integrieren** — Stripe/CopeCart an das Portal anbinden
6. **KPI-Dashboard bauen** — Conversion-Rate pro Phase tracken

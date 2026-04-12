# Motion Graphics Master-Prompt – Gehaltsverhandlung Mastery VSL

## Kontext

Du baust alle Motion-Graphic-Overlays für ein Video Sales Letter (VSL) des Karriere Instituts. Das Video ist ca. 3:45 Min. lang, Talking-Head-Format. Die Overlays werden über den Sprecher gelegt oder als Fullscreen-Inserts geschnitten.

---

## Branding-Vorgaben (zwingend einhalten)

| Token | Wert | Verwendung |
|---|---|---|
| Primärfarbe | `#CC1426` | CTAs, Highlights, Akzente, Zahlen |
| Sekundärfarbe | `#2C2C2E` (Charcoal) | Hintergründe, Text |
| Hintergrund | `#FAFAF8` | Helle Flächen |
| Hintergrund Alt | `#F4F3F0` | Cards, Boxen |
| Border | `#E8E6E1` | Rahmen, Trennlinien |
| Text primär | `#1A1A1A` | Fließtext |
| Text sekundär | `#6B6B6B` | Unterzeilen |
| Erfolg/Grün | `#2D6A4F` | Positive Werte, Testimonial-Ergebnisse |
| Warnung/Gold | `#D4A017` | Sterne, Badges |
| Font | **Instrument Sans** | Alle Texte (Google Fonts) |
| Font-Gewichte | 400 (Regular), 600 (Semibold), 700 (Bold) | |
| Border-Radius | `16px` (Cards), `8px` (kleine Elemente), `980px` (Pills/Buttons) | |
| Logo | Rotes Quadrat `#CC1426` mit weißem "K", `border-radius: 8px` | Immer oben links oder im End-Screen |

### Animations-Stil
- Apple-inspiriert: `cubic-bezier(.25, 1, .5, 1)` Easing
- Sauber, minimal, keine Bounce-Effekte oder übertriebene Bewegungen
- Einblendungen: Fade-Up (opacity 0→1, translateY 20px→0) über 400ms
- Ausblendungen: Fade-Out über 250ms
- Zahlen-Counter: Linear hochzählen, kein Easing

---

## Technische Spezifikationen

| Parameter | Wert |
|---|---|
| Auflösung | 1920 × 1080px (Full HD) |
| Framerate | 30fps |
| Export-Format | `.mov` mit Alpha-Kanal (ProRes 4444) ODER `.webm` mit Alpha |
| Alternativ | HTML/CSS-Animationen als Browser-Source (OBS) oder Screen-Recording |
| Safe Zone Text | Mindestens 100px Abstand zu allen Rändern |
| Untertitel-Bereich | Unteres Drittel freihalten (y > 720px) – dort laufen Burned-In-Subtitles |

---

## Die 12 Motion-Graphic-Assets

Baue jedes Asset einzeln, exportierbar und unabhängig einsetzbar.

---

### ASSET 1: Daten-Overlay "Median-Gehalt"
**Timecode im VSL:** 00:05 – 00:12
**Typ:** Text-Overlay, untere rechte Ecke
**Inhalt:**
```
53.900 €
Median-Gehalt Deutschland
Stepstone Gehaltsreport 2026
```
**Design:**
- Zahl "53.900 €" in Instrument Sans Bold, 120px, Farbe `#CC1426`
- Unterzeile "Median-Gehalt Deutschland" in 28px Semibold, `#1A1A1A`
- Quelle "Stepstone Gehaltsreport 2026" in 16px Regular, `#9A9A9A`
- Hintergrund: halbtransparente Card `#FFFFFF` mit 90% Opacity, `border-radius: 16px`, leichter Schatten `0 8px 30px rgba(0,0,0,0.08)`
- Padding: 32px horizontal, 24px vertikal
- Position: rechts unten, 80px Abstand zu den Rändern
**Animation:**
- Einblendung: Fade-Up über 400ms
- Zahl zählt von 0 auf 53.900 in 1,5 Sekunden (linear)
- Ausblendung: Fade-Out nach 5 Sekunden

---

### ASSET 2: Daten-Overlay "37% verhandeln nie"
**Timecode:** 00:28 – 00:38
**Typ:** Fullscreen-Insert oder großes Overlay, zentriert
**Inhalt:**
```
37%
verhandeln NIE über ihr Gehalt
```
**Design:**
- "37%" in Instrument Sans Bold, 200px, Farbe `#CC1426`
- "verhandeln NIE über ihr Gehalt" in 36px Semibold, `#1A1A1A`
- "NIE" unterstrichen oder in `#CC1426` hervorgehoben
- Hintergrund: leicht gedimmtes Fullscreen `#FAFAF8` mit 95% Opacity ODER als schwebende Card
- Optional: Dezenter roter Glow hinter der Zahl `radial-gradient(circle, rgba(204,20,38,0.08), transparent)`
**Animation:**
- Zahl zählt von 0% auf 37% in 1,2 Sekunden
- Text erscheint nach Counter-Stop mit Fade-Up (200ms Verzögerung)
- "NIE" bekommt einen kurzen Scale-Pulse (1.0→1.05→1.0) über 300ms

---

### ASSET 3: Daten-Overlay "Unbehagen-Statistik"
**Timecode:** 00:38 – 00:50
**Typ:** Split-Overlay oder Vergleichsgrafik
**Inhalt:**
```
52% der Frauen
39% der Männer
empfinden Gehaltsfragen als unangenehm
```
**Design:**
- Zwei Balken nebeneinander (horizontal bar chart):
  - Linker Balken: 52%, Label "Frauen", Farbe `#CC1426`
  - Rechter Balken: 39%, Label "Männer", Farbe `#2C2C2E`
- Balken füllen sich animiert von 0% auf Zielwert
- Unterzeile "empfinden Gehaltsfragen als unangenehm" in 24px, `#6B6B6B`
- Card-Background wie Asset 1
**Animation:**
- Bars füllen sich gleichzeitig über 1 Sekunde, ease-out
- Prozentzahlen zählen synchron hoch
- Fade-Out nach 6 Sekunden

---

### ASSET 4: Daten-Overlay "Gender Pay Gap"
**Timecode:** 00:50 – 01:05
**Typ:** Card-Overlay, rechte Seite
**Inhalt:**
```
9,7%
Bereinigter Gender Pay Gap
Destatis 2025
```
**Design:**
- Identisches Card-Layout wie Asset 1
- "9,7%" in 100px Bold, `#CC1426`
- Optional: kleines Destatis-Logo oder Badge-Stil
- Unterzeile und Quelle wie bei Asset 1
**Animation:**
- Fade-Up, Zahl zählt von 0,0% auf 9,7% in 1 Sekunde
- Dezimale mitlaufen lassen (0,0 → 2,3 → 5,1 → 7,8 → 9,7)

---

### ASSET 5: Counter-Animation "500.000 €"
**Timecode:** 01:18 – 01:35
**Typ:** Fullscreen-Insert, zentriert, dramatisch
**Inhalt:**
```
€ 0 → € 500.000
Entgangenes Gehalt über ein Berufsleben
```
**Design:**
- Großer Counter zentriert: Instrument Sans Bold, 180px, `#CC1426`
- Euro-Zeichen vor der Zahl, mitlaufend formatiert (Tausenderpunkte)
- Unterzeile: 28px Semibold, `#6B6B6B`
- Hintergrund: `#2C2C2E` (Charcoal) Fullscreen mit leichtem Vignette-Effekt
- Wenn Counter bei 500.000 stoppt: kurzer roter Flash/Pulse über den gesamten Bildschirm (200ms, `rgba(204,20,38,0.15)`)
**Animation:**
- Counter läuft von 0 auf 500.000 in 4 Sekunden (linear, kein easing)
- Zwischenwerte: 0 → 24.000 → 120.000 → 280.000 → 420.000 → 500.000
- Bei Stop: 0,5 Sek. Freeze, dann roter Screen-Flash
- Zahl bleibt 3 Sekunden stehen
- Fade-Out über 500ms

---

### ASSET 6: Kurs-Logo / Titel-Card
**Timecode:** 01:47 – 01:52
**Typ:** Center-Overlay oder Split-Screen
**Inhalt:**
```
[K-Logo]
GEHALTSVERHANDLUNG MASTERY
17 Video-Lektionen · 5 Module · 3 Simulationen
```
**Design:**
- Karriere-Institut K-Logo oben zentriert (rotes Quadrat, weißes K, 80×80px)
- Kursname: Instrument Sans Bold, 48px, `#1A1A1A`
- Unterzeile: 22px Regular, `#6B6B6B`, mit Middot-Separatoren
- Card-Background: `#FFFFFF`, `border-radius: 20px`, `box-shadow: 0 20px 60px rgba(0,0,0,0.1)`
- Padding: 48px
**Animation:**
- Logo faded ein (300ms), dann Titel-Text faded up (400ms, 200ms delay)
- Unterzeile faded up (400ms, 400ms delay)

---

### ASSET 7: Modul-Liste (animiert)
**Timecode:** 01:55 – 02:40
**Typ:** Seitliches Panel oder Overlay (linke oder rechte Seite)
**Inhalt – erscheint sequentiell:**
```
Modul 1 · Mindset         [Akzentfarbe: #CC1426]
Modul 2 · Marktwert       [Akzentfarbe: #2D6A4F]
Modul 3 · Vorbereitung    [Akzentfarbe: #2563EB]
Modul 4 · Verhandlung     [Akzentfarbe: #7C3AED]
Modul 5 · Abschluss       [Akzentfarbe: #D4A017]
```
**Design:**
- Vertikale Liste, jedes Modul als eigene Zeile
- Links: farbiger Akzent-Dot (12px Kreis) in Modulfarbe
- "Modul X" in 14px Bold Uppercase, Modulfarbe
- Modulname in 24px Semibold, `#1A1A1A`
- Hintergrund: halbtransparente Card
- Aktives Modul (das gerade besprochen wird) hat leichten farbigen Hintergrund-Highlight
**Animation:**
- Module erscheinen einzeln, Fade-Up, jeweils wenn der Sprecher das Modul erwähnt
- Timing: M1 bei 01:55, M2 bei 02:05, M3 bei 02:15, M4 bei 02:25, M5 bei 02:38
- Bereits erschienene Module bleiben sichtbar, werden aber dezenter (opacity 0.5)
- Aktuelles Modul hat volle Opacity + farbigen Hintergrund

---

### ASSET 8: Simulations-UI-Mockup
**Timecode:** 02:25 – 02:38
**Typ:** Split-Screen oder großes Overlay (60% Bildbreite, rechte Seite)
**Inhalt:**
```
Simulations-Interface mit:
- Dialog-Frage oben: "Ihr Chef sagt: 'Das Budget ist dieses Jahr leider eng.'"
- 3 Antwort-Optionen als Buttons:
  Option A: "Ich verstehe. Vielleicht nächstes Jahr."  [SCHWACH – rot]
  Option B: "Welchen Spielraum sehen Sie konkret?"     [STARK – grün]
  Option C: "Dann muss ich mir Alternativen ansehen."   [RISKANT – orange]
```
**Design:**
- Dunkler Card-Background: `#2C2C2E` mit `border-radius: 20px`
- Dialog-Frage: `#FFFFFF`, 20px Semibold, in einer helleren Sub-Card (`#3A3A3E`)
- Antwort-Buttons: jeweils eigene Zeile, `border-radius: 12px`
  - Hover-State auf Option B (grüner Rand `#2D6A4F`)
  - Labels [SCHWACH], [STARK], [RISKANT] als kleine Pills rechts
- Oben links: "Simulation 1 von 3" Badge in `#CC1426`
**Animation:**
- Card faded ein über 400ms
- Buttons erscheinen sequentiell (je 200ms Verzögerung)
- Nach 2 Sek.: Option B wird "geklickt" (Scale-Pulse, grüner Highlight)
- Feedback erscheint: "Starke Antwort! Du behältst die Kontrolle." in grüner Box

---

### ASSET 9: Testimonial-Karte "Sarah K."
**Timecode:** 02:48 – 02:58
**Typ:** Card-Overlay, rechte untere Ecke
**Inhalt:**
```
★★★★★
"Zum ersten Mal eine konkrete Zahl genannt –
und 4.800 € mehr bekommen."
Sarah K. · Projektmanagerin, München
↑ +4.800 €/Jahr
```
**Design:**
- Card: `#FFFFFF`, `border-radius: 16px`, `box-shadow: 0 8px 30px rgba(0,0,0,0.08)`
- Sterne: `#D4A017`, 18px
- Zitat: 18px Regular Italic, `#1A1A1A`
- Name/Rolle: 14px Semibold + Regular, `#6B6B6B`
- Ergebnis-Zeile: `#2D6A4F` Bold, mit Pfeil-nach-oben-Icon
- Links: Avatar-Quadrat `#CC1426` mit weißen Initialen "SK", `border-radius: 8px`
- Padding: 24px
**Animation:**
- Fade-Up über 400ms
- Ergebnis-Zeile erscheint mit 600ms Delay (eigener Fade-Up)
- Bleibt 8 Sekunden, dann Fade-Out

---

### ASSET 10: Testimonial-Karte "Marco T."
**Timecode:** 02:58 – 03:08
**Typ:** Identisch zu Asset 9, ersetzt es (Crossfade)
**Inhalt:**
```
★★★★★
"Die 5-Quellen-Methode hat mir gezeigt,
dass ich 8.000 € unter Markt lag."
Marco T. · Software-Entwickler, Berlin
↑ +8.000 €/Jahr
```
**Design:** Identisch zu Asset 9, nur andere Initialen "MT" und Farbe des Avatar-Quadrats optional variieren
**Animation:**
- Crossfade von Asset 9 zu Asset 10 über 400ms
- Gleiche Ergebnis-Delay-Animation

---

### ASSET 11: Preis-Overlay
**Timecode:** 03:18 – 03:35
**Typ:** Zentriertes Overlay oder rechte Seite
**Inhalt:**
```
GEHALTSVERHANDLUNG MASTERY

[Streichpreis]  ~~[XXX] €~~
[Aktionspreis]  [XXX] €

Du sparst [XX] €

✓ 17 Video-Lektionen
✓ 3 Simulationen
✓ Alle Vorlagen & Tools
✓ Lebenslanger Zugang

🔒 14 Tage Geld-zurück-Garantie
```
**Design:**
- Card: `#FFFFFF`, `border-radius: 20px`, prominenter Schatten
- Streichpreis: 22px, `#9A9A9A`, durchgestrichen
- Aktionspreis: 64px Bold, `#1A1A1A`
- Spar-Badge: Pill-Shape `#2D6A4F` Hintergrund, weiße Schrift, `border-radius: 980px`
- Feature-Liste: 16px, `#1A1A1A`, Häkchen in `#2D6A4F`
- Garantie: 14px, `#6B6B6B`, Schloss-Icon
- PLATZHALTER: [XXX]-Werte durch echte Preise ersetzen
**Animation:**
- Card faded ein über 500ms
- Streichpreis erscheint zuerst, wird nach 500ms durchgestrichen (animierte Linie)
- Aktionspreis erscheint 200ms danach mit Scale-In (0.9→1.0)
- Spar-Badge poppt ein (300ms, slight bounce)
- Features erscheinen sequentiell (je 150ms)

---

### ASSET 12: End-Screen / CTA-Screen
**Timecode:** 03:40 – 03:45+ (bleibt stehen)
**Typ:** Fullscreen, statisch (5+ Sekunden)
**Inhalt:**
```
[K-Logo]
GEHALTSVERHANDLUNG MASTERY

[CTA-Button: "Jetzt Zugang sichern →"]

[XXX] € · Einmalzahlung · Kein Abo

🔒 14 Tage Geld-zurück-Garantie
Sichere Zahlung · Sofortiger Zugang
```
**Design:**
- Hintergrund: `#FAFAF8` (hell) ODER `#2C2C2E` (dunkel) – je nach Schnitt-Stimmung
- Logo zentriert oben: 60×60px
- Kursname: 42px Bold, `#1A1A1A` oder `#FFFFFF`
- CTA-Button: `#CC1426`, weiße Schrift, 20px Bold, `border-radius: 980px`, Padding 18px 48px
- Button hat pulsierenden Schatten-Effekt: `box-shadow` atmet zwischen `0 4px 16px rgba(204,20,38,0.2)` und `0 8px 32px rgba(204,20,38,0.35)` – Loop alle 2 Sekunden
- Preis-Info und Trust-Badges darunter in `#6B6B6B`, 14px
- PLATZHALTER: [XXX] durch echten Preis ersetzen
**Animation:**
- Schneller Aufbau: Logo (200ms) → Titel (300ms) → Button (400ms) → Rest (500ms)
- Button-Pulse läuft als Endlos-Loop
- Kein Fade-Out – Screen bleibt stehen

---

## Zusammenfassung der Assets

| # | Asset | Typ | Timecode | Dauer |
|---|---|---|---|---|
| 1 | Median-Gehalt 53.900€ | Card-Overlay | 00:05–00:12 | 7 Sek. |
| 2 | 37% verhandeln nie | Fullscreen/Card | 00:28–00:38 | 10 Sek. |
| 3 | 52%/39% Unbehagen | Bar-Chart-Card | 00:38–00:50 | 12 Sek. |
| 4 | Gender Pay Gap 9,7% | Card-Overlay | 00:50–01:05 | 15 Sek. |
| 5 | Counter 500.000€ | Fullscreen Insert | 01:18–01:35 | 17 Sek. |
| 6 | Kurs-Logo/Titel | Center-Card | 01:47–01:52 | 5 Sek. |
| 7 | Modul-Liste (5 Items) | Seitenpanel | 01:55–02:40 | 45 Sek. |
| 8 | Simulations-UI-Mockup | Split-Screen | 02:25–02:38 | 13 Sek. |
| 9 | Testimonial Sarah K. | Card-Overlay | 02:48–02:58 | 10 Sek. |
| 10 | Testimonial Marco T. | Card-Overlay | 02:58–03:08 | 10 Sek. |
| 11 | Preis-Overlay | Center-Card | 03:18–03:35 | 17 Sek. |
| 12 | End-Screen / CTA | Fullscreen | 03:40+ | 5+ Sek. |

---

## Hinweise für die Umsetzung

**In After Effects:** Erstelle ein Master-Projekt mit einer Composition pro Asset. Nutze eine gemeinsame "Brand"-Composition für Farben und Font-Styles. Exportiere als ProRes 4444 mit Alpha.

**In Canva/CapCut:** Erstelle jedes Overlay als eigenes Design (1920×1080), exportiere als transparentes PNG oder animiertes Video. In CapCut als Overlay-Track einfügen.

**Als HTML (Claude Code / Browser-Source):** Jedes Asset als einzelne HTML-Datei mit CSS-Animationen. Per OBS als Browser-Source einbinden oder per Screen-Recording aufnehmen. Vorteil: pixel-perfektes Branding, einfach anpassbar.

**Untertitel:** Alle Overlays müssen das untere Drittel (y > 720px) freihalten – dort laufen die Burned-In-Subtitles.

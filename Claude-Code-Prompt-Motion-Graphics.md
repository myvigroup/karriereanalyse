# Claude Code Prompt: Glasmorphism Motion Graphics – Gehaltsverhandlung Mastery VSL

> **Nutzung:** Kopiere diesen gesamten Prompt in eine neue Claude-Code-Session. Claude baut dir dann alle 12 Overlay-Assets als einzelne, animierte HTML-Dateien.

---

## Auftrag

Baue 12 animierte HTML-Dateien – eine pro Motion-Graphic-Asset. Jede Datei ist ein eigenständiges Overlay für ein Video Sales Letter (VSL). Die Dateien werden entweder per Screen-Recording aufgenommen oder als OBS-Browser-Source eingebunden.

**Jede HTML-Datei muss:**
- Exakt 1920×1080px sein (Full HD)
- Einen transparenten Hintergrund haben (`background: transparent`)
- Sich selbst per Button oder automatisch starten lassen
- Alle Animationen per CSS/JS enthalten (kein externer Import außer Google Fonts)
- Die Glasmorphism-Ästhetik nutzen (siehe Design-System unten)

---

## Design-System: Glasmorphism + Karriere Institut Branding

### Glasmorphism-Regeln (ZWINGEND für alle Elemente)

```css
/* ─── GLASS CARD (Basis für alle Overlays) ─── */
.glass {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

/* ─── GLASS CARD DUNKEL (für dunkle Hintergründe) ─── */
.glass-dark {
  background: rgba(44, 44, 46, 0.65);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

/* ─── GLASS PILL (für Badges, Tags) ─── */
.glass-pill {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 980px;
  padding: 6px 18px;
}

/* ─── GLASS BUTTON (CTAs) ─── */
.glass-btn {
  background: rgba(204, 20, 38, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 980px;
  box-shadow:
    0 4px 20px rgba(204, 20, 38, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* ─── SUBTILE LICHTREFLEXION (oben auf jeder Card) ─── */
.glass::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 50%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 100%
  );
  border-radius: 20px 20px 0 0;
  pointer-events: none;
}
```

### Hintergrund hinter dem Glass

Damit der Blur-Effekt sichtbar wird, braucht jede HTML-Datei einen subtilen Hintergrund-Layer HINTER der Glass-Card. Dieser wird im finalen Video durch das Talking-Head-Footage ersetzt, simuliert aber beim Testen den Effekt:

```css
body {
  /* Simulierter Hintergrund für Glass-Effekt beim Testen */
  background: linear-gradient(135deg, #1A1A2E 0%, #2C2C2E 50%, #0F3460 100%);
  /* Für Produktion auf transparent setzen: */
  /* background: transparent; */
}
```

**Wichtig:** Füge in jede Datei einen Toggle-Button ein, der zwischen dem Test-Hintergrund und `transparent` wechselt, damit man sowohl den Glaseffekt testen als auch den transparenten Export machen kann.

### Branding-Farben

```css
:root {
  --red: #CC1426;
  --red-light: #E8283C;
  --red-glow: rgba(204, 20, 38, 0.25);
  --charcoal: #2C2C2E;
  --bg: #FAFAF8;
  --bg-alt: #F4F3F0;
  --border: #E8E6E1;
  --text: #FFFFFF;            /* Weiß auf Glass-Dark */
  --text-secondary: rgba(255, 255, 255, 0.65);
  --text-muted: rgba(255, 255, 255, 0.4);
  --success: #2D6A4F;
  --success-glow: rgba(45, 106, 79, 0.25);
  --warning: #D4A017;

  /* Glass-spezifisch */
  --glass-bg: rgba(255, 255, 255, 0.12);
  --glass-border: rgba(255, 255, 255, 0.18);
  --glass-highlight: rgba(255, 255, 255, 0.25);
  --glass-blur: blur(24px) saturate(1.4);
}
```

### Typografie

```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap');

body {
  font-family: 'Instrument Sans', -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Große Zahlen */
.stat-number {
  font-weight: 700;
  color: var(--red-light);
  text-shadow: 0 0 40px var(--red-glow);
  letter-spacing: -1px;
}

/* Labels */
.stat-label {
  font-weight: 600;
  color: var(--text);
  letter-spacing: 0.5px;
}

/* Quellen */
.source {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}
```

### Animationen

```css
/* Apple-Style Easing */
--ease: cubic-bezier(.25, 1, .5, 1);
--ease-bounce: cubic-bezier(.34, 1.56, .64, 1);

/* Standard Fade-Up */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Scale-In */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}

/* Glass Shimmer (subtiler Lichtstreifen über die Card) */
@keyframes glassShimmer {
  0%   { left: -100%; }
  100% { left: 200%; }
}

.glass-shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.06),
    transparent
  );
  animation: glassShimmer 4s ease-in-out infinite;
}

/* Pulsierender Glow (für CTAs) */
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 4px 20px var(--red-glow); }
  50%      { box-shadow: 0 8px 40px rgba(204, 20, 38, 0.4); }
}

/* Fade-Out */
@keyframes fadeOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}
```

---

## Die 12 Assets – Einzelspezifikationen

Erstelle für jedes Asset eine eigene HTML-Datei mit dem Dateinamen `asset-XX-name.html`.

---

### `asset-01-median-gehalt.html`
**Dauer:** 7 Sekunden (auto-start, dann fade-out)
**Position:** Rechts unten, 80px Abstand zu den Rändern
**Inhalt:**
- Glass-Card (`.glass-dark`) mit ca. 420×180px
- Zahl: "53.900 €" – 96px Bold, `var(--red-light)`, mit `text-shadow: 0 0 40px var(--red-glow)`
- Unterzeile: "Median-Gehalt Deutschland" – 22px Semibold, `var(--text)`
- Quelle: "Stepstone Gehaltsreport 2026" – 11px, `var(--text-muted)`, uppercase
- Oben links in der Card: kleiner roter Punkt (8px, `var(--red)`) als Akzent
**Animation:**
1. Card faded-up ein (400ms, ease)
2. Zahl zählt per JS-Counter von 0 auf 53.900 in 1,5s (linear, Tausenderpunkte formatiert)
3. Ab Sekunde 6: Fade-Out (500ms)

---

### `asset-02-37-prozent.html`
**Dauer:** 10 Sekunden
**Position:** Zentriert
**Inhalt:**
- Großes Glass-Panel (`.glass-dark`), ca. 700×320px, zentriert
- "37%" – 200px Bold, `var(--red-light)`, mit rotem Glow
- "verhandeln NIE über ihr Gehalt" – 32px Semibold, `var(--text)`
- "NIE" hervorgehoben: eigenes `<span>` mit `color: var(--red-light)` und `text-decoration: underline`
- Dezenter roter Hintergrund-Glow hinter der Zahl: `radial-gradient(circle at center, rgba(204,20,38,0.12), transparent 70%)`
**Animation:**
1. Panel: scaleIn (400ms)
2. Counter: 0% → 37% in 1,2s
3. "NIE" bekommt 300ms Scale-Pulse (1.0→1.08→1.0) nach Counter-Stopp
4. Fade-Out ab Sekunde 9

---

### `asset-03-unbehagen-statistik.html`
**Dauer:** 12 Sekunden
**Position:** Zentriert
**Inhalt:**
- Glass-Card (`.glass-dark`), ca. 640×280px
- Zwei horizontale Glasmorphism-Balken übereinander:
  - Balken 1: Label "Frauen" links, Bar füllt sich auf 52%, Farbe `var(--red)` mit Glass-Overlay
  - Balken 2: Label "Männer" links, Bar füllt sich auf 39%, Farbe `rgba(255,255,255,0.3)`
- Prozentzahlen rechts neben den Bars, zählen synchron hoch
- Unterzeile: "empfinden Gehaltsfragen als unangenehm" – 18px, `var(--text-secondary)`
**Animation:**
1. Card: fadeUp (400ms)
2. Bars füllen sich gleichzeitig in 1s (ease-out), Zahlen counten synchron
3. Fade-Out ab Sekunde 11

---

### `asset-04-gender-pay-gap.html`
**Dauer:** 15 Sekunden
**Position:** Rechts, vertikal zentriert
**Inhalt:**
- Glass-Card (`.glass-dark`), ca. 380×180px
- "9,7%" – 88px Bold, `var(--red-light)`, Glow
- "Bereinigter Gender Pay Gap" – 20px Semibold, `var(--text)`
- "Destatis 2025" – 11px, `var(--text-muted)`, uppercase
- Glass-Pill Badge oben: "Offizielle Statistik" in `var(--text-muted)`
**Animation:**
1. fadeUp (400ms)
2. Counter: 0,0% → 9,7% in 1s, Dezimale live
3. Fade-Out ab Sekunde 14

---

### `asset-05-counter-500k.html`
**Dauer:** 17 Sekunden
**Position:** Fullscreen-zentriert
**Inhalt:**
- Fullscreen dunkler Hintergrund: `#1A1A2E` mit radialem Glow
- Großer Counter zentriert: "€ 0" → "€ 500.000" – 180px Bold, `var(--red-light)`
- Text-Shadow: `0 0 60px rgba(204,20,38,0.4)` für dramatischen Glow
- Tausenderpunkte live formatiert
- Unterzeile (erscheint nach Stopp): "Entgangenes Gehalt über ein Berufsleben" – 28px, `var(--text-secondary)`
- Bei Stopp: Fullscreen red flash `rgba(204,20,38,0.12)` für 200ms
**Animation:**
1. Counter: 0 → 500.000 in 4s (linear)
2. Bei 500.000: Freeze + roter Screen-Flash (200ms)
3. Unterzeile fadeUp (400ms, 500ms Delay nach Stopp)
4. 3s Freeze
5. Fade-Out (500ms)

---

### `asset-06-kurs-titel.html`
**Dauer:** 5 Sekunden
**Position:** Zentriert
**Inhalt:**
- Glass-Card (`.glass-dark`), ca. 560×260px
- Oben: Karriere-Institut-Logo (rotes Quadrat 56×56px mit weißem "K", als CSS gebaut)
- "GEHALTSVERHANDLUNG MASTERY" – 38px Bold, `var(--text)`
- "17 Video-Lektionen · 5 Module · 3 Simulationen" – 16px, `var(--text-secondary)`, Middots
- Glass-Shimmer-Animation auf der Card
**Animation:**
1. Logo: fadeUp (300ms)
2. Titel: fadeUp (400ms, 200ms delay)
3. Unterzeile: fadeUp (400ms, 400ms delay)

---

### `asset-07-modul-liste.html`
**Dauer:** 45 Sekunden (Module erscheinen zeitversetzt per Button-Klick oder Timer)
**Position:** Links, vertikal zentriert
**Inhalt:**
- Vertikales Glass-Panel (`.glass-dark`), ca. 380×440px
- 5 Modul-Zeilen, jede mit:
  - Links: Glasmorphism-Dot (14px Kreis) in Modulfarbe
  - "MODUL X" – 11px Bold Uppercase, Modulfarbe
  - Modulname – 20px Semibold, `var(--text)`
- Modulfarben:
  - M1: `#CC1426` (Rot)
  - M2: `#2D6A4F` (Grün)
  - M3: `#2563EB` (Blau)
  - M4: `#7C3AED` (Violett)
  - M5: `#D4A017` (Gold)
- Aktives Modul: farbiger Glass-Highlight-Background, volle Opacity
- Inaktive/vergangene Module: `opacity: 0.4`
**Animation:**
- Jedes Modul hat einen "Einblende-Button" ODER erscheint automatisch mit Intervall (einstellbar per Variable `const INTERVAL = 8000`)
- Fade-Up pro Modul (400ms)
- Wenn nächstes Modul erscheint: vorheriges wird dezent (`opacity: 0.4`, 300ms Transition)

---

### `asset-08-simulation-ui.html`
**Dauer:** 13 Sekunden
**Position:** Rechts, ca. 60% Bildbreite
**Inhalt:**
- Glass-Card (`.glass-dark`), ca. 820×480px
- Oben links: Glass-Pill "Simulation 1 von 3" in `var(--red)`
- Dialog-Frage in hellerer Sub-Card (`.glass` mit leicht hellerem Fill):
  "Ihr Chef sagt: 'Das Budget ist dieses Jahr leider eng.'"
  – 18px Regular, `var(--text)`
- 3 Antwort-Buttons als Glass-Cards:
  - A: "Ich verstehe. Vielleicht nächstes Jahr." + Pill "SCHWACH" (rot)
  - B: "Welchen Spielraum sehen Sie konkret?" + Pill "STARK" (grün)
  - C: "Dann muss ich mir Alternativen ansehen." + Pill "RISKANT" (orange)
- Buttons haben subtilen Glass-Hover-Effekt
**Animation:**
1. Hauptcard: scaleIn (400ms)
2. Dialog-Frage: fadeUp (300ms, 200ms delay)
3. Buttons erscheinen sequentiell (je 200ms Verzögerung)
4. Nach 2s: Option B bekommt grünen Glass-Border-Glow (`box-shadow: 0 0 20px rgba(45,106,79,0.3)`) + Scale-Pulse
5. Feedback-Box fadet unter den Buttons ein: Glass-Card mit grünem Rand, Text: "Starke Antwort! Du behältst die Kontrolle über das Gespräch."

---

### `asset-09-testimonial-sarah.html`
**Dauer:** 10 Sekunden
**Position:** Rechts unten
**Inhalt:**
- Glass-Card (`.glass-dark`), ca. 400×240px
- Sterne: "★★★★★" in `var(--warning)`, 16px
- Zitat: "Zum ersten Mal eine konkrete Zahl genannt – und 4.800 € mehr bekommen." – 16px Italic, `var(--text)`
- Avatar: Glasmorphism-Quadrat 40×40px, `var(--red)` Background, "SK" weiß
- "Sarah K." – 14px Bold, `var(--text)` / "Projektmanagerin, München" – 13px, `var(--text-secondary)`
- Ergebnis-Badge unten: Glass-Pill mit grünem Glow, "↑ +4.800 €/Jahr" in `var(--success)`
**Animation:**
1. fadeUp (400ms)
2. Ergebnis-Badge: fadeUp (400ms, 600ms delay) mit grünem Glow-Pulse
3. Fade-Out ab Sekunde 9

---

### `asset-10-testimonial-marco.html`
**Dauer:** 10 Sekunden
**Position:** Identisch zu Asset 9
**Inhalt:**
- Identische Struktur wie Asset 9
- Zitat: "Die 5-Quellen-Methode hat mir gezeigt, dass ich 8.000 € unter Markt lag."
- Avatar: "MT"
- "Marco T." / "Software-Entwickler, Berlin"
- Badge: "↑ +8.000 €/Jahr"
**Animation:** Identisch zu Asset 9. Wird im Video als Crossfade nach Asset 9 eingesetzt.

---

### `asset-11-preis-overlay.html`
**Dauer:** 17 Sekunden
**Position:** Zentriert
**Inhalt:**
- Glass-Card (`.glass-dark`), ca. 480×520px
- Oben: "GEHALTSVERHANDLUNG MASTERY" – 16px Bold Uppercase, `var(--text-secondary)`
- Streichpreis: "[XXX] €" – 20px, `var(--text-muted)`, durchgestrichen
- Aktionspreis: "[XXX] €" – 56px Bold, `var(--text)` (PLATZHALTER)
- Spar-Badge: Glass-Pill, grüner Glow, "Du sparst [XX] €"
- Feature-Liste (6 Items): Häkchen in `var(--success)`, Text in `var(--text)`, 15px
  - ✓ 17 Video-Lektionen
  - ✓ 3 interaktive Simulationen
  - ✓ Marktwert-Toolkit
  - ✓ Verhandlungs-Skripte
  - ✓ Lebenslanger Zugang
  - ✓ Bonus: Einwand-Spickzettel
- Garantie: Glass-Pill unten, "🔒 14 Tage Geld-zurück" in `var(--text-muted)`
**Animation:**
1. Card: scaleIn (500ms)
2. Streichpreis: fadeUp, dann animierte Durchstreich-Linie (500ms)
3. Aktionspreis: scaleIn (400ms, mit leichtem Bounce)
4. Spar-Badge: popIn (300ms)
5. Features: sequentiell fadeUp (je 150ms Verzögerung)

---

### `asset-12-endscreen.html`
**Dauer:** Unbegrenzt (Loop)
**Position:** Fullscreen
**Inhalt:**
- Fullscreen dunkler Glass-Hintergrund: `#1A1A2E` mit mehreren überlagerten Glasmorphism-Kreisen als Deko-Elemente (verschiedene Größen, `rgba(204,20,38,0.06)` bis `rgba(255,255,255,0.03)`)
- Zentriert:
  - Logo: CSS-generiert, rotes Quadrat 72×72px mit weißem "K"
  - "GEHALTSVERHANDLUNG MASTERY" – 40px Bold, `var(--text)`
  - CTA-Button (`.glass-btn`): "Jetzt Zugang sichern →" – 20px Bold, weiß, Endlos-Glow-Pulse
  - "[XXX] € · Einmalzahlung · Kein Abo" – 16px, `var(--text-secondary)` (PLATZHALTER)
  - Trust-Zeile: "🔒 14 Tage Geld-zurück · Sichere Zahlung · Sofortiger Zugang" – 13px, `var(--text-muted)`
- Subtile Glasmorphism-Deko-Kreise im Hintergrund, leicht animiert (langsame Bewegung, 20s Loop)
**Animation:**
1. Logo: fadeUp (200ms)
2. Titel: fadeUp (300ms, 200ms delay)
3. Button: fadeUp (400ms, 400ms delay) → dann Endlos `pulseGlow`
4. Rest: fadeUp (500ms, 600ms delay)
5. Deko-Kreise: CSS-Float-Animation (sehr langsam, subtil)

---

## Allgemeine Regeln

1. **Jede HTML-Datei** enthält alles inline – CSS im `<style>`, JS im `<script>`. Keine externen Abhängigkeiten außer Google Fonts.
2. **Toggle-Button** oben links in jeder Datei: wechselt zwischen Test-Hintergrund (dunkler Gradient) und `transparent` (für Screen-Recording/Export).
3. **Start-Button** zentriert: startet die Animation. Verschwindet nach Klick.
4. **Zahlen-Counter** per JavaScript: `requestAnimationFrame`-basiert, mit `Intl.NumberFormat('de-DE')` für Tausenderpunkte.
5. **Safe Zone:** Kein Text im Bereich y > 750px (Untertitel-Bereich).
6. **Dateinamen:** `asset-01-median-gehalt.html`, `asset-02-37-prozent.html`, usw.
7. **Ordner:** Alle Dateien in einen Ordner `motion-graphics/` legen.

Starte mit Asset 01 und arbeite dich sequentiell durch alle 12 Assets. Zeige mir nach jedem Asset das Ergebnis.

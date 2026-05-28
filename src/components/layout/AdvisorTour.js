'use client';
// =====================================================
// AdvisorTour — geguidete Bühnen-Tour mit Spotlight + Multi-Page
// =====================================================
// Pro Schritt: optionaler CSS-Selector für ein Target-Element. Das Target
// wird durch eine SVG-Maske "ausgeschnitten" (heller Fleck im dunklen
// Overlay) und bleibt voll interaktiv — der User kann es anklicken.
// Tour-Card schwebt zentral mittig oder am Bildrand, je nach Target-Position.

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const STEPS = [
  // ── 1. Welcome ──────────────────────────────────────────────────────────
  {
    path: '/advisor/leads',
    target: null,
    title: 'Willkommen im Berater-Portal',
    body: 'Wir gehen jetzt einen typischen Tag durch: Ein Bewerber kommt an deinen Messestand und macht mit dir einen Lebenslauf-Check. Danach zeige ich dir, wie das auch im Self-Service funktioniert — wenn ein Bewerber selbst über deinen Link einen CV hochlädt. Am Ende läuft alles in deinem zentralen Dashboard zusammen. Klick „Weiter", wenn du bereit bist.',
  },

  // ── 2. Szenario A: Bewerber am Messetisch ──────────────────────────────
  {
    path: '/advisor/cv-check/new',
    target: '[data-tour="cv-choice"]',
    title: 'Szenario 1 — Bewerber am Messestand',
    body: 'Ein Bewerber kommt an deinen Tisch und möchte seinen Lebenslauf checken lassen. Du klickst auf „+ Neuer CV-Check" und landest auf dieser Wahl-Seite. Hier hast du zwei Optionen: Entweder ihr macht den Check zusammen direkt vor Ort — oder du gibst ihm einen Link, mit dem er es selbst macht. Für die Messe-Situation wählst du normalerweise die linke Karte „Mit dem Kunden zusammen".',
  },

  // ── 3. Quick-Lead-Formular ──────────────────────────────────────────────
  {
    path: '/advisor/quick-lead',
    target: null,
    title: 'Kundendaten erfassen',
    body: 'Du landest in einem schnellen Formular: Vorname, E-Mail-Adresse, Telefonnummer und seine Wunschposition. Drei bis vier Felder, höchstens 30 Sekunden Eingabe. Mit Klick auf „Quick-Lead anlegen" wird der Lead erstellt — der Bewerber existiert jetzt als Eintrag in deinem Dashboard, auch wenn er noch keinen Lebenslauf hochgeladen hat.',
  },

  // ── 4. CV-Upload + KI-Auswertung erklären ──────────────────────────────
  {
    path: '/advisor/quick-lead',
    target: null,
    title: 'CV hochladen und KI-Auswertung',
    body: 'Nach dem Anlegen kommst du direkt zur Upload-Seite. Du nimmst sein Tablet oder Smartphone, lädst seinen Lebenslauf hoch (PDF oder DOCX) — und die KI analysiert ihn in 10–20 Sekunden. Du bekommst eine Auswertung mit Stärken, Schwächen und einer Marktwert-Schätzung in Euro. Das kannst du direkt mit dem Bewerber besprechen — perfekter Aufhänger für ein Beratungs-Gespräch.',
  },

  // ── 5. Szenario B: Self-Service ─────────────────────────────────────────
  {
    path: '/advisor/affiliate',
    target: null,
    title: 'Szenario 2 — Bewerber macht den Check selbst',
    body: 'Zweite Variante: Der Bewerber kommt zwar an den Stand, hat aber gerade keine Zeit. Oder du triffst ihn auf LinkedIn, im Bekanntenkreis, auf einer Konferenz. Du teilst einfach deinen persönlichen Affiliate-Link oder QR-Code. Der Bewerber klickt drauf, lädt selbst seinen CV hoch und bekommt direkt die KI-Auswertung — komplett ohne dich. Du siehst den Lead automatisch in deinem Dashboard. Skalierbar ohne Mehraufwand.',
  },

  // ── 6. Dashboard: Alle Leads zentral ───────────────────────────────────
  {
    path: '/advisor/leads',
    target: '[data-tour="leads-table"]',
    title: 'Dein zentrales Dashboard',
    body: 'Egal ob Messe-Lead, Direkt-Lead oder Self-Service — alle Bewerber landen hier in einer Liste. Du siehst pro Eintrag: Name, Telefonnummer, E-Mail, Wunschposition, den aktuellen Status und ein Quelle-Pill (🎪 Messe-Name / ⚡ Direkt / 🔗 Affiliate). Ein Klick auf einen Lead öffnet die Detail-Ansicht mit komplettem CV und KI-Auswertung — alles was du fürs Nachfass-Gespräch brauchst.',
  },

  // ── 7. Self-Service-Box ─────────────────────────────────────────────────
  {
    path: '/advisor/leads',
    target: '[data-tour="self-service"]',
    title: 'Self-Service-Box — passive Pipeline',
    body: 'Diese zweite Box ist nur für Self-Service-Checks: Bewerber, die selbst über deinen Link gescannt haben — ohne dich dabei. Du siehst Name, E-Mail, Wunschposition und die KI-Bewertung mit Sternen. So weißt du sofort, wer interessant ist und nachgefasst werden sollte.',
  },

  // ── 8. Stats + Messen ───────────────────────────────────────────────────
  {
    path: '/advisor/leads',
    target: '[data-tour="stats"]',
    title: 'Deine Tageszahlen im Blick',
    body: 'Oben siehst du deine Live-Stats: Gespräche heute, offene CV-Checks (also wo du noch nachfassen musst), Gespräche insgesamt und aktive Messen. Damit weißt du jederzeit, wo du stehst — und kannst die Übersicht auch deinem Team-Lead zeigen.',
  },

  // ── 9. Affiliate-Dashboard ──────────────────────────────────────────────
  {
    path: '/advisor/affiliate',
    target: null,
    title: 'Dein Affiliate-Dashboard',
    body: 'Hier siehst du, wie deine Affiliate-Aktivitäten laufen: Klicks auf deinen Link, Sign-ups, eingegangene Leads. Jeder Lead, der über deinen Link kommt, wird dir dauerhaft zugeordnet — auch wenn er erst Wochen später ein Coaching bucht, bekommst du die Provision.',
  },

  // ── 10. Abschluss ───────────────────────────────────────────────────────
  {
    path: '/advisor/leads',
    target: null,
    title: 'Tour beendet — jetzt selbst ausprobieren',
    body: 'Du kennst jetzt den kompletten Flow: vom Messe-Gespräch über Self-Service-Checks bis zur zentralen Lead-Übersicht. Klick durch die Demo-Leads, schau dir die KI-Auswertung an oder lade selbst einen Test-CV hoch. Bei Fragen findest du oben rechts immer den Tour-Button zum Wiederholen.',
  },
];

const STORAGE_KEY = 'ki_advisor_tour_step';
const SPOTLIGHT_PAD = 10;
const RADIUS = 12;

export default function AdvisorTour({ enabled = true }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [targetRect, setTargetRect] = useState(null);

  // Mount + URL-Param ?tour=start
  useEffect(() => {
    setMounted(true);
    const tourParam = searchParams?.get('tour');
    if (tourParam === 'start') {
      setStep(0);
      sessionStorage.setItem(STORAGE_KEY, '0');
      const url = new URL(window.location.href);
      url.searchParams.delete('tour');
      window.history.replaceState({}, '', url.toString());
      return;
    }
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < STEPS.length) {
        setStep(parsed);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (step === null) sessionStorage.removeItem(STORAGE_KEY);
    else sessionStorage.setItem(STORAGE_KEY, String(step));
  }, [step, mounted]);

  // Target-Element finden + scroll + measure (re-tries falls Page noch nicht fertig gerendert)
  useEffect(() => {
    if (step === null) {
      setTargetRect(null);
      return;
    }
    const current = STEPS[step];
    if (!current?.target) {
      setTargetRect(null);
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 30; // 30 * 100ms = 3s

    function tryMeasure() {
      if (cancelled) return;
      const el = document.querySelector(current.target);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Sichtbarmachen, falls Element außerhalb des Viewports
        if (rect.top < 80 || rect.bottom > window.innerHeight - 80) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            if (!cancelled) {
              setTargetRect(el.getBoundingClientRect());
            }
          }, 400);
        } else {
          setTargetRect(rect);
        }
        return;
      }
      attempts += 1;
      if (attempts < maxAttempts) setTimeout(tryMeasure, 100);
    }

    tryMeasure();

    function onResize() {
      const el = document.querySelector(current.target);
      if (el) setTargetRect(el.getBoundingClientRect());
    }
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [step, pathname]);

  const end = useCallback(() => {
    setStep(null);
    setTargetRect(null);
  }, []);

  const goTo = useCallback((newStep) => {
    if (newStep < 0 || newStep >= STEPS.length) return;
    setStep(newStep);
    setTargetRect(null); // Reset während Page-Wechsel
    const targetPath = STEPS[newStep].path;
    if (targetPath !== pathname) router.push(targetPath);
  }, [pathname, router]);

  if (!enabled || !mounted || step === null) return null;
  const current = STEPS[step];
  if (!current) return null;
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  // Card-Position berechnen — die Card darf den Spotlight NICHT überdecken.
  // Logik:
  //   - Kein Target → Card zentral mittig
  //   - Genug Platz unter dem Target → Card direkt darunter, zentriert
  //   - Genug Platz über dem Target → Card direkt darüber, zentriert
  //   - Sonst → Card oben rechts oder unten rechts (Fallback)
  const CARD_WIDTH = 420;
  const CARD_HEIGHT_EST = 360;
  const GAP = 20;
  let cardPosition = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

  if (targetRect && typeof window !== 'undefined') {
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const spaceBelow = vh - targetRect.bottom;
    const spaceAbove = targetRect.top;

    if (spaceBelow >= CARD_HEIGHT_EST + GAP) {
      // Card unter dem Target, horizontal zentriert
      cardPosition = {
        top: targetRect.bottom + GAP,
        left: '50%',
        transform: 'translateX(-50%)',
      };
    } else if (spaceAbove >= CARD_HEIGHT_EST + GAP) {
      // Card über dem Target, horizontal zentriert
      cardPosition = {
        top: Math.max(16, targetRect.top - CARD_HEIGHT_EST - GAP),
        left: '50%',
        transform: 'translateX(-50%)',
      };
    } else {
      // Kein vertikaler Platz — Card oben rechts (überlappt nicht mit Spotlight in der Mitte)
      cardPosition = {
        top: 24,
        right: 24,
      };
    }
    // Card-Breite respektieren
    if (vw < CARD_WIDTH + 32) {
      cardPosition.left = 16;
      cardPosition.right = 16;
      cardPosition.transform = undefined;
    }
  }

  return (
    <>
      {/* Spotlight-Overlay via SVG-Maske */}
      <svg
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 9996,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          animation: 'tour-fade-in 0.25s ease-out both',
        }}
      >
        <defs>
          <mask id="advisor-tour-spotlight">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - SPOTLIGHT_PAD}
                y={targetRect.top - SPOTLIGHT_PAD}
                width={targetRect.width + SPOTLIGHT_PAD * 2}
                height={targetRect.height + SPOTLIGHT_PAD * 2}
                rx={RADIUS} ry={RADIUS}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0" y="0" width="100%" height="100%"
          fill="rgba(0,0,0,0.6)"
          mask="url(#advisor-tour-spotlight)"
        />
        {/* Highlight-Ring um das Target */}
        {targetRect && (
          <rect
            x={targetRect.left - SPOTLIGHT_PAD}
            y={targetRect.top - SPOTLIGHT_PAD}
            width={targetRect.width + SPOTLIGHT_PAD * 2}
            height={targetRect.height + SPOTLIGHT_PAD * 2}
            rx={RADIUS} ry={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="2"
          />
        )}
      </svg>

      {/* Tour-Card */}
      <div
        role="dialog"
        aria-label="Bühnen-Tour"
        style={{
          position: 'fixed',
          ...cardPosition,
          zIndex: 9998,
          width: CARD_WIDTH,
          maxWidth: 'calc(100vw - 32px)',
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          padding: 24,
          animation: 'tour-pop 0.25s ease-out both',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, color: '#CC1426',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            background: 'rgba(204,20,38,0.08)',
            padding: '4px 10px', borderRadius: 980,
          }}>
            Bühnen-Tour · Schritt {step + 1} von {STEPS.length}
          </span>
          <button
            onClick={end}
            aria-label="Tour beenden"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#86868b', fontSize: 20, lineHeight: 1, padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <h3 style={{
          fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em',
          marginBottom: 10, color: '#1A1A1A',
        }}>
          {current.title}
        </h3>
        <p style={{
          fontSize: 15, color: '#525252',
          lineHeight: 1.6, marginBottom: 18,
        }}>
          {current.body}
        </p>

        {/* Progress-Dots */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 18 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= step ? '#CC1426' : '#E5E7EB',
              transition: 'background 0.3s ease',
            }} />
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <button
            onClick={end}
            style={{
              background: 'transparent', border: 'none',
              color: '#86868b', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', padding: '6px 10px',
            }}
          >
            Tour beenden
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => goTo(step - 1)}
              disabled={isFirst}
              style={{
                background: '#F5F5F7', border: 'none',
                color: isFirst ? '#C5C5C7' : '#525252',
                fontSize: 13, fontWeight: 600,
                cursor: isFirst ? 'not-allowed' : 'pointer',
                padding: '9px 18px', borderRadius: 980,
              }}
            >
              Zurück
            </button>
            <button
              onClick={() => isLast ? end() : goTo(step + 1)}
              className="btn btn-primary"
              style={{ fontSize: 13, padding: '9px 22px' }}
            >
              {isLast ? 'Tour beenden' : 'Weiter →'}
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes tour-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes tour-pop {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}} />
    </>
  );
}

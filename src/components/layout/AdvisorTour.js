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

// Bullets können String[] sein — werden als Liste gerendert.
// body bleibt der kurze Lead-Satz oben.
const STEPS = [
  // ── 1. Welcome ──
  {
    path: '/advisor/leads',
    target: null,
    title: 'Willkommen',
    body: 'Was wir gleich durchgehen:',
    bullets: [
      'Bewerber am Messestand → Check mit Berater',
      'Bewerber im Self-Service → Check über Link',
      'Alles im Dashboard zentral sichtbar',
    ],
  },

  // ── 2. Szenario A: Wahl-Page ──
  {
    path: '/advisor/cv-check/new',
    target: '[data-tour="cv-choice"]',
    title: 'Szenario 1 — Bewerber am Stand',
    body: 'Klick auf „+ Neuer CV-Check" → zwei Wege:',
    bullets: [
      'Links: mit Kunde zusammen (Messe-Beratung)',
      'Rechts: Kunde macht selbst (Link teilen)',
    ],
  },

  // ── 3. Quick-Lead-Formular ──
  {
    path: '/advisor/quick-lead',
    target: '[data-tour="quick-form"]',
    title: 'Kundendaten erfassen',
    body: '4 Felder, 30 Sekunden:',
    bullets: [
      'Vorname · E-Mail · Telefon · Wunschposition',
      'Klick „Quick-Lead anlegen" → Lead existiert',
    ],
  },

  // ── 4. CV-Upload + KI ──
  {
    path: '/advisor/quick-lead',
    target: null,
    title: 'CV hochladen → KI in 20 Sek',
    body: 'Lebenslauf hochladen (PDF/DOCX). KI liefert:',
    bullets: [
      'Stärken & Schwächen',
      'Marktwert-Schätzung in Euro',
      'Sofort mit Bewerber besprechen',
    ],
  },

  // ── 4b. Beispiel-Review: Marcus Berger (Messe, feedback_pending mit vollem CV) ──
  {
    path: '/advisor/fair/11111111-1111-1111-1111-111111111111/lead/a2222222-2222-2222-2222-222222222222/review',
    target: null,
    title: 'KI-Auswertung im Detail',
    body: 'So sieht die Auswertung am Ende aus:',
    bullets: [
      'CV links · KI-Feedback rechts',
      'Tabs: Struktur · Inhalt · Design · Wirkung',
      'Sterne-Rating + KI-Vorschläge per Klick',
      'Eigener Kommentar fürs Gespräch',
    ],
  },

  // ── 5. Szenario B: Self-Service ──
  {
    path: '/advisor/affiliate',
    target: null,
    title: 'Szenario 2 — Self-Service',
    body: 'Bewerber macht selbst, ohne dich:',
    bullets: [
      'Du teilst Affiliate-Link oder QR-Code',
      'Er lädt CV hoch → KI bewertet',
      'Lead landet automatisch bei dir',
    ],
  },

  // ── 6. Dashboard ──
  {
    path: '/advisor/leads',
    target: '[data-tour="leads-table"]',
    title: 'Alle Leads zentral',
    body: 'Eine Liste für alle Quellen:',
    bullets: [
      'Name, Telefon, E-Mail, Wunschposition',
      'Quelle-Pill: 🎪 Messe · ⚡ Direkt · 🔗 Affiliate',
      'Klick öffnet Detail mit CV + Auswertung',
    ],
  },

  // ── 7. Self-Service-Box ──
  {
    path: '/advisor/leads',
    target: '[data-tour="self-service"]',
    title: 'Self-Service-Box',
    body: 'Eigene Box für passive Pipeline:',
    bullets: [
      'Bewerber, die selbst über deinen Link kamen',
      'Sterne-Rating zur Priorisierung',
      'Direkt nachfassbar',
    ],
  },

  // ── 8. Stats ──
  {
    path: '/advisor/leads',
    target: '[data-tour="stats"]',
    title: 'Live-Stats oben',
    body: 'Auf einen Blick:',
    bullets: [
      'Gespräche heute',
      'Offene CV-Checks',
      'Gespräche gesamt · Aktive Messen',
    ],
  },

  // ── 9. Affiliate ──
  {
    path: '/advisor/affiliate',
    target: null,
    title: 'Affiliate-Dashboard',
    body: 'Dein Link für alles außerhalb der Messe:',
    bullets: [
      'Klicks, Sign-ups, Leads — alle deine',
      'Provision dauerhaft zugeordnet',
      'Für LinkedIn, Mail-Signatur, QR-Code',
    ],
  },

  // ── 10. Abschluss ──
  {
    path: '/advisor/leads',
    target: null,
    title: 'Tour fertig — los geht’s',
    body: 'Jetzt selbst:',
    bullets: [
      'Demo-Leads anklicken',
      'KI-Auswertung anschauen',
      'Eigenen CV hochladen',
    ],
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
          fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em',
          marginBottom: 8, color: '#1A1A1A',
        }}>
          {current.title}
        </h3>
        {current.body && (
          <p style={{
            fontSize: 14, color: '#525252',
            lineHeight: 1.5, marginBottom: current.bullets ? 10 : 16,
          }}>
            {current.body}
          </p>
        )}
        {current.bullets && current.bullets.length > 0 && (
          <ul style={{
            listStyle: 'none', padding: 0, margin: '0 0 16px',
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            {current.bullets.map((b, i) => (
              <li key={i} style={{
                fontSize: 14, color: '#1A1A1A',
                lineHeight: 1.45,
                paddingLeft: 18, position: 'relative',
              }}>
                <span style={{
                  position: 'absolute', left: 0, top: 6,
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#CC1426',
                }} />
                {b}
              </li>
            ))}
          </ul>
        )}

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

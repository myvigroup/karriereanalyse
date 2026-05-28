'use client';
// =====================================================
// AdvisorTour — geguidete Bühnen-Tour durch den Berater-Bereich
// =====================================================
// Multi-Page-Tour: jeder Schritt hat einen path. Beim Klick auf "Weiter"
// wird zur nächsten Page navigiert. State liegt in sessionStorage, damit
// die Tour Navigation übersteht.
//
// Aktivierung: per Klick auf "Bühnen-Tour starten" im DemoBanner (oder via
// URL ?tour=start). Endet automatisch nach letztem Schritt oder per X-Klick.

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const STEPS = [
  {
    path: '/advisor/leads',
    title: 'Willkommen im Berater-Portal',
    body: 'Ich zeige dir in 8 Schritten, wie das Tool im Alltag funktioniert. Du siehst gerade dein zentrales CV-Checks-Dashboard. Klick auf „Weiter", wenn du bereit bist.',
  },
  {
    path: '/advisor/leads',
    title: 'Deine Stats auf einen Blick',
    body: 'Gespräche heute, offene CV-Checks, alle Gespräche gesamt, aktive Messen. Du weißt sofort, wo du stehst — kein Excel mehr.',
  },
  {
    path: '/advisor/leads',
    title: 'Aktive Messen',
    body: 'Hier siehst du deine zugewiesenen Messen. Mit einem Klick öffnest du die Messe-Session und kannst dort gezielt Leads anlegen — alles bleibt der Messe zugeordnet.',
  },
  {
    path: '/advisor/leads',
    title: 'Lead-Liste mit Quelle-Pills',
    body: 'Jeder Lead hat ein Label: 🎪 Messe-Name, ⚡ Direkt-Lead, 🔗 Affiliate. Du siehst sofort, woher der Kontakt kam — wichtig für die Provision.',
  },
  {
    path: '/advisor/leads',
    title: 'Self-Service CV-Checks',
    body: 'Diese Box füllt sich automatisch: jeder Kunde, der über deinen Affiliate-Link oder QR-Code scannt, landet hier. Passive Pipeline ohne dass du dabei sein musst.',
  },
  {
    path: '/advisor/cv-check/new',
    title: 'Neuer CV-Check — zwei Wege',
    body: 'Klick auf „+ Neuer CV-Check" landest du hier. „Mit dem Kunden zusammen" — klassische Messe-Beratung. „Kunde macht selbst" — du teilst nur den Link.',
  },
  {
    path: '/advisor/affiliate',
    title: 'Dein Affiliate-Dashboard',
    body: 'Hier siehst du deinen persönlichen Link. Jeder Klick, jeder Sign-up wird dir automatisch zugeordnet. Teile den Link auf LinkedIn, in deiner Mail-Signatur oder per QR-Code.',
  },
  {
    path: '/advisor/leads',
    title: 'Tour beendet — jetzt selbst probieren!',
    body: 'Du kennst jetzt die wichtigsten Funktionen. Wer mag, klickt jetzt selbst durch — Anna Müller, Marcus Berger und die anderen warten auf dich.',
  },
];

const STORAGE_KEY = 'ki_advisor_tour_step';

export default function AdvisorTour({ enabled = true }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Mount + URL-Param ?tour=start
  useEffect(() => {
    setMounted(true);
    const tourParam = searchParams?.get('tour');
    if (tourParam === 'start') {
      setStep(0);
      sessionStorage.setItem(STORAGE_KEY, '0');
      // URL-Param entfernen, damit Reload nicht wieder bei 0 startet
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

  // Persist step changes
  useEffect(() => {
    if (!mounted) return;
    if (step === null) sessionStorage.removeItem(STORAGE_KEY);
    else sessionStorage.setItem(STORAGE_KEY, String(step));
  }, [step, mounted]);

  const end = useCallback(() => setStep(null), []);

  const goTo = useCallback((newStep) => {
    if (newStep < 0 || newStep >= STEPS.length) return;
    setStep(newStep);
    const targetPath = STEPS[newStep].path;
    if (targetPath !== pathname) {
      router.push(targetPath);
    }
  }, [pathname, router]);

  if (!enabled) return null;
  if (!mounted) return null;
  if (step === null) return null;

  const current = STEPS[step];
  if (!current) return null;
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  return (
    <div
      role="dialog"
      aria-label="Bühnen-Tour"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9998,
        width: 380,
        maxWidth: 'calc(100vw - 32px)',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
        padding: 22,
        border: '1px solid #E8E6E1',
        animation: 'tour-pop 0.25s ease-out both',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, color: '#CC1426',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          Bühnen-Tour · {step + 1} von {STEPS.length}
        </span>
        <button
          onClick={end}
          aria-label="Tour beenden"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#86868b', fontSize: 18, lineHeight: 1, padding: 4,
          }}
        >
          ✕
        </button>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= step ? '#CC1426' : '#E5E7EB',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>

      {/* Body */}
      <h3 style={{
        fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em',
        marginBottom: 8, color: '#1A1A1A',
      }}>
        {current.title}
      </h3>
      <p style={{
        fontSize: 14, color: '#525252',
        lineHeight: 1.55, marginBottom: 18,
      }}>
        {current.body}
      </p>

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => goTo(step - 1)}
          disabled={isFirst}
          style={{
            background: 'transparent', border: 'none',
            color: isFirst ? '#C5C5C7' : '#525252',
            fontSize: 13, fontWeight: 600,
            cursor: isFirst ? 'not-allowed' : 'pointer',
            padding: '6px 10px',
          }}
        >
          ← Zurück
        </button>
        <button
          onClick={() => isLast ? end() : goTo(step + 1)}
          className="btn btn-primary"
          style={{ fontSize: 13, padding: '9px 22px' }}
        >
          {isLast ? 'Tour beenden' : 'Weiter →'}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes tour-pop {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </div>
  );
}

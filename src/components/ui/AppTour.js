'use client';
// =====================================================
// AppTour — Onboarding-Tour mit Spotlight und dynamischer Positionierung
// =====================================================
// Zeigt nach dem Onboarding eine kurze Sidebar-Tour. Anders als die alte
// Version positioniert sich das Tooltip jetzt dynamisch neben dem Ziel-Element
// (nicht mehr starr unten in der Mitte), und das Ziel wird per Spotlight-Cutout
// hervorgehoben (SVG-Maske statt vollflächigem Overlay).
//
// Robust gegenüber fehlenden Targets: wenn ein Step kein passendes Element
// findet, wird er automatisch übersprungen statt die Tour hängen zu lassen.

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isExecutive } from '@/lib/executive-mode';

// Reduzierte, kuratierte Liste — nur Steps mit Targets die existieren.
const TOUR_STEPS = [
  { target: 'data-tour-sidebar',   title: 'Dein Menü',              description: 'Hier findest du alle Module. Klicke dich durch und entdecke dein Karriere-OS.', position: 'right' },
  { target: 'data-tour-dashboard', title: 'Übersicht',              description: 'Starte jeden Tag hier. Deine wichtigsten Karten und Aufgaben auf einen Blick.', position: 'right' },
  { target: 'data-tour-analyse',   title: 'Karriere-Analyse',       description: 'Beginne hier — die Basis für alles Weitere. Dauert nur ~10 Minuten.', position: 'right' },
  { target: 'data-tour-masterclass', title: 'Masterclass',          description: 'Strukturierte Lernmodule für deine nächste Karrierestufe.', position: 'right' },
  { target: 'data-tour-cvcheck',   title: 'Lebenslauf-Check',       description: 'KI-Auswertung deines CVs in 30 Sekunden — inklusive Markt­wert-Schätzung.', position: 'right' },
  { target: 'data-tour-coach',     title: 'Coach',                  description: 'Vereinbare Termine mit deinem persönlichen Karriere-Coach.', position: 'right' },
  { target: 'data-tour-profile',   title: 'Dein Profil',            description: 'Halte es aktuell — bessere Empfehlungen, bessere Treffer.', position: 'right' },
];

const PADDING = 8;          // Abstand zwischen Tooltip und Target
const SPOTLIGHT_PAD = 6;    // Wie weit der Highlight um das Target geht
const TOOLTIP_WIDTH = 340;

export default function AppTour({ profile, userId }) {
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [active, setActive] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [targetRect, setTargetRect] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ left: 0, top: 0, placement: 'right' });
  const executive = isExecutive(profile);
  const tooltipRef = useRef(null);

  // Auto-Start nach Onboarding
  useEffect(() => {
    if (!profile) return;
    if (profile.tour_completed === true) return;
    if (profile.onboarding_complete !== true) return;
    // Demo-Account und Berater bekommen keine Mitglieder-Tour
    if (profile.role && ['advisor', 'admin', 'messeleiter'].includes(profile.role)) return;
    const timer = setTimeout(() => {
      const startStep = Math.max(0, Math.min(profile.tour_step || 0, TOUR_STEPS.length - 1));
      setCurrentStep(startStep);
      setActive(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [profile]);

  // Target-Suche mit Skip-Logik: wenn aktueller Target nicht da ist,
  // automatisch weiterspringen oder Tour beenden
  const findStepWithTarget = useCallback((startIdx, direction = 1) => {
    let idx = startIdx;
    while (idx >= 0 && idx < TOUR_STEPS.length) {
      const sel = `[${TOUR_STEPS[idx].target}]`;
      if (document.querySelector(sel)) return idx;
      idx += direction;
    }
    return -1; // nichts gefunden
  }, []);

  // Position des Tooltips berechnen
  const recomputeLayout = useCallback(() => {
    if (!active) return;
    const step = TOUR_STEPS[currentStep];
    if (!step) return;
    const el = document.querySelector(`[${step.target}]`);
    if (!el) {
      // Target fehlt — überspring zum nächsten existierenden Step
      const next = findStepWithTarget(currentStep + 1, 1);
      if (next === -1) {
        setShowFinal(true);
        setActive(false);
      } else {
        setCurrentStep(next);
      }
      return;
    }
    const rect = el.getBoundingClientRect();
    setTargetRect(rect);

    // Tooltip-Position basierend auf step.position + verfügbarem Platz
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const desiredW = Math.min(TOOLTIP_WIDTH, vw - 32);
    let placement = step.position || 'right';
    let left = 0, top = 0;

    if (placement === 'right' && rect.right + PADDING + desiredW <= vw - 16) {
      left = rect.right + PADDING;
      top = Math.max(16, Math.min(rect.top, vh - 240));
    } else if (placement === 'left' && rect.left - PADDING - desiredW >= 16) {
      left = rect.left - PADDING - desiredW;
      top = Math.max(16, Math.min(rect.top, vh - 240));
    } else if (placement === 'bottom' && rect.bottom + PADDING + 200 <= vh - 16) {
      left = Math.max(16, Math.min(rect.left, vw - desiredW - 16));
      top = rect.bottom + PADDING;
    } else if (placement === 'top' && rect.top - PADDING - 200 >= 16) {
      left = Math.max(16, Math.min(rect.left, vw - desiredW - 16));
      top = rect.top - PADDING - 200;
    } else {
      // Fallback: unten — wenn auch das nicht passt, einfach unter dem target
      placement = 'bottom';
      left = Math.max(16, Math.min(rect.left, vw - desiredW - 16));
      top = Math.min(rect.bottom + PADDING, vh - 240);
    }
    setTooltipPos({ left, top, placement });

    // Sicherstellen dass Target im View ist
    if (rect.top < 0 || rect.bottom > vh) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [active, currentStep, findStepWithTarget]);

  // Beim ersten Aktivieren: Step mit Target finden
  useEffect(() => {
    if (!active) return;
    const idx = findStepWithTarget(currentStep, 1);
    if (idx === -1) {
      setShowFinal(true);
      setActive(false);
    } else if (idx !== currentStep) {
      setCurrentStep(idx);
    } else {
      // Layout berechnen
      requestAnimationFrame(() => recomputeLayout());
    }
  }, [active, currentStep, findStepWithTarget, recomputeLayout]);

  // Re-Layout bei resize / scroll
  useEffect(() => {
    if (!active) return;
    const handler = () => recomputeLayout();
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [active, recomputeLayout]);

  const saveTourStep = useCallback(async (step) => {
    try {
      await supabase.from('profiles').update({ tour_step: step }).eq('id', userId);
    } catch {}
  }, [supabase, userId]);

  const completeTour = useCallback(async () => {
    try {
      await supabase.from('profiles').update({ tour_completed: true, tour_step: TOUR_STEPS.length }).eq('id', userId);
    } catch {}
    setActive(false);
    setShowFinal(false);
  }, [supabase, userId]);

  const nextStep = () => {
    const next = findStepWithTarget(currentStep + 1, 1);
    if (next === -1) {
      setShowFinal(true);
      setActive(false);
      saveTourStep(TOUR_STEPS.length);
    } else {
      setCurrentStep(next);
      saveTourStep(next);
    }
  };

  const skipTour = () => completeTour();

  if (!active && !showFinal) return null;

  // Finale Karte
  if (showFinal) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 10001, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{
          background: 'var(--ki-card, #fff)', borderRadius: 20, padding: 40, maxWidth: 440, width: '100%',
          textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
        }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{'\u{1F680}'}</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>Du bist startklar!</h2>
          <p style={{ fontSize: 15, color: 'var(--ki-text-secondary, #525252)', marginBottom: 28, lineHeight: 1.55 }}>
            {executive
              ? 'Beginnen Sie mit der strategischen Standortbestimmung.'
              : 'Beginne mit der Karriere-Analyse — sie ist die Basis für alles Weitere.'}
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={completeTour} className="btn btn-secondary" style={{ flex: 1, padding: '12px' }}>
              Zum Dashboard
            </button>
            <a href="/analyse" onClick={completeTour} className="btn btn-primary" style={{ flex: 1, padding: '12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              Karriere-Analyse starten
            </a>
          </div>
        </div>
      </div>
    );
  }

  const step = TOUR_STEPS[currentStep];
  if (!step || !targetRect) return null;

  // SVG-Spotlight: vollflächiges dunkles Rechteck mit Ausschnitt um das Target
  const spotX = targetRect.left - SPOTLIGHT_PAD;
  const spotY = targetRect.top - SPOTLIGHT_PAD;
  const spotW = targetRect.width + SPOTLIGHT_PAD * 2;
  const spotH = targetRect.height + SPOTLIGHT_PAD * 2;
  const radius = 10;

  return (
    <>
      {/* Spotlight-Overlay via SVG-Maske */}
      <svg
        style={{ position: 'fixed', inset: 0, zIndex: 10000, pointerEvents: 'auto' }}
        width="100%" height="100%"
        onClick={skipTour}
      >
        <defs>
          <mask id="tour-spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect x={spotX} y={spotY} width={spotW} height={spotH} rx={radius} ry={radius} fill="black" />
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.65)" mask="url(#tour-spotlight-mask)" />
        {/* Highlight-Ring um das Target */}
        <rect
          x={spotX} y={spotY} width={spotW} height={spotH} rx={radius} ry={radius}
          fill="none" stroke="rgba(204,20,38,0.9)" strokeWidth="2"
          style={{ pointerEvents: 'none' }}
        />
      </svg>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          position: 'fixed', zIndex: 10002,
          left: tooltipPos.left, top: tooltipPos.top,
          width: Math.min(TOOLTIP_WIDTH, window.innerWidth - 32),
          background: 'var(--ki-card, #fff)',
          borderRadius: 14,
          boxShadow: '0 12px 36px rgba(0,0,0,0.22)',
          padding: 20,
          animation: 'tourPop 0.22s ease-out both',
        }}
      >
        {/* Progress */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
          {TOUR_STEPS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= currentStep ? 'var(--ki-red, #CC1426)' : '#E5E7EB',
              transition: 'background 0.3s ease',
            }} />
          ))}
        </div>

        <div style={{ fontSize: 11, color: '#86868b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
          Schritt {currentStep + 1} von {TOUR_STEPS.length}
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6, color: '#1A1A1A' }}>{step.title}</h3>
        <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.5, marginBottom: 18 }}>{step.description}</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={skipTour}
            style={{ background: 'transparent', border: 'none', color: '#86868b', fontSize: 13, cursor: 'pointer', padding: 4 }}
          >
            Tour beenden
          </button>
          <button
            onClick={nextStep}
            className="btn btn-primary"
            style={{ fontSize: 13, padding: '8px 22px' }}
          >
            {currentStep === TOUR_STEPS.length - 1 ? 'Fertig' : 'Weiter'}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes tourPop {
          from { opacity: 0; transform: translateY(4px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </>
  );
}

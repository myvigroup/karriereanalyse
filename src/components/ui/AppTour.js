'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isExecutive } from '@/lib/executive-mode';

const TOUR_STEPS = [
  { target: 'data-tour-sidebar', title: 'Dein Men\u00FC', description: 'Alle Module findest du hier. Klicke dich durch und entdecke dein Karriere-OS.', position: 'right' },
  { target: 'data-tour-dashboard', title: 'Dashboard', description: 'Starte jeden Tag hier. Streak und Aufgaben auf einen Blick.', position: 'bottom' },
  { target: 'data-tour-streak', title: 'Streak-Counter', description: 'Jeden Tag einloggen h\u00E4lt deinen Streak am Leben. \u{1F525}', position: 'bottom' },
  { target: 'data-tour-coach', title: 'KI-Coach', description: 'Dein pers\u00F6nlicher Mentor. Frag ihn wenn du nicht weiterwei\u00DFt.', position: 'right' },
  { target: 'data-tour-analyse', title: 'Karriereanalyse', description: 'Starte hier \u2014 das ist die Basis f\u00FCr alles. ~10 Minuten.', position: 'right' },
  { target: 'data-tour-notifications', title: 'Benachrichtigungen', description: 'Erinnerungen und Updates findest du hier.', position: 'bottom' },
  { target: 'data-tour-profile', title: 'Profil', description: 'Halte es aktuell f\u00FCr bessere Empfehlungen.', position: 'right' },
  { target: 'data-tour-tooltip', title: 'Hilfe-Icons', description: 'Diese Fragezeichen erkl\u00E4ren jedes Modul. Klicke sie jederzeit an.', position: 'bottom' },
];

export default function AppTour({ profile, userId }) {
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(profile?.tour_step || 0);
  const [active, setActive] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const executive = isExecutive(profile);

  useEffect(() => {
    if (profile && profile.tour_completed === false && profile.onboarding_complete === true) {
      const timer = setTimeout(() => setActive(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  const saveTourStep = useCallback(async (step) => {
    await supabase.from('profiles').update({ tour_step: step }).eq('id', userId);
  }, [supabase, userId]);

  const completeTour = useCallback(async () => {
    await supabase.from('profiles').update({ tour_completed: true, tour_step: TOUR_STEPS.length }).eq('id', userId);
    setActive(false);
    setShowFinal(false);
  }, [supabase, userId]);

  const nextStep = () => {
    const next = currentStep + 1;
    if (next >= TOUR_STEPS.length) {
      setShowFinal(true);
      saveTourStep(TOUR_STEPS.length);
    } else {
      setCurrentStep(next);
      saveTourStep(next);
      // Scroll target into view
      const el = document.querySelector(`[${TOUR_STEPS[next].target}]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const skipTour = () => {
    completeTour();
  };

  if (!active) return null;

  // Final screen
  if (showFinal) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 10001, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center', padding: 48, maxWidth: 440 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{'\u{1F680}'}</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 8 }}>Du bist bereit!</h2>
          <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
            {executive
              ? 'Beginnen Sie mit der strategischen Standortbestimmung.'
              : 'Starte mit der Karriereanalyse \u2014 das ist die Basis f\u00FCr alles Weitere.'}
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="/dashboard" onClick={completeTour} className="btn btn-secondary" style={{ flex: 1 }}>Zum Dashboard</a>
            <a href="/analyse" onClick={completeTour} className="btn btn-primary" style={{ flex: 1 }}>Zur Karriereanalyse</a>
          </div>
        </div>
      </div>
    );
  }

  const step = TOUR_STEPS[currentStep];
  if (!step) return null;

  return (
    <>
      {/* Overlay */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.7)' }} onClick={skipTour} />

      {/* Tooltip */}
      <div style={{
        position: 'fixed', zIndex: 10001,
        bottom: 100, left: '50%', transform: 'translateX(-50%)',
        maxWidth: 380, width: 'calc(100vw - 48px)',
        background: 'var(--ki-card)', borderRadius: 'var(--r-lg)',
        boxShadow: 'var(--sh-xl)', padding: 24,
        animation: 'fadeIn 0.3s ease both',
      }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
          {TOUR_STEPS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= currentStep ? 'var(--ki-red)' : 'var(--grey-5)',
              transition: 'background 0.3s ease',
            }} />
          ))}
        </div>

        <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginBottom: 4 }}>
          Schritt {currentStep + 1} von {TOUR_STEPS.length}
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>{step.title}</h3>
        <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', lineHeight: 1.5, marginBottom: 20 }}>{step.description}</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={skipTour} className="btn btn-ghost" style={{ fontSize: 13, padding: '8px 12px' }}>
            Tour beenden
          </button>
          <button onClick={nextStep} className="btn btn-primary" style={{ fontSize: 13, padding: '8px 20px' }}>
            {currentStep === TOUR_STEPS.length - 1 ? 'Fertig' : 'Weiter'}
          </button>
        </div>
      </div>
    </>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Popup-Logik:
// - Zeigt 30 Sek nach Portal-Start, wenn keine Analyse vorhanden
// - Wenn dismissed: nur in DIESER Session nicht mehr (sessionStorage)
// - Beim nächsten Login / Tab-Wechsel: wieder anzeigen (kein localStorage-Cooldown)
const SESSION_KEY = 'ki_analyse_popup_shown_this_session';
const SHOW_AFTER_MS = 30 * 1000;

const HIDDEN_ON_PATHS = ['/analyse', '/onboarding', '/auth', '/r/', '/start/', '/upload', '/cv-upload', '/scan', '/admin'];

export default function AnalysePopup({ hasAnalysis }) {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (hasAnalysis) return;
    if (HIDDEN_ON_PATHS.some(p => pathname?.startsWith(p))) return;

    // Pro Session nur einmal (verhindert Spam beim Page-Wechsel)
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') return;
    } catch {}

    const timer = setTimeout(() => {
      setVisible(true);
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch {}
    }, SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [hasAnalysis, pathname]);

  function close() {
    setClosing(true);
    setTimeout(() => { setVisible(false); setClosing(false); }, 180);
  }

  function startAnalyse() {
    close();
    router.push('/analyse');
  }

  if (!visible) return null;

  return (
    <div className={`analyse-popup-overlay ${closing ? 'closing' : ''}`} onClick={close}>
      <div className={`analyse-popup ${closing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="analyse-popup-close" onClick={close} aria-label="Schließen" type="button">✕</button>

        <div className="analyse-popup-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="6"/>
            <circle cx="12" cy="12" r="2"/>
          </svg>
        </div>

        <h3 className="analyse-popup-title">
          Schließe deine Karriere-Analyse ab.
        </h3>
        <p className="analyse-popup-desc">
          In ~10 Minuten weißt du, wo deine Stärken liegen und welche Schritte als nächstes für dich Sinn ergeben.
          Danach passt sich das gesamte Portal an dich an — Masterclasses, Coaches, Empfehlungen.
        </p>

        <div className="analyse-popup-actions">
          <button type="button" onClick={startAnalyse} className="analyse-popup-cta-primary">
            Jetzt starten · ~10 Min
          </button>
          <button type="button" onClick={close} className="analyse-popup-cta-secondary">
            Später
          </button>
        </div>
      </div>
    </div>
  );
}

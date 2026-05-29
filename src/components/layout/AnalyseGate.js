'use client';
import { useRouter } from 'next/navigation';

// Soft-CTA Banner statt Hard-Block
// User kann die App IMMER nutzen — die Analyse ist eine EMPFEHLUNG, kein Zwang
export default function AnalyseGate({ hasAnalysis, children }) {
  const router = useRouter();

  return (
    <>
      {!hasAnalysis && (
        <div className="analyse-gate-banner">
          <div className="analyse-gate-inner">
            <div className="analyse-gate-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <div className="analyse-gate-text">
              <div className="analyse-gate-title">
                Karriere-Analyse noch nicht abgeschlossen
              </div>
              <div className="analyse-gate-sub">
                ~10 Minuten — danach passt sich die gesamte App an dich an.
              </div>
            </div>
            <button
              onClick={() => router.push('/analyse')}
              className="analyse-gate-cta"
              type="button"
            >
              Analyse starten
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>
      )}
      {children}
    </>
  );
}

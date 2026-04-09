'use client';
import { useRouter } from 'next/navigation';

// Soft-CTA Banner statt Hard-Block
// User kann die App IMMER nutzen — die Analyse ist eine EMPFEHLUNG, kein Zwang
export default function AnalyseGate({ hasAnalysis, children }) {
  const router = useRouter();

  return (
    <>
      {!hasAnalysis && (
        <div style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, rgba(204,20,38,0.06) 0%, rgba(204,20,38,0.02) 100%)',
          borderBottom: '1px solid rgba(204,20,38,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 20 }}>🎯</span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ki-text)' }}>
              Karriere-Analyse noch nicht abgeschlossen
            </div>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>
              ~10 Minuten — danach passt sich die gesamte App an dich an.
            </div>
          </div>
          <button
            onClick={() => router.push('/analyse')}
            className="btn btn-primary"
            style={{ padding: '8px 20px', fontSize: 13, flexShrink: 0 }}
          >
            Analyse starten →
          </button>
        </div>
      )}
      {children}
    </>
  );
}

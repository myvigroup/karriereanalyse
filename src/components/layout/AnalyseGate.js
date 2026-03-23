'use client';
import { useRouter } from 'next/navigation';

export default function AnalyseGate({ hasAnalysis, children }) {
  const router = useRouter();

  if (!hasAnalysis) {
    return (
      <div style={{ padding: 48, textAlign: 'center', maxWidth: 500, margin: '80px auto' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎯</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
          Deine Karriere-Analyse wartet
        </h2>
        <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 24, lineHeight: 1.7, fontSize: 15 }}>
          Bevor du die App nutzen kannst, erstellen wir dein persönliches
          Kompetenz-Profil. Kostenlos. 5 Minuten. Danach passt sich die
          gesamte App an DICH an.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <button
            onClick={() => router.push('/analyse')}
            className="btn btn-primary"
            style={{ padding: '14px 32px', fontSize: 16 }}
          >
            Jetzt Analyse starten →
          </button>
          <span style={{ fontSize: 13, color: 'var(--ki-text-tertiary)' }}>
            Inklusive 1 Monat Premium gratis
          </span>
        </div>
      </div>
    );
  }

  return children;
}

'use client';
import { useEffect } from 'react';

export default function ProfileLoading() {
  useEffect(() => {
    async function fix() {
      try {
        const res = await fetch('/api/ensure-profile', { method: 'POST' });
        const data = await res.json();

        if (data.error) {
          // Nicht eingeloggt → Login
          window.location.href = '/auth/login';
          return;
        }

        if (data.onboarding_complete === false) {
          // Profil da, aber Onboarding noch nicht fertig
          window.location.href = '/onboarding';
          return;
        }

        // Profil da und komplett → Dashboard neu laden
        window.location.reload();
      } catch {
        // Netzwerkfehler → kurz warten und neu laden
        setTimeout(() => window.location.reload(), 3000);
      }
    }

    // Kurze Pause damit der Server-Render sich stabilisiert
    const timer = setTimeout(fix, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-container" style={{ paddingTop: 80, textAlign: 'center' }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '3px solid var(--ki-border)',
        borderTopColor: 'var(--ki-red)',
        animation: 'spin 0.9s linear infinite',
        margin: '0 auto 24px',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Konto wird eingerichtet...</h1>
      <p style={{ color: 'var(--ki-text-secondary)', marginTop: 8, fontSize: 14 }}>
        Einen Moment — wir richten alles für dich ein.
      </p>
    </div>
  );
}

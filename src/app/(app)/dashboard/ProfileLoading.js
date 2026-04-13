'use client';
import { useEffect } from 'react';

export default function ProfileLoading() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.reload();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-container" style={{ paddingTop: 80, textAlign: 'center' }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        border: '3px solid var(--ki-border)',
        borderTopColor: 'var(--ki-red)',
        animation: 'spin 0.9s linear infinite',
        margin: '0 auto 24px',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>Profil wird eingerichtet...</h1>
      <p style={{ color: 'var(--ki-text-secondary)', marginTop: 8, fontSize: 14 }}>
        Einen Moment — wir richten alles für dich ein.
      </p>
    </div>
  );
}

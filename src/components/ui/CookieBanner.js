'use client';
import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('ki_cookie_consent');
    if (!consent) setShow(true);
  }, []);

  const accept = (all) => {
    localStorage.setItem('ki_cookie_consent', all ? 'all' : 'necessary');
    localStorage.setItem('ki_cookie_consent_date', new Date().toISOString());
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9998,
      background: 'var(--ki-card)', borderTop: '1px solid var(--ki-border)',
      boxShadow: 'var(--sh-xl)', padding: '20px 24px',
      animation: 'fadeIn 0.3s ease both',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Wir verwenden Cookies</p>
          <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', lineHeight: 1.5 }}>
            Für die Funktionalität der Plattform nutzen wir notwendige Cookies. Optionale Cookies helfen uns, das Erlebnis zu verbessern.{' '}
            <a href="/datenschutz" style={{ color: 'var(--ki-red)' }}>Mehr erfahren</a>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => accept(false)} style={{ fontSize: 13, padding: '10px 16px' }}>
            Nur notwendige
          </button>
          <button className="btn btn-primary" onClick={() => accept(true)} style={{ fontSize: 13, padding: '10px 16px' }}>
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}

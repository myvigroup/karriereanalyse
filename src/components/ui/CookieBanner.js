'use client';
import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('ki_cookie_consent');
    if (!consent) {
      // Kurze Verzögerung für sanften Auftritt nach Page-Render
      const t = setTimeout(() => setShow(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  function accept(all) {
    localStorage.setItem('ki_cookie_consent', all ? 'all' : 'necessary');
    localStorage.setItem('ki_cookie_consent_date', new Date().toISOString());
    setClosing(true);
    setTimeout(() => setShow(false), 220);
  }

  if (!show) return null;

  return (
    <div className={`cookie-banner ${closing ? 'closing' : ''}`}>
      <div className="cookie-banner-inner">
        <div className="cookie-banner-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.7"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
            <circle cx="8.5" cy="8.5" r=".5" fill="currentColor"/>
            <circle cx="15.5" cy="13.5" r=".5" fill="currentColor"/>
            <circle cx="9.5" cy="16" r=".5" fill="currentColor"/>
          </svg>
        </div>
        <div className="cookie-banner-text">
          <div className="cookie-banner-title">Cookies & Privatsphäre</div>
          <p>
            Wir nutzen notwendige Cookies für die Funktionalität.
            Optionale Cookies helfen uns, dein Erlebnis zu verbessern.{' '}
            <a href="/datenschutz">Datenschutz</a>
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button type="button" onClick={() => accept(false)} className="cookie-btn-secondary">
            Nur notwendige
          </button>
          <button type="button" onClick={() => accept(true)} className="cookie-btn-primary">
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}

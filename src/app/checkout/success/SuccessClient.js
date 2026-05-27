'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const PRODUCT_INFO = {
  MASTERCLASS: { icon: '\u25B6', title: 'Willkommen zur Masterclass!', sub: 'Starte deinen ersten Kurs.', cta: 'Zu den Kursen', link: '/masterclass' },
  SEMINAR: { icon: '\u{1F3AF}', title: 'Seminar gebucht!', sub: 'Du erhältst eine Bestätigung per Email.', cta: 'Zum Dashboard', link: '/dashboard' },
  COACHING: { icon: '\u{1F91D}', title: 'Coaching gebucht!', sub: 'Buche jetzt deinen Termin.', cta: 'Termin buchen', link: null, calendly: true },
  ANALYSE_STUDENT: { icon: '\u25CE', title: 'Karriere-Blutbild freigeschaltet!', sub: 'Starte jetzt deine Analyse.', cta: 'Zur Analyse', link: '/analyse' },
  ANALYSE_PRO: { icon: '\u25CE', title: 'Karriere-Blutbild freigeschaltet!', sub: 'Starte jetzt deine professionelle Analyse.', cta: 'Zur Analyse', link: '/analyse' },
};

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [productKey, setProductKey] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Try to get product info from session
    if (sessionId) {
      fetch(`/api/checkout/verify?session_id=${sessionId}`)
        .then(r => r.json())
        .then(d => { if (d.product_key) setProductKey(d.product_key); })
        .catch(() => {});
    }
    setTimeout(() => setShowConfetti(false), 4000);
    // Auto-redirect after 15s
    const timer = setTimeout(() => { window.location.href = '/dashboard'; }, 15000);
    return () => clearTimeout(timer);
  }, [sessionId]);

  const info = PRODUCT_INFO[productKey] || PRODUCT_INFO.MASTERCLASS;
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ki-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
      {/* Confetti */}
      {showConfetti && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} style={{
              position: 'absolute', left: `${Math.random() * 100}%`, top: '-10px',
              width: `${6 + Math.random() * 8}px`, height: `${6 + Math.random() * 8}px`,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              background: ['var(--ki-red)', 'var(--ki-warning)', 'var(--ki-success)', '#6366f1', '#f59e0b'][Math.floor(Math.random() * 5)],
              animation: `confFall ${2 + Math.random() * 2}s ease-in forwards`,
              animationDelay: `${Math.random() * 1.5}s`,
            }} />
          ))}
          <style>{`@keyframes confFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }`}</style>
        </div>
      )}

      <div className="card animate-in" style={{ maxWidth: 480, width: '100%', textAlign: 'center', padding: 48 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{info.icon}</div>
        <span className="pill pill-green" style={{ marginBottom: 16, display: 'inline-block' }}>Zahlung erfolgreich</span>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 8 }}>{info.title}</h1>
        <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', marginBottom: 32 }}>{info.sub}</p>

        {info.calendly ? (
          <div>
            <a href={calendlyUrl} target="_blank" rel="noopener" className="btn btn-primary" style={{ width: '100%', marginBottom: 12 }}>
              Termin buchen
            </a>
            <a href="/dashboard" className="btn btn-secondary" style={{ width: '100%' }}>Zum Dashboard</a>
          </div>
        ) : (
          <a href={info.link || '/dashboard'} className="btn btn-primary" style={{ width: '100%' }}>{info.cta}</a>
        )}

        <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 24 }}>
          Automatische Weiterleitung in 15 Sekunden...
        </p>
      </div>
    </div>
  );
}

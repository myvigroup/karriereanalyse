'use client';
import { useState } from 'react';

const PRODUCTS = [
  {
    key: 'ANALYSE_STUDENT',
    name: 'Karriere-Analyse',
    audience: 'Für alle',
    description: 'Lege den Grundstein für deine Karriere. Erhalte dein Karriere-Blutbild.',
    features: ['65 Fragen Assessment', '50+ Seiten Report', 'Radar-Chart', 'Handlungsempfehlungen', '1 Monat Premium gratis'],
    fallbackPrice: 'KOSTENLOS',
    badge: '🎁 Gratis',
    cta: 'Kostenlose Analyse starten',
    type: 'one_time',
  },
  {
    key: 'ANALYSE_PRO',
    name: 'Karriere-Analyse',
    audience: 'F\u00FCr Berufst\u00E4tige & Selbstst\u00E4ndige',
    description: 'Dein Karriere-Blutbild: Fundierter \u00DCberblick \u00FCber deinen Ist-Zustand.',
    features: ['65 Fragen Assessment', '50+ Seiten Report', 'Coach-Auswertung', 'Karriere-Roadmap'],
    fallbackPrice: 'Preis auf Anfrage',
    badge: null,
    cta: 'Karriere-Blutbild sichern',
    type: 'one_time',
  },
  {
    key: 'MASTERCLASS',
    name: 'Masterclass',
    audience: 'Monatliches Abo',
    description: 'Kurse zu Gehaltsverhandlung, Rhetorik, Leadership und mehr.',
    features: ['Alle Kurs-Module', 'Quiz & Praxis-Aufgaben', 'Zertifikate', 'Community-Zugang'],
    fallbackPrice: 'ab 15\u20AC/Monat',
    badge: '7 Tage kostenlos',
    cta: 'Kostenlos testen',
    type: 'subscription',
  },
  {
    key: 'SEMINAR',
    name: 'Seminare',
    audience: 'Intensiv-Seminar',
    description: 'Ganzt\u00E4gige Workshops mit erfahrenen Coaches.',
    features: ['Ganzt\u00E4giges Intensiv-Seminar', 'Arbeitsmaterialien', 'Teilnahme-Zertifikat'],
    fallbackPrice: 'ab 99\u20AC',
    badge: null,
    cta: 'Seminar buchen',
    type: 'one_time',
  },
  {
    key: 'COACHING',
    name: 'Privat-Coaching',
    audience: '1:1 Coaching',
    description: 'Pers\u00F6nliches Coaching mit zertifiziertem Karriere-Coach.',
    features: ['60 Min. 1:1 Session', 'Pers\u00F6nlicher Aktionsplan', 'Follow-up Email'],
    fallbackPrice: 'ab 199\u20AC',
    badge: 'Premium',
    cta: 'Coaching buchen',
    type: 'one_time',
  },
];

export default function AngeboteClient() {
  const [interval, setInterval] = useState('monthly');
  const [loading, setLoading] = useState(null);

  const handleCheckout = async (productKey) => {
    setLoading(productKey);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productKey, interval }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(data.error === 'Nicht eingeloggt' ? 'Bitte logge dich zuerst ein.' : data.error);
      }
    } catch {
      alert('Verbindungsfehler. Bitte versuche es erneut.');
    }
    setLoading(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ki-bg)', fontFamily: "'Instrument Sans', sans-serif" }}>
      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <a href="/" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--ki-red)', textTransform: 'uppercase', textDecoration: 'none' }}>Karriere-Institut</a>
        <a href="/auth/login" className="btn btn-primary" style={{ fontSize: 13, padding: '8px 20px' }}>Einloggen</a>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '60px 24px 40px', maxWidth: 700, margin: '0 auto' }}>
        <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 12 }}>
          Unsere Angebote
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ki-text-secondary)', lineHeight: 1.6 }}>
          Die Blaupause f\u00FCr deinen beruflichen Erfolg. Finde das passende Angebot f\u00FCr deine Karrieresituation.
        </p>
      </section>

      {/* Interval Toggle for Masterclass */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 40 }}>
        <button
          onClick={() => setInterval('monthly')}
          className={`btn ${interval === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: 13, padding: '8px 20px', borderRadius: '8px 0 0 8px' }}
        >
          Monatlich
        </button>
        <button
          onClick={() => setInterval('yearly')}
          className={`btn ${interval === 'yearly' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: 13, padding: '8px 20px', borderRadius: '0 8px 8px 0' }}
        >
          J\u00E4hrlich <span style={{ fontSize: 11, opacity: 0.7 }}>(-20%)</span>
        </button>
      </div>

      {/* Products */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300, 1fr))', gap: 20 }}>
          {PRODUCTS.map((p) => {
            const isPremium = p.key === 'COACHING';
            return (
              <div key={p.key} className="card" style={{
                padding: 28, position: 'relative', display: 'flex', flexDirection: 'column',
                border: isPremium ? '2px solid var(--ki-red)' : '1px solid var(--ki-border)',
              }}>
                {/* Badges */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                  <span className="pill pill-grey" style={{ fontSize: 11 }}>{p.audience}</span>
                  {p.badge && <span className="pill pill-red" style={{ fontSize: 11 }}>{p.badge}</span>}
                </div>

                <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>{p.name}</h3>
                <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 16, flex: 1 }}>{p.description}</p>

                <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>{p.fallbackPrice}</div>

                <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                  {p.features.map((f, i) => (
                    <li key={i} style={{ fontSize: 13, padding: '4px 0', color: 'var(--ki-text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--ki-success)' }}>{'\u2713'}</span> {f}
                    </li>
                  ))}
                </ul>

                <button
                  className="btn btn-primary"
                  onClick={() => handleCheckout(p.key)}
                  disabled={loading === p.key}
                  style={{ width: '100%', opacity: loading === p.key ? 0.6 : 1 }}
                >
                  {loading === p.key ? 'Wird geladen...' : p.cta}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--ki-border)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginBottom: 8 }}>
          {'\u00A9'} 2026 - Das Karriere-Institut | +49 511 5468 4547 | info@daskarriereinstitut.de
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 12, color: 'var(--ki-text-secondary)' }}>
          <a href="/impressum" style={{ color: 'var(--ki-text-secondary)' }}>Impressum</a>
          <a href="/datenschutz" style={{ color: 'var(--ki-text-secondary)' }}>Datenschutz</a>
          <a href="/widerruf" style={{ color: 'var(--ki-text-secondary)' }}>Widerruf</a>
          <a href="/agb" style={{ color: 'var(--ki-text-secondary)' }}>AGB</a>
        </div>
      </footer>
    </div>
  );
}

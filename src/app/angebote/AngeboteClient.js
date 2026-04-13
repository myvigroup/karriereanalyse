'use client';
import { useState } from 'react';

export default function AngeboteClient() {
  const [interval, setInterval] = useState('monthly');
  const [loading, setLoading] = useState(null);

  const monthlyPrice = 15;
  const yearlyMonthly = Math.round(monthlyPrice * 0.8); // 12
  const yearlyTotal = yearlyMonthly * 12; // 144
  const yearlySavings = monthlyPrice * 12 - yearlyTotal; // 36

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
      <section style={{ textAlign: 'center', padding: '60px 24px 40px', maxWidth: 640, margin: '0 auto' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 12 }}>
          Seminar buchen
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ki-text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
          Einzel ab 99 € — oder mit der Premium-Mitgliedschaft jeden Monat inklusive.
        </p>
        {/* Value Hook Banner */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px',
          borderRadius: 12, background: 'rgba(204,20,38,0.06)', border: '1px solid rgba(204,20,38,0.15)',
        }}>
          <span style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>1 Seminar-Platz kostet einzeln</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--ki-text)', textDecoration: 'line-through', opacity: 0.45 }}>99 €</span>
          <span style={{ fontSize: 13, color: 'var(--ki-text-tertiary)' }}>— mit Premium-Abo</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--ki-red)' }}>15 €/Monat</span>
        </div>
      </section>

      {/* Interval Toggle */}
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
          Jährlich <span style={{ fontSize: 11, opacity: 0.7 }}>(-20%)</span>
        </button>
      </div>

      {/* 2-Column Pricing */}
      <section style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Einzelbuchung */}
        <div className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Einzelbuchung
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Seminar</h2>
          <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 24, lineHeight: 1.55 }}>
            Ein Seminar deiner Wahl — online, samstags, 09:30–12:00 Uhr.
          </p>

          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>99 €</div>
          <div style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', marginBottom: 28 }}>einmalig pro Seminar</div>

          <ul style={{ listStyle: 'none', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['1 Seminar deiner Wahl', 'Online via Microsoft Teams', 'Arbeitsmaterialien inklusive', 'Teilnahme-Zertifikat'].map((f, i) => (
              <li key={i} style={{ fontSize: 14, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--ki-success)', fontWeight: 700 }}>✓</span> {f}
              </li>
            ))}
          </ul>

          <button
            className="btn btn-secondary"
            onClick={() => handleCheckout('SEMINAR')}
            disabled={loading === 'SEMINAR'}
            style={{ width: '100%', marginTop: 'auto' }}
          >
            {loading === 'SEMINAR' ? 'Wird geladen...' : 'Jetzt buchen'}
          </button>
        </div>

        {/* KI-Mitgliedschaft */}
        <div className="card" style={{
          padding: 32, display: 'flex', flexDirection: 'column',
          border: '2px solid var(--ki-red)', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--ki-red)', color: '#fff', fontSize: 11, fontWeight: 700,
            padding: '4px 14px', borderRadius: 980, whiteSpace: 'nowrap',
          }}>
            ⭐ Empfohlen
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ki-red)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            {interval === 'yearly' ? 'Jährliches Abo' : 'Monatliches Abo'}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>Premium-Mitgliedschaft</h2>

          {/* Value Callout — prominenter Kern */}
          <div style={{
            background: 'rgba(204,20,38,0.05)', border: '1px solid rgba(204,20,38,0.15)',
            borderRadius: 10, padding: '14px 16px', marginBottom: 20,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
              Was du bekommst
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ki-text)' }}>1 Seminar pro Monat</div>
                <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 2 }}>+ alle E-Learnings & Masterclasses</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', textDecoration: 'line-through' }}>99 €/Monat</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--ki-red)', letterSpacing: '-0.03em' }}>15 €/Monat</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#2D6A4F' }}>Du sparst 84 €</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em' }}>
              {interval === 'yearly' ? yearlyMonthly : monthlyPrice} €
            </span>
            <span style={{ fontSize: 15, color: 'var(--ki-text-secondary)' }}>/Monat</span>
          </div>
          {interval === 'yearly' ? (
            <div style={{ fontSize: 13, color: 'var(--ki-success)', fontWeight: 600, marginBottom: 20 }}>
              = {yearlyTotal} €/Jahr · Du sparst {yearlySavings} €
            </div>
          ) : (
            )}

          <ul style={{ listStyle: 'none', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['📅', '1x Seminar/Monat', 'Jeden Monat ein neuer Skill, der dich im Job weiterbringt'],
              ['💰', 'Gehaltsverhandlung Mastery', '7–12 % mehr Gehalt — mit System und Skripten'],
              ['📚', 'Alle E-Learning Kurse', 'Rhetorik, Leadership, Achtsamkeit & mehr'],
              ['◎', 'Karriere-Analyse', 'Verstehe, wo du stehst — und wo du hinwillst'],
            ].map(([icon, title, desc], i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ki-text)' }}>{title}</div>
                  <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', lineHeight: 1.4, marginTop: 1 }}>{desc}</div>
                </div>
              </li>
            ))}
          </ul>

          <button
            className="btn btn-primary"
            onClick={() => handleCheckout('MASTERCLASS')}
            disabled={loading === 'MASTERCLASS'}
            style={{ width: '100%', marginTop: 'auto' }}
          >
            {loading === 'MASTERCLASS' ? 'Wird geladen...' : 'Premium-Mitgliedschaft starten'}
          </button>
        </div>
      </section>

      {/* Masterclass CTA */}
      <section style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: 'var(--r-lg)', padding: '24px 32px',
          display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: 36 }}>💰</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
              Nur die Gehaltsverhandlung Mastery?
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
              Einmalig ab 49 € — oder mit der Mitgliedschaft inklusive.
            </div>
          </div>
          <a href="/angebote/masterclass" className="btn btn-primary" style={{ fontSize: 13, padding: '10px 22px', flexShrink: 0 }}>
            Masterclass kaufen →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--ki-border)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginBottom: 8 }}>
          © 2026 - Das Karriere-Institut | +49 511 5468 4547 | info@daskarriereinstitut.de
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 12 }}>
          <a href="/impressum" style={{ color: 'var(--ki-text-secondary)' }}>Impressum</a>
          <a href="/datenschutz" style={{ color: 'var(--ki-text-secondary)' }}>Datenschutz</a>
          <a href="/widerruf" style={{ color: 'var(--ki-text-secondary)' }}>Widerruf</a>
          <a href="/agb" style={{ color: 'var(--ki-text-secondary)' }}>AGB</a>
        </div>
      </footer>
    </div>
  );
}

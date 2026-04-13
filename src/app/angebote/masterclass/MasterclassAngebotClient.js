'use client';
import { useState, useMemo } from 'react';

const MODULES = [
  { icon: '🧠', title: 'Modul 1: Mindset', sub: 'Die innere Blockade lösen' },
  { icon: '📊', title: 'Modul 2: Marktwert', sub: 'Deine Zahlen kennen' },
  { icon: '📋', title: 'Modul 3: Vorbereitung', sub: 'Der Fahrplan' },
  { icon: '🎭', title: 'Modul 4: Verhandlung', sub: 'Die Taktik im Gespräch' },
  { icon: '🏆', title: 'Modul 5: Abschluss', sub: 'Nach dem Ja' },
];

function GehaltsRechner() {
  const [salary, setSalary] = useState(50000);
  const result = useMemo(() => {
    const low = Math.round(salary * 0.07);
    const high = Math.round(salary * 0.12);
    const lowM = Math.round(low / 12);
    const highM = Math.round(high / 12);
    return { low, high, lowM, highM };
  }, [salary]);

  const fmtEur = (n) => n.toLocaleString('de-DE') + ' €';

  return (
    <section style={{ maxWidth: 640, margin: '40px auto 0', padding: '0 24px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: 20, padding: '32px 36px',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#ff6b7a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Dein Gehalts-Rechner
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: 0 }}>
            Wie viel Geld lässt du gerade liegen?
          </h2>
        </div>

        {/* Slider */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
              Dein aktuelles Jahresgehalt
            </label>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              {fmtEur(salary)}
            </div>
          </div>
          <input
            type="range"
            min={20000} max={200000} step={1000}
            value={salary}
            onChange={e => setSalary(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#CC1426', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
            <span>20.000 €</span>
            <span>200.000 €</span>
          </div>
        </div>

        {/* Result Box */}
        <div style={{
          background: 'rgba(204,20,38,0.15)', border: '1px solid rgba(204,20,38,0.4)',
          borderRadius: 14, padding: '20px 24px', marginBottom: 20,
        }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
              Mit 7–12 % Gehaltserhöhung hättest du <strong style={{ color: 'rgba(255,255,255,0.8)' }}>mehr pro Jahr</strong>:
            </div>
            <div style={{ fontSize: 42, fontWeight: 900, color: '#ff6b7a', letterSpacing: '-0.04em', lineHeight: 1 }}>
              {fmtEur(result.low)} – {fmtEur(result.high)}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>
              = {fmtEur(result.lowM)} – {fmtEur(result.highM)} mehr pro Monat
            </div>
          </div>
          <div style={{
            background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '12px 16px',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
              Das lässt du jedes Jahr liegen, weil du nicht verhandelst.
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
          Die Gehalts-Masterclass kostet einmalig <strong style={{ color: '#fff' }}>49 €</strong> —
          das holst du in einer einzigen Verhandlung raus.
        </div>
      </div>
    </section>
  );
}

export default function MasterclassAngebotClient() {
  const [interval, setInterval] = useState('monthly');
  const [loading, setLoading] = useState(null);

  const monthlyPrice = 15;
  const yearlyMonthly = Math.round(monthlyPrice * 0.8);
  const yearlyTotal = yearlyMonthly * 12;
  const yearlySavings = monthlyPrice * 12 - yearlyTotal;

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
      <section style={{ textAlign: 'center', padding: '60px 24px 16px', maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
        <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 12 }}>
          Gehalts-Masterclass
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ki-text-secondary)', lineHeight: 1.65, marginBottom: 8 }}>
          Von Angst zu Strategie: Lerne wie du dein Gehalt systematisch um 7–12 % steigerst —
          mit konkreten Skripten, Simulations-Training und marktbasierter Argumentation.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 13, color: 'var(--ki-text-tertiary)', marginTop: 12 }}>
          <span>5 Module</span>
          <span>·</span>
          <span>17 Lektionen</span>
          <span>·</span>
          <span>~55 Minuten</span>
        </div>
      </section>

      {/* Module Preview */}
      <section style={{ maxWidth: 560, margin: '28px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {MODULES.map((m, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
              borderRadius: 'var(--r-md)', background: 'var(--ki-card)', border: '1px solid var(--ki-border)',
            }}>
              <span style={{ fontSize: 18 }}>{m.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{m.title}</div>
                <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>{m.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <GehaltsRechner />

      {/* Interval Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, margin: '40px 0 32px' }}>
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
      <section style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Einzelkauf */}
        <div className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Einzelkauf · Lebenslanger Zugang
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Gehalts-Masterclass
          </h2>
          <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 20, lineHeight: 1.55 }}>
            Einmaliger Kauf — für immer zugänglich.
          </p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--ki-red)' }}>49 €</span>
            <span style={{ fontSize: 15, color: 'var(--ki-text-tertiary)', textDecoration: 'line-through' }}>99 €</span>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(204,20,38,0.08)', border: '1px solid rgba(204,20,38,0.2)',
            borderRadius: 980, padding: '4px 12px', fontSize: 12, fontWeight: 700, color: 'var(--ki-red)',
            marginBottom: 28, alignSelf: 'flex-start',
          }}>
            🎪 Messe-Aktionspreis
          </div>

          <ul style={{ listStyle: 'none', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              '5 Module · 17 Lektionen',
              'Interaktive Gehalts-Simulationen',
              'Konkrete Skripte & Pitches',
              'Lebenslanger Zugang',
              'Kurs-Zertifikat',
            ].map((f, i) => (
              <li key={i} style={{ fontSize: 14, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--ki-success)', fontWeight: 700 }}>✓</span> {f}
              </li>
            ))}
          </ul>

          <button
            className="btn btn-secondary"
            onClick={() => handleCheckout('MASTERCLASS_SINGLE')}
            disabled={loading === 'MASTERCLASS_SINGLE'}
            style={{ width: '100%', marginTop: 'auto' }}
          >
            {loading === 'MASTERCLASS_SINGLE' ? 'Wird geladen...' : 'Jetzt für 49 € kaufen'}
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
            ⭐ Mehr Wert
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ki-red)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            {interval === 'yearly' ? 'Jährliches Abo' : 'Monatliches Abo'}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>Premium-Mitgliedschaft</h2>

          {/* Value Callout */}
          <div style={{
            background: 'rgba(204,20,38,0.05)', border: '1px solid rgba(204,20,38,0.15)',
            borderRadius: 10, padding: '14px 16px', marginBottom: 20,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
              Was du bekommst
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ki-text)' }}>Masterclass + 1 Seminar/Monat</div>
                <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 2 }}>+ alle weiteren E-Learning Kurse</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', textDecoration: 'line-through' }}>148 €/Monat</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--ki-red)', letterSpacing: '-0.03em' }}>15 €/Monat</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#2D6A4F' }}>Du sparst 133 €</div>
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
            <div style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', marginBottom: 20 }}>7 Tage kostenlos testen</div>
          )}

          <ul style={{ listStyle: 'none', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Gehalts-Masterclass inklusive',
              '1x Premium-Seminar pro Monat (Wert 99 €)',
              'Alle weiteren E-Learning Kurse',
              'Karriere-Analyse vollständig',
              'Neue Inhalte jeden Monat',
            ].map((f, i) => (
              <li key={i} style={{ fontSize: 14, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--ki-success)', fontWeight: 700 }}>✓</span> {f}
              </li>
            ))}
          </ul>

          <button
            className="btn btn-primary"
            onClick={() => handleCheckout('MASTERCLASS')}
            disabled={loading === 'MASTERCLASS'}
            style={{ width: '100%', marginTop: 'auto' }}
          >
            {loading === 'MASTERCLASS' ? 'Wird geladen...' : interval === 'yearly' ? 'Premium-Mitgliedschaft starten' : '7 Tage kostenlos testen'}
          </button>
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

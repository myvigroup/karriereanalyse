'use client';

import { useState } from 'react';

export default function UnlearnAssistantWidget({ config, onComplete }) {
  const beispiele = config?.beispiele || [];
  const [routinen, setRoutinen] = useState([{ alt: '', neu: '', hebel: '' }]);
  const [submitted, setSubmitted] = useState(false);

  function update(idx, field, val) {
    setRoutinen(prev => prev.map((r, i) => i === idx ? { ...r, [field]: val } : r));
  }

  function addRoutine() {
    if (routinen.length < 5) setRoutinen(prev => [...prev, { alt: '', neu: '', hebel: '' }]);
  }

  const allFilled = routinen.every(r => r.alt.length >= 3 && r.neu.length >= 3);

  return (
    <div className="card" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🗑️</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Kill your Darlings: Altes verlernen</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 8, lineHeight: 1.6 }}>
        Nach 5+ Jahren blockieren alte Routinen neues Wissen. Identifiziere 3 Routinen die du ersetzen willst.
      </p>

      {beispiele.length > 0 && (
        <div style={{ marginBottom: 14, padding: '10px 12px', borderRadius: 'var(--r-md)', background: 'var(--ki-bg-alt)', fontSize: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--ki-text-tertiary)' }}>Beispiele:</div>
          {beispiele.map((b, i) => (
            <div key={i} style={{ color: 'var(--ki-text-secondary)', marginBottom: 2 }}>
              ❌ {b.alt} → ✅ {b.neu} ({b.hebel})
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {routinen.map((r, i) => (
          <div key={i} style={{ padding: '10px', borderRadius: 'var(--r-md)', background: 'var(--ki-bg-alt)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#ef4444', marginBottom: 2 }}>❌ Alte Routine</div>
            <input className="input" value={r.alt} onChange={e => update(i, 'alt', e.target.value)} placeholder="Was machst du seit Jahren?" disabled={submitted} style={{ fontSize: 13, marginBottom: 6 }} />
            <div style={{ fontSize: 12, fontWeight: 600, color: '#16a34a', marginBottom: 2 }}>✅ Neue Alternative</div>
            <input className="input" value={r.neu} onChange={e => update(i, 'neu', e.target.value)} placeholder="Was wäre besser?" disabled={submitted} style={{ fontSize: 13, marginBottom: 6 }} />
            <div style={{ fontSize: 12, fontWeight: 600, color: '#8b5cf6', marginBottom: 2 }}>📈 Erwarteter Hebel</div>
            <input className="input" value={r.hebel} onChange={e => update(i, 'hebel', e.target.value)} placeholder="z.B. 5h/Monat gespart" disabled={submitted} style={{ fontSize: 13 }} />
          </div>
        ))}
      </div>

      {!submitted && routinen.length < 5 && (
        <button onClick={addRoutine} className="btn btn-secondary" style={{ marginTop: 10, fontSize: 12 }}>
          + Weitere Routine
        </button>
      )}

      {!submitted ? (
        <button onClick={() => setSubmitted(true)} className="btn btn-primary" disabled={!allFilled} style={{ marginTop: 14, opacity: allFilled ? 1 : 0.5 }}>
          Unlearn-Plan aktivieren
        </button>
      ) : (
        <div style={{ marginTop: 14 }}>
          <div style={{ padding: '12px 16px', borderRadius: 'var(--r-md)', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#8b5cf6' }}>
              ✅ {routinen.length} Routine{routinen.length > 1 ? 'n' : ''} zum Verlernen markiert
            </div>
            <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>
              Challenge: Teste diese Woche EINE neue Alternative. Messe das Ergebnis.
            </div>
          </div>
          <button onClick={onComplete} className="btn btn-primary">✅ Als erledigt markieren (+40 XP)</button>
        </div>
      )}
    </div>
  );
}

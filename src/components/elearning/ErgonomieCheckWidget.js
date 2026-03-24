'use client';

import { useState } from 'react';

export default function ErgonomieCheckWidget({ config, onComplete }) {
  const checks = config?.checks || [];
  const [checked, setChecked] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = Object.values(checked).filter(Boolean).length;
  const total = checks.length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  function toggle(i) {
    if (submitted) return;
    setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  const getColor = () => {
    if (pct >= 80) return '#16a34a';
    if (pct >= 50) return '#f59e0b';
    return '#dc2626';
  };

  const getLabel = () => {
    if (pct >= 80) return 'Deine Ergonomie ist top!';
    if (pct >= 50) return 'Guter Anfang — ein paar Punkte kannst du noch verbessern.';
    return 'Achtung! Deine Lese-Ergonomie braucht dringend Verbesserung.';
  };

  return (
    <div className="card" style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>👁️</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Ergonomie-Check</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
        Gehe jeden Punkt durch und prüfe ehrlich, ob du ihn erfüllst.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {checks.map((c, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 'var(--r-md)',
              background: checked[i]
                ? 'rgba(34,197,94,0.06)'
                : 'var(--ki-bg-alt)',
              border: checked[i]
                ? '1px solid rgba(34,197,94,0.25)'
                : '1px solid var(--ki-border)',
              cursor: submitted ? 'default' : 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
          >
            <span style={{
              width: 22, height: 22, borderRadius: 4, flexShrink: 0, marginTop: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: checked[i] ? '#16a34a' : 'var(--ki-card)',
              border: checked[i] ? 'none' : '2px solid var(--ki-border)',
              color: 'white', fontSize: 12, fontWeight: 700,
            }}>
              {checked[i] ? '✓' : ''}
            </span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{c.bereich}</div>
              <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginBottom: 2 }}>{c.check}</div>
              <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', fontStyle: 'italic' }}>Optimal: {c.optimal}</div>
            </div>
          </button>
        ))}
      </div>

      {!submitted ? (
        <button onClick={handleSubmit} className="btn btn-primary" style={{ marginTop: 18 }}>
          Auswertung anzeigen
        </button>
      ) : (
        <div style={{
          marginTop: 18, padding: '16px 18px', borderRadius: 'var(--r-md)',
          background: `${getColor()}10`, border: `1px solid ${getColor()}40`,
        }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: getColor(), marginBottom: 4 }}>
            {score}/{total} Punkte ({pct}%)
          </div>
          <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>
            {getLabel()}
          </div>
          {checks.filter((_, i) => !checked[i]).length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--ki-text-tertiary)' }}>
                Das kannst du verbessern:
              </div>
              {checks.filter((_, i) => !checked[i]).map((c, idx) => (
                <div key={idx} style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 4 }}>
                  → <strong>{c.bereich}:</strong> {c.optimal}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {submitted && (
        <button onClick={onComplete} className="btn btn-primary" style={{ marginTop: 14 }}>
          ✅ Als erledigt markieren (+30 XP)
        </button>
      )}
    </div>
  );
}

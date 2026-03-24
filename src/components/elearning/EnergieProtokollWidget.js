'use client';

import { useState, useCallback } from 'react';

const ZEITEN = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

function getRecommendations(levels) {
  const entries = Object.entries(levels).sort((a, b) => ZEITEN.indexOf(a[0]) - ZEITEN.indexOf(b[0]));
  if (entries.length < 5) return null;

  const peak = entries.reduce((best, cur) => cur[1] > best[1] ? cur : best);
  const low = entries.reduce((worst, cur) => cur[1] < worst[1] ? cur : worst);
  const avg = entries.reduce((sum, e) => sum + e[1], 0) / entries.length;

  return {
    peak: { zeit: peak[0], wert: peak[1] },
    low: { zeit: low[0], wert: low[1] },
    avg: Math.round(avg * 10) / 10,
    tipps: [
      `Dein Energie-Peak liegt um ${peak[0]} Uhr. Plane hier deine wichtigste Aufgabe!`,
      `Dein Energie-Tief liegt um ${low[0]} Uhr. Plane hier leichte Aufgaben oder eine Pause.`,
      avg < 5 ? 'Dein Durchschnitt ist niedrig. Pruefe Schlaf, Ernaehrung und Bewegung.' :
      avg < 7 ? 'Dein Durchschnitt ist solide. Micro-Recovery-Techniken koennen die Tiefs abfedern.' :
      'Dein Durchschnitt ist hoch! Halte deine Routinen bei.',
    ],
  };
}

export default function EnergieProtokollWidget({ onComplete }) {
  const [levels, setLevels] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleLevel = useCallback((zeit, val) => {
    if (submitted) return;
    setLevels(prev => ({ ...prev, [zeit]: Number(val) }));
  }, [submitted]);

  const filledCount = Object.keys(levels).length;
  const results = submitted ? getRecommendations(levels) : null;

  return (
    <div className="card" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>⚡</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Dein Energie-Protokoll</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
        Setze fuer jede Stunde dein Energielevel (1 = voellig leer, 10 = volle Energie). Mindestens 5 Eintraege.
      </p>

      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {ZEITEN.map(zeit => {
          const val = levels[zeit] || 0;
          const color = val >= 7 ? '#22c55e' : val >= 4 ? '#f59e0b' : val > 0 ? '#ef4444' : 'var(--ki-border)';
          return (
            <div key={zeit} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, width: 42, color: 'var(--ki-text-tertiary)' }}>{zeit}</span>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={val || 5}
                  onChange={e => handleLevel(zeit, e.target.value)}
                  disabled={submitted}
                  style={{ width: '100%', accentColor: color }}
                />
                {val > 0 && (
                  <div style={{
                    position: 'absolute', right: -30, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 12, fontWeight: 700, color,
                    width: 24, textAlign: 'center',
                  }}>
                    {val}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={() => setSubmitted(true)}
          className="btn btn-primary"
          disabled={filledCount < 5}
          style={{ opacity: filledCount >= 5 ? 1 : 0.5 }}
        >
          Protokoll auswerten ({filledCount} / {ZEITEN.length} ausgefuellt)
        </button>
      )}

      {submitted && results && (
        <div style={{ marginTop: 8 }}>
          {/* Visual chart */}
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: 2, height: 100,
            padding: '0 4px', marginBottom: 16, borderBottom: '1px solid var(--ki-border)',
          }}>
            {ZEITEN.map(zeit => {
              const val = levels[zeit] || 0;
              const pct = (val / 10) * 100;
              const color = val >= 7 ? '#22c55e' : val >= 4 ? '#f59e0b' : '#ef4444';
              const isPeak = zeit === results.peak.zeit;
              const isLow = zeit === results.low.zeit;
              return (
                <div key={zeit} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  {(isPeak || isLow) && (
                    <span style={{ fontSize: 8, color }}>{isPeak ? 'Peak' : 'Tief'}</span>
                  )}
                  <div style={{
                    width: '100%', height: `${pct}%`, minHeight: val > 0 ? 4 : 0,
                    background: color,
                    borderRadius: '2px 2px 0 0',
                    border: (isPeak || isLow) ? `2px solid ${color}` : 'none',
                    transition: 'height 0.3s',
                  }} />
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <div style={{ flex: 1, padding: '10px', borderRadius: 'var(--r-sm)', background: 'rgba(34,197,94,0.06)', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#22c55e' }}>{results.peak.zeit}</div>
              <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>Peak ({results.peak.wert}/10)</div>
            </div>
            <div style={{ flex: 1, padding: '10px', borderRadius: 'var(--r-sm)', background: 'rgba(239,68,68,0.06)', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#ef4444' }}>{results.low.zeit}</div>
              <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>Tief ({results.low.wert}/10)</div>
            </div>
            <div style={{ flex: 1, padding: '10px', borderRadius: 'var(--r-sm)', background: 'rgba(59,130,246,0.06)', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#3b82f6' }}>{results.avg}</div>
              <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>Durchschnitt</div>
            </div>
          </div>

          {/* Recommendations */}
          <div style={{
            padding: '14px 16px', borderRadius: 'var(--r-md)',
            background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)',
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Empfehlungen</div>
            {results.tipps.map((t, i) => (
              <div key={i} style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ki-text-secondary)', marginBottom: 4 }}>
                {t}
              </div>
            ))}
          </div>

          <button onClick={() => onComplete?.()} className="btn btn-primary">
            Energie-Protokoll speichern (+40 XP)
          </button>
        </div>
      )}
    </div>
  );
}

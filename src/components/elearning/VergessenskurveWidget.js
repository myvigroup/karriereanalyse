'use client';

import { useState, useEffect } from 'react';

const CURVE_POINTS = [
  { day: 0, noRepeat: 100, withRepeat: 100 },
  { day: 1, noRepeat: 33, withRepeat: 90 },
  { day: 3, noRepeat: 25, withRepeat: 85 },
  { day: 7, noRepeat: 20, withRepeat: 80 },
  { day: 14, noRepeat: 15, withRepeat: 78 },
  { day: 21, noRepeat: 12, withRepeat: 75 },
  { day: 30, noRepeat: 10, withRepeat: 73 },
];

export default function VergessenskurveWidget({ onComplete }) {
  const [showRepeat, setShowRepeat] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 300);
  }, []);

  const chartH = 200;
  const chartW = 100; // percentage

  return (
    <div className="card" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>📉</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Die Ebbinghaus Vergessenskurve</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
        Ohne Wiederholung vergisst du 70% in 24 Stunden. Mit Spaced Repetition behältst du 73% nach 30 Tagen.
      </p>

      {/* Chart */}
      <div style={{ position: 'relative', height: chartH + 40, padding: '0 10px', marginBottom: 20 }}>
        {/* Y axis labels */}
        <div style={{ position: 'absolute', left: 0, top: 0, height: chartH, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {[100, 75, 50, 25, 0].map(v => (
            <span key={v} style={{ fontSize: 10, color: 'var(--ki-text-tertiary)', width: 28, textAlign: 'right' }}>{v}%</span>
          ))}
        </div>

        {/* Chart area */}
        <div style={{ marginLeft: 36, height: chartH, position: 'relative', borderLeft: '1px solid var(--ki-border)', borderBottom: '1px solid var(--ki-border)' }}>
          {/* Grid lines */}
          {[25, 50, 75].map(v => (
            <div key={v} style={{ position: 'absolute', left: 0, right: 0, bottom: `${v}%`, height: 1, background: 'var(--ki-border)', opacity: 0.3 }} />
          ))}

          {/* No-repeat curve (red) */}
          {CURVE_POINTS.map((p, i) => (
            <div key={`nr-${i}`} style={{
              position: 'absolute',
              left: `${(p.day / 30) * 100}%`,
              bottom: `${animated ? p.noRepeat : 100}%`,
              width: 8, height: 8, borderRadius: '50%',
              background: '#ef4444', border: '2px solid white',
              transition: 'bottom 1s ease',
              transform: 'translate(-4px, 4px)',
              zIndex: 2,
            }} />
          ))}

          {/* With-repeat curve (green) */}
          {showRepeat && CURVE_POINTS.map((p, i) => (
            <div key={`wr-${i}`} style={{
              position: 'absolute',
              left: `${(p.day / 30) * 100}%`,
              bottom: `${animated ? p.withRepeat : 100}%`,
              width: 8, height: 8, borderRadius: '50%',
              background: '#16a34a', border: '2px solid white',
              transition: 'bottom 1s ease',
              transform: 'translate(-4px, 4px)',
              zIndex: 2,
            }} />
          ))}
        </div>

        {/* X axis labels */}
        <div style={{ marginLeft: 36, display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          {CURVE_POINTS.map(p => (
            <span key={p.day} style={{ fontSize: 9, color: 'var(--ki-text-tertiary)' }}>T{p.day}</span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ color: 'var(--ki-text-secondary)' }}>Ohne Wiederholung</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, opacity: showRepeat ? 1 : 0.3 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#16a34a' }} />
          <span style={{ color: 'var(--ki-text-secondary)' }}>Mit Spaced Repetition</span>
        </div>
      </div>

      {!showRepeat ? (
        <button onClick={() => setShowRepeat(true)} className="btn btn-primary">
          Zeige Spaced Repetition Kurve
        </button>
      ) : (
        <div>
          <div style={{
            padding: '12px 16px', borderRadius: 'var(--r-md)', marginBottom: 14,
            background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)',
            fontSize: 13, color: '#16a34a', fontWeight: 600,
          }}>
            Mit Spaced Repetition (Tag 1, 3, 7, 21) behältst du 73% statt 10%!
          </div>
          <button onClick={onComplete} className="btn btn-primary">
            ✅ Als erledigt markieren
          </button>
        </div>
      )}
    </div>
  );
}

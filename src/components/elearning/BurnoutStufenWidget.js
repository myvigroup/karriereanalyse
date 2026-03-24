'use client';

import { useState } from 'react';
import { BURNOUT_STUFEN } from '@/lib/elearning/balance-content';

export default function BurnoutStufenWidget({ onComplete }) {
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const stufen = BURNOUT_STUFEN.stufen;
  const empfehlungen = BURNOUT_STUFEN.empfehlungen;

  function handleSelect(stufe) {
    if (confirmed) return;
    setSelected(stufe);
  }

  function handleConfirm() {
    setConfirmed(true);
  }

  const getZoneEmpfehlung = () => {
    if (!selected) return '';
    return empfehlungen[selected.zone] || '';
  };

  const isWarning = selected && selected.stufe >= 8;

  return (
    <div className="card" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🔥</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Burnout-Stufen: Wo stehst du?</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
        Klicke auf die Stufe, mit der du dich am meisten identifizierst. Sei ehrlich zu dir selbst.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {stufen.map(s => (
          <button
            key={s.stufe}
            onClick={() => handleSelect(s)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 'var(--r-sm)',
              background: selected?.stufe === s.stufe ? `${s.farbe}18` : 'var(--ki-bg-alt)',
              border: selected?.stufe === s.stufe ? `2px solid ${s.farbe}` : '1px solid var(--ki-border)',
              cursor: confirmed ? 'default' : 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
              opacity: confirmed && selected?.stufe !== s.stufe ? 0.4 : 1,
            }}
          >
            <span style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: s.farbe, color: 'white', fontSize: 12, fontWeight: 700,
            }}>
              {s.stufe}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 1 }}>{s.name}</div>
              {(selected?.stufe === s.stufe) && (
                <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', lineHeight: 1.5 }}>
                  {s.beschreibung}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {selected && !confirmed && (
        <button
          onClick={handleConfirm}
          className="btn btn-primary"
          style={{ marginTop: 16 }}
        >
          Stufe {selected.stufe} bestaetigen
        </button>
      )}

      {confirmed && selected && (
        <div style={{ marginTop: 16 }}>
          {isWarning && (
            <div style={{
              padding: '14px 16px',
              borderRadius: 'var(--r-md)',
              background: 'rgba(239,68,68,0.08)',
              border: '2px solid rgba(239,68,68,0.4)',
              marginBottom: 14,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#dc2626', marginBottom: 6 }}>
                Wichtiger Hinweis
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ki-text-secondary)' }}>
                Du befindest dich auf Stufe {selected.stufe} — das ist ein ernstes Warnsignal.
                Bitte suche dir professionelle Hilfe.
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#dc2626', marginTop: 8 }}>
                {BURNOUT_STUFEN.hotline}
              </div>
            </div>
          )}

          <div style={{
            padding: '14px 16px',
            borderRadius: 'var(--r-md)',
            background: `${selected.farbe}10`,
            border: `1px solid ${selected.farbe}30`,
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
              Empfehlung fuer Zone "{selected.zone}"
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ki-text-secondary)' }}>
              {getZoneEmpfehlung()}
            </div>
          </div>

          <button onClick={() => onComplete?.()} className="btn btn-primary">
            Ergebnis speichern (+30 XP)
          </button>
        </div>
      )}
    </div>
  );
}

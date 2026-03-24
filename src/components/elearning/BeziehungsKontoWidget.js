'use client';

import { useState } from 'react';
import { BEZIEHUNGS_KONTO } from '@/lib/elearning/balance-content';

export default function BeziehungsKontoWidget({ onComplete }) {
  const [einzahlungen, setEinzahlungen] = useState([]);
  const [abhebungen, setAbhebungen] = useState([]);
  const [customEin, setCustomEin] = useState('');
  const [customAb, setCustomAb] = useState('');
  const [showCheck, setShowCheck] = useState(false);
  const [checkAnswers, setCheckAnswers] = useState({});

  const einCount = einzahlungen.length;
  const abCount = abhebungen.length;
  const ratio = abCount > 0 ? (einCount / abCount).toFixed(1) : einCount > 0 ? 'Perfekt' : '0:0';
  const isGood = abCount === 0 || (einCount / abCount) >= 5;

  function addEinzahlung(text) {
    if (text.trim()) {
      setEinzahlungen(prev => [...prev, text.trim()]);
      setCustomEin('');
    }
  }

  function addAbhebung(text) {
    if (text.trim()) {
      setAbhebungen(prev => [...prev, text.trim()]);
      setCustomAb('');
    }
  }

  function removeEin(i) { setEinzahlungen(prev => prev.filter((_, idx) => idx !== i)); }
  function removeAb(i) { setAbhebungen(prev => prev.filter((_, idx) => idx !== i)); }

  const ratioColor = isGood ? '#22c55e' : abCount > 0 && einCount / abCount >= 3 ? '#f59e0b' : '#ef4444';

  return (
    <div className="card" style={{ border: '1px solid rgba(239,68,68,0.15)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🏦</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Dein Beziehungs-Konto</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
        Gottman-Ratio: Mindestens 5 positive Interaktionen auf 1 negative. Tracke deine Ein- und Auszahlungen.
      </p>

      {/* Ratio display */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        padding: '14px', borderRadius: 'var(--r-md)',
        background: `${ratioColor}08`, border: `1px solid ${ratioColor}25`,
        marginBottom: 16,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#22c55e' }}>{einCount}</div>
          <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>Einzahlungen</div>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: ratioColor }}>:</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#ef4444' }}>{abCount}</div>
          <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>Abhebungen</div>
        </div>
        <div style={{
          marginLeft: 12, padding: '6px 12px', borderRadius: 'var(--r-sm)',
          background: `${ratioColor}15`, fontSize: 13, fontWeight: 700, color: ratioColor,
        }}>
          Ratio: {typeof ratio === 'string' ? ratio : `${ratio}:1`}
          {typeof ratio !== 'string' && (isGood ? ' ✓' : ' (Ziel: 5:1)')}
        </div>
      </div>

      {/* Balance meter */}
      <div style={{ height: 8, borderRadius: 4, background: 'var(--ki-border)', marginBottom: 20, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${Math.min(100, (einCount + abCount) > 0 ? (einCount / (einCount + abCount)) * 100 : 50)}%`,
          background: `linear-gradient(90deg, #22c55e, ${ratioColor})`,
          borderRadius: 4,
          transition: 'width 0.3s',
        }} />
      </div>

      {/* Two columns */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        {/* Einzahlungen */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', marginBottom: 8 }}>Einzahlungen (+)</div>

          {/* Preset buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {BEZIEHUNGS_KONTO.einzahlungen.map(e => (
              <button
                key={e.id}
                onClick={() => addEinzahlung(e.text)}
                style={{
                  fontSize: 11, padding: '4px 8px', borderRadius: 'var(--r-sm)',
                  background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)',
                  cursor: 'pointer', color: 'var(--ki-text-secondary)',
                }}
                title={e.beispiel}
              >
                + {e.text.substring(0, 20)}...
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            <input
              className="input"
              value={customEin}
              onChange={e => setCustomEin(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addEinzahlung(customEin)}
              placeholder="Eigene..."
              style={{ fontSize: 12, flex: 1 }}
            />
            <button onClick={() => addEinzahlung(customEin)} style={{
              fontSize: 14, padding: '4px 10px', borderRadius: 'var(--r-sm)',
              background: '#22c55e', color: 'white', border: 'none', cursor: 'pointer',
            }}>+</button>
          </div>

          {einzahlungen.map((e, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 8px', borderRadius: 'var(--r-sm)',
              background: 'rgba(34,197,94,0.04)', fontSize: 12, marginBottom: 3,
            }}>
              <span style={{ color: '#22c55e', fontWeight: 700 }}>+</span>
              <span style={{ flex: 1, color: 'var(--ki-text-secondary)' }}>{e}</span>
              <button onClick={() => removeEin(i)} style={{
                fontSize: 10, color: 'var(--ki-text-tertiary)', background: 'none',
                border: 'none', cursor: 'pointer',
              }}>x</button>
            </div>
          ))}
        </div>

        {/* Abhebungen */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', marginBottom: 8 }}>Abhebungen (-)</div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {BEZIEHUNGS_KONTO.abhebungen.map(a => (
              <button
                key={a.id}
                onClick={() => addAbhebung(a.text)}
                style={{
                  fontSize: 11, padding: '4px 8px', borderRadius: 'var(--r-sm)',
                  background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
                  cursor: 'pointer', color: 'var(--ki-text-secondary)',
                }}
                title={a.beispiel}
              >
                - {a.text.substring(0, 20)}...
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            <input
              className="input"
              value={customAb}
              onChange={e => setCustomAb(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addAbhebung(customAb)}
              placeholder="Eigene..."
              style={{ fontSize: 12, flex: 1 }}
            />
            <button onClick={() => addAbhebung(customAb)} style={{
              fontSize: 14, padding: '4px 10px', borderRadius: 'var(--r-sm)',
              background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer',
            }}>-</button>
          </div>

          {abhebungen.map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 8px', borderRadius: 'var(--r-sm)',
              background: 'rgba(239,68,68,0.04)', fontSize: 12, marginBottom: 3,
            }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>-</span>
              <span style={{ flex: 1, color: 'var(--ki-text-secondary)' }}>{a}</span>
              <button onClick={() => removeAb(i)} style={{
                fontSize: 10, color: 'var(--ki-text-tertiary)', background: 'none',
                border: 'none', cursor: 'pointer',
              }}>x</button>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly check */}
      {!showCheck && (einCount + abCount >= 2) && (
        <button
          onClick={() => setShowCheck(true)}
          className="btn btn-secondary"
          style={{ marginBottom: 12, fontSize: 13 }}
        >
          Woechentlicher Beziehungs-Check
        </button>
      )}

      {showCheck && (
        <div style={{
          padding: '14px 16px', borderRadius: 'var(--r-md)',
          background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)',
          marginBottom: 14,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Woechentlicher Check</div>
          {BEZIEHUNGS_KONTO.woechentlicher_check.map((q, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 4, lineHeight: 1.5 }}>{q}</div>
              <input
                className="input"
                placeholder="Deine Antwort..."
                value={checkAnswers[i] || ''}
                onChange={e => setCheckAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                style={{ fontSize: 12 }}
              />
            </div>
          ))}
        </div>
      )}

      {(einCount + abCount >= 2) && (
        <button onClick={() => onComplete?.()} className="btn btn-primary">
          Beziehungs-Konto speichern (+40 XP)
        </button>
      )}
    </div>
  );
}

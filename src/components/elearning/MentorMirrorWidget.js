'use client';

import { useState } from 'react';

export default function MentorMirrorWidget({ config, onComplete }) {
  const branchen = config?.branchen || [];
  const [selectedBranche, setSelectedBranche] = useState(null);
  const [eigeneLernzeit, setEigeneLernzeit] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selected = branchen.find((_, i) => i === selectedBranche);

  return (
    <div className="card" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🪞</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Mentor-Mirror: Branchen-Vergleich</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
        Wie viel lernen andere in deiner Branche? Orientierung für Einsteiger.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {branchen.map((b, i) => (
          <button
            key={i}
            onClick={() => setSelectedBranche(i)}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px', borderRadius: 'var(--r-md)', textAlign: 'left',
              background: selectedBranche === i ? 'rgba(139,92,246,0.08)' : 'var(--ki-bg-alt)',
              border: selectedBranche === i ? '2px solid #8b5cf6' : '1px solid var(--ki-border)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: selectedBranche === i ? '#7c3aed' : 'var(--ki-text)' }}>{b.branche}</div>
              <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>Top Skills: {b.top_skills}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#8b5cf6' }}>{b.durchschnitt}</div>
              <div style={{ fontSize: 10, color: 'var(--ki-text-tertiary)' }}>Lern-Budget: {b.lern_budget}</div>
            </div>
          </button>
        ))}
      </div>

      {selected && !submitted && (
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
            Wie viel lernst DU aktuell pro Tag?
          </label>
          <input
            className="input"
            value={eigeneLernzeit}
            onChange={e => setEigeneLernzeit(e.target.value)}
            placeholder="z.B. 15 Min, 30 Min, 1 Stunde..."
            style={{ fontSize: 13 }}
          />
        </div>
      )}

      {!submitted && selectedBranche !== null && eigeneLernzeit && (
        <button onClick={() => setSubmitted(true)} className="btn btn-primary">
          Vergleich anzeigen
        </button>
      )}

      {submitted && selected && (
        <div style={{ marginTop: 14 }}>
          <div style={{
            padding: '14px 16px', borderRadius: 'var(--r-md)',
            background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)',
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#8b5cf6', marginBottom: 8 }}>
              Dein Vergleich: {selected.branche}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', lineHeight: 1.8 }}>
              <strong>Branchen-Durchschnitt:</strong> {selected.durchschnitt}<br />
              <strong>Deine Lernzeit:</strong> {eigeneLernzeit}<br />
              <strong>Empfohlenes Lern-Budget:</strong> {selected.lern_budget}
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginBottom: 14 }}>
            Tipp: Starte mit 20 Min/Tag. Steigere auf den Branchen-Durchschnitt in 4 Wochen.
          </p>
          <button onClick={onComplete} className="btn btn-primary">
            ✅ Als erledigt markieren
          </button>
        </div>
      )}
    </div>
  );
}

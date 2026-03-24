'use client';

import { useState } from 'react';

const MODI = [
  { id: 'deep', label: '🐢 Deep Reading', color: '#3b82f6' },
  { id: 'normal', label: '🚶 Normal', color: '#10b981' },
  { id: 'speed', label: '🏃 Speedreading', color: '#f59e0b' },
  { id: 'skim', label: '⚡ Skimming', color: '#ef4444' },
];

export default function DifferenzierungsMatrix({ config, onComplete }) {
  const texte = config?.texte || [];
  const [assignments, setAssignments] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function assign(textIdx, modusId) {
    if (submitted) return;
    setAssignments(prev => ({ ...prev, [textIdx]: modusId }));
  }

  const allAssigned = texte.length > 0 && texte.every((_, i) => assignments[i]);

  function handleSubmit() {
    setSubmitted(true);
  }

  const correctCount = texte.filter((t, i) => assignments[i] === t.correct).length;
  const pct = texte.length > 0 ? Math.round((correctCount / texte.length) * 100) : 0;

  return (
    <div className="card" style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🎯</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Sortiere diese Texte in den richtigen Lese-Modus</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
        Nicht jeder Text verdient die gleiche Geschwindigkeit. Ordne jeden Text dem passenden Lese-Modus zu.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {texte.map((t, i) => {
          const selected = assignments[i];
          const isCorrect = submitted && selected === t.correct;
          const isWrong = submitted && selected && selected !== t.correct;
          const correctModus = MODI.find(m => m.id === t.correct);

          return (
            <div key={i} style={{
              padding: '12px 14px', borderRadius: 'var(--r-md)',
              background: isCorrect ? 'rgba(34,197,94,0.06)' : isWrong ? 'rgba(239,68,68,0.05)' : 'var(--ki-bg-alt)',
              border: isCorrect ? '1px solid rgba(34,197,94,0.3)' : isWrong ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--ki-border)',
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                {t.text}
                {isCorrect && <span style={{ marginLeft: 8, color: '#16a34a', fontSize: 13 }}>✓ Richtig!</span>}
                {isWrong && <span style={{ marginLeft: 8, color: '#dc2626', fontSize: 12 }}>✗ Richtig wäre: {correctModus?.label}</span>}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {MODI.map(m => (
                  <button
                    key={m.id}
                    onClick={() => assign(i, m.id)}
                    disabled={submitted}
                    style={{
                      padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      border: selected === m.id ? `2px solid ${m.color}` : '2px solid transparent',
                      background: selected === m.id ? `${m.color}18` : 'var(--ki-card)',
                      color: selected === m.id ? m.color : 'var(--ki-text-secondary)',
                      cursor: submitted ? 'default' : 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="btn btn-primary"
          disabled={!allAssigned}
          style={{ marginTop: 18, opacity: allAssigned ? 1 : 0.5 }}
        >
          Auswertung anzeigen
        </button>
      ) : (
        <div style={{ marginTop: 18 }}>
          <div style={{
            padding: '14px 18px', borderRadius: 'var(--r-md)',
            background: pct >= 75 ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)',
            border: pct >= 75 ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(245,158,11,0.25)',
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: pct >= 75 ? '#16a34a' : '#d97706' }}>
              {correctCount}/{texte.length} richtig ({pct}%)
            </div>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>
              {pct === 100 ? 'Perfekt! Du weißt genau wann welcher Modus angemessen ist.' :
               pct >= 75 ? 'Sehr gut! Die Nuancen kommen mit der Übung.' :
               'Nicht schlecht! Denk daran: Verträge = Deep, E-Mails = Speed, Newsletter = Skim.'}
            </div>
          </div>
          <button onClick={onComplete} className="btn btn-primary">
            ✅ Als erledigt markieren (+30 XP)
          </button>
        </div>
      )}
    </div>
  );
}

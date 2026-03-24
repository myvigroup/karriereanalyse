'use client';

import { useState, useMemo } from 'react';

export default function LerntypTest({ config, onComplete }) {
  const typen = config?.typen || [];
  const fragen = config?.fragen || [];
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function answer(qIdx, typ) {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: typ }));
  }

  const allAnswered = fragen.length > 0 && fragen.every((_, i) => answers[i]);

  const scores = useMemo(() => {
    const s = {};
    typen.forEach(t => { s[t.id] = 0; });
    Object.values(answers).forEach(typ => { if (s[typ] !== undefined) s[typ]++; });
    return s;
  }, [answers, typen]);

  const maxScore = Math.max(...Object.values(scores), 1);
  const dominantTyp = typen.find(t => scores[t.id] === maxScore) || typen[0];

  function handleSubmit() {
    setSubmitted(true);
  }

  return (
    <div className="card" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🧠</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Lerntyp-Test (VARK)</span>
      </div>

      {!submitted ? (
        <>
          <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
            Wähle bei jeder Frage die Antwort die am besten zu dir passt.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {fragen.map((q, qi) => (
              <div key={qi}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{qi + 1}. {q.text}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {q.optionen.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => answer(qi, opt.typ)}
                      style={{
                        padding: '8px 12px', borderRadius: 'var(--r-md)', textAlign: 'left',
                        fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
                        border: answers[qi] === opt.typ ? '2px solid #8b5cf6' : '1px solid var(--ki-border)',
                        background: answers[qi] === opt.typ ? 'rgba(139,92,246,0.08)' : 'var(--ki-bg-alt)',
                        color: answers[qi] === opt.typ ? '#7c3aed' : 'var(--ki-text-secondary)',
                        fontWeight: answers[qi] === opt.typ ? 600 : 400,
                      }}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={!allAnswered}
            style={{ marginTop: 20, opacity: allAnswered ? 1 : 0.5 }}
          >
            Ergebnis anzeigen
          </button>
        </>
      ) : (
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Dein Lerntyp-Profil</div>

          {/* Bar chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {typen.map(t => {
              const pct = fragen.length > 0 ? Math.round((scores[t.id] / fragen.length) * 100) : 0;
              const isDominant = t.id === dominantTyp?.id;
              return (
                <div key={t.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span style={{ fontWeight: isDominant ? 700 : 400, color: isDominant ? t.color : 'var(--ki-text-secondary)' }}>
                      {t.emoji} {t.label}
                    </span>
                    <span style={{ fontWeight: 600, color: t.color }}>{pct}%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: 'var(--ki-bg-alt)' }}>
                    <div style={{
                      height: '100%', borderRadius: 4, background: t.color,
                      width: `${pct}%`, transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dominant type detail */}
          {dominantTyp && (
            <div style={{
              padding: '16px', borderRadius: 'var(--r-md)',
              background: `${dominantTyp.color}08`, border: `1px solid ${dominantTyp.color}30`,
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: dominantTyp.color, marginBottom: 6 }}>
                {dominantTyp.emoji} Dein dominanter Typ: {dominantTyp.label}
              </div>
              <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
                {dominantTyp.beschreibung}
              </p>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Empfohlene Strategien:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {(dominantTyp.strategien || []).map((s, i) => (
                  <div key={i} style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>✓ {s}</div>
                ))}
              </div>
            </div>
          )}

          <button onClick={onComplete} className="btn btn-primary">
            ✅ Ergebnis speichern & weiter
          </button>
        </div>
      )}
    </div>
  );
}

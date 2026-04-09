'use client';
import { useState } from 'react';
import { SIMULATION_CONFIGS } from '@/lib/elearning/gehaltsverhandlung-content';

const QUALITY_COLORS = {
  weak: { bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.2)', text: '#dc2626', icon: '✗' },
  good: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)', text: '#d97706', icon: '~' },
  strong: { bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.2)', text: '#16a34a', icon: '✓' },
};

const RATING_BADGE = (score, maxScore, labels) => {
  const pct = score / maxScore;
  if (pct >= 0.875) return { label: Object.values(labels).at(-1), color: '#16a34a' };
  if (pct >= 0.625) return { label: Object.values(labels).at(-2) || 'Profi', color: '#2563EB' };
  if (pct >= 0.375) return { label: Object.values(labels)[1] || 'Verhandler', color: '#d97706' };
  return { label: Object.values(labels)[0], color: '#dc2626' };
};

export default function GehaltSimulationWidget({ simulationKey, maxScore, ratingLabels, endMessage, isCompleted, onMarkComplete, saving }) {
  const config = SIMULATION_CONFIGS[simulationKey];
  const [phase, setPhase] = useState('intro'); // intro | round | feedback | done
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [roundScores, setRoundScores] = useState([]);

  const currentRound = config?.rounds?.[roundIndex];

  function handleSelect(optionIdx) {
    if (selected !== null) return;
    setSelected(optionIdx);
  }

  function handleNext() {
    if (selected === null) return;
    const opt = currentRound.options[selected];
    const newScore = totalScore + opt.points;
    const newScores = [...roundScores, { selected, points: opt.points, quality: opt.quality }];
    setTotalScore(newScore);
    setRoundScores(newScores);

    if (roundIndex < config.rounds.length - 1) {
      setRoundIndex(roundIndex + 1);
      setSelected(null);
      setPhase('round');
    } else {
      setPhase('done');
    }
  }

  if (!config) return <div style={{ color: 'var(--ki-text-tertiary)', padding: 32, textAlign: 'center' }}>Simulation wird geladen…</div>;

  // ── INTRO ──────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: 16, padding: '32px 28px', marginBottom: 24, color: 'white',
          display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center',
        }}>
          <div style={{ fontSize: 48 }}>🎭</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{config.title}</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 480 }}>
            {config.context}
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#f59e0b' }}>{config.rounds.length}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Runden</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#f59e0b' }}>{maxScore}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Max. Punkte</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#f59e0b' }}>Live</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Feedback</div>
            </div>
          </div>
        </div>
        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '14px 24px', fontSize: 16 }}
          onClick={() => setPhase('round')}
        >
          Simulation starten →
        </button>
      </div>
    );
  }

  // ── DONE ──────────────────────────────────────────────────────────
  if (phase === 'done') {
    const pct = Math.round((totalScore / maxScore) * 100);
    const rating = RATING_BADGE(totalScore, maxScore, ratingLabels);
    const strongCount = roundScores.filter(r => r.quality === 'strong').length;
    const goodCount = roundScores.filter(r => r.quality === 'good').length;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Score card */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: 16, padding: '32px 24px', color: 'white', textAlign: 'center',
        }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Dein Ergebnis
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>{totalScore}</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 16 }}>von {maxScore} Punkten</div>
          <div style={{
            display: 'inline-block', padding: '6px 18px', borderRadius: 99,
            background: rating.color, fontSize: 14, fontWeight: 700,
          }}>
            {rating.label}
          </div>
          <div style={{
            width: '100%', height: 8, background: 'rgba(255,255,255,0.1)',
            borderRadius: 99, marginTop: 20, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: 'linear-gradient(90deg, #f59e0b, #f97316)',
              borderRadius: 99, transition: 'width 0.8s ease',
            }} />
          </div>
        </div>

        {/* Round summary */}
        <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            Runden-Übersicht
          </div>
          {roundScores.map((rs, i) => {
            const opt = config.rounds[i].options[rs.selected];
            const q = QUALITY_COLORS[rs.quality];
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '10px 0', borderBottom: i < roundScores.length - 1 ? '1px solid var(--ki-border)' : 'none',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', background: q.bg, border: `1px solid ${q.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: q.text, flexShrink: 0,
                }}>{q.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--ki-text)', marginBottom: 2 }}>{opt.text}</div>
                  <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', lineHeight: 1.5 }}>{opt.feedback}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: q.text, flexShrink: 0 }}>+{rs.points}</div>
              </div>
            );
          })}
        </div>

        {/* Lesson */}
        {endMessage && (
          <div style={{
            padding: '14px 18px', borderRadius: 12,
            background: 'rgba(204,20,38,0.04)', border: '1px solid rgba(204,20,38,0.12)',
            fontSize: 14, color: 'var(--ki-text)', lineHeight: 1.7, fontStyle: 'italic',
          }}>
            💡 {endMessage}
          </div>
        )}

        {/* Replay / Complete */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className="btn btn-secondary"
            onClick={() => { setPhase('intro'); setRoundIndex(0); setSelected(null); setTotalScore(0); setRoundScores([]); }}
            style={{ flex: 1 }}
          >
            ↺ Nochmal üben
          </button>
          {!isCompleted ? (
            <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving} style={{ flex: 2 }}>
              {saving ? 'Speichert...' : '✅ Abschließen (+50 XP)'}
            </button>
          ) : (
            <span className="pill pill-green" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
              ✅ Abgeschlossen +50 XP
            </span>
          )}
        </div>
      </div>
    );
  }

  // ── ROUND ──────────────────────────────────────────────────────────
  const progressPct = (roundIndex / config.rounds.length) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, height: 4, background: 'var(--ki-bg-alt)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--ki-red)', borderRadius: 99, transition: 'width 0.3s ease' }} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', flexShrink: 0 }}>
          Runde {roundIndex + 1} / {config.rounds.length}
        </div>
      </div>

      {/* Boss speech */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #374151, #1f2937)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, border: '2px solid var(--ki-border)',
        }}>
          👔
        </div>
        <div style={{
          flex: 1, background: 'var(--ki-bg-alt)', borderRadius: '0 16px 16px 16px',
          padding: '14px 18px', fontSize: 15, lineHeight: 1.7, color: 'var(--ki-text)',
          border: '1px solid var(--ki-border)',
        }}>
          {currentRound.boss}
        </div>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Deine Antwort:
        </div>
        {currentRound.options.map((opt, i) => {
          const isSelected = selected === i;
          const showFeedback = selected !== null && isSelected;
          const feedbackQ = showFeedback ? QUALITY_COLORS[opt.quality] : null;

          return (
            <div
              key={i}
              onClick={() => handleSelect(i)}
              style={{
                padding: '14px 18px',
                borderRadius: 12,
                border: `2px solid ${
                  isSelected && feedbackQ ? feedbackQ.border
                  : isSelected ? 'var(--ki-red)'
                  : selected !== null ? 'var(--ki-border)'
                  : 'var(--ki-border)'
                }`,
                background: isSelected && feedbackQ ? feedbackQ.bg : isSelected ? 'rgba(204,20,38,0.04)' : 'var(--ki-card)',
                cursor: selected === null ? 'pointer' : 'default',
                transition: 'all 0.15s',
                opacity: selected !== null && !isSelected ? 0.45 : 1,
              }}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: isSelected && feedbackQ ? feedbackQ.bg : 'var(--ki-bg-alt)',
                  border: `1px solid ${isSelected && feedbackQ ? feedbackQ.border : 'var(--ki-border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  color: isSelected && feedbackQ ? feedbackQ.text : 'var(--ki-text-tertiary)',
                }}>
                  {isSelected && feedbackQ ? feedbackQ.icon : String.fromCharCode(65 + i)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: 'var(--ki-text)', lineHeight: 1.6 }}>{opt.text}</div>
                  {showFeedback && (
                    <div style={{
                      marginTop: 10, padding: '10px 14px',
                      borderRadius: 8, background: feedbackQ.bg,
                      fontSize: 13, color: feedbackQ.text, lineHeight: 1.6,
                    }}>
                      {opt.feedback}
                    </div>
                  )}
                </div>
                {isSelected && feedbackQ && (
                  <div style={{ fontSize: 14, fontWeight: 700, color: feedbackQ.text, flexShrink: 0 }}>
                    +{opt.points}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selected !== null && (
        <button onClick={handleNext} className="btn btn-primary">
          {roundIndex < config.rounds.length - 1 ? 'Nächste Runde →' : 'Auswertung anzeigen →'}
        </button>
      )}
    </div>
  );
}

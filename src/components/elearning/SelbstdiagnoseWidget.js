'use client';

import { useState, useCallback } from 'react';
import { SELBSTDIAGNOSE, BERUFSPHASE } from '@/lib/elearning/prioritaeten-content';

const CATEGORIES = {
  chaos: {
    min: 10, max: 20,
    label: 'Chaos-Modus',
    icon: '🌪️',
    text: 'Du reagierst meist spontan und hast wenig Struktur in deinem Alltag. Das Gute: Es gibt großes Potenzial für Verbesserung!',
    color: '#EF4444',
  },
  reaktiv: {
    min: 21, max: 35,
    label: 'Reaktiver Modus',
    icon: '⚡',
    text: 'Du hast bereits Ansätze für Priorisierung, lässt dich aber oft von äußeren Einflüssen steuern. Zeit, proaktiver zu werden!',
    color: '#F59E0B',
  },
  proaktiv: {
    min: 36, max: 50,
    label: 'Proaktiver Modus',
    icon: '🎯',
    text: 'Du steuerst deinen Alltag bewusst und setzt klare Prioritäten. Weiter so – und optimiere die Details!',
    color: '#10B981',
  },
};

const DIMENSION_LABELS = {
  klarheit: 'Klarheit',
  fokus: 'Fokus',
  grenzen: 'Grenzen setzen',
  planung: 'Planung',
  reflexion: 'Reflexion',
};

const SLIDER_LABELS = ['Stimme gar nicht zu', '', 'Neutral', '', 'Stimme voll zu'];

export default function SelbstdiagnoseWidget({ onComplete, diagnoseData }) {
  const [phase, setPhase] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [slideDir, setSlideDir] = useState('in');

  const diagData = diagnoseData || SELBSTDIAGNOSE;
  const questions = diagData?.fragen || diagData?.questions || [];
  const totalQ = questions.length || 10;

  const handlePhaseSelect = useCallback((p) => {
    setPhase(p);
    setSlideDir('in');
  }, []);

  const handleSlider = useCallback((val) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: val }));
  }, [currentQ]);

  const handleNext = useCallback(() => {
    if (currentQ < totalQ - 1) {
      setSlideDir('out');
      setTimeout(() => {
        setCurrentQ((prev) => prev + 1);
        setSlideDir('in');
      }, 200);
    } else {
      setShowResult(true);
    }
  }, [currentQ, totalQ]);

  const handlePrev = useCallback(() => {
    if (currentQ > 0) {
      setSlideDir('out');
      setTimeout(() => {
        setCurrentQ((prev) => prev - 1);
        setSlideDir('in');
      }, 200);
    }
  }, [currentQ]);

  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);

  const getCategory = () => {
    if (totalScore <= 20) return CATEGORIES.chaos;
    if (totalScore <= 35) return CATEGORIES.reaktiv;
    return CATEGORIES.proaktiv;
  };

  const getDimensionScores = () => {
    const dims = {};
    questions.forEach((q, i) => {
      const dim = q.dimension || q.kategorie || Object.keys(DIMENSION_LABELS)[i % 5];
      if (!dims[dim]) dims[dim] = { total: 0, count: 0 };
      dims[dim].total += answers[i] || 0;
      dims[dim].count += 1;
    });
    return dims;
  };

  // --- Phase Selection Screen ---
  if (!phase) {
    const phases = BERUFSPHASE || [
      { id: 'einstieg', label: 'Berufseinstieg', icon: '🚀', desc: 'Gerade am Anfang deiner Karriere' },
      { id: 'aufbau', label: 'Aufbauphase', icon: '📈', desc: '2-5 Jahre Berufserfahrung' },
      { id: 'etabliert', label: 'Etabliert', icon: '⭐', desc: 'Erfahrene Fachkraft oder Führungskraft' },
      { id: 'neuorientierung', label: 'Neuorientierung', icon: '🔄', desc: 'Beruflicher Wandel oder Umstieg' },
    ];
    const phaseList = Array.isArray(phases) ? phases : Object.values(phases);

    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Wo stehst du gerade beruflich?</h2>
        <p style={styles.subtext}>Wähle die Phase, die am besten zu dir passt.</p>
        <div style={styles.phaseGrid}>
          {phaseList.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePhaseSelect(p.id)}
              className="card"
              style={styles.phaseCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#CC1426';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--ki-bg, #e5e7eb)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={styles.phaseIcon}>{p.icon}</span>
              <strong style={styles.phaseLabel}>{p.label}</strong>
              <span style={styles.phaseDesc}>{p.desc || p.beschreibung || ''}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- Result Screen ---
  if (showResult) {
    const cat = getCategory();
    const dims = getDimensionScores();

    return (
      <div style={styles.container}>
        <div className="card" style={{ ...styles.resultCard, borderTop: `4px solid ${cat.color}` }}>
          <div style={styles.resultIcon}>{cat.icon}</div>
          <h2 style={{ ...styles.heading, color: cat.color }}>{cat.label}</h2>
          <p style={styles.resultScore}>Dein Score: {totalScore} / {totalQ * 5}</p>
          <p style={styles.resultText}>{cat.text}</p>
        </div>

        <div className="card" style={styles.dimCard}>
          <h3 style={styles.subheading}>Dein Profil im Detail</h3>
          {Object.entries(dims).map(([key, val]) => {
            const maxPossible = val.count * 5;
            const pct = Math.round((val.total / maxPossible) * 100);
            return (
              <div key={key} style={styles.dimRow}>
                <div style={styles.dimLabel}>
                  <span>{DIMENSION_LABELS[key] || key}</span>
                  <span style={styles.dimPct}>{pct}%</span>
                </div>
                <div style={styles.barTrack}>
                  <div
                    style={{
                      ...styles.barFill,
                      width: `${pct}%`,
                      backgroundColor: pct >= 70 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#EF4444',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Radar-style visualization */}
        <div className="card" style={styles.dimCard}>
          <h3 style={styles.subheading}>Radar-Übersicht</h3>
          <svg viewBox="0 0 300 300" style={{ width: '100%', maxWidth: 300, margin: '0 auto', display: 'block' }}>
            {/* Background rings */}
            {[1, 2, 3, 4, 5].map((ring) => (
              <circle
                key={ring}
                cx="150" cy="150"
                r={ring * 25}
                fill="none"
                stroke="var(--ki-bg, #e5e7eb)"
                strokeWidth="1"
              />
            ))}
            {/* Dimension axes and polygon */}
            {(() => {
              const dimEntries = Object.entries(dims);
              const n = dimEntries.length || 1;
              const points = dimEntries.map(([, val], i) => {
                const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
                const maxP = val.count * 5;
                const ratio = val.total / maxP;
                const r = ratio * 125;
                return {
                  x: 150 + r * Math.cos(angle),
                  y: 150 + r * Math.sin(angle),
                  lx: 150 + 140 * Math.cos(angle),
                  ly: 150 + 140 * Math.sin(angle),
                };
              });
              const polyPoints = points.map((p) => `${p.x},${p.y}`).join(' ');
              return (
                <>
                  {dimEntries.map(([key], i) => {
                    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
                    return (
                      <line
                        key={key}
                        x1="150" y1="150"
                        x2={150 + 125 * Math.cos(angle)}
                        y2={150 + 125 * Math.sin(angle)}
                        stroke="var(--ki-bg, #e5e7eb)"
                        strokeWidth="1"
                      />
                    );
                  })}
                  <polygon
                    points={polyPoints}
                    fill="rgba(204,20,38,0.15)"
                    stroke="#CC1426"
                    strokeWidth="2"
                  />
                  {points.map((p, i) => (
                    <text
                      key={i}
                      x={p.lx}
                      y={p.ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: 11, fill: 'var(--ki-text, #333)', fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      {DIMENSION_LABELS[dimEntries[i][0]] || dimEntries[i][0]}
                    </text>
                  ))}
                </>
              );
            })()}
          </svg>
        </div>

        <button className="btn btn-primary" style={styles.weiterBtn} onClick={onComplete}>
          Weiter
        </button>
      </div>
    );
  }

  // --- Question Screen ---
  const q = questions[currentQ] || { text: `Frage ${currentQ + 1}`, frage: `Frage ${currentQ + 1}` };
  const qText = q.text || q.frage || `Frage ${currentQ + 1}`;
  const val = answers[currentQ] || 3;

  return (
    <div style={styles.container}>
      {/* Progress bar */}
      <div style={styles.progressWrap}>
        <div style={styles.progressLabel}>
          Frage {currentQ + 1} von {totalQ}
        </div>
        <div className="progress-bar" style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${((currentQ + 1) / totalQ) * 100}%` }} />
        </div>
      </div>

      <div
        className="card"
        style={{
          ...styles.questionCard,
          animation: slideDir === 'in' ? 'fadeSlideIn 0.3s ease' : 'fadeSlideOut 0.2s ease',
        }}
      >
        <p style={styles.questionText}>{qText}</p>

        <div style={styles.sliderWrap}>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={val}
            onChange={(e) => handleSlider(Number(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.sliderLabels}>
            {SLIDER_LABELS.map((label, i) => (
              <span key={i} style={{ ...styles.sliderTick, fontWeight: val === i + 1 ? 700 : 400 }}>
                {label}
              </span>
            ))}
          </div>
          <div style={styles.sliderValue}>{val}</div>
        </div>
      </div>

      <div style={styles.navRow}>
        <button
          className="btn btn-secondary"
          onClick={handlePrev}
          disabled={currentQ === 0}
          style={{ opacity: currentQ === 0 ? 0.4 : 1 }}
        >
          Zurück
        </button>
        <button className="btn btn-primary" onClick={handleNext}>
          {currentQ === totalQ - 1 ? 'Ergebnis anzeigen' : 'Weiter'}
        </button>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(-30px); }
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #CC1426;
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #CC1426;
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Instrument Sans, sans-serif',
    maxWidth: 640,
    margin: '0 auto',
    padding: '1rem',
  },
  heading: {
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: '1.5rem',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '0.5rem',
    color: 'var(--ki-text, #1a1a1a)',
  },
  subheading: {
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: 'var(--ki-text, #1a1a1a)',
  },
  subtext: {
    textAlign: 'center',
    color: 'var(--ki-text, #666)',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
  },
  phaseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem',
  },
  phaseCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1.5rem 1rem',
    border: '2px solid var(--ki-bg, #e5e7eb)',
    borderRadius: 12,
    cursor: 'pointer',
    background: '#fff',
    transition: 'all 0.2s ease',
    textAlign: 'center',
  },
  phaseIcon: { fontSize: '2rem' },
  phaseLabel: { fontSize: '1.05rem', color: 'var(--ki-text, #1a1a1a)' },
  phaseDesc: { fontSize: '0.85rem', color: 'var(--ki-text, #666)' },
  progressWrap: { marginBottom: '1.5rem' },
  progressLabel: {
    fontSize: '0.85rem',
    color: 'var(--ki-text, #666)',
    marginBottom: '0.4rem',
    textAlign: 'center',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    background: 'var(--ki-bg, #e5e7eb)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    background: '#CC1426',
    transition: 'width 0.3s ease',
  },
  questionCard: {
    padding: '2rem 1.5rem',
    borderRadius: 12,
    textAlign: 'center',
  },
  questionText: {
    fontSize: '1.1rem',
    fontWeight: 500,
    marginBottom: '2rem',
    lineHeight: 1.5,
    color: 'var(--ki-text, #1a1a1a)',
  },
  sliderWrap: {
    maxWidth: 400,
    margin: '0 auto',
  },
  slider: {
    width: '100%',
    height: 6,
    appearance: 'none',
    WebkitAppearance: 'none',
    background: 'linear-gradient(to right, #e5e7eb, #CC1426)',
    borderRadius: 3,
    outline: 'none',
    cursor: 'pointer',
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '0.5rem',
    fontSize: '0.75rem',
    color: 'var(--ki-text, #999)',
  },
  sliderTick: {
    flex: 1,
    textAlign: 'center',
    transition: 'font-weight 0.2s',
  },
  sliderValue: {
    marginTop: '0.75rem',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#CC1426',
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1.5rem',
    gap: '1rem',
  },
  resultCard: {
    padding: '2rem',
    borderRadius: 12,
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  resultIcon: { fontSize: '3rem', marginBottom: '0.5rem' },
  resultScore: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--ki-text, #1a1a1a)',
    marginBottom: '0.75rem',
  },
  resultText: {
    fontSize: '0.95rem',
    color: 'var(--ki-text, #555)',
    lineHeight: 1.6,
  },
  dimCard: {
    padding: '1.5rem',
    borderRadius: 12,
    marginBottom: '1.5rem',
  },
  dimRow: { marginBottom: '1rem' },
  dimLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    marginBottom: '0.3rem',
    color: 'var(--ki-text, #333)',
  },
  dimPct: { fontWeight: 600 },
  barTrack: {
    height: 10,
    borderRadius: 5,
    background: 'var(--ki-bg, #e5e7eb)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
    transition: 'width 0.6s ease',
  },
  weiterBtn: {
    width: '100%',
    marginTop: '0.5rem',
  },
};

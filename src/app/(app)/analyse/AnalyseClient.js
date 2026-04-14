'use client';
import { useState, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { awardPoints } from '@/lib/gamification';
import {
  KOMPETENZFELDER,
  MASTERCLASS_INFO,
  scoreToPercent,
  getScoreLevel,
  getRecommendedMasterclass,
} from './matrix';

// ============================================================
// RADAR CHART (SVG, 12 Felder)
// ============================================================
function RadarChart({ scores, size = 340 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.34;
  const n = KOMPETENZFELDER.length;
  const rings = [25, 50, 75, 100];

  const getPoint = (i, val) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const dist = (val / 100) * r;
    return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist };
  };

  const dataPoints = KOMPETENZFELDER.map((f, i) => getPoint(i, scores[f.id] || 0));
  const path = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + 'Z';

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', maxWidth: size }}>
      <defs>
        <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#CC1426" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#CC1426" stopOpacity="0.03" />
        </radialGradient>
      </defs>
      {rings.map(ring => {
        const pts = Array.from({ length: n }, (_, i) => getPoint(i, ring));
        return (
          <polygon
            key={ring}
            points={pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
            fill={ring === 100 ? 'url(#radarGrad)' : 'none'}
            stroke="#E8E6E1"
            strokeWidth="1"
          />
        );
      })}
      {KOMPETENZFELDER.map((_, i) => {
        const p = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#E8E6E1" strokeWidth="1" />;
      })}
      <path d={path} fill="rgba(204,20,38,0.12)" stroke="#CC1426" strokeWidth="2.5" strokeLinejoin="round" />
      {dataPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#CC1426" />)}
      {KOMPETENZFELDER.map((f, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const lx = cx + Math.cos(angle) * (r + 26);
        const ly = cy + Math.sin(angle) * (r + 26);
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: 13, fontFamily: 'Instrument Sans, sans-serif' }}>
            {f.icon}
          </text>
        );
      })}
    </svg>
  );
}

// ============================================================
// SCALE QUESTION COMPONENT (1–5 Buttons)
// ============================================================
function ScaleQuestion({ question, onAnswer, answered }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (val) => {
    if (answered) return;
    setSelected(val);
    setTimeout(() => onAnswer(val), 300);
  };

  return (
    <div>
      <p style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.6, marginBottom: 20, color: '#1A1A1A' }}>
        {question.text}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map(val => (
          <button
            key={val}
            onClick={() => handleSelect(val)}
            style={{
              width: 52, height: 52, borderRadius: '50%', border: '2px solid',
              borderColor: selected === val ? '#CC1426' : '#E8E6E1',
              background: selected === val ? '#CC1426' : '#fff',
              color: selected === val ? '#fff' : '#1A1A1A',
              fontSize: 16, fontWeight: 700, cursor: answered ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              transform: selected === val ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {val}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#86868b' }}>
        <span style={{ maxWidth: 120 }}>{question.low}</span>
        <span style={{ maxWidth: 120, textAlign: 'right' }}>{question.high}</span>
      </div>
    </div>
  );
}

// ============================================================
// LOCKED CARD
// ============================================================
function LockedCard({ children }) {
  return (
    <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.6 }}>
        {children}
      </div>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(2px)',
      }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>Vollanalyse freischalten</div>
        <div style={{ fontSize: 12, color: '#86868b' }}>Im Gespräch mit deinem Karriere-Berater</div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
// ============================================================
// FIELD RESULT CARD (rich per-field interpretation)
// ============================================================
function FieldResultCard({ field, score, isLocked }) {
  const level = getScoreLevel(score);

  const interpretation = score >= 75
    ? `Du zeigst im Bereich ${field.name} klare Stärken. ${field.intro.was} Mit einem Score von ${score}% bist du hier deutlich besser aufgestellt als der Durchschnitt — ein echter Vorteil, den du aktiv nutzen solltest.`
    : score >= 50
    ? `Im Bereich ${field.name} bist du solide aufgestellt, hast aber noch konkretes Wachstumspotenzial. ${field.intro.was} Dein Score von ${score}% zeigt: die Grundlagen sind vorhanden — mit gezieltem Training kannst du hier in die Exzellenz-Zone kommen.`
    : `${field.name} ist ein klares Wachstumsfeld für dich. ${field.intro.warum} Mit einem Score von ${score}% liegt hier enormes Entwicklungspotenzial — und genau das ist die Chance, dich von anderen abzuheben.`;

  return (
    <div className="card animate-in" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
      {/* Header row */}
      <div style={{ padding: '18px 22px', borderLeft: `4px solid ${field.color}`, display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 28, flexShrink: 0 }}>{field.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{field.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 6, background: '#F0EEE9', borderRadius: 3 }}>
              <div style={{ height: '100%', width: `${score}%`, background: level.color, borderRadius: 3, transition: 'width 1s ease' }} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: level.color, minWidth: 46 }}>{score}%</span>
          </div>
        </div>
        <div style={{
          padding: '4px 12px', borderRadius: 980, background: `${level.color}18`,
          color: level.color, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {level.badge} {level.label}
        </div>
      </div>

      {/* Details */}
      {isLocked ? (
        <LockedCard>
          <div style={{ padding: '16px 22px 24px' }}>
            {[90, 70, 85].map((w, i) => (
              <div key={i} style={{ height: 10, background: '#F0EEE9', borderRadius: 5, marginBottom: 10, width: `${w}%` }} />
            ))}
          </div>
        </LockedCard>
      ) : (
        <div style={{ padding: '4px 22px 22px' }}>
          {/* Outcome callout */}
          <div style={{
            background: `${field.color}0f`, border: `1px solid ${field.color}30`,
            borderRadius: 10, padding: '10px 14px', margin: '14px 0',
            fontSize: 13, fontWeight: 600, color: field.color, lineHeight: 1.5,
          }}>
            💡 {field.outcome.headline}
          </div>

          {/* Deine persönliche Auswertung */}
          <div style={{ fontSize: 11, fontWeight: 700, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>
            Deine persönliche Auswertung
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#3d3d3d', marginBottom: 16 }}>
            {interpretation}
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.75, color: '#6B7280', marginBottom: score < 70 ? 16 : 0 }}>
            {field.outcome.text}
          </p>

          {/* Schwaechen — only if score < 70 */}
          {score < 70 && (
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10 }}>
                Klassische Anzeichen in diesem Feld:
              </div>
              {field.intro.schwaechen.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 7, fontSize: 13, color: '#555', lineHeight: 1.5 }}>
                  <span style={{ color: '#CC1426', flexShrink: 0, marginTop: 1 }}>✗</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AnalyseClient({ profile, existingSession, userId, hasFullAccess }) {
  const supabase = createClient();

  // Phase: 1=welcome, 2=questions, 3=results
  const [phase, setPhase] = useState(
    existingSession?.status === 'completed' ? 3 : 1
  );
  const [fieldIndex, setFieldIndex] = useState(existingSession?.current_field || 0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true); // show intro card per field
  const [showFieldResult, setShowFieldResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [scaleAnswered, setScaleAnswered] = useState(false);
  const [answers, setAnswers] = useState(existingSession?.answers || {});
  const [fieldScores, setFieldScores] = useState(existingSession?.scores || {});
  const [showConfetti, setShowConfetti] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);
  const [resumePrompt, setResumePrompt] = useState(existingSession?.status === 'in_progress');

  const currentField = KOMPETENZFELDER[fieldIndex];
  const currentQuestion = currentField ? currentField.fragen[questionIndex] : null;
  const isScaleQuestion = currentQuestion?.type === 'scale';
  const totalQuestions = KOMPETENZFELDER.length * 4; // 48
  const answeredQuestions = fieldIndex * 4 + questionIndex;
  const overallProgress = (answeredQuestions / totalQuestions) * 100;

  // Compute per-field raw score: sum of answers (scenario=1-10, scale=1-5)
  const computeFieldScore = useCallback((fieldAnswers) => {
    const sum = (fieldAnswers || []).reduce((a, b) => a + b, 0);
    return scoreToPercent(sum);
  }, []);

  const finishField = useCallback((newAnswers, fieldId, currentFieldIdx) => {
    const pct = computeFieldScore(newAnswers[fieldId]);
    setFieldScores(prev => {
      const newScores = { ...prev, [fieldId]: pct };
      supabase.from('analysis_sessions').upsert({
        user_id: userId,
        scores: newScores,
        answers: newAnswers,
        overall_score: Math.round(Object.values(newScores).reduce((a, b) => a + b, 0) / Object.keys(newScores).length),
        current_field: currentFieldIdx,
        status: currentFieldIdx >= KOMPETENZFELDER.length - 1 ? 'completed' : 'in_progress',
        completed_at: currentFieldIdx >= KOMPETENZFELDER.length - 1 ? new Date().toISOString() : null,
      }, { onConflict: 'user_id' });
      return newScores;
    });
    setShowFieldResult(true);
  }, [computeFieldScore, supabase, userId]);

  const handleScenarioClick = useCallback((option) => {
    if (selectedOption) return;
    setSelectedOption(option);

    setTimeout(() => {
      const fieldId = currentField.id;
      const prev = answers[fieldId] || [];
      const updated = [...prev];
      updated[questionIndex] = option.score;
      const newAnswers = { ...answers, [fieldId]: updated };
      setAnswers(newAnswers);
      setSelectedOption(null);

      if (questionIndex < 3) {
        setQuestionIndex(questionIndex + 1);
      } else {
        finishField(newAnswers, fieldId, fieldIndex);
      }
    }, 500);
  }, [selectedOption, currentField, answers, questionIndex, finishField, fieldIndex]);

  const handleScaleAnswer = useCallback((val) => {
    if (scaleAnswered) return;
    setScaleAnswered(true);

    const fieldId = currentField.id;
    const prev = answers[fieldId] || [];
    const updated = [...prev];
    updated[questionIndex] = val;
    const newAnswers = { ...answers, [fieldId]: updated };
    setAnswers(newAnswers);

    setTimeout(() => {
      setScaleAnswered(false);
      if (questionIndex < 3) {
        setQuestionIndex(questionIndex + 1);
      } else {
        finishField(newAnswers, fieldId, fieldIndex);
      }
    }, 400);
  }, [scaleAnswered, currentField, answers, questionIndex, finishField, fieldIndex]);

  const nextField = useCallback(async () => {
    setShowFieldResult(false);
    if (fieldIndex >= KOMPETENZFELDER.length - 1) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      setPhase(3);
      if (!xpAwarded) {
        awardPoints(supabase, userId, 'FIRST_ANALYSIS');
        setXpAwarded(true);
      }
    } else {
      setFieldIndex(fieldIndex + 1);
      setQuestionIndex(0);
      setShowIntro(true);
    }
  }, [fieldIndex, xpAwarded, supabase, userId]);

  const handleResume = (resume) => {
    setResumePrompt(false);
    if (resume) {
      setPhase(2);
      setFieldIndex((existingSession?.current_field || 0) + 1);
      setQuestionIndex(0);
      setShowIntro(true);
    } else {
      setAnswers({});
      setFieldScores({});
      setFieldIndex(0);
      setQuestionIndex(0);
      setShowIntro(true);
    }
  };

  const sortedScores = useMemo(() => {
    return KOMPETENZFELDER
      .map(f => ({ ...f, score: fieldScores[f.id] || 0, level: getScoreLevel(fieldScores[f.id] || 0) }))
      .sort((a, b) => b.score - a.score);
  }, [fieldScores]);

  const overallScore = useMemo(() => {
    const vals = Object.values(fieldScores);
    return vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  }, [fieldScores]);

  const recommendedMcId = useMemo(() => getRecommendedMasterclass(fieldScores), [fieldScores]);
  const recommendedMc = MASTERCLASS_INFO[recommendedMcId];

  // ============================================================
  // CONFETTI
  // ============================================================
  const ConfettiOverlay = () => !showConfetti ? null : (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
      {Array.from({ length: 60 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${Math.random() * 100}%`, top: '-10px',
          width: `${6 + Math.random() * 8}px`, height: `${6 + Math.random() * 8}px`,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          background: ['#CC1426', '#D4A017', '#2D6A4F', '#6366f1', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 6)],
          animation: `confFall ${2 + Math.random() * 2}s ease-in forwards`,
          animationDelay: `${Math.random() * 1.5}s`,
        }} />
      ))}
      <style>{`@keyframes confFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  );

  // ============================================================
  // PHASE 1: WELCOME
  // ============================================================
  if (phase === 1) {
    if (resumePrompt) {
      const completed = Object.keys(fieldScores).length;
      return (
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="card animate-in" style={{ maxWidth: 460, textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔄</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Weitermachen?</h2>
            <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', marginBottom: 24 }}>
              Du hast {completed} von {KOMPETENZFELDER.length} Feldern abgeschlossen.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" onClick={() => handleResume(false)} style={{ flex: 1 }}>Neu starten</button>
              <button className="btn btn-primary" onClick={() => handleResume(true)} style={{ flex: 1 }}>Weitermachen →</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: '24px 0', maxWidth: 720, margin: '0 auto' }}>
        {/* ── Welcome Card ── */}
        <div className="card animate-in" style={{ textAlign: 'center', padding: 48, marginBottom: 48 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🧠</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Dein Karriere-Blutbild
          </h1>
          <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', marginBottom: 28, lineHeight: 1.7 }}>
            Entdecke deine 12 Karriere-Kompetenzfelder — und welche Masterclass dich am schnellsten voranbringt.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginBottom: 32 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#CC1426' }}>12</div>
              <div style={{ fontSize: 11, color: 'var(--ki-text-secondary)', marginTop: 2 }}>Felder</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#CC1426' }}>48</div>
              <div style={{ fontSize: 11, color: 'var(--ki-text-secondary)', marginTop: 2 }}>Fragen</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#CC1426' }}>~10</div>
              <div style={{ fontSize: 11, color: 'var(--ki-text-secondary)', marginTop: 2 }}>Minuten</div>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => { setPhase(2); setShowIntro(true); }}
            style={{ padding: '14px 36px', fontSize: 16 }}
          >
            Analyse starten →
          </button>
        </div>

        {/* ── Competency Overview ── */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6, textAlign: 'center' }}>
            Was wird analysiert?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', textAlign: 'center', marginBottom: 28 }}>
            In diesen 12 Kompetenzfeldern erhältst du deinen persönlichen Score
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 12,
          }}>
            {KOMPETENZFELDER.map((f) => (
              <div
                key={f.id}
                className="card"
                style={{
                  padding: '16px 18px',
                  borderLeft: `3px solid ${f.color}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 26, flexShrink: 0, lineHeight: 1 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3, color: 'var(--ki-text)' }}>
                    {f.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ki-text-secondary)', lineHeight: 1.4 }}>
                    {f.outcome.headline}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // PHASE 2: QUESTIONS
  // ============================================================
  if (phase === 2) {
    if (!currentField) return null;

    // INTRO CARD per field
    if (showIntro) {
      return (
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ maxWidth: 520, width: '100%' }}>
            {/* Progress */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: '#86868b' }}>
                <span>Feld {fieldIndex + 1} von {KOMPETENZFELDER.length}</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <div style={{ height: 4, background: '#F0EEE9', borderRadius: 4 }}>
                <div style={{ height: '100%', width: `${overallProgress}%`, background: '#CC1426', borderRadius: 4, transition: 'width 0.5s ease' }} />
              </div>
            </div>

            <div className="card animate-in" style={{ padding: 32, borderLeft: `5px solid ${currentField.color}` }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{currentField.icon}</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: '#1A1A1A' }}>{currentField.name}</h2>

              {/* Outcome Headline */}
              <div style={{
                background: `${currentField.color}12`, borderRadius: 10, padding: '10px 14px',
                marginBottom: 16, fontSize: 14, fontWeight: 600, color: currentField.color,
              }}>
                💡 {currentField.outcome.headline}
              </div>

              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, marginBottom: 12 }}>
                <strong style={{ color: '#1A1A1A' }}>Was ist das?</strong> {currentField.intro.was}
              </p>
              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, marginBottom: 16 }}>
                <strong style={{ color: '#1A1A1A' }}>Warum wichtig?</strong> {currentField.intro.warum}
              </p>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                  Typische Schwächen in diesem Feld:
                </div>
                {currentField.intro.schwaechen.map((s, i) => (
                  <div key={i} style={{ fontSize: 13, color: '#6B7280', padding: '5px 0', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#CC1426', flexShrink: 0 }}>✗</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setShowIntro(false)}
                style={{ width: '100%', padding: '12px 24px' }}
              >
                Fragen beantworten →
              </button>
            </div>
          </div>
        </div>
      );
    }

    // FIELD RESULT (mini-feedback)
    if (showFieldResult) {
      const score = fieldScores[currentField.id] || 0;
      const level = getScoreLevel(score);
      const isLast = fieldIndex >= KOMPETENZFELDER.length - 1;

      return (
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="card animate-in" style={{ maxWidth: 480, width: '100%', textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{currentField.icon}</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{currentField.name}</h2>
            <div style={{ fontSize: 13, color: '#86868b', marginBottom: 20 }}>Auswertung</div>

            {/* Score */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: level.color }}>{level.badge} {level.label}</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: level.color }}>{score}%</span>
              </div>
              <div style={{ height: 8, background: '#F0EEE9', borderRadius: 4 }}>
                <div style={{ height: '100%', width: `${score}%`, background: level.color, borderRadius: 4, transition: 'width 1s ease' }} />
              </div>
            </div>

            {/* What this means concretely */}
            <div style={{
              background: '#F5F5F7', borderRadius: 12, padding: '14px 16px',
              marginBottom: 20, fontSize: 14, color: '#1A1A1A', lineHeight: 1.6, textAlign: 'left',
            }}>
              <strong>{currentField.outcome.headline}</strong>
              <br />
              <span style={{ fontSize: 13, color: '#6B7280' }}>{currentField.outcome.text}</span>
            </div>

            {score < 65 && (
              <div style={{
                background: `${currentField.color}10`, border: `1px solid ${currentField.color}30`,
                borderRadius: 10, padding: '10px 14px', marginBottom: 20,
                fontSize: 13, color: currentField.color, fontWeight: 600,
              }}>
                ⚡ Dieses Feld hat Potenzial für dich — wir zeigen dir am Ende wie.
              </div>
            )}

            <div style={{ fontSize: 13, color: '#86868b', marginBottom: 16 }}>
              {!isLast && (
                <>Nächstes Feld: <strong>{KOMPETENZFELDER[fieldIndex + 1]?.icon} {KOMPETENZFELDER[fieldIndex + 1]?.name}</strong></>
              )}
              {isLast && '🎉 Letzes Feld abgeschlossen!'}
            </div>

            <button className="btn btn-primary" onClick={nextField} style={{ width: '100%' }}>
              {isLast ? 'Ergebnis ansehen →' : 'Weiter →'}
            </button>
          </div>
        </div>
      );
    }

    // QUESTION
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px' }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: '#86868b' }}>
            <span>{currentField.icon} {currentField.name} — Frage {questionIndex + 1}/4</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <div style={{ height: 4, background: '#F0EEE9', borderRadius: 4 }}>
            <div style={{ height: '100%', width: `${overallProgress}%`, background: '#CC1426', borderRadius: 4, transition: 'width 0.4s ease' }} />
          </div>
          {/* Question dots */}
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                height: 4, flex: 1, borderRadius: 2,
                background: i < questionIndex ? '#CC1426' : i === questionIndex ? '#CC1426' : '#E8E6E1',
                opacity: i === questionIndex ? 1 : i < questionIndex ? 0.7 : 0.3,
              }} />
            ))}
          </div>
        </div>

        {/* Question label */}
        <div style={{ fontSize: 11, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16 }}>
          {isScaleQuestion ? '📊 Selbsteinschätzung' : '📍 Szenario'}
        </div>

        {/* Scenario Question */}
        {!isScaleQuestion && (
          <>
            <div className="card" style={{ padding: 24, marginBottom: 20, borderLeft: `4px solid ${currentField.color}` }}>
              <p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.65, margin: 0 }}>
                {currentQuestion.text}
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {currentQuestion.options.map((opt, i) => {
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={i}
                    onClick={() => handleScenarioClick(opt)}
                    className="card"
                    style={{
                      cursor: selectedOption ? 'default' : 'pointer',
                      padding: 18, textAlign: 'left',
                      border: `2px solid ${isSelected ? '#CC1426' : 'transparent'}`,
                      background: isSelected ? 'rgba(204,20,38,0.06)' : 'var(--ki-card)',
                      transition: 'all 0.2s ease',
                      opacity: selectedOption && !isSelected ? 0.45 : 1,
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{opt.emoji}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.5, color: '#1A1A1A' }}>{opt.text}</div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Scale Question */}
        {isScaleQuestion && (
          <div className="card" style={{ padding: 28, borderLeft: `4px solid ${currentField.color}` }}>
            <ScaleQuestion question={currentQuestion} onAnswer={handleScaleAnswer} answered={scaleAnswered} />
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // PHASE 3: RESULTS
  // ============================================================
  if (phase === 3) {
    const top3 = sortedScores.slice(0, 3);
    const bottom3 = sortedScores.slice(-3).reverse();
    const overallLevel = getScoreLevel(overallScore);

    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 48px' }}>
        <ConfettiOverlay />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🧠</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>
            Dein Karriere-Blutbild
          </h1>
          <p style={{ fontSize: 13, color: '#86868b', marginBottom: 20 }}>
            Erstellt am {new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <div style={{ fontSize: 52, fontWeight: 700, color: overallLevel.color, letterSpacing: '-0.03em' }}>
            {overallScore}%
          </div>
          <div style={{
            display: 'inline-block', marginTop: 8, padding: '5px 16px', borderRadius: 980,
            background: `${overallLevel.color}18`, color: overallLevel.color,
            fontSize: 13, fontWeight: 700,
          }}>
            {overallLevel.badge} {overallLevel.label}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="card" style={{ padding: 24, marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
          <RadarChart scores={fieldScores} />
        </div>

        {/* Top 3 Stärken + Wachstumsfelder */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#1A1A1A' }}>Deine Top 3 Stärken</h3>
            {top3.map((f, i) => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 2 ? '1px solid #F0EEE9' : 'none' }}>
                <span style={{ fontSize: 14 }}>{['🥇', '🥈', '🥉'][i]}</span>
                <span style={{ fontSize: 14 }}>{f.icon}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{f.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: f.level.color }}>{f.score}%</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#1A1A1A' }}>Top 3 Wachstumsfelder</h3>
            {bottom3.map((f, i) => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 2 ? '1px solid #F0EEE9' : 'none' }}>
                <span style={{ fontSize: 14 }}>⚡</span>
                <span style={{ fontSize: 14 }}>{f.icon}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{f.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: f.level.color }}>{f.score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Per-field detailed cards */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Deine persönliche Auswertung
          </h2>
          <p style={{ fontSize: 13, color: '#86868b', marginBottom: 20 }}>
            {hasFullAccess
              ? 'Alle 12 Kompetenzfelder mit detaillierter Interpretation'
              : 'Top 3 Felder mit detaillierter Interpretation — restliche Felder im Gespräch mit deinem Karriere-Berater'}
          </p>
          {sortedScores.map((f, i) => (
            <FieldResultCard
              key={f.id}
              field={f}
              score={f.score}
              isLocked={!hasFullAccess && i >= 3}
            />
          ))}
        </div>

        {/* Masterclass Empfehlung */}
        {recommendedMc && (
          <div style={{
            background: 'linear-gradient(135deg, #1A1A1A 0%, #2d1a1a 100%)',
            borderRadius: 20, padding: '28px 28px', marginBottom: 20, color: '#fff',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>
              Deine persönliche Empfehlung
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 36 }}>{recommendedMc.icon}</span>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>{recommendedMc.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Masterclass</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: 20 }}>
              {recommendedMc.pitch}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>49 €</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>89 €</span>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Messeaktion · Einmalig · Lebenslanger Zugang</div>
              </div>
              <a
                href="/checkout"
                style={{
                  display: 'inline-block', padding: '13px 24px', background: '#CC1426',
                  color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 14,
                  textDecoration: 'none', whiteSpace: 'nowrap',
                }}
              >
                Jetzt starten →
              </a>
            </div>
          </div>
        )}

        {/* Restart */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => {
              setPhase(1);
              setAnswers({});
              setFieldScores({});
              setFieldIndex(0);
              setQuestionIndex(0);
              setShowIntro(true);
            }}
            style={{ fontSize: 13, color: '#86868b', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Analyse wiederholen
          </button>
        </div>
      </div>
    );
  }

  return null;
}

'use client';
import { useState, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { awardPoints } from '@/lib/gamification';
import {
  KOMPETENZFELDER,
  MASTERCLASS_INFO,
  scoreToPercent,
  getScoreLevel,
  getRecommendedMasterclass,
} from './matrix';

// ─── Icons ───────────────────────────────────────────────────────────────────
function Icon({ name, size = 14, stroke = 1.7 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
              stroke: 'currentColor', strokeWidth: stroke,
              strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'chev-l':  return (<svg {...p}><polyline points="15 18 9 12 15 6"/></svg>);
    case 'lock':    return (<svg {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
    case 'sparkle': return (<svg {...p}><path d="M5 3v4M3 5h4M19 17v4M17 19h4M12 2l2.4 5.1L20 9l-5.1 2.4L12 16l-2.4-5L4 9l5.4-2L12 2z"/></svg>);
    case 'refresh': return (<svg {...p}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>);
    default: return null;
  }
}

// ─── Radar Chart ─────────────────────────────────────────────────────────────
function RadarChart({ scores, size = 320 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.34;
  const n = KOMPETENZFELDER.length;
  const rings = [25, 50, 75, 100];
  const point = (i, val) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const d = (val / 100) * r;
    return { x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d };
  };
  const pts = KOMPETENZFELDER.map((f, i) => point(i, scores[f.id] || 0));
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + 'Z';
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', maxWidth: size }}>
      <defs>
        <radialGradient id="radarG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#CC1426" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#CC1426" stopOpacity="0.04" />
        </radialGradient>
      </defs>
      {rings.map(ring => {
        const rp = Array.from({ length: n }, (_, i) => point(i, ring));
        return (
          <polygon key={ring}
            points={rp.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
            fill={ring === 100 ? 'url(#radarG)' : 'none'}
            stroke="var(--line-2)" strokeWidth="0.8"
          />
        );
      })}
      {KOMPETENZFELDER.map((_, i) => {
        const p = point(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--line-2)" strokeWidth="0.8" />;
      })}
      <path d={path} fill="rgba(204,20,38,0.18)" stroke="var(--ki-red)" strokeWidth="2" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="var(--ki-red)" />)}
      {KOMPETENZFELDER.map((f, i) => {
        const a = (Math.PI * 2 * i) / n - Math.PI / 2;
        const lx = cx + Math.cos(a) * (r + 22);
        const ly = cy + Math.sin(a) * (r + 22);
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                style={{ fontSize: 13 }}>{f.icon}</text>
        );
      })}
    </svg>
  );
}

function ScoreRing({ score, size = 180 }) {
  const r = (size - 24) / 2, c = 2 * Math.PI * r;
  const val = Math.max(0, Math.min(100, score || 0));
  const offset = c - (val / 100) * c;
  return (
    <div className="ana-ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle className="track" cx={size/2} cy={size/2} r={r} />
        <circle className="prog" cx={size/2} cy={size/2} r={r}
                strokeDasharray={c} strokeDashoffset={offset} />
      </svg>
      <div className="label">
        <div className="v">{Math.round(val)}</div>
        <div className="o">von 100</div>
      </div>
    </div>
  );
}

function FieldCard({ field, score, locked }) {
  const lvl = getScoreLevel(score);
  if (locked) {
    return (
      <div className="ana-field-card locked">
        <div className="ana-field-icon" style={{ background: 'var(--fill-2)', color: 'var(--label-4)' }}>
          {field.icon}
        </div>
        <div className="ana-field-body">
          <div className="ana-field-name">{field.name}</div>
          <div className="ana-field-locked">
            <Icon name="lock" size={13} stroke={2} />
            Mit Premium freischalten
          </div>
        </div>
        <div className="ana-field-lock-ic"><Icon name="lock" size={18} stroke={2} /></div>
      </div>
    );
  }
  return (
    <div className="ana-field-card">
      <div className="ana-field-icon" style={{ background: `${field.color}15`, color: field.color }}>
        {field.icon}
      </div>
      <div className="ana-field-body">
        <div className="ana-field-name">{field.name}</div>
        <div className="ana-field-bar">
          <div className="ana-field-bar-fill" style={{ width: `${score}%`, background: lvl.color }} />
        </div>
        <div className="ana-field-meta">
          <span className="ana-field-level" style={{ color: lvl.color }}>{lvl.label}</span>
          <span className="ana-field-score">{score}<span className="of">/100</span></span>
        </div>
      </div>
    </div>
  );
}

function ScaleQuestion({ question, selected, onSelect, disabled }) {
  return (
    <div>
      <div className="ana-q-kicker">📊 Selbsteinschätzung</div>
      <div className="ana-q-text">{question.text}</div>
      <div className="ana-q-scale-row">
        {[1, 2, 3, 4, 5].map(val => (
          <button key={val} type="button"
            className={`ana-scale-btn ${selected === val ? 'on' : ''}`}
            onClick={() => !disabled && onSelect(val)}
            disabled={disabled}>{val}</button>
        ))}
      </div>
      <div className="ana-q-scale-labels">
        <span>{question.low}</span>
        <span>{question.high}</span>
      </div>
    </div>
  );
}

function ScenarioQuestion({ question, selected, onSelect, disabled }) {
  return (
    <div>
      <div className="ana-q-kicker">📍 Szenario</div>
      <div className="ana-q-text">{question.text}</div>
      <div className="ana-q-scenarios">
        {question.options.map((opt, i) => (
          <button key={i} type="button"
            className={`ana-scenario-btn ${selected === opt.score ? 'on' : ''}`}
            onClick={() => !disabled && onSelect(opt.score)}
            disabled={disabled}>
            <span className="emoji">{opt.emoji}</span>
            <span className="txt">{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AnalyseClient({ profile, existingSession, userId, hasFullAccess }) {
  const supabase = createClient();

  const initialPhase = existingSession?.status === 'completed' ? 3 : 1;
  const [phase, setPhase] = useState(initialPhase);
  const [currentFieldIdx, setCurrentFieldIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [answers, setAnswers] = useState(existingSession?.answers || {});
  const [fieldScores, setFieldScores] = useState(existingSession?.scores || {});
  const [xpAwarded, setXpAwarded] = useState(existingSession?.status === 'completed');
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const currentField = KOMPETENZFELDER[currentFieldIdx];
  const currentQuestion = currentField?.fragen?.[questionIdx];
  const totalFields = KOMPETENZFELDER.length;
  const fieldsCompleted = useMemo(() => Object.keys(fieldScores).length, [fieldScores]);
  const overallScore = useMemo(() => {
    const vals = Object.values(fieldScores);
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  }, [fieldScores]);

  function computeFieldScore(fieldAnswers) {
    const sum = (fieldAnswers || []).reduce((a, b) => a + (b || 0), 0);
    return scoreToPercent(sum);
  }

  function handleAnswer(score) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(score);

    const fieldArr = answers[currentField.id] ? [...answers[currentField.id]] : [];
    fieldArr[questionIdx] = score;
    const updated = { ...answers, [currentField.id]: fieldArr };
    setAnswers(updated);

    setTimeout(() => {
      const isLastQ = questionIdx >= currentField.fragen.length - 1;
      if (isLastQ) {
        const finalScore = computeFieldScore(fieldArr);
        const newScores = { ...fieldScores, [currentField.id]: finalScore };
        setFieldScores(newScores);
        setSelectedAnswer(null);

        const isLastField = currentFieldIdx >= totalFields - 1;
        const overall = Math.round(Object.values(newScores).reduce((a, b) => a + b, 0) / Object.values(newScores).length);

        if (isLastField) {
          (async () => {
            try {
              await supabase.from('analysis_sessions').upsert({
                user_id: userId,
                scores: newScores,
                answers: updated,
                overall_score: overall,
                current_field: currentFieldIdx,
                status: 'completed',
                completed_at: new Date().toISOString(),
              }, { onConflict: 'user_id' });
            } catch (e) { console.error('[analyse] save', e); }
            if (!xpAwarded) {
              try { await awardPoints(supabase, userId, 'FIRST_ANALYSIS'); } catch {}
              setXpAwarded(true);
            }
            setPhase(3);
          })();
        } else {
          (async () => {
            try {
              await supabase.from('analysis_sessions').upsert({
                user_id: userId,
                scores: newScores,
                answers: updated,
                overall_score: overall,
                current_field: currentFieldIdx,
                status: 'in_progress',
                completed_at: null,
              }, { onConflict: 'user_id' });
            } catch (e) { console.error('[analyse] save', e); }
          })();
          setCurrentFieldIdx(currentFieldIdx + 1);
          setQuestionIdx(0);
          setShowIntro(true);
        }
      } else {
        setQuestionIdx(questionIdx + 1);
        setSelectedAnswer(null);
      }
    }, 350);
  }

  function handleStart() {
    setCurrentFieldIdx(0);
    setQuestionIdx(0);
    setShowIntro(true);
    setAnswers({});
    setFieldScores({});
    setPhase(2);
  }

  function handleResume() {
    const last = existingSession?.current_field ?? 0;
    const next = Math.min(last + 1, totalFields - 1);
    setCurrentFieldIdx(next);
    setQuestionIdx(0);
    setShowIntro(true);
    setPhase(2);
  }

  function handleReset() {
    setPhase(1);
    setCurrentFieldIdx(0);
    setQuestionIdx(0);
    setAnswers({});
    setFieldScores({});
    setXpAwarded(false);
    setShowIntro(true);
  }

  const sortedFields = useMemo(
    () => [...KOMPETENZFELDER].sort((a, b) => (fieldScores[b.id] || 0) - (fieldScores[a.id] || 0)),
    [fieldScores]
  );
  const recommendedMc = useMemo(() => {
    if (Object.keys(fieldScores).length === 0) return null;
    const mcId = getRecommendedMasterclass(fieldScores);
    return MASTERCLASS_INFO[mcId] || null;
  }, [fieldScores]);
  const topStaerken = sortedFields.slice(0, 3);
  const topLuecken = [...sortedFields].reverse().slice(0, 3);

  return (
    <div className="analyse-v2">
      <div className="title-kicker">
        <span className="pulse" />
        {phase === 1 && (existingSession?.status === 'in_progress'
          ? `Letzte Session: ${(existingSession.current_field || 0) + 1} von ${totalFields} Feldern`
          : 'Karriere-Blutbild · ~10 Min')}
        {phase === 2 && `Feld ${currentFieldIdx + 1} von ${totalFields} · Frage ${questionIdx + 1} von ${currentField.fragen.length}`}
        {phase === 3 && `Abgeschlossen · ${fieldsCompleted}/${totalFields} Felder`}
      </div>
      <h1 className="page-title">
        Karriere-Analyse.{' '}
        <span className="faded">
          {phase === 1 ? 'Wo stehst du wirklich?' : phase === 2 ? currentField.name : 'Dein vollständiges Profil.'}
        </span>
      </h1>
      {phase === 1 && (
        <p className="page-sub">
          12 Kompetenzfelder, jeweils 4 Fragen — ehrlich beantwortet bekommst du danach deinen Karriere-Score, deine Stärken und ein klares Bild deiner Wachstumsfelder.
        </p>
      )}

      {/* ── PHASE 1 ─────────────────────────────────────────── */}
      {phase === 1 && (
        <>
          {existingSession?.status === 'in_progress' ? (
            <div className="ana-welcome-card">
              <div className="ana-welcome-grid">
                <ScoreRing score={existingSession.overall_score || 0} size={140} />
                <div>
                  <div className="ana-w-eyebrow">Vorherige Session gefunden</div>
                  <h2 className="ana-w-title">
                    Du hast {existingSession.current_field + 1} von {totalFields} Feldern abgeschlossen.
                  </h2>
                  <p className="ana-w-sub">Mach dort weiter wo du aufgehört hast — oder starte komplett neu.</p>
                  <div className="ana-w-actions">
                    <button type="button" className="ana-btn-primary" onClick={handleResume}>Weitermachen →</button>
                    <button type="button" className="ana-btn-ghost" onClick={handleStart}>Neu starten</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="ana-welcome-card ana-welcome-solo">
              <div className="ana-w-eyebrow">Dein Karriere-Blutbild</div>
              <h2 className="ana-w-title">Wo stehst du wirklich?</h2>
              <p className="ana-w-sub">
                12 Felder · 48 Fragen · etwa 10 Minuten ehrliche Selbsteinschätzung. Danach bekommst du deinen Karriere-Score, eine Karte deiner Stärken und drei klare Wachstumsfelder mit passender Masterclass.
              </p>
              <div className="ana-w-actions">
                <button type="button" className="ana-btn-primary" onClick={handleStart}>Analyse starten →</button>
              </div>
              <div className="ana-w-stats">
                <div className="ana-w-stat"><span className="v">12</span><span className="l">Felder</span></div>
                <div className="ana-w-stat-sep" />
                <div className="ana-w-stat"><span className="v">48</span><span className="l">Fragen</span></div>
                <div className="ana-w-stat-sep" />
                <div className="ana-w-stat"><span className="v">~10</span><span className="l">Minuten</span></div>
              </div>
            </div>
          )}

          <div className="ana-section-head">
            <h3>Diese 12 Felder werden analysiert</h3>
            <span>4 Fragen je Feld</span>
          </div>
          <div className="ana-field-preview-grid">
            {KOMPETENZFELDER.map(f => (
              <div key={f.id} className="ana-field-preview">
                <div className="ana-field-preview-icon" style={{ background: `${f.color}15`, color: f.color }}>
                  {f.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="ana-field-preview-name">{f.name}</div>
                  <div className="ana-field-preview-sub">{f.outcome?.headline?.slice(0, 60) || ''}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── PHASE 2 ─────────────────────────────────────────── */}
      {phase === 2 && currentField && (
        <>
          <div className="ana-progress-wrap">
            <div className="ana-progress-info">
              <span>Fortschritt</span>
              <span>{fieldsCompleted} von {totalFields} Feldern · {Math.round((fieldsCompleted / totalFields) * 100)}%</span>
            </div>
            <div className="ana-progress-bar">
              <div className="ana-progress-bar-fill" style={{ width: `${(fieldsCompleted / totalFields) * 100}%` }} />
            </div>
          </div>

          {showIntro ? (
            <div className="ana-intro-card">
              <div className="ana-intro-icon" style={{ background: `${currentField.color}15`, color: currentField.color }}>
                {currentField.icon}
              </div>
              <div className="ana-intro-eyebrow">Feld {currentFieldIdx + 1} von {totalFields}</div>
              <h2 className="ana-intro-title">{currentField.name}</h2>
              {currentField.outcome?.headline && (
                <p className="ana-intro-headline">{currentField.outcome.headline}</p>
              )}
              {currentField.intro?.was && (
                <div className="ana-intro-block">
                  <div className="ana-intro-label">Was bedeutet das?</div>
                  <p>{currentField.intro.was}</p>
                </div>
              )}
              {currentField.intro?.warum && (
                <div className="ana-intro-block">
                  <div className="ana-intro-label">Warum ist das wichtig?</div>
                  <p>{currentField.intro.warum}</p>
                </div>
              )}
              <div className="ana-intro-actions">
                <button type="button" className="ana-btn-primary" onClick={() => setShowIntro(false)}>
                  4 Fragen beantworten →
                </button>
              </div>
            </div>
          ) : (
            <div className="ana-q-card">
              <div className="ana-q-dots">
                {currentField.fragen.map((_, i) => (
                  <span key={i} className={`ana-q-dot ${i < questionIdx ? 'done' : i === questionIdx ? 'active' : ''}`} />
                ))}
              </div>

              {currentQuestion?.type === 'scenario' ? (
                <ScenarioQuestion question={currentQuestion} selected={selectedAnswer} onSelect={handleAnswer} disabled={selectedAnswer !== null} />
              ) : (
                <ScaleQuestion question={currentQuestion} selected={selectedAnswer} onSelect={handleAnswer} disabled={selectedAnswer !== null} />
              )}

              <div className="ana-q-foot">
                {questionIdx > 0 ? (
                  <button type="button" className="ana-btn-back" onClick={() => { setQuestionIdx(questionIdx - 1); setSelectedAnswer(null); }}>
                    <Icon name="chev-l" size={14} /> Zurück
                  </button>
                ) : <span />}
                <span className="ana-q-counter">Frage {questionIdx + 1} / {currentField.fragen.length}</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── PHASE 3 ─────────────────────────────────────────── */}
      {phase === 3 && (
        <>
          <div className="ana-results-hero">
            <div className="hero-grain" />
            <div className="ana-results-grid">
              <ScoreRing score={overallScore} />
              <div className="ana-results-meta">
                <div className="eyebrow">Dein Karriere-Score</div>
                <h2>
                  {overallScore >= 75 ? 'Starkes Profil — du weißt, was du tust.'
                    : overallScore >= 55 ? 'Solide Basis mit klaren Hebeln nach oben.'
                    : 'Klares Wachstumsfeld — und genau dafür gibt es die Masterclass.'}
                </h2>
                <p>
                  Du hast alle 12 Kompetenzfelder beantwortet. Schau dir unten deine Stärken-Karte an, die drei wichtigsten Wachstumsfelder, und welche Masterclass dir am schnellsten hilft.
                </p>
              </div>
            </div>
          </div>

          <div className="ana-radar-section">
            <div className="card">
              <div className="card-head">
                <h3 className="card-title">Stärken-Karte<span className="kicker">12 Felder</span></h3>
              </div>
              <div className="ana-radar-grid">
                <div className="ana-radar"><RadarChart scores={fieldScores} size={320} /></div>
                <div className="ana-top-cols">
                  <div className="ana-top-col">
                    <div className="ana-top-label" style={{ color: 'var(--green-dark)' }}>Top 3 Stärken</div>
                    {topStaerken.map(f => (
                      <div key={f.id} className="ana-top-row">
                        <span className="ana-top-ic" style={{ background: `${f.color}15`, color: f.color }}>{f.icon}</span>
                        <span className="ana-top-name">{f.name}</span>
                        <span className="ana-top-score" style={{ color: 'var(--green-dark)' }}>{fieldScores[f.id] || 0}</span>
                      </div>
                    ))}
                  </div>
                  <div className="ana-top-col">
                    <div className="ana-top-label" style={{ color: 'var(--ki-red-dark)' }}>Top 3 Wachstumsfelder</div>
                    {topLuecken.map(f => (
                      <div key={f.id} className="ana-top-row">
                        <span className="ana-top-ic" style={{ background: `${f.color}15`, color: f.color }}>{f.icon}</span>
                        <span className="ana-top-name">{f.name}</span>
                        <span className="ana-top-score" style={{ color: 'var(--ki-red-dark)' }}>{fieldScores[f.id] || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ana-section-head">
            <h3>Alle 12 Felder im Detail</h3>
            {!hasFullAccess && <span>Top 3 frei · Rest mit Premium</span>}
          </div>
          <div className="ana-field-grid">
            {sortedFields.map((f, idx) => (
              <FieldCard key={f.id} field={f} score={fieldScores[f.id] || 0} locked={!hasFullAccess && idx >= 3} />
            ))}
          </div>

          {recommendedMc && (
            <div className="ana-mc-card">
              <div className="hero-grain" />
              <div className="ana-mc-inner">
                <div>
                  <div className="ana-mc-eyebrow">
                    <Icon name="sparkle" size={12} stroke={2} /> Empfohlene Masterclass
                  </div>
                  <div className="ana-mc-icon">{recommendedMc.icon}</div>
                  <h2 className="ana-mc-title">{recommendedMc.name}</h2>
                  <p className="ana-mc-sub">{recommendedMc.pitch}</p>
                  <div className="ana-mc-fields">
                    {recommendedMc.fields?.map(fid => {
                      const f = KOMPETENZFELDER.find(x => x.id === fid);
                      if (!f) return null;
                      return <span key={fid} className="ana-mc-field">{f.icon} {f.name}</span>;
                    })}
                  </div>
                </div>
                <div className="ana-mc-cta">
                  <a href="/masterclass" className="ana-btn-light">Masterclass öffnen →</a>
                </div>
              </div>
            </div>
          )}

          <div className="ana-reset-row">
            <button type="button" className="ana-btn-ghost" onClick={handleReset}>
              <Icon name="refresh" size={13} stroke={2} /> Analyse wiederholen
            </button>
          </div>
        </>
      )}
    </div>
  );
}

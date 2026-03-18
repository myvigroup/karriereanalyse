'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { calculateFieldScore, calculateOverallScore, calculatePriorities, classifyScore, prepareRadarData } from '@/lib/career-logic';

// ============================================================
// RADAR CHART (SVG)
// ============================================================
function RadarChart({ data, size = 320 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const n = data.length;
  if (n === 0) return null;

  const getPoint = (i, val) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const dist = (val / 100) * r;
    return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist };
  };

  const rings = [25, 50, 75, 100];
  const points = data.map((d, i) => getPoint(i, d.value));
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', maxWidth: size }}>
      {rings.map(ring => {
        const pts = Array.from({ length: n }, (_, i) => getPoint(i, ring));
        return <polygon key={ring} points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="var(--grey-5)" strokeWidth="0.5" />;
      })}
      {data.map((_, i) => {
        const end = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="var(--grey-5)" strokeWidth="0.5" />;
      })}
      <polygon points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(204,20,38,0.1)" stroke="var(--ki-red)" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--ki-red)" />
      ))}
      {data.map((d, i) => {
        const labelPt = getPoint(i, 115);
        return (
          <text key={i} x={labelPt.x} y={labelPt.y} textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: 10, fill: 'var(--ki-text-secondary)', fontFamily: 'Instrument Sans' }}>
            {d.icon}
          </text>
        );
      })}
    </svg>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function AnalyseClient({ fields, existingResults, userId, marketValuePercentile, selfAssessmentScore }) {
  const supabase = createClient();
  const [phase, setPhase] = useState(existingResults?.length > 0 ? 'results' : 'intro'); // intro | quiz | results | quick
  const [currentFieldIdx, setCurrentFieldIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { fieldId: [1-10, 1-10, ...] }
  const [scores, setScores] = useState([]); // { fieldId, score, title, icon, slug }
  const [saving, setSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareForm, setShareForm] = useState({ name: '', email: '', anonymized: false });
  const [shareLink, setShareLink] = useState('');
  const [shareLoading, setShareLoading] = useState(false);

  // Load existing results
  useEffect(() => {
    if (existingResults?.length > 0) {
      setScores(existingResults.map(r => ({
        fieldId: r.field_id,
        score: r.score,
        title: r.competency_fields?.title || '',
        icon: r.competency_fields?.icon || '',
        slug: r.competency_fields?.slug || '',
      })));
    }
  }, [existingResults]);

  const currentField = fields?.[currentFieldIdx];
  const questions = currentField?.competency_questions?.sort((a, b) => a.sort_order - b.sort_order) || [];
  const fieldAnswers = answers[currentField?.id] || [];
  const allAnswered = fieldAnswers.length === questions.length && fieldAnswers.every(a => a > 0);
  const totalFields = fields?.length || 13;

  // Answer a question
  const setAnswer = useCallback((qIdx, value) => {
    setAnswers(prev => {
      const fieldId = currentField.id;
      const arr = [...(prev[fieldId] || Array(questions.length).fill(0))];
      arr[qIdx] = value;
      return { ...prev, [fieldId]: arr };
    });
  }, [currentField, questions.length]);

  // Next field
  const nextField = useCallback(() => {
    const fieldId = currentField.id;
    const fieldScore = calculateFieldScore(answers[fieldId] || []);
    setScores(prev => {
      const existing = prev.filter(s => s.fieldId !== fieldId);
      return [...existing, { fieldId, score: fieldScore, title: currentField.title, icon: currentField.icon, slug: currentField.slug }];
    });

    if (currentFieldIdx < totalFields - 1) {
      setCurrentFieldIdx(i => i + 1);
    } else {
      finishAnalysis();
    }
  }, [currentFieldIdx, currentField, answers, totalFields]);

  // Finish & save
  const finishAnalysis = async () => {
    setSaving(true);
    const finalScores = fields.map(f => {
      const existing = scores.find(s => s.fieldId === f.id);
      if (existing) return existing;
      return { fieldId: f.id, score: calculateFieldScore(answers[f.id] || []), title: f.title, icon: f.icon, slug: f.slug };
    });
    setScores(finalScores);

    // Save to Supabase
    for (const s of finalScores) {
      await supabase.from('analysis_results').upsert({
        user_id: userId, field_id: s.fieldId, score: s.score,
      }, { onConflict: 'user_id,field_id' });
    }

    const overall = calculateOverallScore(finalScores);
    const prios = calculatePriorities(finalScores);
    await supabase.from('analysis_sessions').insert({
      user_id: userId,
      overall_score: overall,
      prio_1_field: prios.prio1?.fieldId,
      prio_2_field: prios.prio2?.fieldId,
      prio_3_field: prios.prio3?.fieldId,
    });

    setSaving(false);
    setPhase('results');
  };

  // Quick assessment (sliders)
  const [quickScores, setQuickScores] = useState(() =>
    (fields || []).reduce((acc, f) => ({ ...acc, [f.id]: 50 }), {})
  );

  const saveQuickAssessment = async () => {
    setSaving(true);
    const finalScores = fields.map(f => ({
      fieldId: f.id, score: quickScores[f.id] || 50, title: f.title, icon: f.icon, slug: f.slug,
    }));
    setScores(finalScores);

    for (const s of finalScores) {
      await supabase.from('analysis_results').upsert({
        user_id: userId, field_id: s.fieldId, score: s.score,
      }, { onConflict: 'user_id,field_id' });
    }
    const overall = calculateOverallScore(finalScores);
    const prios = calculatePriorities(finalScores);
    await supabase.from('analysis_sessions').insert({
      user_id: userId, overall_score: overall,
      prio_1_field: prios.prio1?.fieldId, prio_2_field: prios.prio2?.fieldId, prio_3_field: prios.prio3?.fieldId,
    });
    setSaving(false);
    setPhase('results');
  };

  // Share report
  const handleShare = async () => {
    setShareLoading(true);
    const token = crypto.randomUUID();
    await supabase.from('shared_reports').insert({
      user_id: userId,
      share_token: token,
      recipient_name: shareForm.name,
      recipient_email: shareForm.email,
      is_anonymized: shareForm.anonymized,
      sections_visible: { radar: true, priorities: true, scores: true },
    });
    const link = `${window.location.origin}/shared/${token}`;
    setShareLink(link);
    setShareLoading(false);
  };

  // Impostor score
  const impostorGap = (marketValuePercentile || 0) - (selfAssessmentScore || 0);

  // ============================================================
  // RENDER
  // ============================================================

  // INTRO
  if (phase === 'intro') return (
    <div className="page-container" style={{ maxWidth: 700 }}>
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>◎</div>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 12 }}>Entdecke dein Potenzial</h1>
        <p style={{ fontSize: 17, color: 'var(--ki-text-secondary)', maxWidth: 500, margin: '0 auto 40px' }}>
          13 Kompetenzfelder. 65 Fragen. In 10 Minuten weißt du genau, wo dein größtes Wachstumspotenzial liegt.
        </p>
        <div className="grid-3" style={{ marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
          {[['13', 'Kompetenzfelder'], ['65', 'Fragen'], ['~10', 'Minuten']].map(([n, l]) => (
            <div key={l} className="card" style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--ki-red)' }}>{n}</div>
              <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => { setCurrentFieldIdx(0); setPhase('quiz'); }} style={{ padding: '14px 32px', fontSize: 16 }}>
            Analyse starten →
          </button>
          <button className="btn btn-secondary" onClick={() => setPhase('quick')}>
            Schnell-Einstufung
          </button>
        </div>
      </div>
    </div>
  );

  // QUICK ASSESSMENT
  if (phase === 'quick') return (
    <div className="page-container" style={{ maxWidth: 600 }}>
      <h1 className="page-title">Schnell-Einstufung</h1>
      <p className="page-subtitle" style={{ marginBottom: 32 }}>Schätze dich in jedem Feld ein (0–100%)</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {(fields || []).map(f => (
          <div key={f.id} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{f.icon}</span>
              <span style={{ fontWeight: 600, flex: 1 }}>{f.title}</span>
              <span style={{ fontWeight: 700, color: classifyScore(quickScores[f.id]).color, minWidth: 40, textAlign: 'right' }}>
                {quickScores[f.id]}%
              </span>
            </div>
            <input type="range" min={0} max={100} value={quickScores[f.id]} onChange={e => setQuickScores(p => ({ ...p, [f.id]: +e.target.value }))}
              style={{ width: '100%', accentColor: 'var(--ki-red)' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button className="btn btn-secondary" onClick={() => setPhase('intro')}>← Zurück</button>
        <button className="btn btn-primary" onClick={saveQuickAssessment} disabled={saving} style={{ flex: 1 }}>
          {saving ? 'Speichern...' : 'Ergebnis anzeigen →'}
        </button>
      </div>
    </div>
  );

  // QUIZ
  if (phase === 'quiz') return (
    <div className="page-container" style={{ maxWidth: 650 }}>
      {/* Progress */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 8 }}>
          <span>Feld {currentFieldIdx + 1} von {totalFields}</span>
          <span>{Math.round(((currentFieldIdx) / totalFields) * 100)}%</span>
        </div>
        <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${((currentFieldIdx) / totalFields) * 100}%` }} /></div>
      </div>

      {/* Current Field */}
      <div className="card animate-in" style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 32 }}>{currentField?.icon}</span>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{currentField?.title}</h2>
            <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)' }}>{currentField?.description}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>
          {questions.map((q, qIdx) => (
            <div key={q.id}>
              <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 10 }}>{q.question_text}</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => {
                  const isActive = fieldAnswers[qIdx] === val;
                  return (
                    <button key={val} onClick={() => setAnswer(qIdx, val)} style={{
                      flex: 1, padding: '8px 0', borderRadius: 'var(--r-pill)', border: 'none', cursor: 'pointer',
                      fontSize: 13, fontWeight: isActive ? 700 : 400, fontFamily: 'Instrument Sans',
                      background: isActive ? 'var(--ki-red)' : 'var(--ki-bg-alt)',
                      color: isActive ? 'white' : 'var(--ki-text-secondary)',
                      transform: isActive ? 'scale(1.08)' : 'scale(1)',
                      transition: 'all var(--t-fast)',
                    }}>
                      {val}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ki-text-tertiary)', marginTop: 4 }}>
                <span>Trifft nicht zu</span><span>Trifft voll zu</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          {currentFieldIdx > 0 && (
            <button className="btn btn-secondary" onClick={() => setCurrentFieldIdx(i => i - 1)}>← Zurück</button>
          )}
          <button className="btn btn-primary" onClick={nextField} disabled={!allAnswered} style={{ flex: 1, opacity: allAnswered ? 1 : 0.5 }}>
            {currentFieldIdx === totalFields - 1 ? 'Ergebnis anzeigen' : 'Weiter →'}
          </button>
        </div>
      </div>
    </div>
  );

  // RESULTS
  if (phase === 'results') {
    const sorted = [...scores].sort((a, b) => a.score - b.score);
    const overall = calculateOverallScore(scores);
    const prios = calculatePriorities(scores);
    const radarData = prepareRadarData(scores.map(s => ({ ...s, sort_order: fields?.findIndex(f => f.id === s.fieldId) || 0 })));

    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.04em' }}>Dein Ergebnis</h1>
          <div style={{ fontSize: 64, fontWeight: 700, color: 'var(--ki-red)', margin: '16px 0' }}>{Math.round(overall)}%</div>
          <p style={{ color: 'var(--ki-text-secondary)' }}>Gesamtscore über 13 Kompetenzfelder</p>
        </div>

        <div className="grid-2" style={{ marginBottom: 40, alignItems: 'start' }}>
          {/* Radar */}
          <div className="card animate-in" style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
            <RadarChart data={radarData} size={320} />
          </div>

          {/* PRIO List */}
          <div className="card animate-in">
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Dein Fokus</h3>
            {[prios.prio1, prios.prio2, prios.prio3].filter(Boolean).map((p, i) => {
              const cls = classifyScore(p.score);
              return (
                <div key={p.fieldId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--ki-border)' : 'none' }}>
                  <span className="pill pill-red">PRIO {i + 1}</span>
                  <span style={{ flex: 1, fontWeight: 500 }}>{p.title}</span>
                  <span style={{ fontWeight: 700, color: cls.color }}>{Math.round(p.score)}%</span>
                </div>
              );
            })}
            <a href="/masterclass" className="btn btn-primary" style={{ width: '100%', marginTop: 16 }}>Masterclass starten →</a>
          </div>
        </div>

        {/* All Fields */}
        <div className="card" style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Alle Kompetenzfelder</h3>
          {sorted.map((s, i) => {
            const cls = classifyScore(s.score);
            return (
              <div key={s.fieldId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--ki-border)' }}>
                <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{s.icon}</span>
                <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{s.title}</span>
                {i < 3 && <span className="pill pill-red" style={{ fontSize: 11 }}>PRIO {i + 1}</span>}
                <div style={{ width: 120 }}>
                  <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${s.score}%`, background: cls.color }} /></div>
                </div>
                <span style={{ fontWeight: 600, color: cls.color, minWidth: 36, textAlign: 'right', fontSize: 14 }}>{Math.round(s.score)}%</span>
              </div>
            );
          })}
        </div>

        {/* Impostor-Score Confidence Box */}
        {impostorGap > 15 && (
          <div className="card" style={{ marginBottom: 32, background: 'rgba(212,160,23,0.05)', border: '1px solid rgba(212,160,23,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>💡</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ki-warning)', marginBottom: 4 }}>Du unterschätzt deinen Marktwert</div>
                <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', lineHeight: 1.6 }}>
                  Dein Marktwert liegt {Math.round(impostorGap)}% über deiner Selbsteinschätzung.
                  Das ist typisch und nennt sich Impostor-Syndrom. Empfehlung: Starte das Modul <strong>Gehaltsverhandlung</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={() => window.open('/api/generate-report', '_blank')}>📄 Report generieren</button>
          <button className="btn btn-secondary" onClick={() => setShowShareModal(true)}>📤 Report teilen</button>
          <button className="btn btn-secondary" onClick={() => { setPhase('intro'); setAnswers({}); setScores([]); }}>🔄 Analyse wiederholen</button>
          <a href="/masterclass" className="btn btn-primary" style={{ flex: 1 }}>Masterclass starten →</a>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
            onClick={() => { setShowShareModal(false); setShareLink(''); }}>
            <div className="card" style={{ width: 440, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>📤 Report teilen</h3>
                <button onClick={() => { setShowShareModal(false); setShareLink(''); }} className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 18 }}>×</button>
              </div>
              {shareLink ? (
                <div>
                  <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>Link erstellt! Kopiere ihn und teile ihn:</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input className="input" readOnly value={shareLink} onClick={e => e.target.select()} />
                    <button className="btn btn-primary" style={{ flexShrink: 0 }} onClick={() => { navigator.clipboard.writeText(shareLink); }}>
                      Kopieren
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Name (optional)</label>
                    <input className="input" placeholder="An wen geht der Report?" value={shareForm.name} onChange={e => setShareForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>E-Mail (optional)</label>
                    <input className="input" type="email" placeholder="empfaenger@email.de" value={shareForm.email} onChange={e => setShareForm(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                    <input type="checkbox" checked={shareForm.anonymized} onChange={e => setShareForm(p => ({ ...p, anonymized: e.target.checked }))} />
                    Anonymisiert teilen
                  </label>
                  <button onClick={handleShare} className="btn btn-primary" disabled={shareLoading} style={{ width: '100%' }}>
                    {shareLoading ? 'Erstellt...' : 'Link erstellen'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

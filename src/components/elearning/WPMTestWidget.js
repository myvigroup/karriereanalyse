'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function WPMTestWidget({ texte, ghostWPM, onComplete, onResult, userId }) {
  const supabase = createClient();
  const allTexte = texte || [];
  const [phase, setPhase] = useState('intro'); // intro | reading | questions | result
  const [textIdx] = useState(() => Math.floor(Math.random() * Math.max(1, allTexte.length)));
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [answers, setAnswers] = useState({});
  const [wpm, setWPM] = useState(0);
  const [verstaendnis, setVerstaendnis] = useState(0);
  const [ghostProgress, setGhostProgress] = useState(0);
  const ghostRef = useRef(null);

  const text = allTexte[textIdx] || { titel: 'Testtext', woerter: 200, text: 'Kein Text verfügbar.', fragen: [] };

  // Ghost mode: simulate old reading speed
  useEffect(() => {
    if (phase === 'reading' && ghostWPM && ghostWPM > 0) {
      const totalTime = (text.woerter / ghostWPM) * 60 * 1000; // ms to read at ghost speed
      const interval = 100;
      let elapsed = 0;
      ghostRef.current = setInterval(() => {
        elapsed += interval;
        setGhostProgress(Math.min(100, (elapsed / totalTime) * 100));
        if (elapsed >= totalTime) clearInterval(ghostRef.current);
      }, interval);
      return () => clearInterval(ghostRef.current);
    }
    return () => {};
  }, [phase, ghostWPM, text.woerter]);

  function startReading() {
    setStartTime(Date.now());
    setPhase('reading');
  }

  function finishReading() {
    const end = Date.now();
    setEndTime(end);
    const minutes = (end - startTime) / 60000;
    const calculatedWPM = Math.round(text.woerter / minutes);
    setWPM(calculatedWPM);
    setPhase('questions');
  }

  function answerQuestion(qIdx, optIdx) {
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  }

  async function saveWPMResult(wpmVal, verstaendnisScore) {
    if (!userId) return;
    await supabase.from('wpm_history').insert({
      user_id: userId, wpm: Math.round(wpmVal),
      verstaendnis_score: verstaendnisScore, test_typ: 'standard',
    }).catch(() => {});
    const { data: profile } = await supabase.from('profiles').select('wpm_start').eq('id', userId).single().catch(() => ({ data: null }));
    const updates = { wpm_current: Math.round(wpmVal) };
    if (!profile?.wpm_start || profile.wpm_start === 0) updates.wpm_start = Math.round(wpmVal);
    await supabase.from('profiles').update(updates).eq('id', userId).catch(() => {});
  }

  function finishQuiz() {
    const correct = text.fragen.filter((q, i) => answers[i] === q.correct).length;
    const score = text.fragen.length > 0 ? Math.round((correct / text.fragen.length) * 100) : 100;
    setVerstaendnis(score);
    setPhase('result');
    saveWPMResult(wpm, score);
    if (onResult) onResult({ wpm, verstaendnis: score, date: new Date().toISOString() });
  }

  const allQuestionsAnswered = text.fragen.length > 0 && text.fragen.every((_, i) => answers[i] !== undefined);

  return (
    <div className="card" style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
      {/* INTRO */}
      {phase === 'intro' && (
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>⚡</span>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>WPM-Lesetest</div>
          <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 4, lineHeight: 1.7 }}>
            Lies den folgenden Text so schnell wie möglich — aber so, dass du den Inhalt verstehst.
          </p>
          <p style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', marginBottom: 20 }}>
            ~{text.woerter} Wörter | Danach folgen {text.fragen.length} Verständnisfragen
          </p>
          {ghostWPM > 0 && (
            <div style={{
              padding: '8px 14px', borderRadius: 'var(--r-md)', marginBottom: 16,
              background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
              fontSize: 13, color: '#d97706',
            }}>
              👻 Ghost-Mode aktiv! Dein altes Ich liest mit {ghostWPM} WPM. Schlag es!
            </div>
          )}
          <button onClick={startReading} className="btn btn-primary">
            Timer starten & lesen
          </button>
        </div>
      )}

      {/* READING */}
      {phase === 'reading' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{text.titel}</div>
            <div style={{
              padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700,
              background: '#dc262615', color: '#dc2626',
              animation: 'pulse 1.5s infinite',
            }}>
              ⏱ Timer läuft...
            </div>
          </div>

          {/* Ghost progress bar */}
          {ghostWPM > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', marginBottom: 4 }}>
                👻 Ghost ({ghostWPM} WPM): {Math.round(ghostProgress)}%
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'var(--ki-bg-alt)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  background: 'rgba(245,158,11,0.4)',
                  width: `${ghostProgress}%`,
                  transition: 'width 0.1s linear',
                }} />
              </div>
            </div>
          )}

          <div style={{
            fontSize: 15, lineHeight: 2, color: 'var(--ki-text)',
            padding: '16px 0',
            whiteSpace: 'pre-wrap',
          }}>
            {text.text}
          </div>

          <button onClick={finishReading} className="btn btn-primary" style={{ marginTop: 16 }}>
            Fertig gelesen — Timer stoppen
          </button>

          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
        </div>
      )}

      {/* QUESTIONS */}
      {phase === 'questions' && (
        <div>
          <div style={{
            padding: '12px 16px', borderRadius: 'var(--r-md)', marginBottom: 20,
            background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#d97706' }}>
              ⚡ {wpm} WPM
              {ghostWPM > 0 && wpm > ghostWPM && (
                <span style={{ marginLeft: 8, fontSize: 13, color: '#16a34a' }}>
                  👻 Ghost geschlagen! (+{wpm - ghostWPM} WPM)
                </span>
              )}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>
              Jetzt testen wir dein Verständnis:
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {text.fragen.map((q, qi) => (
              <div key={qi}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                  {qi + 1}. {q.frage}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {q.optionen.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => answerQuestion(qi, oi)}
                      style={{
                        padding: '8px 12px', borderRadius: 'var(--r-md)', textAlign: 'left',
                        fontSize: 13, border: answers[qi] === oi ? '2px solid #f59e0b' : '1px solid var(--ki-border)',
                        background: answers[qi] === oi ? 'rgba(245,158,11,0.08)' : 'var(--ki-bg-alt)',
                        color: answers[qi] === oi ? '#d97706' : 'var(--ki-text-secondary)',
                        fontWeight: answers[qi] === oi ? 600 : 400,
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={finishQuiz}
            className="btn btn-primary"
            disabled={!allQuestionsAnswered}
            style={{ marginTop: 20, opacity: allQuestionsAnswered ? 1 : 0.5 }}
          >
            Ergebnis anzeigen
          </button>
        </div>
      )}

      {/* RESULT */}
      {phase === 'result' && (
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 8 }}>
            {wpm >= 500 ? '🏆' : wpm >= 350 ? '⚡' : '📖'}
          </span>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#f59e0b', letterSpacing: '-0.03em' }}>
            {wpm} WPM
          </div>
          <div style={{ fontSize: 16, color: 'var(--ki-text-secondary)', marginBottom: 20 }}>
            bei {verstaendnis}% Textverständnis
          </div>

          {ghostWPM > 0 && (
            <div style={{
              padding: '10px 16px', borderRadius: 'var(--r-md)', marginBottom: 16,
              background: wpm > ghostWPM ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.06)',
              border: wpm > ghostWPM ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(239,68,68,0.2)',
              fontSize: 14, fontWeight: 600,
              color: wpm > ghostWPM ? '#16a34a' : '#dc2626',
            }}>
              {wpm > ghostWPM
                ? `👻 Ghost geschlagen! +${wpm - ghostWPM} WPM schneller als dein altes Ich!`
                : `👻 Ghost war schneller. Weiter üben — du schaffst das!`}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            <span style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              background: 'rgba(245,158,11,0.1)', color: '#d97706', border: '1px solid rgba(245,158,11,0.3)',
            }}>
              {wpm >= 700 ? '👑 Elite-Leser' : wpm >= 500 ? '⚡ Speed-Reader' : wpm >= 350 ? '🚀 Aufsteiger' : '📖 Starter'}
            </span>
            <span style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              background: verstaendnis >= 80 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.08)',
              color: verstaendnis >= 80 ? '#16a34a' : '#dc2626',
              border: verstaendnis >= 80 ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(239,68,68,0.2)',
            }}>
              {verstaendnis}% Verständnis
            </span>
          </div>

          <button onClick={onComplete} className="btn btn-primary">
            ✅ Ergebnis speichern & weiter
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

export default function PacerSimulator({ onComplete }) {
  const text = `Speedreading ist keine Magie und kein Trick. Es ist eine trainierbare Fähigkeit die auf wissenschaftlichen Erkenntnissen basiert. Der Schlüssel liegt darin die natürlichen Fähigkeiten deiner Augen besser zu nutzen.

Dein Gehirn kann Informationen viel schneller verarbeiten als du normalerweise liest. Das Problem ist nicht dein Gehirn sondern deine Lesegewohnheiten. Subvokalisierung, Regression und zu enge Fixierungen bremsen dich aus.

Ein Pacer ist das einfachste und effektivste Tool um diese Bremsen zu lösen. Indem du einem sich bewegenden Punkt folgst zwingst du deine Augen vorwärts zu schauen. Regression wird unmöglich. Dein Lesetempo steigt automatisch.

Professionelle Speedreader nutzen immer einen Pacer. Manche verwenden einen Stift, manche den Finger, manche ein digitales Tool. Das Medium ist egal. Wichtig ist dass deine Augen einer Führung folgen statt planlos über den Text zu springen.

Studien von Rayner und Kollegen zeigen dass ein Pacer die Lesegeschwindigkeit um 20 bis 30 Prozent steigern kann ohne das Textverständnis zu beeinträchtigen. Der Effekt ist sofort messbar und verstärkt sich mit der Übung.`;

  const words = useMemo(() => text.split(/\s+/).filter(Boolean), []);
  const [speed, setSpeed] = useState(300); // WPM
  const [wordIdx, setWordIdx] = useState(-1); // -1 = not started
  const [phase, setPhase] = useState('intro'); // intro | running | done
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase === 'running' && wordIdx >= 0) {
      const msPerWord = (1 / speed) * 60 * 1000;
      timerRef.current = setTimeout(() => {
        if (wordIdx + 1 >= words.length) {
          setPhase('done');
        } else {
          setWordIdx(w => w + 1);
        }
      }, msPerWord);
      return () => clearTimeout(timerRef.current);
    }
    return () => {};
  }, [phase, wordIdx, speed, words.length]);

  function start() {
    setWordIdx(0);
    setPhase('running');
  }

  function restart(newSpeed) {
    setSpeed(newSpeed);
    setWordIdx(0);
    setPhase('running');
  }

  return (
    <div className="card" style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>✏️</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Pacer-Simulator</span>
      </div>

      {/* INTRO */}
      {phase === 'intro' && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 16, lineHeight: 1.7 }}>
            Ein Pacer (Stift/Finger) führt deine Augen über den Text und verhindert Regression.
            Folge dem <span style={{ color: '#f59e0b', fontWeight: 700 }}>gelben Highlight</span> — nicht zurückschauen!
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            {[200, 300, 400, 500].map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                style={{
                  padding: '6px 14px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                  background: speed === s ? '#f59e0b' : 'var(--ki-bg-alt)',
                  color: speed === s ? 'white' : 'var(--ki-text-secondary)',
                  border: speed === s ? 'none' : '1px solid var(--ki-border)',
                  cursor: 'pointer',
                }}
              >
                {s} WPM
              </button>
            ))}
          </div>
          <button onClick={start} className="btn btn-primary">
            Pacer starten ({speed} WPM)
          </button>
        </div>
      )}

      {/* RUNNING */}
      {phase === 'running' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>
              Speed: {speed} WPM | Wort {wordIdx + 1}/{words.length}
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {[200, 300, 400, 500].map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  style={{
                    padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 600,
                    background: speed === s ? '#f59e0b' : 'var(--ki-bg-alt)',
                    color: speed === s ? 'white' : 'var(--ki-text-tertiary)',
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div style={{ height: 3, borderRadius: 2, background: 'var(--ki-bg-alt)', marginBottom: 16 }}>
            <div style={{
              height: '100%', borderRadius: 2, background: '#f59e0b',
              width: `${words.length > 0 ? ((wordIdx + 1) / words.length) * 100 : 0}%`,
              transition: 'width 0.1s linear',
            }} />
          </div>

          <div style={{
            fontSize: 17, lineHeight: 2, padding: 16, borderRadius: 'var(--r-md)',
            background: 'var(--ki-bg-alt)',
          }}>
            {words.map((w, i) => (
              <span key={i} style={{
                display: 'inline',
                color: i === wordIdx ? '#f59e0b' : i < wordIdx ? 'var(--ki-text)' : 'var(--ki-text-tertiary)',
                fontWeight: i === wordIdx ? 800 : 400,
                fontSize: i === wordIdx ? 19 : 17,
                background: i === wordIdx ? 'rgba(245,158,11,0.12)' : 'transparent',
                borderRadius: 4, padding: i === wordIdx ? '0 2px' : 0,
                transition: 'all 0.1s',
              }}>
                {w}{' '}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* DONE */}
      {phase === 'done' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✏️</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            Pacer-Übung abgeschlossen!
          </div>
          <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
            Du hast {words.length} Wörter mit {speed} WPM gelesen.
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => restart(Math.min(speed + 100, 800))} className="btn btn-secondary" style={{ fontSize: 13 }}>
              Nochmal schneller ({Math.min(speed + 100, 800)} WPM)
            </button>
            <button onClick={onComplete} className="btn btn-primary">
              ✅ Als erledigt markieren
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

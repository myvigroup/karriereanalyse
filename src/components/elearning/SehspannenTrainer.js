'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export default function SehspannenTrainer({ config, onComplete }) {
  const levels = config?.level || [];
  const wortgruppen = config?.wortgruppen || [];
  const [currentLevel, setCurrentLevel] = useState(0);
  const [roundIdx, setRoundIdx] = useState(0);
  const [showWords, setShowWords] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [results, setResults] = useState([]);
  const [phase, setPhase] = useState('intro'); // intro | flash | answer | feedback | levelDone | complete
  const timerRef = useRef(null);

  const level = levels[currentLevel] || { name: 'Level 1', breite: 2, zeit_ms: 2000 };
  const words = wortgruppen[roundIdx] || [];
  const chunk = words.slice(0, level.breite).join(' ');

  const flash = useCallback(() => {
    setShowWords(true);
    setPhase('flash');
    timerRef.current = setTimeout(() => {
      setShowWords(false);
      setPhase('answer');
    }, level.zeit_ms);
  }, [level.zeit_ms]);

  function checkAnswer() {
    const correct = chunk.toLowerCase().trim() === userInput.toLowerCase().trim();
    setResults(prev => [...prev, correct]);
    setPhase('feedback');
  }

  function nextRound() {
    setUserInput('');
    if (roundIdx + 1 >= wortgruppen.length) {
      // Level done
      const correctCount = [...results].filter(Boolean).length;
      if (correctCount >= wortgruppen.length * 0.6 && currentLevel + 1 < levels.length) {
        setPhase('levelDone');
      } else {
        setPhase('complete');
      }
    } else {
      setRoundIdx(roundIdx + 1);
      setTimeout(flash, 500);
    }
  }

  function nextLevel() {
    setCurrentLevel(c => c + 1);
    setRoundIdx(0);
    setResults([]);
    setUserInput('');
    setTimeout(flash, 500);
  }

  function startTraining() {
    setPhase('flash');
    flash();
  }

  const correctCount = results.filter(Boolean).length;

  return (
    <div className="card" style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>👁️</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Sehspannen-Trainer</span>
      </div>

      {/* Level indicator */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {levels.map((l, i) => (
          <div key={i} style={{
            padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
            background: i === currentLevel ? '#f59e0b' : i < currentLevel ? 'rgba(34,197,94,0.1)' : 'var(--ki-bg-alt)',
            color: i === currentLevel ? 'white' : i < currentLevel ? '#16a34a' : 'var(--ki-text-tertiary)',
          }}>
            {i < currentLevel ? '✓' : ''} {l.name}
          </div>
        ))}
      </div>

      {/* INTRO */}
      {phase === 'intro' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 16, lineHeight: 1.7 }}>
            {config?.beschreibung || 'Fixiere den Mittelpunkt. Wörter werden kurz eingeblendet. Tippe ein was du gesehen hast.'}
          </p>
          <div style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', marginBottom: 16 }}>
            {level.name}: {level.breite} Wörter gleichzeitig erfassen | {level.zeit_ms}ms Einblendung
          </div>
          <button onClick={startTraining} className="btn btn-primary">
            Training starten
          </button>
        </div>
      )}

      {/* FLASH */}
      {phase === 'flash' && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginBottom: 20 }}>
            Fixiere den Mittelpunkt — Runde {roundIdx + 1}/{wortgruppen.length}
          </div>
          <div style={{
            fontSize: showWords ? 24 : 36,
            fontWeight: 700,
            color: showWords ? '#f59e0b' : 'var(--ki-text-tertiary)',
            minHeight: 60,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}>
            {showWords ? chunk : '•'}
          </div>
        </div>
      )}

      {/* ANSWER */}
      {phase === 'answer' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>
            Was hast du gesehen? Tippe es ein:
          </div>
          <input
            className="input"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && userInput.trim() && checkAnswer()}
            placeholder="Wörter eingeben..."
            autoFocus
            style={{ textAlign: 'center', fontSize: 16, marginBottom: 12 }}
          />
          <button
            onClick={checkAnswer}
            className="btn btn-primary"
            disabled={!userInput.trim()}
            style={{ opacity: userInput.trim() ? 1 : 0.5 }}
          >
            Prüfen
          </button>
        </div>
      )}

      {/* FEEDBACK */}
      {phase === 'feedback' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{
            fontSize: 14, fontWeight: 600, marginBottom: 8,
            color: results[results.length - 1] ? '#16a34a' : '#dc2626',
          }}>
            {results[results.length - 1] ? '✓ Richtig!' : '✗ Nicht ganz.'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
            Richtige Antwort: <strong>{chunk}</strong>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginBottom: 12 }}>
            Score: {correctCount}/{results.length}
          </div>
          <button onClick={nextRound} className="btn btn-primary">
            {roundIdx + 1 >= wortgruppen.length ? 'Ergebnis anzeigen' : 'Nächste Runde'}
          </button>
        </div>
      )}

      {/* LEVEL DONE */}
      {phase === 'levelDone' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#16a34a', marginBottom: 8 }}>
            {level.name} gemeistert!
          </div>
          <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
            {correctCount}/{results.length} richtig — Bereit für das nächste Level!
          </div>
          <button onClick={nextLevel} className="btn btn-primary">
            Nächstes Level starten →
          </button>
        </div>
      )}

      {/* COMPLETE */}
      {phase === 'complete' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>👁️</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            Training abgeschlossen!
          </div>
          <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
            Level {currentLevel + 1}/{levels.length} | {correctCount}/{results.length} richtig
          </div>
          <button onClick={onComplete} className="btn btn-primary">
            ✅ Als erledigt markieren (+30 XP)
          </button>
        </div>
      )}
    </div>
  );
}

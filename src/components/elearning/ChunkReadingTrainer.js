'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

export default function ChunkReadingTrainer({ config, onComplete }) {
  const stufen = config?.stufen || [
    { name: 'Langsam', wpm: 250, chunk_size: 2 },
    { name: 'Mittel', wpm: 350, chunk_size: 3 },
    { name: 'Schnell', wpm: 450, chunk_size: 3 },
    { name: 'Turbo', wpm: 600, chunk_size: 4 },
  ];
  const text = config?.text || '';

  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  const [currentStufe, setCurrentStufe] = useState(0);
  const [chunkIdx, setChunkIdx] = useState(-1); // -1 = not started
  const [phase, setPhase] = useState('intro'); // intro | running | stufe_done | complete
  const timerRef = useRef(null);

  const stufe = stufen[currentStufe];
  const chunkSize = stufe?.chunk_size || 2;

  // Build chunks
  const chunks = useMemo(() => {
    const result = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      result.push(words.slice(i, i + chunkSize).join(' '));
    }
    return result;
  }, [words, chunkSize]);

  // Auto-advance chunks based on WPM
  useEffect(() => {
    if (phase === 'running' && chunkIdx >= 0) {
      const wordsPerChunk = chunkSize;
      const msPerChunk = (wordsPerChunk / stufe.wpm) * 60 * 1000;

      timerRef.current = setTimeout(() => {
        if (chunkIdx + 1 >= chunks.length) {
          setPhase('stufe_done');
        } else {
          setChunkIdx(c => c + 1);
        }
      }, msPerChunk);

      return () => clearTimeout(timerRef.current);
    }
    return () => {};
  }, [phase, chunkIdx, chunkSize, stufe, chunks.length]);

  function startStufe() {
    setChunkIdx(0);
    setPhase('running');
  }

  function nextStufe() {
    if (currentStufe + 1 >= stufen.length) {
      setPhase('complete');
    } else {
      setCurrentStufe(c => c + 1);
      setChunkIdx(-1);
      setPhase('intro');
    }
  }

  const progressPct = chunks.length > 0 ? Math.round(((chunkIdx + 1) / chunks.length) * 100) : 0;

  return (
    <div className="card" style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>📖</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Chunk-Reading Trainer</span>
      </div>

      {/* Stufen indicator */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {stufen.map((s, i) => (
          <div key={i} style={{
            padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
            background: i === currentStufe ? '#f59e0b' : i < currentStufe ? 'rgba(34,197,94,0.1)' : 'var(--ki-bg-alt)',
            color: i === currentStufe ? 'white' : i < currentStufe ? '#16a34a' : 'var(--ki-text-tertiary)',
          }}>
            {i < currentStufe ? '✓ ' : ''}{s.name} ({s.wpm} WPM)
          </div>
        ))}
      </div>

      {/* INTRO */}
      {phase === 'intro' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#f59e0b' }}>
            {stufe.name}: {stufe.wpm} WPM
          </div>
          <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 16, lineHeight: 1.7 }}>
            Der Text wird in <strong>{chunkSize}-Wort-Gruppen</strong> angezeigt.
            Lies nur den hervorgehobenen Chunk — nicht zurückspringen!
          </p>
          <button onClick={startStufe} className="btn btn-primary">
            Stufe starten
          </button>
        </div>
      )}

      {/* RUNNING */}
      {phase === 'running' && chunkIdx >= 0 && (
        <div>
          {/* Progress bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ki-text-tertiary)', marginBottom: 4 }}>
              <span>{stufe.name} — {stufe.wpm} WPM</span>
              <span>{progressPct}%</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: 'var(--ki-bg-alt)' }}>
              <div style={{ height: '100%', borderRadius: 2, background: '#f59e0b', width: `${progressPct}%`, transition: 'width 0.3s' }} />
            </div>
          </div>

          {/* Text with highlighted chunk */}
          <div style={{
            fontSize: 18, lineHeight: 2.2, padding: '16px', borderRadius: 'var(--r-md)',
            background: 'var(--ki-bg-alt)', minHeight: 200,
          }}>
            {chunks.map((c, i) => (
              <span key={i} style={{
                display: 'inline',
                color: i === chunkIdx ? '#f59e0b' : i < chunkIdx ? 'var(--ki-text-tertiary)' : 'transparent',
                fontWeight: i === chunkIdx ? 700 : 400,
                fontSize: i === chunkIdx ? 20 : 18,
                transition: 'all 0.2s',
                textShadow: i > chunkIdx ? '0 0 8px var(--ki-text-tertiary)' : 'none',
              }}>
                {c}{' '}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* STUFE DONE */}
      {phase === 'stufe_done' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            {stufe.name} ({stufe.wpm} WPM) geschafft!
          </div>
          <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
            {currentStufe + 1 < stufen.length
              ? `Bereit für ${stufen[currentStufe + 1].name} mit ${stufen[currentStufe + 1].wpm} WPM?`
              : 'Alle Stufen gemeistert!'}
          </p>
          <button onClick={nextStufe} className="btn btn-primary">
            {currentStufe + 1 < stufen.length ? 'Nächste Stufe →' : 'Training abschließen'}
          </button>
        </div>
      )}

      {/* COMPLETE */}
      {phase === 'complete' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            Chunk-Reading Training abgeschlossen!
          </div>
          <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
            Du hast alle {stufen.length} Geschwindigkeitsstufen durchlaufen.
          </div>
          <button onClick={onComplete} className="btn btn-primary">
            ✅ Als erledigt markieren (+30 XP)
          </button>
        </div>
      )}
    </div>
  );
}

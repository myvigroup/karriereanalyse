'use client';

import { useState, useCallback, useEffect } from 'react';

const EARS = [
  { id: 'sachinhalt', label: 'Sachinhalt', icon: '\u{1F4CB}', color: '#3B82F6' },
  { id: 'selbstoffenbarung', label: 'Selbstoffenbarung', icon: '\u{1F4AD}', color: '#10B981' },
  { id: 'beziehung', label: 'Beziehung', icon: '\u{1F91D}', color: '#F59E0B' },
  { id: 'appell', label: 'Appell', icon: '\u{1F4E2}', color: '#EF4444' },
];

export default function VierOhrenDragDrop({ config, onComplete }) {
  const { saetze = [] } = config || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placements, setPlacements] = useState({});
  const [evaluated, setEvaluated] = useState(false);
  const [scores, setScores] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverEar, setDragOverEar] = useState(null);
  const [mobileTap, setMobileTap] = useState(null);
  const [hasDragSupport, setHasDragSupport] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const isTouchOnly = 'ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches;
    setHasDragSupport(!isTouchOnly);
  }, []);

  const current = saetze[currentIndex];
  if (!current && !finished) return null;

  const interpretations = current ? [
    { id: 'sachinhalt', text: current.interpretationen.sachinhalt },
    { id: 'selbstoffenbarung', text: current.interpretationen.selbstoffenbarung },
    { id: 'beziehung', text: current.interpretationen.beziehung },
    { id: 'appell', text: current.interpretationen.appell },
  ] : [];

  // Shuffle interpretations on first render per sentence (deterministic by index)
  const shuffled = [...interpretations].sort((a, b) => {
    const ha = hashStr(a.text + currentIndex);
    const hb = hashStr(b.text + currentIndex);
    return ha - hb;
  });

  function hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return h;
  }

  const unplaced = shuffled.filter((i) => !Object.values(placements).includes(i.id));
  const allPlaced = Object.keys(placements).length === 4;

  const onDragStart = useCallback((e, interpId) => {
    setDraggedId(interpId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', interpId);
  }, []);

  const onDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverEar(null);
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDragEnter = useCallback((e, earId) => {
    e.preventDefault();
    setDragOverEar(earId);
  }, []);

  const onDragLeave = useCallback((e, earId) => {
    e.preventDefault();
    if (dragOverEar === earId) setDragOverEar(null);
  }, [dragOverEar]);

  const onDrop = useCallback((e, earId) => {
    e.preventDefault();
    const interpId = e.dataTransfer.getData('text/plain') || draggedId;
    if (interpId) {
      setPlacements((prev) => {
        const next = { ...prev };
        // Remove interpId from any previous ear
        Object.keys(next).forEach((k) => { if (next[k] === interpId) delete next[k]; });
        next[earId] = interpId;
        return next;
      });
    }
    setDraggedId(null);
    setDragOverEar(null);
  }, [draggedId]);

  const handleMobileTap = (interpId) => {
    if (evaluated) return;
    setMobileTap(mobileTap === interpId ? null : interpId);
  };

  const handleMobilePlace = (earId) => {
    if (!mobileTap) return;
    setPlacements((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => { if (next[k] === mobileTap) delete next[k]; });
      next[earId] = mobileTap;
      return next;
    });
    setMobileTap(null);
  };

  const handleRemove = (earId) => {
    if (evaluated) return;
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[earId];
      return next;
    });
  };

  const handleEvaluate = () => {
    setEvaluated(true);
    let correct = 0;
    EARS.forEach((ear) => {
      if (placements[ear.id] === ear.id) correct++;
    });
    setScores((prev) => [...prev, correct]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < saetze.length) {
      setCurrentIndex(currentIndex + 1);
      setPlacements({});
      setEvaluated(false);
      setMobileTap(null);
    } else {
      setFinished(true);
    }
  };

  const getPlacedInterp = (earId) => {
    const interpId = placements[earId];
    if (!interpId) return null;
    return interpretations.find((i) => i.id === interpId);
  };

  const isCorrect = (earId) => placements[earId] === earId;

  const totalCorrect = scores.reduce((a, b) => a + b, 0);
  const totalPossible = saetze.length * 4;

  if (finished) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>4-Ohren-Modell - Ergebnis</h2>
        <div className="card" style={styles.resultCard}>
          <div style={styles.resultScore}>{totalCorrect}/{totalPossible}</div>
          <p style={styles.resultText}>richtige Zuordnungen</p>
          <div style={styles.progressBarOuter}>
            <div style={{ ...styles.progressBarInner, width: `${(totalCorrect / Math.max(totalPossible, 1)) * 100}%` }} />
          </div>
          {scores.map((s, i) => (
            <p key={i} style={styles.sentenceScore}>
              Satz {i + 1}: {s}/4 {s === 4 ? '\u2713' : ''}
            </p>
          ))}
        </div>
        <div style={styles.actions}>
          <button className="btn btn-primary" onClick={() => onComplete?.({ score: totalCorrect, total: totalPossible })} style={styles.completeBtn}>
            Weiter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>4-Ohren-Modell</h2>
      <p style={styles.subtext}>
        Ordne jede Interpretation dem richtigen &quot;Ohr&quot; zu.
      </p>

      <div style={styles.progressBarOuter}>
        <div style={{ ...styles.progressBarInner, width: `${(currentIndex / Math.max(saetze.length, 1)) * 100}%` }} />
      </div>
      <p style={styles.progressText}>Satz {currentIndex + 1} von {saetze.length}</p>

      {/* Current sentence */}
      <div className="card" style={styles.sentenceCard}>
        <p style={styles.sentenceLabel}>Jemand sagt:</p>
        <p style={styles.sentenceText}>&ldquo;{current.satz}&rdquo;</p>
      </div>

      {/* Draggable interpretation cards */}
      {!evaluated && unplaced.length > 0 && (
        <div style={styles.interpList}>
          <h3 style={styles.sectionLabel}>Interpretationen zuordnen:</h3>
          {unplaced.map((interp) => (
            <div
              key={interp.id}
              draggable={hasDragSupport}
              onDragStart={(e) => onDragStart(e, interp.id)}
              onDragEnd={onDragEnd}
              onClick={() => !hasDragSupport && handleMobileTap(interp.id)}
              className="card"
              style={{
                ...styles.interpCard,
                opacity: draggedId === interp.id ? 0.4 : 1,
                borderColor: mobileTap === interp.id ? 'var(--ki-red, #CC1426)' : '#e5e7eb',
                cursor: 'grab',
              }}
            >
              {interp.text}
            </div>
          ))}
        </div>
      )}

      {/* Ear drop zones */}
      <div style={styles.earGrid}>
        {EARS.map((ear) => {
          const placed = getPlacedInterp(ear.id);
          const isOver = dragOverEar === ear.id;
          const correct = evaluated ? isCorrect(ear.id) : null;
          return (
            <div
              key={ear.id}
              onDragEnter={(e) => onDragEnter(e, ear.id)}
              onDragLeave={(e) => onDragLeave(e, ear.id)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, ear.id)}
              onClick={() => !hasDragSupport && mobileTap && handleMobilePlace(ear.id)}
              style={{
                ...styles.earZone,
                borderColor: evaluated
                  ? correct ? '#10B981' : '#EF4444'
                  : isOver ? 'var(--ki-red, #CC1426)' : ear.color,
                background: evaluated
                  ? correct ? '#f0fdf4' : '#fef2f2'
                  : isOver ? `${ear.color}15` : `${ear.color}08`,
              }}
            >
              <div style={{ ...styles.earHeader, color: ear.color }}>
                <span style={styles.earIcon}>{ear.icon}</span>
                <span style={styles.earLabel}>{ear.label}</span>
              </div>
              {placed ? (
                <div
                  style={{
                    ...styles.placedInterp,
                    borderColor: evaluated ? (correct ? '#10B981' : '#EF4444') : '#ddd',
                  }}
                  onClick={(e) => { e.stopPropagation(); handleRemove(ear.id); }}
                >
                  <span style={styles.placedText}>{placed.text}</span>
                  {evaluated && correct && <span style={styles.checkMark}>{'\u2713'}</span>}
                  {evaluated && !correct && <span style={styles.wrongMark}>{'\u2717'}</span>}
                </div>
              ) : (
                <p style={styles.dropHint}>
                  {hasDragSupport ? 'Hierher ziehen' : 'Tippe eine Karte, dann hier'}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        {!evaluated && allPlaced && (
          <button className="btn btn-primary" onClick={handleEvaluate}>
            Auswerten
          </button>
        )}
        {evaluated && (
          <button className="btn btn-primary" onClick={handleNext}>
            {currentIndex + 1 < saetze.length ? 'Nächster Satz' : 'Ergebnis anzeigen'}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Instrument Sans, sans-serif',
    maxWidth: 700,
    margin: '0 auto',
    padding: '1rem',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '0.25rem',
    color: 'var(--ki-text, #1a1a1a)',
  },
  subtext: {
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#888',
    marginBottom: '1rem',
  },
  progressBarOuter: {
    height: 4,
    background: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    background: 'var(--ki-red, #CC1426)',
    borderRadius: 2,
    transition: 'width 0.4s ease',
  },
  progressText: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 16,
    textAlign: 'center',
  },
  sentenceCard: {
    padding: 20,
    textAlign: 'center',
    borderLeft: '4px solid var(--ki-red, #CC1426)',
    marginBottom: 20,
  },
  sentenceLabel: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 8px',
  },
  sentenceText: {
    fontSize: 20,
    fontWeight: 600,
    color: 'var(--ki-text, #1a1a1a)',
    lineHeight: 1.5,
    margin: 0,
    fontStyle: 'italic',
  },
  sectionLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--ki-text, #555)',
    marginBottom: '0.75rem',
  },
  interpList: {
    marginBottom: 20,
  },
  interpCard: {
    padding: '0.7rem 1rem',
    marginBottom: '0.5rem',
    border: '2px solid #e5e7eb',
    fontSize: '0.9rem',
    color: 'var(--ki-text, #333)',
    userSelect: 'none',
    transition: 'all 0.15s ease',
  },
  earGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '0.75rem',
    marginBottom: 20,
  },
  earZone: {
    border: '2px dashed',
    borderRadius: 12,
    padding: '0.75rem',
    minHeight: 100,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  earHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  earIcon: {
    fontSize: '1.2rem',
  },
  earLabel: {
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  placedInterp: {
    padding: '0.5rem 0.7rem',
    borderRadius: 6,
    border: '1.5px solid #ddd',
    fontSize: '0.82rem',
    background: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  placedText: {
    flex: 1,
    color: 'var(--ki-text, #333)',
  },
  checkMark: { color: '#10B981', fontWeight: 700, fontSize: '1rem' },
  wrongMark: { color: '#EF4444', fontWeight: 700, fontSize: '1rem' },
  dropHint: {
    fontSize: '0.78rem',
    color: '#bbb',
    fontStyle: 'italic',
    margin: 0,
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem',
  },
  resultCard: {
    textAlign: 'center',
    padding: 24,
    marginBottom: 20,
    borderLeft: '4px solid var(--ki-red, #CC1426)',
  },
  resultScore: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: 'var(--ki-red, #CC1426)',
  },
  resultText: {
    fontSize: '1rem',
    color: '#888',
    marginBottom: 12,
  },
  sentenceScore: {
    fontSize: '0.85rem',
    color: 'var(--ki-text, #555)',
    margin: '4px 0',
  },
  completeBtn: {
    fontSize: 18,
    padding: '14px 40px',
  },
};

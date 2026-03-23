'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

const QUADRANT_COLORS = {
  sofort: '#EF4444',
  planen: '#10B981',
  delegieren: '#F59E0B',
  eliminieren: '#6B7280',
};

const QUADRANT_DEFAULT = [
  { id: 'sofort', label: 'Sofort erledigen', color: '#EF4444' },
  { id: 'planen', label: 'Planen', color: '#10B981' },
  { id: 'delegieren', label: 'Delegieren', color: '#F59E0B' },
  { id: 'eliminieren', label: 'Eliminieren', color: '#6B7280' },
];

export default function DragDropSortierung({ config, onComplete }) {
  const { aufgaben = [], quadranten } = config || {};
  const quads = quadranten || QUADRANT_DEFAULT;

  const [placements, setPlacements] = useState({});
  const [evaluated, setEvaluated] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverQuad, setDragOverQuad] = useState(null);
  const [hasDragSupport, setHasDragSupport] = useState(true);
  const [mobileTask, setMobileTask] = useState(null);
  const dragCounter = useRef({});

  useEffect(() => {
    // Check for drag support (touch-only devices)
    const isTouchOnly = 'ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches;
    setHasDragSupport(!isTouchOnly);
  }, []);

  const unplaced = aufgaben.filter((t) => !placements[t.id]);
  const allPlaced = unplaced.length === 0 && aufgaben.length > 0;

  const getQuadTasks = (quadId) =>
    aufgaben.filter((t) => placements[t.id] === quadId);

  const correctCount = aufgaben.filter(
    (t) => placements[t.id] === (t.correct || t.quadrant || t.korrekt)
  ).length;

  const isCorrect = (task) =>
    placements[task.id] === (task.correct || task.quadrant || task.korrekt);

  // --- Drag Handlers ---
  const onDragStart = useCallback((e, taskId) => {
    setDraggedId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  }, []);

  const onDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverQuad(null);
    dragCounter.current = {};
  }, []);

  const onDragEnter = useCallback((e, quadId) => {
    e.preventDefault();
    dragCounter.current[quadId] = (dragCounter.current[quadId] || 0) + 1;
    setDragOverQuad(quadId);
  }, []);

  const onDragLeave = useCallback((e, quadId) => {
    e.preventDefault();
    dragCounter.current[quadId] = (dragCounter.current[quadId] || 0) - 1;
    if (dragCounter.current[quadId] <= 0) {
      dragCounter.current[quadId] = 0;
      if (dragOverQuad === quadId) setDragOverQuad(null);
    }
  }, [dragOverQuad]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e, quadId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedId;
    if (taskId) {
      setPlacements((prev) => ({ ...prev, [taskId]: quadId }));
    }
    setDraggedId(null);
    setDragOverQuad(null);
    dragCounter.current = {};
  }, [draggedId]);

  // --- Mobile Handlers ---
  const handleMobilePlace = useCallback((quadId) => {
    if (mobileTask) {
      setPlacements((prev) => ({ ...prev, [mobileTask]: quadId }));
      setMobileTask(null);
    }
  }, [mobileTask]);

  const handleEvaluate = useCallback(() => setEvaluated(true), []);

  const handleReset = useCallback(() => {
    setPlacements({});
    setEvaluated(false);
    setMobileTask(null);
  }, []);

  const handleRemove = useCallback((taskId) => {
    if (!evaluated) {
      setPlacements((prev) => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
    }
  }, [evaluated]);

  const passed = correctCount >= 8;

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes dropHighlight {
          0% { box-shadow: inset 0 0 0 2px transparent; }
          100% { box-shadow: inset 0 0 0 3px #CC1426; }
        }
      `}</style>

      <h2 style={styles.heading}>Eisenhower-Matrix</h2>
      <p style={styles.subtext}>Ordne jede Aufgabe dem richtigen Quadranten zu.</p>

      {/* Score display when evaluated */}
      {evaluated && (
        <div className="card" style={{
          ...styles.scoreCard,
          borderColor: passed ? '#10B981' : '#EF4444',
        }}>
          <span style={{ ...styles.scoreText, color: passed ? '#10B981' : '#EF4444' }}>
            {correctCount}/{aufgaben.length} richtig
          </span>
          {passed && <p style={styles.passText}>Gut gemacht! Du hast die Matrix gemeistert.</p>}
          {!passed && <p style={styles.failText}>Versuche es erneut – du brauchst mindestens 8 richtige.</p>}
        </div>
      )}

      <div style={styles.layout}>
        {/* Left: Unplaced tasks */}
        <div style={styles.taskList}>
          <h3 style={styles.sectionLabel}>Aufgaben ({unplaced.length})</h3>
          {unplaced.map((task) => {
            const isActive = mobileTask === task.id;
            return (
              <div key={task.id}>
                <div
                  draggable={hasDragSupport && !evaluated}
                  onDragStart={(e) => onDragStart(e, task.id)}
                  onDragEnd={onDragEnd}
                  onClick={() => !hasDragSupport && !evaluated && setMobileTask(isActive ? null : task.id)}
                  className="card"
                  style={{
                    ...styles.taskCard,
                    opacity: draggedId === task.id ? 0.4 : 1,
                    cursor: evaluated ? 'default' : 'grab',
                    borderColor: isActive ? '#CC1426' : 'var(--ki-bg, #e5e7eb)',
                  }}
                >
                  {task.text || task.label || task.aufgabe}
                </div>
                {/* Mobile: show quadrant buttons */}
                {!hasDragSupport && isActive && !evaluated && (
                  <div style={styles.mobileQuadBtns}>
                    {quads.map((q) => (
                      <button
                        key={q.id}
                        style={{ ...styles.mobileQuadBtn, background: q.color }}
                        onClick={() => handleMobilePlace(q.id)}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {unplaced.length === 0 && !evaluated && (
            <p style={styles.emptyText}>Alle Aufgaben zugeordnet!</p>
          )}
        </div>

        {/* Right: Quadrant grid */}
        <div style={styles.quadGrid}>
          {quads.map((q) => {
            const tasks = getQuadTasks(q.id);
            const isOver = dragOverQuad === q.id;
            return (
              <div
                key={q.id}
                onDragEnter={(e) => onDragEnter(e, q.id)}
                onDragLeave={(e) => onDragLeave(e, q.id)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, q.id)}
                style={{
                  ...styles.quadrant,
                  borderColor: isOver ? '#CC1426' : (q.color || QUADRANT_COLORS[q.id] || '#e5e7eb'),
                  background: isOver
                    ? 'rgba(204,20,38,0.05)'
                    : `${q.color || QUADRANT_COLORS[q.id] || '#e5e7eb'}08`,
                }}
              >
                <div style={{
                  ...styles.quadLabel,
                  color: q.color || QUADRANT_COLORS[q.id],
                }}>
                  {q.label}
                </div>
                <div style={styles.quadTasks}>
                  {tasks.map((t) => {
                    const correct = isCorrect(t);
                    const correctQuad = t.correct || t.quadrant || t.korrekt;
                    const correctLabel = quads.find((qd) => qd.id === correctQuad)?.label;
                    return (
                      <div
                        key={t.id}
                        style={{
                          ...styles.placedTask,
                          borderColor: evaluated
                            ? correct ? '#10B981' : '#EF4444'
                            : 'var(--ki-bg, #ddd)',
                          background: evaluated
                            ? correct ? '#f0fdf4' : '#fef2f2'
                            : '#fff',
                        }}
                        onClick={() => handleRemove(t.id)}
                        title={evaluated ? undefined : 'Klicken zum Entfernen'}
                      >
                        <span style={styles.placedText}>
                          {t.text || t.label || t.aufgabe}
                        </span>
                        {evaluated && !correct && (
                          <span style={styles.correctHint}>→ {correctLabel}</span>
                        )}
                        {evaluated && correct && <span style={styles.checkMark}>✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        {!evaluated && allPlaced && (
          <button className="btn btn-primary" onClick={handleEvaluate}>
            Auswerten
          </button>
        )}
        {evaluated && (
          <>
            <button className="btn btn-secondary" onClick={handleReset}>
              Nochmal versuchen
            </button>
            {passed && (
              <button className="btn btn-primary" onClick={onComplete}>
                Weiter
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Instrument Sans, sans-serif',
    maxWidth: 900,
    margin: '0 auto',
    padding: '1rem',
  },
  heading: {
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: '1.5rem',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '0.25rem',
    color: 'var(--ki-text, #1a1a1a)',
  },
  subtext: {
    textAlign: 'center',
    fontSize: '0.9rem',
    color: 'var(--ki-text, #666)',
    marginBottom: '1.5rem',
  },
  scoreCard: {
    textAlign: 'center',
    padding: '1rem',
    borderRadius: 10,
    border: '2px solid',
    marginBottom: '1.5rem',
  },
  scoreText: { fontSize: '1.3rem', fontWeight: 700 },
  passText: { color: '#10B981', fontSize: '0.9rem', margin: '0.5rem 0 0' },
  failText: { color: '#EF4444', fontSize: '0.9rem', margin: '0.5rem 0 0' },
  layout: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  taskList: {
    flex: '1 1 220px',
    minWidth: 200,
  },
  sectionLabel: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--ki-text, #333)',
    marginBottom: '0.75rem',
  },
  taskCard: {
    padding: '0.75rem 1rem',
    borderRadius: 8,
    border: '2px solid var(--ki-bg, #e5e7eb)',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    color: 'var(--ki-text, #333)',
    background: '#fff',
    transition: 'all 0.15s ease',
    userSelect: 'none',
  },
  emptyText: {
    fontSize: '0.85rem',
    color: 'var(--ki-text, #999)',
    fontStyle: 'italic',
    padding: '1rem 0',
  },
  mobileQuadBtns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.4rem',
    marginBottom: '0.75rem',
    paddingLeft: '0.5rem',
  },
  mobileQuadBtn: {
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '0.5rem 0.25rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Instrument Sans, sans-serif',
  },
  quadGrid: {
    flex: '2 1 400px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  quadrant: {
    border: '2px dashed',
    borderRadius: 12,
    padding: '0.75rem',
    minHeight: 140,
    transition: 'all 0.2s ease',
  },
  quadLabel: {
    fontSize: '0.85rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  quadTasks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  placedTask: {
    padding: '0.5rem 0.75rem',
    borderRadius: 6,
    border: '1.5px solid',
    fontSize: '0.82rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  placedText: { flex: 1, color: 'var(--ki-text, #333)' },
  correctHint: { fontSize: '0.72rem', color: '#EF4444', fontWeight: 600, whiteSpace: 'nowrap' },
  checkMark: { color: '#10B981', fontWeight: 700, fontSize: '1rem' },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
  },
};

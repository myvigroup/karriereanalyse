'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const TOTAL_SECONDS = 60;

export default function BrainDumpTimer({ onComplete }) {
  const [phase, setPhase] = useState('intro'); // intro | writing | timesup | categorize | summary
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState({ sofort: [], planen: [], loslassen: [] });
  const [flash, setFlash] = useState(false);
  const timerRef = useRef(null);
  const textareaRef = useRef(null);

  const startTimer = useCallback(() => {
    setPhase('writing');
    setSecondsLeft(TOTAL_SECONDS);
    setTimeout(() => textareaRef.current?.focus(), 100);
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setPhase('timesup');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Flash effect at 10, 5, 0 seconds
  useEffect(() => {
    if ([10, 5, 0].includes(secondsLeft) && phase === 'writing') {
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
    }
  }, [secondsLeft, phase]);

  const handleStartCategorize = () => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    setItems(lines.map((line, i) => ({ id: i, text: line, category: null })));
    setPhase('categorize');
  };

  const categorizeItem = (itemId, category) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, category } : item
    ));
    setCategories(prev => {
      const item = items.find(i => i.id === itemId);
      if (!item) return prev;
      // Remove from all categories first
      const cleaned = {
        sofort: prev.sofort.filter(i => i.id !== itemId),
        planen: prev.planen.filter(i => i.id !== itemId),
        loslassen: prev.loslassen.filter(i => i.id !== itemId),
      };
      cleaned[category] = [...cleaned[category], item];
      return cleaned;
    });
  };

  const allCategorized = items.length > 0 && items.every(i => i.category !== null);

  const handleFinish = () => {
    setPhase('summary');
  };

  const progress = secondsLeft / TOTAL_SECONDS;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference * (1 - progress);

  const categoryLabels = {
    sofort: { label: 'Sofort tun', color: 'var(--ki-red)', emoji: '' },
    planen: { label: 'Planen', color: 'var(--ki-warning)', emoji: '' },
    loslassen: { label: 'Loslassen', color: 'var(--ki-success)', emoji: '' },
  };

  // --- Intro ---
  if (phase === 'intro') {
    return (
      <div style={styles.container}>
        <div className="card" style={styles.introCard}>
          <h2 style={styles.title}>Brain Dump Challenge</h2>
          <p style={styles.introText}>
            Du hast <strong>60 Sekunden</strong>. Schreibe ALLES auf was in deinem Kopf ist.
          </p>
          <p style={styles.subtitle}>Aufgaben, Sorgen, Ideen, Erinnerungen &mdash; alles raus!</p>
          <button className="btn btn-primary" onClick={startTimer} style={styles.startBtn}>
            Start
          </button>
        </div>
      </div>
    );
  }

  // --- Writing phase ---
  if (phase === 'writing' || phase === 'timesup') {
    return (
      <div style={{
        ...styles.container,
        ...(flash ? styles.flash : {}),
      }}>
        <div style={styles.timerSection}>
          <svg width="128" height="128" viewBox="0 0 120 120" style={styles.timerSvg}>
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e0e0e0" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke={secondsLeft <= 10 ? 'var(--ki-red)' : '#CC1426'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1s linear', transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
            />
            <text x="60" y="66" textAnchor="middle" style={{
              fontSize: secondsLeft <= 10 ? '32px' : '28px',
              fontWeight: 700,
              fill: secondsLeft <= 10 ? 'var(--ki-red)' : 'var(--ki-text)',
              fontFamily: 'Instrument Sans, sans-serif',
            }}>
              {secondsLeft}
            </text>
          </svg>
        </div>

        {phase === 'timesup' && (
          <div style={styles.timesUpBanner}>Zeit ist um!</div>
        )}

        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={phase === 'timesup'}
          placeholder="Schreibe alles auf, was dir einfällt... eine Sache pro Zeile"
          style={{
            ...styles.textarea,
            ...(phase === 'timesup' ? styles.textareaDisabled : {}),
          }}
        />

        {phase === 'timesup' && text.trim().length > 0 && (
          <button className="btn btn-primary" onClick={handleStartCategorize} style={{ marginTop: 16 }}>
            Jetzt kategorisieren
          </button>
        )}
      </div>
    );
  }

  // --- Categorize phase ---
  if (phase === 'categorize') {
    const uncategorized = items.filter(i => i.category === null);
    const categorized = items.filter(i => i.category !== null);

    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Kategorisieren</h2>
        <p style={styles.subtitle}>Ordne jedes Element einer Kategorie zu:</p>

        <div style={styles.categoryLegend}>
          {Object.entries(categoryLabels).map(([key, val]) => (
            <span key={key} className="pill" style={{ ...styles.pill, borderColor: val.color, color: val.color }}>
              {val.label}
            </span>
          ))}
        </div>

        <div style={styles.itemsList}>
          {uncategorized.map(item => (
            <div key={item.id} className="card" style={styles.itemCard}>
              <p style={styles.itemText}>{item.text}</p>
              <div style={styles.catButtons}>
                {Object.entries(categoryLabels).map(([key, val]) => (
                  <button
                    key={key}
                    className="btn btn-secondary"
                    style={{ ...styles.catBtn, borderColor: val.color, color: val.color }}
                    onClick={() => categorizeItem(item.id, key)}
                  >
                    {val.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {categorized.length > 0 && (
          <div style={styles.categorizedSection}>
            {Object.entries(categoryLabels).map(([key, val]) => {
              const catItems = items.filter(i => i.category === key);
              if (catItems.length === 0) return null;
              return (
                <div key={key} style={{ marginBottom: 16 }}>
                  <h3 style={{ ...styles.catHeader, color: val.color }}>{val.label}</h3>
                  {catItems.map(item => (
                    <div key={item.id} style={{ ...styles.catItem, borderLeftColor: val.color }}>
                      {item.text}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {allCategorized && (
          <button className="btn btn-primary" onClick={handleFinish} style={{ marginTop: 24 }}>
            Zusammenfassung anzeigen
          </button>
        )}
      </div>
    );
  }

  // --- Summary ---
  if (phase === 'summary') {
    return (
      <div style={styles.container}>
        <div className="card" style={styles.summaryCard}>
          <h2 style={styles.title}>Dein Brain Dump Ergebnis</h2>

          {Object.entries(categoryLabels).map(([key, val]) => {
            const catItems = items.filter(i => i.category === key);
            return (
              <div key={key} style={styles.summaryGroup}>
                <h3 style={{ ...styles.catHeader, color: val.color }}>
                  {val.label} ({catItems.length})
                </h3>
                {catItems.length === 0 ? (
                  <p style={styles.emptyNote}>Keine Einträge</p>
                ) : (
                  <ul style={styles.summaryList}>
                    {catItems.map(item => (
                      <li key={item.id} style={styles.summaryItem}>{item.text}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}

          <div style={styles.insightBox}>
            <strong>Erkenntnis:</strong> Du hattest {items.length} Dinge im Kopf.
            {items.filter(i => i.category === 'loslassen').length > 0 &&
              ` ${items.filter(i => i.category === 'loslassen').length} davon kannst du loslassen.`}
            {items.filter(i => i.category === 'sofort').length > 0 &&
              ` ${items.filter(i => i.category === 'sofort').length} erfordern sofortiges Handeln.`}
          </div>

          <button className="btn btn-primary" onClick={() => onComplete?.({
            totalItems: items.length,
            categories: {
              sofort: items.filter(i => i.category === 'sofort').length,
              planen: items.filter(i => i.category === 'planen').length,
              loslassen: items.filter(i => i.category === 'loslassen').length,
            },
          })} style={{ marginTop: 24 }}>
            Weiter
          </button>
        </div>
      </div>
    );
  }

  return null;
}

const styles = {
  container: {
    fontFamily: 'Instrument Sans, sans-serif',
    maxWidth: 640,
    margin: '0 auto',
    padding: 16,
    transition: 'background 0.3s',
  },
  flash: {
    background: 'rgba(204, 20, 38, 0.08)',
    borderRadius: 16,
  },
  introCard: {
    textAlign: 'center',
    padding: 32,
  },
  title: {
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--ki-text)',
    marginBottom: 12,
  },
  introText: {
    fontSize: 18,
    color: 'var(--ki-text)',
    lineHeight: 1.6,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  startBtn: {
    fontSize: 20,
    padding: '14px 48px',
  },
  timerSection: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 16,
  },
  timerSvg: {
    display: 'block',
  },
  timesUpBanner: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--ki-red)',
    marginBottom: 12,
    padding: 8,
    background: 'rgba(204, 20, 38, 0.08)',
    borderRadius: 8,
  },
  textarea: {
    width: '100%',
    minHeight: 200,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Instrument Sans, sans-serif',
    border: '2px solid #e0e0e0',
    borderRadius: 12,
    resize: 'vertical',
    outline: 'none',
    lineHeight: 1.6,
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  textareaDisabled: {
    background: '#f5f5f5',
    color: '#999',
    borderColor: '#ddd',
  },
  categoryLegend: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'center',
  },
  pill: {
    border: '2px solid',
    background: 'transparent',
    fontWeight: 600,
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  itemCard: {
    padding: 16,
  },
  itemText: {
    fontSize: 16,
    color: 'var(--ki-text)',
    marginBottom: 12,
    lineHeight: 1.5,
  },
  catButtons: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  catBtn: {
    fontSize: 13,
    padding: '6px 14px',
    border: '2px solid',
    background: 'transparent',
    borderRadius: 8,
    fontWeight: 600,
    cursor: 'pointer',
  },
  categorizedSection: {
    marginTop: 24,
  },
  catHeader: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 8,
    fontFamily: 'Instrument Sans, sans-serif',
  },
  catItem: {
    padding: '8px 12px',
    borderLeft: '3px solid',
    marginBottom: 4,
    fontSize: 14,
    color: 'var(--ki-text)',
    background: 'rgba(0,0,0,0.02)',
    borderRadius: '0 6px 6px 0',
  },
  summaryCard: {
    padding: 24,
  },
  summaryGroup: {
    marginBottom: 20,
  },
  emptyNote: {
    fontSize: 14,
    color: '#aaa',
    fontStyle: 'italic',
  },
  summaryList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  summaryItem: {
    padding: '6px 0',
    borderBottom: '1px solid #f0f0f0',
    fontSize: 15,
    color: 'var(--ki-text)',
  },
  insightBox: {
    padding: 16,
    background: 'rgba(204, 20, 38, 0.05)',
    borderRadius: 12,
    fontSize: 15,
    color: 'var(--ki-text)',
    lineHeight: 1.6,
    marginTop: 16,
  },
};

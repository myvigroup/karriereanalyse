'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export default function SzenarioPlayer({ config, onComplete }) {
  const { titel, beschreibung, events = [] } = config || {};

  const [screen, setScreen] = useState('intro');
  const [eventIndex, setEventIndex] = useState(0);
  const [totalImpact, setTotalImpact] = useState(0);
  const [maxPossible, setMaxPossible] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [history, setHistory] = useState([]);
  const timerRef = useRef(null);

  // Timer
  useEffect(() => {
    if (screen === 'event' || screen === 'feedback') {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentEvent = events[eventIndex] || {};
  const optionen = currentEvent.optionen || currentEvent.options || [];

  // Calculate max possible impact
  useEffect(() => {
    let mp = 0;
    events.forEach((ev) => {
      const opts = ev.optionen || ev.options || [];
      const best = Math.max(...opts.map((o) => o.impact || 0), 0);
      mp += best;
    });
    setMaxPossible(mp || events.length * 10);
  }, [events]);

  const handleStart = useCallback(() => {
    setScreen('event');
    setElapsed(0);
  }, []);

  const handleSelect = useCallback((option, idx) => {
    setSelectedOption(idx);
    setShowFeedback(true);
    const impact = option.impact || 0;
    setTotalImpact((prev) => prev + impact);
    setHistory((prev) => [...prev, {
      event: currentEvent.text || currentEvent.titel || `Event ${eventIndex + 1}`,
      option: option.text || option.label,
      impact,
      feedback: option.feedback || option.rueckmeldung || '',
    }]);
  }, [currentEvent, eventIndex]);

  const handleNext = useCallback(() => {
    setSelectedOption(null);
    setShowFeedback(false);
    if (eventIndex < events.length - 1) {
      setEventIndex((prev) => prev + 1);
      setScreen('event');
    } else {
      setScreen('result');
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [eventIndex, events.length]);

  const getAssessment = () => {
    const pct = maxPossible > 0 ? (totalImpact / maxPossible) * 100 : 0;
    if (pct >= 80) return { label: 'Exzellent', color: '#10B981', icon: '🌟' };
    if (pct >= 60) return { label: 'Gut', color: '#3B82F6', icon: '👍' };
    if (pct >= 40) return { label: 'Ausbaufähig', color: '#F59E0B', icon: '📈' };
    return { label: 'Fokusbereich', color: '#EF4444', icon: '🎯' };
  };

  const pct = maxPossible > 0 ? Math.round((totalImpact / maxPossible) * 100) : 0;

  // --- Intro ---
  if (screen === 'intro') {
    return (
      <div style={styles.container}>
        <div className="card" style={styles.introCard}>
          <div style={styles.introIcon}>🎬</div>
          <h2 style={styles.heading}>{titel || 'Szenario'}</h2>
          <p style={styles.introDesc}>{beschreibung || 'Triff die besten Entscheidungen in diesem interaktiven Szenario.'}</p>
          <div style={styles.infoRow}>
            <span className="pill" style={styles.infoPill}>{events.length} Situationen</span>
          </div>
          <button className="btn btn-primary" style={styles.startBtn} onClick={handleStart}>
            Szenario starten
          </button>
        </div>
      </div>
    );
  }

  // --- Result ---
  if (screen === 'result') {
    const assessment = getAssessment();
    return (
      <div style={styles.container}>
        <div className="card" style={{ ...styles.resultCard, borderTop: `4px solid ${assessment.color}` }}>
          <div style={styles.resultIcon}>{assessment.icon}</div>
          <h2 style={{ ...styles.heading, color: assessment.color }}>{assessment.label}</h2>
          <p style={styles.resultScore}>
            Impact Score: {totalImpact} / {maxPossible} ({pct}%)
          </p>
          <p style={styles.timerDisplay}>Dauer: {formatTime(elapsed)}</p>
        </div>

        {/* History */}
        <div className="card" style={styles.historyCard}>
          <h3 style={styles.subheading}>Deine Entscheidungen</h3>
          {history.map((h, i) => (
            <div key={i} style={styles.historyItem}>
              <div style={styles.historyHeader}>
                <span style={styles.historyNum}>{i + 1}.</span>
                <span style={styles.historyEvent}>{h.event}</span>
                <span style={{
                  ...styles.historyImpact,
                  color: h.impact > 0 ? '#10B981' : h.impact < 0 ? '#EF4444' : '#6B7280',
                }}>
                  {h.impact > 0 ? '+' : ''}{h.impact}
                </span>
              </div>
              <div style={styles.historyChoice}>→ {h.option}</div>
              {h.feedback && <div style={styles.historyFeedback}>{h.feedback}</div>}
            </div>
          ))}
        </div>

        <button className="btn btn-primary" style={{ width: '100%' }} onClick={onComplete}>
          Weiter
        </button>
      </div>
    );
  }

  // --- Event / Feedback ---
  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Top bar: timer + progress + running total */}
      <div style={styles.topBar}>
        <span style={styles.timerBadge}>⏱ {formatTime(elapsed)}</span>
        <span style={styles.eventCounter}>
          {eventIndex + 1} / {events.length}
        </span>
        <span style={{
          ...styles.impactBadge,
          color: totalImpact >= 0 ? '#10B981' : '#EF4444',
        }}>
          Impact: {totalImpact > 0 ? '+' : ''}{totalImpact}
        </span>
      </div>

      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${((eventIndex + 1) / events.length) * 100}%` }} />
      </div>

      {/* Event text */}
      <div className="card" style={{ ...styles.eventCard, animation: 'fadeSlideUp 0.3s ease' }}>
        <p style={styles.eventText}>{currentEvent.text || currentEvent.beschreibung || `Situation ${eventIndex + 1}`}</p>
      </div>

      {/* Options / Feedback */}
      {showFeedback ? (
        <div style={{ animation: 'fadeSlideUp 0.3s ease' }}>
          <div className="card" style={styles.feedbackCard}>
            {(() => {
              const opt = optionen[selectedOption] || {};
              const impact = opt.impact || 0;
              return (
                <>
                  <div style={styles.feedbackHeader}>
                    <span style={{
                      ...styles.impactDisplay,
                      color: impact > 0 ? '#10B981' : impact < 0 ? '#EF4444' : '#6B7280',
                      background: impact > 0 ? '#f0fdf4' : impact < 0 ? '#fef2f2' : '#f9fafb',
                    }}>
                      {impact > 0 ? '+' : ''}{impact} Punkte
                    </span>
                  </div>
                  <p style={styles.feedbackText}>
                    {opt.feedback || opt.rueckmeldung || 'Entscheidung notiert.'}
                  </p>
                </>
              );
            })()}
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleNext}>
            {eventIndex < events.length - 1 ? 'Nächste Situation' : 'Ergebnis anzeigen'}
          </button>
        </div>
      ) : (
        <div style={styles.optionList}>
          {optionen.map((opt, i) => (
            <button
              key={i}
              className="card"
              style={styles.optionCard}
              onClick={() => handleSelect(opt, i)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#CC1426';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--ki-bg, #e5e7eb)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
              <span style={styles.optionText}>{opt.text || opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Instrument Sans, sans-serif',
    maxWidth: 640,
    margin: '0 auto',
    padding: '1rem',
  },
  heading: {
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: '1.5rem',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '0.5rem',
    color: 'var(--ki-text, #1a1a1a)',
  },
  subheading: {
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: 'var(--ki-text, #1a1a1a)',
  },
  introCard: {
    padding: '2rem',
    borderRadius: 12,
    textAlign: 'center',
  },
  introIcon: { fontSize: '3rem', marginBottom: '0.5rem' },
  introDesc: {
    color: 'var(--ki-text, #555)',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    marginBottom: '1.25rem',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  infoPill: {
    fontSize: '0.8rem',
    padding: '0.3rem 0.75rem',
  },
  startBtn: { width: '100%', maxWidth: 280 },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  timerBadge: {
    color: 'var(--ki-text, #666)',
  },
  eventCounter: {
    color: 'var(--ki-text, #333)',
  },
  impactBadge: {
    fontWeight: 700,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    background: 'var(--ki-bg, #e5e7eb)',
    overflow: 'hidden',
    marginBottom: '1.5rem',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    background: '#CC1426',
    transition: 'width 0.4s ease',
  },
  eventCard: {
    padding: '1.5rem',
    borderRadius: 12,
    borderLeft: '4px solid #CC1426',
    marginBottom: '1.25rem',
  },
  eventText: {
    fontSize: '1.05rem',
    lineHeight: 1.6,
    color: 'var(--ki-text, #333)',
    margin: 0,
  },
  optionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  optionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    borderRadius: 10,
    border: '2px solid var(--ki-bg, #e5e7eb)',
    cursor: 'pointer',
    background: '#fff',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  },
  optionLetter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'var(--ki-bg, #f3f4f6)',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#CC1426',
    flexShrink: 0,
  },
  optionText: {
    fontSize: '0.95rem',
    color: 'var(--ki-text, #333)',
    fontWeight: 500,
  },
  feedbackCard: {
    padding: '1.5rem',
    borderRadius: 12,
  },
  feedbackHeader: {
    marginBottom: '0.75rem',
  },
  impactDisplay: {
    display: 'inline-block',
    padding: '0.3rem 0.75rem',
    borderRadius: 20,
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  feedbackText: {
    fontSize: '0.95rem',
    color: 'var(--ki-text, #333)',
    lineHeight: 1.6,
    margin: 0,
  },
  resultCard: {
    padding: '2rem',
    borderRadius: 12,
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  resultIcon: { fontSize: '3rem', marginBottom: '0.5rem' },
  resultScore: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--ki-text, #1a1a1a)',
    marginBottom: '0.25rem',
  },
  timerDisplay: {
    fontSize: '0.9rem',
    color: 'var(--ki-text, #666)',
  },
  historyCard: {
    padding: '1.5rem',
    borderRadius: 12,
    marginBottom: '1.5rem',
  },
  historyItem: {
    borderBottom: '1px solid var(--ki-bg, #e5e7eb)',
    paddingBottom: '0.75rem',
    marginBottom: '0.75rem',
  },
  historyHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.25rem',
  },
  historyNum: {
    fontWeight: 700,
    color: 'var(--ki-text, #999)',
    fontSize: '0.85rem',
  },
  historyEvent: {
    flex: 1,
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--ki-text, #333)',
  },
  historyImpact: {
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  historyChoice: {
    fontSize: '0.85rem',
    color: 'var(--ki-text, #555)',
    paddingLeft: '1.25rem',
  },
  historyFeedback: {
    fontSize: '0.82rem',
    color: 'var(--ki-text, #777)',
    fontStyle: 'italic',
    paddingLeft: '1.25rem',
    marginTop: '0.25rem',
  },
};

'use client';

import { useState, useCallback } from 'react';
import { CHRONOTYP_TEST } from '@/lib/elearning/prioritaeten-content';

const TYPES = {
  lerche: {
    label: 'Lerche (Early Bird)',
    icon: '🌅',
    color: '#F59E0B',
    description: 'Du bist ein Frühaufsteher! Deine beste Energie hast du in den Morgenstunden. Nutze diese Zeit für die wichtigsten Aufgaben.',
    peak: '6:00 – 10:00',
    dip: '14:00 – 15:00',
    secondWind: '16:00 – 18:00',
    schedule: [
      { start: 6, end: 10, label: 'Deep Work', color: '#CC1426', icon: '🧠' },
      { start: 10, end: 11, label: 'Meetings', color: '#3B82F6', icon: '👥' },
      { start: 11, end: 12, label: 'Admin', color: '#8B5CF6', icon: '📋' },
      { start: 12, end: 13, label: 'Mittagspause', color: '#10B981', icon: '🍽️' },
      { start: 13, end: 14, label: 'Leichte Aufgaben', color: '#6B7280', icon: '📝' },
      { start: 14, end: 15, label: 'Pause / Spaziergang', color: '#10B981', icon: '🚶' },
      { start: 15, end: 16, label: 'Meetings', color: '#3B82F6', icon: '👥' },
      { start: 16, end: 18, label: 'Zweites Hoch', color: '#F59E0B', icon: '⚡' },
    ],
  },
  eule: {
    label: 'Eule (Night Owl)',
    icon: '🌙',
    color: '#6366F1',
    description: 'Du blühst spät auf! Deine kreativste und produktivste Phase beginnt am späten Vormittag und kann bis in die Nacht reichen.',
    peak: '10:00 – 14:00',
    dip: '15:00 – 16:00',
    secondWind: '20:00 – 23:00',
    schedule: [
      { start: 9, end: 10, label: 'Sanfter Start / Admin', color: '#6B7280', icon: '☕' },
      { start: 10, end: 12, label: 'Deep Work', color: '#CC1426', icon: '🧠' },
      { start: 12, end: 13, label: 'Mittagspause', color: '#10B981', icon: '🍽️' },
      { start: 13, end: 14, label: 'Deep Work', color: '#CC1426', icon: '🧠' },
      { start: 14, end: 15, label: 'Meetings', color: '#3B82F6', icon: '👥' },
      { start: 15, end: 16, label: 'Pause', color: '#10B981', icon: '🚶' },
      { start: 16, end: 18, label: 'Leichte Aufgaben', color: '#6B7280', icon: '📝' },
      { start: 20, end: 23, label: 'Kreatives Arbeiten', color: '#8B5CF6', icon: '✨' },
    ],
  },
  kolibri: {
    label: 'Kolibri (Flexible)',
    icon: '✨',
    color: '#10B981',
    description: 'Du bist flexibel und kannst dich gut an verschiedene Rhythmen anpassen. Dein Energielevel ist gleichmäßiger verteilt.',
    peak: '9:00 – 12:00',
    dip: '13:00 – 14:00',
    secondWind: '15:00 – 18:00',
    schedule: [
      { start: 9, end: 10.5, label: 'Deep Work', color: '#CC1426', icon: '🧠' },
      { start: 10.5, end: 11.5, label: 'Meetings', color: '#3B82F6', icon: '👥' },
      { start: 11.5, end: 12, label: 'Admin', color: '#8B5CF6', icon: '📋' },
      { start: 12, end: 13, label: 'Mittagspause', color: '#10B981', icon: '🍽️' },
      { start: 13, end: 14, label: 'Leichte Aufgaben', color: '#6B7280', icon: '📝' },
      { start: 14, end: 15, label: 'Meetings', color: '#3B82F6', icon: '👥' },
      { start: 15, end: 17, label: 'Deep Work', color: '#CC1426', icon: '🧠' },
      { start: 17, end: 18, label: 'Tagesabschluss', color: '#F59E0B', icon: '📊' },
    ],
  },
};

const DEFAULT_QUESTIONS = [
  {
    text: 'Wann fühlst du dich morgens am fittesten?',
    optionen: [
      { text: 'Direkt nach dem Aufstehen um 6 Uhr', type: 'lerche' },
      { text: 'So gegen 10-11 Uhr', type: 'eule' },
      { text: 'Das variiert bei mir', type: 'kolibri' },
    ],
  },
  {
    text: 'Wenn du frei wählen könntest, wann würdest du schlafen gehen?',
    optionen: [
      { text: 'Um 22 Uhr – ich bin dann schon müde', type: 'lerche' },
      { text: 'Nach Mitternacht – da bin ich oft noch wach', type: 'eule' },
      { text: 'Zwischen 23 und 0 Uhr, flexibel', type: 'kolibri' },
    ],
  },
  {
    text: 'Wann hast du die besten Ideen?',
    optionen: [
      { text: 'Frühmorgens, wenn es still ist', type: 'lerche' },
      { text: 'Spätabends, wenn alle schlafen', type: 'eule' },
      { text: 'Über den Tag verteilt', type: 'kolibri' },
    ],
  },
  {
    text: 'Wie fühlst du dich nach dem Mittagessen?',
    optionen: [
      { text: 'Deutlich müder – ich brauche eine Pause', type: 'lerche' },
      { text: 'Gar nicht müde – ich komme gerade in Fahrt', type: 'eule' },
      { text: 'Ein kurzes Tief, dann geht es weiter', type: 'kolibri' },
    ],
  },
  {
    text: 'Am Wochenende wachst du auf...',
    optionen: [
      { text: 'Zur gleichen Zeit wie unter der Woche', type: 'lerche' },
      { text: 'Deutlich später als unter der Woche', type: 'eule' },
      { text: 'Mal so, mal so', type: 'kolibri' },
    ],
  },
];

export default function ChronotypTest({ onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [slideDir, setSlideDir] = useState('in');

  const questions = CHRONOTYP_TEST?.fragen || CHRONOTYP_TEST?.questions || DEFAULT_QUESTIONS;
  const totalQ = questions.length;

  const handleSelect = useCallback((type) => {
    const newAnswers = [...answers, type];
    setAnswers(newAnswers);

    if (currentQ < totalQ - 1) {
      setSlideDir('out');
      setTimeout(() => {
        setCurrentQ((prev) => prev + 1);
        setSlideDir('in');
      }, 250);
    } else {
      setShowResult(true);
    }
  }, [answers, currentQ, totalQ]);

  const getResult = () => {
    const counts = { lerche: 0, eule: 0, kolibri: 0 };
    answers.forEach((a) => { counts[a] = (counts[a] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0][0];
  };

  // --- Result Screen ---
  if (showResult) {
    const typeKey = getResult();
    const type = TYPES[typeKey];
    const minHour = Math.min(...type.schedule.map((b) => b.start));
    const maxHour = Math.max(...type.schedule.map((b) => b.end));
    const totalHours = maxHour - minHour;

    return (
      <div style={styles.container}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div className="card" style={{ ...styles.resultCard, borderTop: `4px solid ${type.color}`, animation: 'fadeIn 0.4s ease' }}>
          <div style={styles.resultIcon}>{type.icon}</div>
          <h2 style={{ ...styles.heading, color: type.color }}>{type.label}</h2>
          <p style={styles.resultDesc}>{type.description}</p>

          <div style={styles.peakRow}>
            <div style={styles.peakItem}>
              <span style={styles.peakLabel}>Peak</span>
              <span style={styles.peakValue}>{type.peak}</span>
            </div>
            <div style={styles.peakItem}>
              <span style={styles.peakLabel}>Tief</span>
              <span style={styles.peakValue}>{type.dip}</span>
            </div>
            <div style={styles.peakItem}>
              <span style={styles.peakLabel}>Zweites Hoch</span>
              <span style={styles.peakValue}>{type.secondWind}</span>
            </div>
          </div>
        </div>

        {/* Day plan timeline */}
        <div className="card" style={{ ...styles.timelineCard, animation: 'fadeIn 0.5s ease 0.1s both' }}>
          <h3 style={styles.subheading}>Dein optimaler Tagesplan</h3>

          {/* Hour markers */}
          <div style={styles.hourRow}>
            {Array.from({ length: Math.ceil(totalHours) + 1 }).map((_, i) => {
              const hour = minHour + i;
              if (hour > maxHour) return null;
              return (
                <span
                  key={hour}
                  style={{
                    ...styles.hourMark,
                    left: `${((hour - minHour) / totalHours) * 100}%`,
                  }}
                >
                  {hour}
                </span>
              );
            })}
          </div>

          {/* Timeline blocks */}
          <div style={styles.timeline}>
            {type.schedule.map((block, i) => {
              const left = ((block.start - minHour) / totalHours) * 100;
              const width = ((block.end - block.start) / totalHours) * 100;
              return (
                <div
                  key={i}
                  style={{
                    ...styles.timeBlock,
                    left: `${left}%`,
                    width: `${width}%`,
                    background: block.color,
                  }}
                  title={`${block.label} (${block.start}:00 - ${block.end}:00)`}
                >
                  <span style={styles.blockIcon}>{block.icon}</span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={styles.legend}>
            {type.schedule.map((block, i) => (
              <div key={i} style={styles.legendItem}>
                <span style={{ ...styles.legendDot, background: block.color }} />
                <span style={styles.legendIcon}>{block.icon}</span>
                <span style={styles.legendText}>{block.label}</span>
                <span style={styles.legendTime}>
                  {Math.floor(block.start)}:{block.start % 1 ? '30' : '00'} – {Math.floor(block.end)}:{block.end % 1 ? '30' : '00'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%' }} onClick={onComplete}>
          Weiter
        </button>
      </div>
    );
  }

  // --- Question Screen ---
  const q = questions[currentQ] || {};
  const qText = q.text || q.frage || `Frage ${currentQ + 1}`;
  const opts = q.optionen || q.options || [];

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(-30px); }
        }
      `}</style>

      {/* Progress */}
      <div style={styles.progressWrap}>
        <div style={styles.progressLabel}>Frage {currentQ + 1} von {totalQ}</div>
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${((currentQ + 1) / totalQ) * 100}%` }} />
        </div>
      </div>

      <div
        style={{
          animation: slideDir === 'in' ? 'slideIn 0.3s ease' : 'slideOut 0.2s ease',
        }}
      >
        <div className="card" style={styles.questionCard}>
          <p style={styles.questionText}>{qText}</p>
        </div>

        <div style={styles.optionList}>
          {opts.map((opt, i) => {
            const optType = opt.type || opt.typ || ['lerche', 'eule', 'kolibri'][i];
            const typeInfo = TYPES[optType] || {};
            return (
              <button
                key={i}
                className="card"
                style={styles.optionCard}
                onClick={() => handleSelect(optType)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = typeInfo.color || '#CC1426';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--ki-bg, #e5e7eb)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ ...styles.optIcon, color: typeInfo.color }}>{typeInfo.icon}</span>
                <span style={styles.optText}>{opt.text || opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
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
    marginBottom: '1.25rem',
    color: 'var(--ki-text, #1a1a1a)',
  },
  progressWrap: { marginBottom: '1.5rem' },
  progressLabel: {
    fontSize: '0.85rem',
    color: 'var(--ki-text, #666)',
    marginBottom: '0.4rem',
    textAlign: 'center',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    background: 'var(--ki-bg, #e5e7eb)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    background: '#CC1426',
    transition: 'width 0.3s ease',
  },
  questionCard: {
    padding: '1.5rem',
    borderRadius: 12,
    textAlign: 'center',
    marginBottom: '1rem',
  },
  questionText: {
    fontSize: '1.1rem',
    fontWeight: 500,
    lineHeight: 1.5,
    color: 'var(--ki-text, #1a1a1a)',
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
  optIcon: {
    fontSize: '1.3rem',
    flexShrink: 0,
  },
  optText: {
    fontSize: '0.95rem',
    color: 'var(--ki-text, #333)',
    fontWeight: 500,
  },
  resultCard: {
    padding: '2rem',
    borderRadius: 12,
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  resultIcon: { fontSize: '3rem', marginBottom: '0.5rem' },
  resultDesc: {
    fontSize: '0.95rem',
    color: 'var(--ki-text, #555)',
    lineHeight: 1.6,
    marginBottom: '1.5rem',
  },
  peakRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  peakItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    background: 'var(--ki-bg, #f9fafb)',
    borderRadius: 8,
  },
  peakLabel: { fontSize: '0.75rem', color: 'var(--ki-text, #999)', fontWeight: 600, textTransform: 'uppercase' },
  peakValue: { fontSize: '0.9rem', fontWeight: 600, color: 'var(--ki-text, #333)', marginTop: '0.15rem' },
  timelineCard: {
    padding: '1.5rem',
    borderRadius: 12,
    marginBottom: '1.5rem',
  },
  hourRow: {
    position: 'relative',
    height: 20,
    marginBottom: '0.25rem',
  },
  hourMark: {
    position: 'absolute',
    transform: 'translateX(-50%)',
    fontSize: '0.7rem',
    color: 'var(--ki-text, #999)',
    fontWeight: 600,
  },
  timeline: {
    position: 'relative',
    height: 44,
    borderRadius: 8,
    background: 'var(--ki-bg, #f3f4f6)',
    marginBottom: '1.25rem',
    overflow: 'hidden',
  },
  timeBlock: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '1rem',
    transition: 'opacity 0.2s',
    cursor: 'default',
  },
  blockIcon: {
    filter: 'brightness(0) invert(1)',
    fontSize: '1rem',
  },
  legend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
    flexShrink: 0,
  },
  legendIcon: { fontSize: '0.9rem' },
  legendText: {
    flex: 1,
    color: 'var(--ki-text, #333)',
    fontWeight: 500,
  },
  legendTime: {
    color: 'var(--ki-text, #999)',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
};

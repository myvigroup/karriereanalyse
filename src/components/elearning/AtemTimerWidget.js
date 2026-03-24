'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export default function AtemTimerWidget({ config, onComplete }) {
  const zyklen = config?.zyklen || 3;
  const einatmen = config?.einatmen || 4;
  const halten = config?.halten || 4;
  const ausatmen = config?.ausatmen || 6;
  const zyklusDauer = einatmen + halten + ausatmen;

  const [phase, setPhase] = useState('idle'); // idle | einatmen | halten | ausatmen | done
  const [cycle, setCycle] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  const getPhaseLabel = () => {
    if (phase === 'einatmen') return 'Einatmen...';
    if (phase === 'halten') return 'Halten...';
    if (phase === 'ausatmen') return 'Ausatmen...';
    if (phase === 'done') return 'Fertig!';
    return 'Bereit?';
  };

  const getScale = () => {
    if (phase === 'einatmen') return 1 + (seconds / einatmen) * 0.4;
    if (phase === 'halten') return 1.4;
    if (phase === 'ausatmen') return 1.4 - (seconds / ausatmen) * 0.4;
    return 1;
  };

  const getColor = () => {
    if (phase === 'einatmen') return '#3b82f6';
    if (phase === 'halten') return '#f59e0b';
    if (phase === 'ausatmen') return '#10b981';
    if (phase === 'done') return '#16a34a';
    return 'var(--ki-text-tertiary)';
  };

  const nextStep = useCallback(() => {
    if (phase === 'einatmen' && seconds >= einatmen - 1) {
      setPhase('halten');
      setSeconds(0);
    } else if (phase === 'halten' && seconds >= halten - 1) {
      setPhase('ausatmen');
      setSeconds(0);
    } else if (phase === 'ausatmen' && seconds >= ausatmen - 1) {
      if (cycle + 1 >= zyklen) {
        setPhase('done');
        setSeconds(0);
      } else {
        setCycle(c => c + 1);
        setPhase('einatmen');
        setSeconds(0);
      }
    } else {
      setSeconds(s => s + 1);
    }
  }, [phase, seconds, cycle, einatmen, halten, ausatmen, zyklen]);

  useEffect(() => {
    if (phase !== 'idle' && phase !== 'done') {
      timerRef.current = setInterval(nextStep, 1000);
      return () => clearInterval(timerRef.current);
    }
    return () => {};
  }, [phase, nextStep]);

  function start() {
    setCycle(0);
    setSeconds(0);
    setPhase('einatmen');
  }

  return (
    <div className="card" style={{ border: '1px solid rgba(245,158,11,0.2)', textAlign: 'center' }}>
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
        {config?.titel || '30-Sekunden Fokus-Aktivierung'}
      </div>
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
        {config?.warum || 'Aktiviert den Parasympathikus, senkt Herzfrequenz, verbessert Aufmerksamkeit.'}
      </p>

      {/* Breathing Circle */}
      <div style={{
        width: 160, height: 160, margin: '0 auto 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: `${getColor()}15`,
          border: `3px solid ${getColor()}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
          transform: `scale(${getScale()})`,
          transition: 'transform 1s ease-in-out, border-color 0.3s, background 0.3s',
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: getColor() }}>
            {getPhaseLabel()}
          </div>
          {phase !== 'idle' && phase !== 'done' && (
            <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 4 }}>
              Zyklus {cycle + 1}/{zyklen}
            </div>
          )}
        </div>
      </div>

      {phase === 'idle' && (
        <button onClick={start} className="btn btn-primary">
          Atem-Übung starten
        </button>
      )}

      {phase === 'done' && (
        <div>
          <div style={{
            padding: '12px 18px', borderRadius: 'var(--r-md)',
            background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)',
            marginBottom: 14, fontSize: 14, color: '#16a34a', fontWeight: 600,
          }}>
            ✅ Fokus aktiviert! Du bist bereit zum Lesen.
          </div>
          <button onClick={onComplete} className="btn btn-primary">
            Weiter zum WPM-Test
          </button>
        </div>
      )}
    </div>
  );
}

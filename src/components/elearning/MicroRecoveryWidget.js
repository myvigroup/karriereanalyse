'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MICRO_RECOVERY } from '@/lib/elearning/balance-content';

export default function MicroRecoveryWidget({ onComplete }) {
  const techniken = MICRO_RECOVERY.techniken;
  const [tried, setTried] = useState({});
  const [activeTimer, setActiveTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef(null);

  const triedCount = Object.keys(tried).length;

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = useCallback((technik) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActiveTimer(technik.id);
    setTimeLeft(technik.dauer_sekunden);

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setTried(p => ({ ...p, [technik.id]: true }));
          setActiveTimer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    if (activeTimer) {
      setTried(p => ({ ...p, [activeTimer]: true }));
    }
    setActiveTimer(null);
    setTimeLeft(0);
  }, [activeTimer]);

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  return (
    <div className="card" style={{ border: '1px solid rgba(34,197,94,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🔋</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Micro-Recovery Techniken</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 6, lineHeight: 1.6 }}>
        Probiere die Techniken aus! Klicke "Jetzt machen" um den Timer zu starten.
      </p>
      <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginBottom: 16 }}>
        {triedCount} von {techniken.length} ausprobiert
      </p>

      {/* Active timer overlay */}
      {activeTimer && (
        <div style={{
          padding: '20px', borderRadius: 'var(--r-md)',
          background: 'rgba(34,197,94,0.06)', border: '2px solid #22c55e',
          textAlign: 'center', marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            {techniken.find(t => t.id === activeTimer)?.name}
          </div>
          <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
            {techniken.find(t => t.id === activeTimer)?.anleitung}
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#22c55e', marginBottom: 12 }}>
            {formatTime(timeLeft)}
          </div>
          <button onClick={stopTimer} className="btn btn-secondary" style={{ fontSize: 13 }}>
            Fertig (vorzeitig beenden)
          </button>
        </div>
      )}

      {/* Technique cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {techniken.map(t => (
          <div key={t.id} style={{
            padding: '12px 14px', borderRadius: 'var(--r-md)',
            background: tried[t.id] ? 'rgba(34,197,94,0.04)' : 'var(--ki-bg-alt)',
            border: tried[t.id] ? '1px solid rgba(34,197,94,0.2)' : '1px solid var(--ki-border)',
            opacity: activeTimer && activeTimer !== t.id ? 0.4 : 1,
            transition: 'all 0.15s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {t.name}
                  {tried[t.id] && <span style={{ color: '#22c55e', marginLeft: 6, fontSize: 12 }}>Erledigt</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>
                  {t.dauer} | {t.kategorie}
                </div>
              </div>
              {!tried[t.id] && !activeTimer && (
                <button
                  onClick={() => startTimer(t)}
                  className="btn btn-primary"
                  style={{ fontSize: 11, padding: '5px 10px' }}
                >
                  Jetzt machen
                </button>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', lineHeight: 1.5, marginTop: 4 }}>
              {t.anleitung}
            </div>
          </div>
        ))}
      </div>

      {triedCount >= 3 && (
        <button onClick={() => onComplete?.()} className="btn btn-primary" style={{ marginTop: 16 }}>
          {triedCount} Techniken ausprobiert! Speichern (+40 XP)
        </button>
      )}
    </div>
  );
}

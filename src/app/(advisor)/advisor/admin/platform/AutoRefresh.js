'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AutoRefresh({ intervalSeconds = 30 }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(true);
  const [countdown, setCountdown] = useState(intervalSeconds);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    if (!enabled) return;

    const tick = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          router.refresh();
          setLastRefresh(new Date());
          return intervalSeconds;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [enabled, intervalSeconds, router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Live-Indikator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%', display: 'inline-block',
          background: enabled ? '#059669' : '#D1D5DB',
          animation: enabled ? 'pulse 1.5s infinite' : 'none',
        }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: enabled ? '#059669' : '#9CA3AF' }}>
          {enabled ? `Live · ${countdown}s` : 'Pausiert'}
        </span>
      </div>

      {/* Toggle */}
      <button
        onClick={() => { setEnabled(v => !v); setCountdown(intervalSeconds); }}
        style={{
          fontSize: 11, padding: '4px 10px',
          border: `1px solid ${enabled ? '#D1FAE5' : '#E5E7EB'}`,
          borderRadius: 980, background: enabled ? '#F0FDF4' : '#F9FAFB',
          color: enabled ? '#059669' : '#6B7280',
          cursor: 'pointer', fontWeight: 600,
        }}
      >
        {enabled ? '⏸ Pause' : '▶ Starten'}
      </button>

      {/* Manuell aktualisieren */}
      <button
        onClick={() => { router.refresh(); setLastRefresh(new Date()); setCountdown(intervalSeconds); }}
        style={{
          fontSize: 11, padding: '4px 10px',
          border: '1px solid #E5E7EB', borderRadius: 980,
          background: '#fff', color: '#6B7280',
          cursor: 'pointer', fontWeight: 600,
        }}
      >
        ↻ Jetzt
      </button>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';

export default function WPMProgressChart({ results, meilensteine }) {
  // results = [{ date, wpm, verstaendnis }] from user's test history
  const data = results || [];
  const milestones = meilensteine || [];

  const maxWPM = useMemo(() => {
    const vals = [...data.map(d => d.wpm), ...milestones.map(m => m.wpm)];
    return Math.max(800, ...vals) + 50;
  }, [data, milestones]);

  if (data.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 32 }}>
        <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>📈</span>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>WPM-Fortschritt</div>
        <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>
          Noch keine WPM-Tests absolviert. Mach deinen ersten Test!
        </div>
      </div>
    );
  }

  const chartH = 200;
  const chartW = '100%';

  return (
    <div className="card" style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 22 }}>📈</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Dein WPM-Fortschritt</span>
      </div>

      {/* Simple bar chart */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: chartH, marginBottom: 8, padding: '0 4px' }}>
        {data.map((d, i) => {
          const barH = Math.max(8, (d.wpm / maxWPM) * chartH);
          const isLatest = i === data.length - 1;
          const badge = milestones.find(m => d.wpm >= m.wpm);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: isLatest ? '#f59e0b' : 'var(--ki-text-tertiary)' }}>
                {d.wpm}
              </div>
              <div style={{
                width: '100%', maxWidth: 40, height: barH, borderRadius: '4px 4px 0 0',
                background: isLatest
                  ? 'linear-gradient(to top, #d97706, #f59e0b)'
                  : 'linear-gradient(to top, rgba(245,158,11,0.2), rgba(245,158,11,0.4))',
                transition: 'height 0.5s ease',
              }} />
              <div style={{ fontSize: 9, color: 'var(--ki-text-tertiary)', whiteSpace: 'nowrap' }}>
                {d.date ? new Date(d.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) : `#${i + 1}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestone lines */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', marginBottom: 8 }}>Meilensteine</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {milestones.map((m, i) => {
            const reached = data.some(d => d.wpm >= m.wpm);
            return (
              <div key={i} style={{
                padding: '6px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                background: reached ? 'rgba(245,158,11,0.1)' : 'var(--ki-bg-alt)',
                border: reached ? '1px solid rgba(245,158,11,0.3)' : '1px solid var(--ki-border)',
                color: reached ? '#d97706' : 'var(--ki-text-tertiary)',
              }}>
                {reached ? '🏆' : '🔒'} {m.wpm} WPM — {m.badge || m.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Latest stats */}
      {data.length >= 2 && (
        <div style={{
          marginTop: 16, padding: '12px 16px', borderRadius: 'var(--r-md)',
          background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#16a34a' }}>
            +{data[data.length - 1].wpm - data[0].wpm} WPM seit Start
            ({Math.round(((data[data.length - 1].wpm - data[0].wpm) / data[0].wpm) * 100)}% Steigerung)
          </div>
        </div>
      )}
    </div>
  );
}

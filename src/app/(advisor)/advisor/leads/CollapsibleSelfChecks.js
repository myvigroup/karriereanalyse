'use client';
import { useState } from 'react';

const INITIAL_COUNT = 5;

export default function CollapsibleSelfChecks({ selfChecks, fairById }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? selfChecks : selfChecks.slice(0, INITIAL_COUNT);
  const hiddenCount = selfChecks.length - INITIAL_COUNT;

  const TZ = 'Europe/Berlin';
  const formatDate = (d) => new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: TZ });
  const formatTime = (d) => new Date(d).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', timeZone: TZ });

  return (
    <div data-tour="self-service">
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 140px 100px', padding: '12px 20px', borderBottom: '1px solid #F0EEE9', background: '#FAFAF8' }}>
          {['Name & Kontakt', 'Messe', 'Datum', 'Ergebnis'].map(h => (
            <div key={h} style={{ fontSize: 12, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</div>
          ))}
        </div>

        {visible.map((sc, i) => {
          const fair = fairById[sc.fair_id];
          const ratingColor = !sc.overall_rating ? '#9CA3AF' : sc.overall_rating <= 2 ? '#EF4444' : sc.overall_rating === 3 ? '#F59E0B' : '#22C55E';
          return (
            <div key={sc.id} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 140px 100px', alignItems: 'center', borderBottom: i < visible.length - 1 ? '1px solid #F0EEE9' : 'none' }}>
              <div style={{ padding: '14px 0 14px 20px' }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A', marginBottom: 2 }}>{sc.name || '–'}</div>
                {sc.phone && <div style={{ fontSize: 12, color: '#CC1426', fontWeight: 600 }}>📞 {sc.phone}</div>}
                {sc.email && <div style={{ fontSize: 12, color: '#86868b' }}>{sc.email}</div>}
                {sc.registered && <span style={{ fontSize: 11, fontWeight: 600, color: '#059669', background: '#F0FDF4', padding: '1px 7px', borderRadius: 980, border: '1px solid #A7F3D0', display: 'inline-block', marginTop: 3 }}>Registriert</span>}
              </div>
              <div style={{ fontSize: 13, color: '#6B7280', padding: '14px 0' }}>{fair?.name || '–'}</div>
              <div style={{ fontSize: 13, color: '#6B7280', padding: '14px 0' }}>
                {formatDate(sc.created_at)}<br /><span style={{ fontSize: 12 }}>{formatTime(sc.created_at)}</span>
              </div>
              <div style={{ padding: '14px 20px 14px 0' }}>
                {sc.overall_rating ? (
                  <a href={`/scan/result/${sc.result_token}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 700, color: ratingColor, textDecoration: 'none' }}>
                    {sc.overall_rating}/5 →
                  </a>
                ) : (
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>–</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ width: '100%', marginTop: 8, padding: '11px 20px', borderRadius: 10, background: '#fff', border: '1px solid #E8E6E1', color: '#6B7280', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#F5F5F7'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          {expanded ? '↑ Weniger anzeigen' : `↓ Weitere ${hiddenCount} anzeigen`}
        </button>
      )}
    </div>
  );
}

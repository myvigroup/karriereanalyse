'use client';
import { useState } from 'react';
import Link from 'next/link';
import FollowUpSelect from './FollowUpSelect';

const STATUS_LABELS = {
  new: { label: 'Neu', bg: '#F3F4F6', color: '#6B7280' },
  analyzing: { label: 'CV hochgeladen', bg: '#DBEAFE', color: '#1D4ED8' },
  feedback_pending: { label: 'Feedback offen', bg: '#FEF3C7', color: '#D97706' },
  completed: { label: 'Abgeschlossen', bg: '#D1FAE5', color: '#059669' },
  contacted: { label: 'Kontaktiert', bg: '#E8F5E9', color: '#2D6A4F' },
  converted: { label: 'Konvertiert', bg: '#FCE4EC', color: '#CC1426' },
  lost: { label: 'Verloren', bg: '#F3F4F6', color: '#9CA3AF' },
};

function getNextStep(lead) {
  switch (lead.status) {
    case 'new': return `/advisor/fair/${lead.fair_id}/lead/${lead.id}/upload`;
    case 'analyzing': return `/advisor/fair/${lead.fair_id}/lead/${lead.id}/review`;
    case 'feedback_pending': return lead.email
      ? `/advisor/fair/${lead.fair_id}/lead/${lead.id}/summary`
      : `/advisor/fair/${lead.fair_id}/lead/${lead.id}/contact`;
    default: return `/advisor/fair/${lead.fair_id}/lead/${lead.id}/review`;
  }
}

const INITIAL_COUNT = 5;

export default function CollapsibleLeadsList({ leads, isSuperAdmin, advisorById, fairById }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? leads : leads.slice(0, INITIAL_COUNT);
  const hiddenCount = leads.length - INITIAL_COUNT;

  const TZ = 'Europe/Berlin';
  const formatDate = (d) => new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: TZ });
  const formatTime = (d) => new Date(d).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', timeZone: TZ });

  if (!leads.length) {
    return (
      <div style={{ background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center', border: '1px solid #E8E6E1', color: '#86868b' }}>
        Noch keine CV-Checks aus Beratungsgesprächen.
      </div>
    );
  }

  return (
    <div data-tour="leads-table">
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isSuperAdmin ? '1.2fr 0.9fr 110px 120px 160px 80px' : '1.4fr 1fr 140px 160px 80px',
          padding: '12px 20px', borderBottom: '1px solid #F0EEE9', background: '#FAFAF8',
        }}>
          {(isSuperAdmin
            ? ['Name & Kontakt', 'Messe', 'Datum', 'Berater', 'Nachfassen', 'Aktion']
            : ['Name & Kontakt', 'Messe', 'Datum', 'Nachfassen', 'Aktion']
          ).map(h => (
            <div key={h} style={{ fontSize: 12, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</div>
          ))}
        </div>

        {visible.map((lead, i) => {
          const statusInfo = STATUS_LABELS[lead.status] || STATUS_LABELS.new;
          const fair = fairById[lead.fair_id];
          const isOpen = ['new', 'analyzing', 'feedback_pending'].includes(lead.status);
          const advisorName = isSuperAdmin ? (advisorById[lead.advisor_user_id] || '–') : null;

          return (
            <div key={lead.id} className="lead-row" style={{
              display: 'grid',
              gridTemplateColumns: isSuperAdmin ? '1.2fr 0.9fr 110px 120px 160px 80px' : '1.4fr 1fr 140px 160px 80px',
              alignItems: 'center',
              borderBottom: i < visible.length - 1 ? '1px solid #F0EEE9' : 'none',
              position: 'relative',
            }}>
              <Link href={`/advisor/leads/${lead.id}`} style={{ position: 'absolute', inset: 0, right: 100, zIndex: 0 }} aria-label={`${lead.first_name} ${lead.last_name || ''} öffnen`} />

              <div style={{ padding: '14px 0 14px 20px', position: 'relative', zIndex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A', marginBottom: 2 }}>{`${lead.first_name} ${lead.last_name || ''}`.trim()}</div>
                {lead.phone && <span style={{ fontSize: 12, color: '#CC1426', fontWeight: 600, display: 'block' }}>📞 {lead.phone}</span>}
                {lead.email && <div style={{ fontSize: 12, color: '#86868b' }}>{lead.email}</div>}
                {!lead.phone && !lead.email && <div style={{ fontSize: 12, color: '#C5C5C7' }}>Keine Kontaktdaten</div>}
              </div>

              <div style={{ padding: '14px 0', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {fair ? (
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 980, background: '#FEF3C7', color: '#92400E', whiteSpace: 'nowrap', display: 'inline-block', alignSelf: 'flex-start' }}>🎪 {fair.name}</span>
                ) : lead.source === 'affiliate' ? (
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 980, background: '#F3E8FF', color: '#7C3AED', whiteSpace: 'nowrap', display: 'inline-block', alignSelf: 'flex-start' }}>🔗 Affiliate</span>
                ) : (
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 980, background: '#CCFBF1', color: '#0F766E', whiteSpace: 'nowrap', display: 'inline-block', alignSelf: 'flex-start' }}>⚡ Direkt</span>
                )}
                <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 980, background: statusInfo.bg, color: statusInfo.color, whiteSpace: 'nowrap', display: 'inline-block', alignSelf: 'flex-start' }}>
                  {statusInfo.label}
                </span>
              </div>

              <div style={{ fontSize: 13, color: '#6B7280', padding: '14px 0', position: 'relative', zIndex: 1 }}>
                {formatDate(lead.created_at)}<br /><span style={{ fontSize: 12 }}>{formatTime(lead.created_at)}</span>
              </div>

              {isSuperAdmin && (
                <div style={{ padding: '14px 8px 14px 0', position: 'relative', zIndex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1A1A1A', background: '#F5F5F7', padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap', display: 'inline-block', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {advisorName}
                  </span>
                </div>
              )}

              <div style={{ padding: '14px 0', position: 'relative', zIndex: 1 }}>
                <FollowUpSelect leadId={lead.id} initialValue={lead.follow_up_status} />
              </div>

              <div style={{ padding: '14px 20px 14px 0', position: 'relative', zIndex: 1 }}>
                <Link href={isOpen ? getNextStep(lead) : `/advisor/leads/${lead.id}`} style={{ fontSize: 13, fontWeight: 600, color: isOpen ? '#CC1426' : '#86868b', textDecoration: 'none' }}>
                  {isOpen ? 'Weiter →' : 'Ansehen'}
                </Link>
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

'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';

const STATUS_FILTERS = [
  { id: 'all',          label: 'Alle' },
  { id: 'ai-pending',   label: 'Wartend auf KI' },
  { id: 'ai-done',      label: 'KI fertig' },
  { id: 'review',       label: 'In Review' },
  { id: 'completed',    label: 'Abgeschlossen' },
];

function displayName(profile) {
  if (!profile) return 'Unbekannt';
  return profile.name || profile.first_name || profile.email || 'User';
}
function avatarInitials(profile) {
  if (!profile) return '?';
  return profile.avatar_initials || (profile.first_name?.[0] || '?').toUpperCase();
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getStatus(doc) {
  const fb = doc.cv_feedback?.[0];
  if (!fb) return { id: 'ai-pending', label: 'Wartend auf KI', tier: 'low' };
  if (fb.status === 'completed') return { id: 'completed', label: 'Abgeschlossen', tier: 'good' };
  if (fb.advisor_id) return { id: 'review', label: 'In Review', tier: 'mid' };
  if (fb.ai_parsed_at) return { id: 'ai-done', label: 'KI fertig', tier: 'mid' };
  return { id: 'ai-pending', label: 'Wartend auf KI', tier: 'low' };
}

export default function AdminCvChecksClient({ docs, profileMap, stats }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return docs.filter(d => {
      const status = getStatus(d);
      if (filter !== 'all' && status.id !== filter) return false;
      if (search) {
        const user = profileMap[d.user_id];
        const haystack = [
          d.file_name,
          user?.name, user?.email, user?.first_name,
        ].filter(Boolean).join(' ').toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [docs, filter, search, profileMap]);

  return (
    <div className="admin-cvchecks admin-coaches">
      <div className="admin-pageheader">
        <div>
          <div className="title-kicker"><span className="pulse" /> Admin · Lebenslauf-Checks</div>
          <h1 className="page-title">CV-Checks <span className="faded">{docs.length}</span></h1>
          <p className="page-sub">Alle eingereichten Lebensläufe zentral. Filtere nach Status, durchsuche, öffne den Mitglieder-View.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats-row">
        <Stat label="Eingereicht" value={stats.total} iconName="file-text" />
        <Stat label="Mit KI-Analyse" value={stats.withAi} iconName="ai" />
        <Stat label="Abgeschlossen" value={stats.withReview} iconName="check-circle" />
        <Stat label="Wartend" value={stats.pending} iconName="refresh" highlight />
      </div>

      {/* Filter + Search */}
      <div className="admin-toolbar">
        <div className="admin-tabs">
          {STATUS_FILTERS.map(f => (
            <button key={f.id} className={`admin-tab ${filter === f.id ? 'on' : ''}`}
                    onClick={() => setFilter(f.id)} type="button">
              {f.label}
            </button>
          ))}
        </div>
        <input className="admin-search-input"
               type="search" placeholder="Nach Name, E-Mail oder Dateiname suchen…"
               value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="admin-list">
        {filtered.length === 0 && (
          <div className="admin-empty">Keine CVs für diese Filter.</div>
        )}
        {filtered.map(d => {
          const user = profileMap[d.user_id];
          const status = getStatus(d);
          const fb = d.cv_feedback?.[0];
          return (
            <div key={d.id} className="admin-row">
              <div className="admin-avatar small">{avatarInitials(user)}</div>
              <div className="admin-row-body">
                <div className="admin-row-name">
                  {displayName(user)}
                  {d.is_current && <span className="admin-coach-badge ext">aktuell</span>}
                </div>
                <div className="admin-row-content">
                  <Icon name="file-text" size={12} stroke={1.7} /> {d.file_name}
                  {d.page_count && <> · {d.page_count} Seiten</>}
                  {fb?.overall_rating ? <> · ★ {fb.overall_rating}/5</> : null}
                </div>
                <div className="admin-row-meta">
                  <span className={`admin-coach-badge tier-${status.tier}`}>{status.label}</span>
                  <span>·</span>
                  <span>Hochgeladen {formatDate(d.created_at)}</span>
                  {fb?.ai_parsed_at && <><span>·</span><span>KI: {formatDate(fb.ai_parsed_at)}</span></>}
                </div>
                {d.processing_error && (
                  <div className="admin-row-error">⚠ {d.processing_error}</div>
                )}
              </div>
              <div className="admin-coach-actions">
                <Link href={`/cv-check?docId=${d.id}`} className="admin-action-btn">
                  Öffnen
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, iconName, highlight }) {
  return (
    <div className={`admin-stat ${highlight ? 'highlight' : ''}`}>
      <div className="admin-stat-icon"><Icon name={iconName} size={18} stroke={1.6} /></div>
      <div className="admin-stat-body">
        <div className="admin-stat-value">{value}</div>
        <div className="admin-stat-label">{label}</div>
      </div>
    </div>
  );
}

'use client';
import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// ─── Pipeline columns (preserve existing status keys) ────────────────────────
const PIPELINE = [
  { id: 'research',   label: 'Recherche',   tone: 'neutral'  },
  { id: 'applied',    label: 'Beworben',    tone: 'neutral'  },
  { id: 'interview',  label: 'Interview',   tone: 'strength' },
  { id: 'assessment', label: 'AC / Finale', tone: 'work'     },
  { id: 'offer',      label: 'Angebot',     tone: 'gap'      },
];

const STATUS_META = {
  research:   { label: 'Recherche',   tone: 'neutral'  },
  applied:    { label: 'Beworben',    tone: 'neutral'  },
  interview:  { label: 'Interview',   tone: 'strength' },
  assessment: { label: 'AC / Finale', tone: 'work'     },
  offer:      { label: 'Angebot',     tone: 'gap'      },
  accepted:   { label: 'Angenommen',  tone: 'strength' },
  rejected:   { label: 'Abgesagt',    tone: 'work'     },
  draft:      { label: 'Entwurf',     tone: 'neutral'  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function companyColor(name) {
  const palette = ['#4a0a14', '#1d4e89', '#5d3a91', '#1d4d2e', '#8a4a14', '#353A3B', '#0071E3', '#CC1426'];
  const i = (name || 'x').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length;
  return palette[i];
}

function Icon({ name, size = 14, stroke = 1.7 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
              stroke: 'currentColor', strokeWidth: stroke,
              strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'brief':  return (<svg {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>);
    case 'check':  return (<svg {...p}><polyline points="20 6 9 17 4 12"/></svg>);
    case 'plus':   return (<svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
    case 'cal':    return (<svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
    case 'trophy': return (<svg {...p}><path d="M6 9a6 6 0 0 0 12 0V3H6z"/><path d="M9 21h6"/><path d="M12 17v4"/></svg>);
    case 'arrow':  return (<svg {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>);
    default: return null;
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function ApplicationsClient({ applications, documents, userId }) {
  const supabase = createClient();
  const router = useRouter();

  const [view, setView] = useState('all');
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newApp, setNewApp] = useState({
    company: '', position: '', location: '', status: 'research', salary: '', url: '', next_step: '',
  });

  // Counts
  const counts = useMemo(() => {
    const byStatus = {};
    (applications || []).forEach(a => {
      byStatus[a.status] = (byStatus[a.status] || 0) + 1;
    });
    const active = (applications || []).filter(a => !['rejected', 'accepted'].includes(a.status)).length;
    return {
      total: applications?.length || 0,
      active,
      research: byStatus.research || 0,
      applied: byStatus.applied || 0,
      interview: byStatus.interview || 0,
      assessment: byStatus.assessment || 0,
      offer: byStatus.offer || 0,
      accepted: byStatus.accepted || 0,
      rejected: byStatus.rejected || 0,
    };
  }, [applications]);

  // Filter applications by view
  const filtered = useMemo(() => {
    if (view === 'all') return applications || [];
    if (view === 'active') return (applications || []).filter(a => !['rejected', 'accepted'].includes(a.status));
    if (view === 'interview') return (applications || []).filter(a => ['interview', 'assessment'].includes(a.status));
    if (view === 'archive') return (applications || []).filter(a => ['rejected', 'accepted'].includes(a.status));
    return applications || [];
  }, [applications, view]);

  async function handleCreate(e) {
    e?.preventDefault();
    if (!newApp.company || !newApp.position) return;
    setSaving(true);
    try {
      const payload = { ...newApp, user_id: userId };
      if (!payload.salary) delete payload.salary;
      if (!payload.url) delete payload.url;
      await supabase.from('applications').insert(payload);
      setNewApp({ company: '', position: '', location: '', status: 'research', salary: '', url: '', next_step: '' });
      setAdding(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="applications-v2">
      {/* Title */}
      <div className="title-kicker">
        <span className="pulse" />
        {counts.active} aktive Bewerbungen
        {counts.interview > 0 && ` · ${counts.interview} im Interview-Prozess`}
      </div>
      <h1 className="page-title">
        Bewerbungen.{' '}
        <span className="faded">Vom ersten Klick bis zur Unterschrift — alles an einem Ort.</span>
      </h1>
      <p className="page-sub">
        Behalte Pipeline, Status und nächste Schritte im Blick. Lege neue Bewerbungen an und verfolge ihre Entwicklung.
      </p>

      {/* Filter chips + CTA */}
      <div className="segmented">
        {[
          { id: 'all',       label: 'Alle' },
          { id: 'active',    label: 'Aktiv' },
          { id: 'interview', label: 'Im Interview' },
          { id: 'archive',   label: 'Archiv' },
        ].map(t => (
          <button key={t.id} className={view === t.id ? 'on' : ''} onClick={() => setView(t.id)}>
            {t.label}
          </button>
        ))}
        <button className="seg-cta" type="button" onClick={() => setAdding(v => !v)}>
          <Icon name="plus" size={13} stroke={2} /> Neue Bewerbung
        </button>
      </div>

      {/* New application form (collapsed by default) */}
      {adding && (
        <div className="card" style={{ marginBottom: 'var(--gap)' }}>
          <div className="card-head">
            <h3 className="card-title">Neue Bewerbung</h3>
          </div>
          <form className="newapp-form" onSubmit={handleCreate}>
            <div className="newapp-row">
              <div className="newapp-field">
                <label className="newapp-label">Unternehmen <span className="req">*</span></label>
                <input className="newapp-input" required value={newApp.company} onChange={e => setNewApp({ ...newApp, company: e.target.value })} placeholder="z. B. SAP" />
              </div>
              <div className="newapp-field">
                <label className="newapp-label">Position <span className="req">*</span></label>
                <input className="newapp-input" required value={newApp.position} onChange={e => setNewApp({ ...newApp, position: e.target.value })} placeholder="z. B. Senior Product Manager" />
              </div>
            </div>
            <div className="newapp-row three">
              <div className="newapp-field">
                <label className="newapp-label">Ort</label>
                <input className="newapp-input" value={newApp.location} onChange={e => setNewApp({ ...newApp, location: e.target.value })} placeholder="z. B. Berlin" />
              </div>
              <div className="newapp-field">
                <label className="newapp-label">Status</label>
                <select className="newapp-select" value={newApp.status} onChange={e => setNewApp({ ...newApp, status: e.target.value })}>
                  {PIPELINE.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>
              <div className="newapp-field">
                <label className="newapp-label">Gehalt (€)</label>
                <input className="newapp-input" type="text" value={newApp.salary} onChange={e => setNewApp({ ...newApp, salary: e.target.value })} placeholder="z. B. 75.000" />
              </div>
            </div>
            <div className="newapp-row full">
              <div className="newapp-field">
                <label className="newapp-label">Stellenanzeige URL</label>
                <input className="newapp-input" type="url" value={newApp.url} onChange={e => setNewApp({ ...newApp, url: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div className="newapp-row full">
              <div className="newapp-field">
                <label className="newapp-label">Nächster Schritt</label>
                <input className="newapp-input" value={newApp.next_step} onChange={e => setNewApp({ ...newApp, next_step: e.target.value })} placeholder="z. B. Anschreiben bis Freitag" />
              </div>
            </div>
            <div className="newapp-actions">
              <button type="button" className="newapp-btn ghost" onClick={() => setAdding(false)}>Abbrechen</button>
              <button type="submit" className="newapp-btn primary" disabled={saving || !newApp.company || !newApp.position}>
                {saving ? 'Speichert…' : 'Speichern'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="stats">
        <div className="stat">
          <div className="stat-label"><span className="sl-ic"><Icon name="brief" size={11} stroke={2} /></span> Gesamt</div>
          <div className="stat-value">{counts.total}</div>
          <div className="stat-sub">{counts.research} in Recherche</div>
        </div>
        <div className="stat">
          <div className="stat-label"><span className="sl-ic"><Icon name="arrow" size={11} stroke={2} /></span> Aktiv</div>
          <div className="stat-value">{counts.active}</div>
          <div className="stat-sub">In Bearbeitung</div>
        </div>
        <div className="stat">
          <div className="stat-label"><span className="sl-ic"><Icon name="cal" size={11} stroke={2} /></span> Interview</div>
          <div className="stat-value">{counts.interview + counts.assessment}</div>
          <div className="stat-sub">{counts.assessment} in AC/Finale</div>
        </div>
        <div className="stat">
          <div className="stat-label"><span className="sl-ic"><Icon name="trophy" size={11} stroke={2} /></span> Angebote</div>
          <div className="stat-value">{counts.offer + counts.accepted}</div>
          <div className="stat-sub">{counts.accepted} angenommen</div>
        </div>
      </div>

      {/* Content */}
      {(applications || []).length === 0 ? (
        <div className="card">
          <div className="apps-empty">
            <div className="apps-empty-ic"><Icon name="brief" size={22} /></div>
            <div className="apps-empty-title">Noch keine Bewerbungen</div>
            <div className="apps-empty-sub">
              Lege deine erste Bewerbung an. Du behältst Status, nächste Schritte und Termine automatisch im Blick.
            </div>
            <button className="apps-empty-cta" onClick={() => setAdding(true)}>
              <Icon name="plus" size={13} stroke={2} /> Neue Bewerbung anlegen
            </button>
          </div>
        </div>
      ) : view === 'all' ? (
        /* Kanban view */
        <div className="card" style={{ marginBottom: 'var(--gap)' }}>
          <div className="card-head">
            <h3 className="card-title">
              Pipeline <span className="kicker">{counts.active} aktiv</span>
            </h3>
          </div>
          <div className="kanban">
            {PIPELINE.map(col => {
              const cards = filtered.filter(a => a.status === col.id);
              return (
                <div className="kanban-col" key={col.id}>
                  <div className="kanban-col-head">
                    <span className="kanban-col-label">{col.label}</span>
                    <span className="kanban-col-count">{cards.length}</span>
                  </div>
                  <div className="kanban-col-body">
                    {cards.map(a => (
                      <div key={a.id} className="kanban-card" onClick={() => a.url && window.open(a.url, '_blank')}>
                        <div className="kc-head">
                          <div className="kc-logo" style={{ background: companyColor(a.company) }}>
                            {(a.company?.[0] || '?').toUpperCase()}
                          </div>
                          <div className="kc-co-block">
                            <div className="kc-co">{a.company || 'Unbekannt'}</div>
                            {a.location && <div className="kc-loc">{a.location}</div>}
                          </div>
                        </div>
                        {a.position && <div className="kc-role">{a.position}</div>}
                        {(a.salary || a.applied_at) && (
                          <div className="kc-foot">
                            <span className="kc-match-num">
                              {a.applied_at ? new Date(a.applied_at).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' }) : ''}
                            </span>
                            {a.salary && <span className="kc-salary">{a.salary}</span>}
                          </div>
                        )}
                        {a.next_step && <div className="kc-tag">{a.next_step}</div>}
                      </div>
                    ))}
                    {cards.length === 0 && (
                      <button className="kanban-add" onClick={() => { setNewApp({ ...newApp, status: col.id }); setAdding(true); }}>
                        + Hinzufügen
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Filtered list view */
        <div className="card" style={{ marginBottom: 'var(--gap)' }}>
          <div className="card-head">
            <h3 className="card-title">
              {view === 'active' ? 'Aktive Bewerbungen' : view === 'interview' ? 'Im Interview-Prozess' : 'Archiv'}
              <span className="kicker">{filtered.length}</span>
            </h3>
          </div>
          {filtered.length === 0 ? (
            <div className="apps-empty">
              <div className="apps-empty-title">Keine Bewerbungen in dieser Ansicht.</div>
            </div>
          ) : (
            <div className="apps-table">
              <div className="apps-row apps-head">
                <div>Unternehmen</div>
                <div>Rolle</div>
                <div>Status</div>
                <div>Nächster Schritt</div>
              </div>
              {filtered.map(a => {
                const meta = STATUS_META[a.status] || STATUS_META.draft;
                return (
                  <div className="apps-row" key={a.id} style={{ gridTemplateColumns: '1.6fr 1.6fr 0.9fr 1.2fr' }}>
                    <div className="apps-co">
                      <div className="kc-logo sm" style={{ background: companyColor(a.company) }}>
                        {(a.company?.[0] || '?').toUpperCase()}
                      </div>
                      <div>
                        <div className="apps-co-name">{a.company || 'Unbekannt'}</div>
                        {a.location && <div className="apps-co-loc">{a.location}</div>}
                      </div>
                    </div>
                    <div className="apps-role">
                      <div>{a.position || '—'}</div>
                      {a.salary && <div className="apps-salary">{a.salary} €</div>}
                    </div>
                    <div><span className={`status-pill ${meta.tone}`}>{meta.label}</span></div>
                    <div className="apps-time">
                      {a.next_step || (a.applied_at ? `Beworben am ${new Date(a.applied_at).toLocaleDateString('de-DE')}` : '—')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';
import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { awardPoints } from '@/lib/gamification';
import InfoTooltip from '@/components/ui/InfoTooltip';

const ROLE_OPTIONS = [
  { key: 'mentor', label: 'Mentor', icon: '🧠' },
  { key: 'headhunter', label: 'Headhunter', icon: '🔍' },
  { key: 'ex_boss', label: 'Ex-Vorgesetzte/r', icon: '👔' },
  { key: 'colleague', label: 'Kolleg/in', icon: '🤝' },
  { key: 'friend', label: 'Sparringspartner', icon: '💬' },
  { key: 'other', label: 'Sonstige', icon: '○' },
];

const WEEKLY_GOAL = 3;

function getContactStatus(daysSince) {
  if (daysSince === null) return 'new';
  if (daysSince <= 7) return 'fresh';
  if (daysSince <= 30) return 'warm';
  return 'cold';
}

function statusPillClass(status) {
  if (status === 'fresh') return 'pill pill-green';
  if (status === 'warm') return 'pill pill-gold';
  if (status === 'cold') return 'pill pill-red';
  return 'pill pill-grey';
}

function statusPillLabel(status, daysSince) {
  if (status === 'new') return 'Neu';
  if (status === 'fresh') return `vor ${daysSince}d`;
  if (status === 'warm') return `vor ${daysSince}d`;
  if (status === 'cold') return `vor ${daysSince}d`;
  return '';
}

function statusColor(status) {
  if (status === 'fresh') return 'var(--ki-success)';
  if (status === 'warm') return 'var(--ki-warning)';
  if (status === 'cold') return 'var(--ki-error)';
  return 'var(--grey-4)';
}

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          style={{
            cursor: 'pointer',
            fontSize: 16,
            color: i <= (hovered || value || 0) ? 'var(--ki-warning)' : 'var(--grey-4)',
            transition: 'color 100ms',
          }}
        >
          {i <= (hovered || value || 0) ? '\u2605' : '\u2606'}
        </span>
      ))}
    </div>
  );
}

function ProgressRing({ value, max, size = 64, stroke = 6, color = 'var(--ki-red)' }) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = Math.min(value / max, 1);
  const offset = circumference * (1 - progress);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--grey-5)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  );
}

function StakeholderMap({ contacts, onSelectContact, selectedId }) {
  const WIDTH = 560;
  const HEIGHT = 320;
  const CX = WIDTH / 2;
  const CY = HEIGHT / 2;

  const displayed = contacts.slice(0, 12);
  const angleStep = (2 * Math.PI) / Math.max(displayed.length, 1);
  const ORBIT_R = 110;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Orbit ring */}
      <circle cx={CX} cy={CY} r={ORBIT_R} fill="none" stroke="var(--ki-border)" strokeDasharray="4 6" strokeWidth={1} />

      {/* Connection lines */}
      {displayed.map((c, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = CX + ORBIT_R * Math.cos(angle);
        const y = CY + ORBIT_R * Math.sin(angle);
        const daysSince = c.last_contact_date
          ? Math.floor((Date.now() - new Date(c.last_contact_date)) / 86400000)
          : null;
        const s = getContactStatus(daysSince);
        return (
          <line
            key={`line-${c.id}`}
            x1={CX} y1={CY}
            x2={x} y2={y}
            stroke={statusColor(s)}
            strokeOpacity={0.25}
            strokeWidth={1.5}
          />
        );
      })}

      {/* You - center */}
      <circle cx={CX} cy={CY} r={28} fill="var(--ki-red)" />
      <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={11} fontWeight={700} fontFamily="Instrument Sans, sans-serif">Du</text>

      {/* Contact nodes */}
      {displayed.map((c, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = CX + ORBIT_R * Math.cos(angle);
        const y = CY + ORBIT_R * Math.sin(angle);
        const daysSince = c.last_contact_date
          ? Math.floor((Date.now() - new Date(c.last_contact_date)) / 86400000)
          : null;
        const s = getContactStatus(daysSince);
        const r = 10 + (c.relationship_strength || 1) * 2.5;
        const isSelected = selectedId === c.id;
        const initial = (c.name || '?')[0].toUpperCase();

        return (
          <g
            key={c.id}
            onClick={() => onSelectContact(isSelected ? null : c.id)}
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={x} cy={y} r={r + (isSelected ? 4 : 0)}
              fill={statusColor(s)}
              fillOpacity={isSelected ? 0.25 : 0.12}
              stroke={statusColor(s)}
              strokeWidth={isSelected ? 2.5 : 1.5}
            />
            <text
              x={x} y={y + 0.5}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={statusColor(s)}
              fontSize={10}
              fontWeight={700}
              fontFamily="Instrument Sans, sans-serif"
            >
              {initial}
            </text>
            <text
              x={x}
              y={y + r + 10}
              textAnchor="middle"
              fill="var(--ki-text-secondary)"
              fontSize={9}
              fontFamily="Instrument Sans, sans-serif"
            >
              {c.name.split(' ')[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function NetworkClient({ contacts: initial, userId }) {
  const supabase = createClient();
  const [contacts, setContacts] = useState(initial || []);
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', role: 'colleague', company: '', notes: '', linkedin_url: '', relationship_strength: 3 });
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('last_contacted');
  const [activeView, setActiveView] = useState('list'); // 'list' | 'map'
  const [noteContactId, setNoteContactId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [selectedMapId, setSelectedMapId] = useState(null);
  const [xpToast, setXpToast] = useState(null);

  const today = new Date();

  const enriched = useMemo(() => {
    const mapped = contacts.map(c => {
      const lastDate = c.last_contact_date ? new Date(c.last_contact_date) : null;
      const daysSince = lastDate ? Math.floor((today - lastDate) / 86400000) : null;
      const status = getContactStatus(daysSince);
      return { ...c, daysSince, status };
    });
    const sorted = [...mapped];
    if (sortBy === 'last_contacted') {
      sorted.sort((a, b) => {
        if (a.daysSince === null && b.daysSince === null) return 0;
        if (a.daysSince === null) return 1;
        if (b.daysSince === null) return -1;
        return b.daysSince - a.daysSince;
      });
    } else if (sortBy === 'importance') {
      sorted.sort((a, b) => (b.relationship_strength || 0) - (a.relationship_strength || 0));
    }
    return sorted;
  }, [contacts, sortBy]);

  const filtered = filter === 'all'
    ? enriched
    : filter === 'reconnect'
      ? enriched.filter(c => c.status === 'cold' || c.status === 'warm')
      : enriched.filter(c => c.role === filter);

  const coldCount = enriched.filter(c => c.status === 'cold').length;

  // Weekly challenge: contacts contacted in the past 7 days
  const weeklyContacted = useMemo(() => {
    const cutoff = new Date(Date.now() - 7 * 86400000).toISOString();
    return contacts.filter(c => c.last_contacted_at && c.last_contacted_at >= cutoff).length;
  }, [contacts]);

  const showXpToast = (pts) => {
    setXpToast(pts);
    setTimeout(() => setXpToast(null), 2500);
  };

  const handleAdd = async () => {
    if (!newContact.name) return;
    const { data } = await supabase.from('contacts').insert({ user_id: userId, ...newContact }).select().single();
    if (data) {
      setContacts(p => [...p, data]);
      setShowAdd(false);
      setNewContact({ name: '', role: 'colleague', company: '', notes: '', linkedin_url: '', relationship_strength: 3 });
      const result = await awardPoints(supabase, userId, 'CONTACT_ADDED');
      if (result?.awarded) showXpToast(result.awarded);
    }
  };

  const handleDelete = async (id) => {
    await supabase.from('contacts').delete().eq('id', id);
    setContacts(p => p.filter(c => c.id !== id));
  };

  const markContacted = async (id) => {
    const now = new Date().toISOString().split('T')[0];
    const nowFull = new Date().toISOString();
    await supabase.from('contacts').update({ last_contact_date: now, last_contacted_at: nowFull }).eq('id', id);
    setContacts(p => p.map(c => c.id === id ? { ...c, last_contact_date: now, last_contacted_at: nowFull } : c));
  };

  const handleSaveNote = async () => {
    if (!noteContactId) return;
    const now = new Date().toISOString().split('T')[0];
    const nowFull = new Date().toISOString();
    const existing = contacts.find(c => c.id === noteContactId);
    const updatedNotes = noteText
      ? `${existing?.notes ? existing.notes + '\n' : ''}[${now}] ${noteText}`
      : existing?.notes || '';
    await supabase.from('contacts').update({
      last_contact_date: now,
      last_contacted_at: nowFull,
      notes: updatedNotes,
    }).eq('id', noteContactId);
    setContacts(p => p.map(c => c.id === noteContactId ? { ...c, last_contact_date: now, last_contacted_at: nowFull, notes: updatedNotes } : c));
    setNoteContactId(null);
    setNoteText('');
  };

  const updateStrength = async (id, strength) => {
    await supabase.from('contacts').update({ relationship_strength: strength }).eq('id', id);
    setContacts(p => p.map(c => c.id === id ? { ...c, relationship_strength: strength } : c));
  };

  const handleIntroEmail = (c) => {
    alert(`Intro-E-Mail für ${c.name} wird generiert...\n\n(Funktion in Kürze verfügbar)`);
  };

  return (
    <div className="page-container">

      {/* XP Toast */}
      {xpToast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 999,
          background: 'var(--ki-success)', color: 'white',
          padding: '10px 20px', borderRadius: 'var(--r-pill)',
          fontWeight: 700, fontSize: 15,
          boxShadow: 'var(--sh-lg)',
          animation: 'fadeIn 0.3s ease',
        }}>
          +{xpToast} XP verdient!
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Netzwerk<InfoTooltip moduleId="network" profile={null} /></h1>
          <p className="page-subtitle">
            {contacts.length} Kontakte
            {coldCount > 0 ? ` \u00b7 ${coldCount} Re-Connects f\u00e4llig` : ''}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Kontakt</button>
      </div>

      {/* Video-Platzhalter */}
      <div className="card" style={{ marginBottom: 24, padding: 0, overflow: 'hidden' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--ki-charcoal) 0%, #1a2829 100%)',
          padding: '28px 32px',
          display: 'flex', alignItems: 'center', gap: 20,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(204,20,38,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0, cursor: 'pointer',
            boxShadow: '0 0 0 4px rgba(255,255,255,0.15)',
          }}>
            ▶
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500, marginBottom: 4 }}>
              Strategisches Networking
            </div>
            <div style={{ fontWeight: 700, fontSize: 17, color: 'white' }}>
              Strategisches Networking f\u00fcr Introvertierte
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
              14 Min. \u00b7 Karriere-Institut Akademie
            </div>
          </div>
        </div>
      </div>

      {/* Top row: Challenge + Stats */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Weekly Challenge */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <ProgressRing
              value={weeklyContacted}
              max={WEEKLY_GOAL}
              size={72}
              stroke={7}
              color={weeklyContacted >= WEEKLY_GOAL ? 'var(--ki-success)' : 'var(--ki-red)'}
            />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700, color: weeklyContacted >= WEEKLY_GOAL ? 'var(--ki-success)' : 'var(--ki-text)',
            }}>
              {weeklyContacted}/{WEEKLY_GOAL}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
              Wochenziel: 3 Kontakte
            </div>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 8 }}>
              {weeklyContacted >= WEEKLY_GOAL
                ? 'Ziel erreicht! Gro\u00dfartig.'
                : `Noch ${WEEKLY_GOAL - weeklyContacted} Kontakt${WEEKLY_GOAL - weeklyContacted !== 1 ? 'e' : ''} diese Woche.`}
            </div>
            {weeklyContacted >= WEEKLY_GOAL && (
              <span className="pill pill-green">Geschafft!</span>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>Netzwerk-Status</div>
          {[
            { label: 'Aktiv (< 7d)', count: enriched.filter(c => c.status === 'fresh').length, cls: 'pill-green' },
            { label: 'Warm (7-30d)', count: enriched.filter(c => c.status === 'warm').length, cls: 'pill-gold' },
            { label: 'Kalt (> 30d)', count: enriched.filter(c => c.status === 'cold').length, cls: 'pill-red' },
          ].map(({ label, count, cls }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>{label}</span>
              <span className={`pill ${cls}`} style={{ fontSize: 12, padding: '2px 10px' }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          className={`btn ${activeView === 'list' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveView('list')}
          style={{ fontSize: 13, padding: '6px 16px' }}
        >
          Liste
        </button>
        <button
          className={`btn ${activeView === 'map' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveView('map')}
          style={{ fontSize: 13, padding: '6px 16px' }}
        >
          Stakeholder-Map
        </button>
      </div>

      {/* Stakeholder Map View */}
      {activeView === 'map' && (
        <div className="card animate-in" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Dein Netzwerk</div>
          <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
            Kreisgr\u00f6\u00dfe = Beziehungsst\u00e4rke \u00b7 Farbe = letzter Kontakt
          </p>
          {contacts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ki-text-secondary)' }}>
              F\u00fcge Kontakte hinzu, um die Map zu sehen.
            </div>
          ) : (
            <StakeholderMap
              contacts={enriched}
              onSelectContact={setSelectedMapId}
              selectedId={selectedMapId}
            />
          )}
          {selectedMapId && (() => {
            const c = enriched.find(x => x.id === selectedMapId);
            if (!c) return null;
            const roleInfo = ROLE_OPTIONS.find(r => r.key === c.role) || ROLE_OPTIONS[5];
            return (
              <div style={{
                marginTop: 16, padding: '12px 16px', borderRadius: 'var(--r-md)',
                background: 'var(--ki-bg-alt)', display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{ fontSize: 22 }}>{roleInfo.icon}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700 }}>{c.name}</span>
                  <span style={{ color: 'var(--ki-text-secondary)', fontSize: 13, marginLeft: 8 }}>
                    {roleInfo.label}{c.company ? ` \u00b7 ${c.company}` : ''}
                  </span>
                </div>
                <span className={statusPillClass(c.status)} style={{ fontSize: 12 }}>
                  {c.daysSince === null ? 'Neu' : c.daysSince === 0 ? 'Heute' : `vor ${c.daysSince}d`}
                </span>
                <button className="btn btn-primary" onClick={() => markContacted(selectedMapId)} style={{ fontSize: 12, padding: '6px 14px' }}>
                  Kontaktiert
                </button>
              </div>
            );
          })()}
          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
            {[
              { color: 'var(--ki-success)', label: '< 7 Tage' },
              { color: 'var(--ki-warning)', label: '7-30 Tage' },
              { color: 'var(--ki-error)', label: '> 30 Tage' },
              { color: 'var(--grey-4)', label: 'Neu' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ki-text-secondary)' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View Controls */}
      {activeView === 'list' && (
        <>
          {/* Sort */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>Sortierung:</span>
            <button
              className={`btn ${sortBy === 'last_contacted' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSortBy('last_contacted')}
              style={{ fontSize: 12, padding: '4px 10px' }}
            >
              Zuletzt kontaktiert
            </button>
            <button
              className={`btn ${sortBy === 'importance' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSortBy('importance')}
              style={{ fontSize: 12, padding: '4px 10px' }}
            >
              Wichtigkeit
            </button>
          </div>

          {/* Filter */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              ['all', 'Alle'],
              ['reconnect', `Re-Connect (${coldCount})`],
              ...ROLE_OPTIONS.map(r => [r.key, `${r.icon} ${r.label}`]),
            ].map(([key, label]) => (
              <button
                key={key}
                className={`btn ${filter === key ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(key)}
                style={{ fontSize: 12, padding: '6px 12px' }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Contact Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(c => {
              const roleInfo = ROLE_OPTIONS.find(r => r.key === c.role) || ROLE_OPTIONS[5];
              const showNote = noteContactId === c.id;
              return (
                <div key={c.id} className="card animate-in" style={{
                  padding: 16,
                  borderLeft: `3px solid ${statusColor(c.status)}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    {/* Avatar */}
                    <div style={{
                      width: 42, height: 42, borderRadius: '50%',
                      background: 'var(--ki-bg-alt)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, flexShrink: 0,
                    }}>
                      {roleInfo.icon}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</span>
                        {/* Last-contacted badge */}
                        <span className={statusPillClass(c.status)} style={{ fontSize: 11, padding: '2px 8px' }}>
                          {c.daysSince === null ? 'Neu' : c.daysSince === 0 ? 'Heute' : `vor ${c.daysSince}d`}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 1 }}>
                        {roleInfo.label}{c.company ? ` \u00b7 ${c.company}` : ''}
                      </div>
                      {/* Star rating */}
                      <div style={{ marginTop: 6 }}>
                        <StarRating
                          value={c.relationship_strength || 0}
                          onChange={(v) => updateStrength(c.id, v)}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', flexShrink: 0 }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="btn btn-secondary"
                          onClick={() => markContacted(c.id)}
                          style={{ fontSize: 11, padding: '4px 10px', whiteSpace: 'nowrap' }}
                          title="Als kontaktiert markieren"
                        >
                          Kontaktiert
                        </button>
                        <button
                          className="btn btn-ghost"
                          onClick={() => {
                            if (noteContactId === c.id) {
                              setNoteContactId(null);
                              setNoteText('');
                            } else {
                              setNoteContactId(c.id);
                              setNoteText('');
                            }
                          }}
                          style={{ fontSize: 11, padding: '4px 10px' }}
                          title="Notiz hinzuf\u00fcgen"
                        >
                          Notiz
                        </button>
                        <button
                          className="btn btn-ghost"
                          onClick={() => handleIntroEmail(c)}
                          style={{ fontSize: 11, padding: '4px 10px' }}
                          title="Intro-E-Mail generieren"
                        >
                          E-Mail
                        </button>
                        <button
                          className="btn btn-ghost"
                          onClick={() => handleDelete(c.id)}
                          style={{ fontSize: 13, padding: '4px 8px', color: 'var(--ki-text-tertiary)' }}
                          title="L\u00f6schen"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notes display */}
                  {c.notes && !showNote && (
                    <div style={{
                      marginTop: 10, fontSize: 13,
                      color: 'var(--ki-text-secondary)',
                      paddingLeft: 54,
                      whiteSpace: 'pre-line',
                      borderTop: '1px solid var(--ki-border)',
                      paddingTop: 8,
                    }}>
                      {c.notes}
                    </div>
                  )}

                  {/* Inline note editor */}
                  {showNote && (
                    <div style={{ marginTop: 12, paddingLeft: 54, display: 'flex', gap: 8 }}>
                      <textarea
                        className="input"
                        placeholder="Notiz eingeben..."
                        rows={2}
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        autoFocus
                        style={{ flex: 1, fontSize: 13, resize: 'vertical' }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <button
                          className="btn btn-primary"
                          onClick={handleSaveNote}
                          style={{ fontSize: 12, padding: '6px 14px' }}
                        >
                          Speichern
                        </button>
                        <button
                          className="btn btn-ghost"
                          onClick={() => { setNoteContactId(null); setNoteText(''); }}
                          style={{ fontSize: 12, padding: '6px 14px' }}
                        >
                          Abbrechen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {contacts.length === 0 && (
            <div className="card" style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🤝</div>
              <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
                Dein Netzwerk ist dein Karriere-Kapital. F\u00fcge deine wichtigsten Kontakte hinzu.
              </p>
              <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                Ersten Kontakt hinzuf\u00fcgen
              </button>
            </div>
          )}
        </>
      )}

      {/* Add Contact Modal */}
      {showAdd && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
          }}
          onClick={e => e.target === e.currentTarget && setShowAdd(false)}
        >
          <div className="card animate-in" style={{ width: 480, maxWidth: '92vw' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Kontakt hinzuf\u00fcgen</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                className="input"
                placeholder="Name *"
                value={newContact.name}
                onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))}
              />
              <select
                className="input"
                value={newContact.role}
                onChange={e => setNewContact(p => ({ ...p, role: e.target.value }))}
              >
                {ROLE_OPTIONS.map(r => (
                  <option key={r.key} value={r.key}>{r.icon} {r.label}</option>
                ))}
              </select>
              <input
                className="input"
                placeholder="Unternehmen"
                value={newContact.company}
                onChange={e => setNewContact(p => ({ ...p, company: e.target.value }))}
              />
              <input
                className="input"
                placeholder="LinkedIn-URL"
                value={newContact.linkedin_url}
                onChange={e => setNewContact(p => ({ ...p, linkedin_url: e.target.value }))}
              />
              <textarea
                className="input"
                placeholder="Notizen"
                rows={2}
                value={newContact.notes}
                onChange={e => setNewContact(p => ({ ...p, notes: e.target.value }))}
              />

              {/* Relationship Strength in form */}
              <div>
                <label style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 6 }}>
                  Beziehungsst\u00e4rke
                </label>
                <StarRating
                  value={newContact.relationship_strength}
                  onChange={v => setNewContact(p => ({ ...p, relationship_strength: v }))}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--ki-text-secondary)' }}>
                <span style={{ color: 'var(--ki-success)', fontWeight: 700 }}>+20 XP</span>
                f\u00fcr jeden neuen Kontakt
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAdd(false)}
                  style={{ flex: 1 }}
                >
                  Abbrechen
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleAdd}
                  style={{ flex: 1 }}
                >
                  Hinzuf\u00fcgen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

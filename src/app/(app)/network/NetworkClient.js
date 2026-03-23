'use client';

import { useState, useMemo } from 'react';
import { createClient }       from '@/lib/supabase/client';
import { awardPoints }        from '@/lib/gamification';
import InfoTooltip             from '@/components/ui/InfoTooltip';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TAG_OPTIONS = [
  { key: 'mentor',   label: 'Mentor',           icon: '\u{1F9E0}' },
  { key: 'kollege',  label: 'Kollege',          icon: '\u{1F91D}' },
  { key: 'hr',       label: 'HR',               icon: '\u{1F454}' },
  { key: 'fuehrung', label: 'F\u00FChrungskraft', icon: '\u{1F451}' },
  { key: 'branche',  label: 'Branche-Kontakt',  icon: '\u{1F3E2}' },
  { key: 'freund',   label: 'Freund',           icon: '\u{1F4AC}' },
  { key: 'coach',    label: 'Coach',            icon: '\u{1F3AF}' },
  { key: 'referenz', label: 'Referenz',         icon: '\u2B50'    },
];

const TAG_MAP = Object.fromEntries(TAG_OPTIONS.map(t => [t.key, t]));

const EMPTY_FORM = {
  first_name: '', last_name: '', company: '', role: '', phone: '',
  email: '', city: '', linkedin_url: '', xing_url: '',
  tags: [], relationship_strength: 0, how_met: '', what_can_i_give: '', notes: '',
};

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--ki-text-secondary)',
  marginBottom: 4,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function daysBetween(a, b) {
  return Math.floor((b - a) / 86400000);
}

function getContactStatus(daysSince) {
  if (daysSince === null) return 'new';
  if (daysSince < 14)    return 'fresh';
  if (daysSince <= 30)   return 'warm';
  return 'cold';
}

function getContactFreshness(lastContactDate) {
  if (!lastContactDate) return { color: '#6B7280', label: 'Neu', icon: '\u26AA' };
  const days = Math.floor((Date.now() - new Date(lastContactDate)) / (1000 * 60 * 60 * 24));
  if (days <= 14) return { color: '#10B981', label: 'Aktiv', icon: '\uD83D\uDFE2' };
  if (days <= 60) return { color: '#F59E0B', label: 'Touchpoint fällig', icon: '\uD83D\uDFE1' };
  return { color: '#EF4444', label: 'Schläft ein!', icon: '\uD83D\uDD34' };
}

function statusBorder(status) {
  if (status === 'fresh') return '4px solid var(--ki-success)';
  if (status === 'warm')  return '4px solid var(--ki-warning)';
  if (status === 'cold')  return '4px solid var(--ki-error)';
  return '4px solid var(--ki-border)';
}

function initials(name) {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function initialsColor(name) {
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) {
    h = (name.charCodeAt(i) + ((h << 5) - h)) | 0;
  }
  return `hsl(${Math.abs(h) % 360}, 55%, 48%)`;
}

function calcNetworkScore(contacts) {
  if (!contacts.length) return 0;
  const now = Date.now();

  const active = contacts.filter(c => {
    const d = c.last_contact_date || c.last_contacted_at;
    return d && daysBetween(new Date(d), new Date(now)) <= 30;
  }).length;
  const activeRatio = (active / contacts.length) * 40;

  const allTags = new Set(contacts.flatMap(c => c.tags || []));
  const tagDiv = (allTags.size / 8) * 30;

  const freqs = contacts.map(c => {
    const d = c.last_contact_date || c.last_contacted_at;
    if (!d) return 0;
    const diff = daysBetween(new Date(d), new Date(now));
    if (diff <= 7)  return 1;
    if (diff <= 14) return 0.75;
    if (diff <= 30) return 0.4;
    return 0;
  });
  const avgFreq = (freqs.reduce((a, b) => a + b, 0) / contacts.length) * 30;

  return Math.min(100, Math.round(activeRatio + tagDiv + avgFreq));
}

function scoreColor(s) {
  if (s >= 70) return 'var(--ki-success)';
  if (s >= 40) return 'var(--ki-warning)';
  return 'var(--ki-error)';
}

function timestamp() {
  return new Date().toLocaleString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/* ------------------------------------------------------------------ */
/*  StarRating                                                         */
/* ------------------------------------------------------------------ */

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          style={{
            cursor: onChange ? 'pointer' : 'default',
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

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function NetworkClient({ contacts: initial, userId }) {
  const supabase = createClient();

  /* ---- state ---- */
  const [contacts, setContacts]           = useState(initial || []);
  const [search, setSearch]               = useState('');
  const [sortBy, setSortBy]               = useState('last');
  const [filterTags, setFilterTags]       = useState([]);
  const [modalOpen, setModalOpen]         = useState(false);
  const [editId, setEditId]               = useState(null);
  const [form, setForm]                   = useState({ ...EMPTY_FORM });
  const [noteModal, setNoteModal]         = useState(null);
  const [noteText, setNoteText]           = useState('');
  const [expandedNotes, setExpandedNotes] = useState({});
  const [busy, setBusy]                   = useState(false);
  const [messageModal, setMessageModal]   = useState(null);
  const [messageText, setMessageText]     = useState('');
  const [messageCopied, setMessageCopied] = useState(false);

  /* ---- derived ---- */
  const now = Date.now();

  const enriched = useMemo(() => contacts.map(c => {
    const d = c.last_contact_date || c.last_contacted_at;
    const daysSince = d ? daysBetween(new Date(d), new Date(now)) : null;
    return { ...c, daysSince, status: getContactStatus(daysSince) };
  }), [contacts, now]);

  const filtered = useMemo(() => {
    let list = enriched;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.company || '').toLowerCase().includes(q)
      );
    }

    if (filterTags.length) {
      list = list.filter(c => filterTags.some(t => (c.tags || []).includes(t)));
    }

    list = [...list].sort((a, b) => {
      if (sortBy === 'stars') {
        return (b.relationship_strength || 0) - (a.relationship_strength || 0);
      }
      const da = a.last_contact_date || a.last_contacted_at || a.created_at || '';
      const db = b.last_contact_date || b.last_contacted_at || b.created_at || '';
      return new Date(db) - new Date(da);
    });

    return list;
  }, [enriched, search, sortBy, filterTags]);

  const stats = useMemo(() => {
    const total    = contacts.length;
    const active   = enriched.filter(c => c.status === 'fresh' || c.status === 'warm').length;
    const inactive = total - active;
    const tagCounts = {};
    contacts.forEach(c => (c.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
    const score = calcNetworkScore(contacts);

    // Ampel-System stats
    let ampelGreen = 0, ampelYellow = 0, ampelRed = 0, ampelNew = 0;
    contacts.forEach(c => {
      const d = c.last_contact_date || c.last_contacted_at;
      const freshness = getContactFreshness(d);
      if (freshness.label === 'Aktiv') ampelGreen++;
      else if (freshness.label === 'Touchpoint fällig') ampelYellow++;
      else if (freshness.label === 'Schläft ein!') ampelRed++;
      else ampelNew++;
    });

    return { total, active, inactive, tagCounts, score, ampelGreen, ampelYellow, ampelRed, ampelNew };
  }, [contacts, enriched]);

  /* ---- helpers ---- */
  const patch = (id, data) =>
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));

  const f = (key, val) => setForm(p => ({ ...p, [key]: val }));

  function openAdd() {
    setEditId(null);
    setForm({ ...EMPTY_FORM });
    setModalOpen(true);
  }

  function openEdit(c) {
    const [first, ...rest] = (c.name || '').split(' ');
    setEditId(c.id);
    setForm({
      first_name: first || '',
      last_name: rest.join(' '),
      company: c.company || '',
      role: c.role || '',
      phone: c.phone || '',
      email: c.email || '',
      city: c.city || '',
      linkedin_url: c.linkedin_url || '',
      xing_url: c.xing_url || '',
      tags: c.tags || [],
      relationship_strength: c.relationship_strength || 0,
      how_met: c.how_met || '',
      what_can_i_give: c.what_can_i_give || '',
      notes: c.notes || '',
    });
    setModalOpen(true);
  }

  /* ---- CRUD ---- */

  async function saveContact() {
    if (!form.first_name.trim() || !form.last_name.trim() ||
        !form.company.trim()    || !form.role.trim()) return;
    setBusy(true);

    const name = `${form.first_name.trim()} ${form.last_name.trim()}`;
    const payload = {
      user_id: userId,
      name,
      company: form.company.trim(),
      role: form.role.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      city: form.city.trim() || null,
      linkedin_url: form.linkedin_url.trim() || null,
      xing_url: form.xing_url.trim() || null,
      tags: form.tags,
      relationship_strength: form.relationship_strength,
      how_met: form.how_met.trim() || null,
      what_can_i_give: form.what_can_i_give.trim() || null,
      notes: form.notes.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (editId) {
      const { data, error } = await supabase
        .from('contacts').update(payload).eq('id', editId).select().single();
      if (!error && data) patch(editId, data);
    } else {
      payload.created_at = new Date().toISOString();
      const { data, error } = await supabase
        .from('contacts').insert(payload).select().single();
      if (!error && data) {
        setContacts(prev => [data, ...prev]);
        awardPoints(userId, 20, 'contact_added');
      }
    }

    setModalOpen(false);
    setBusy(false);
  }

  async function deleteContact(id) {
    if (!confirm('Kontakt wirklich l\u00F6schen?')) return;
    await supabase.from('contacts').delete().eq('id', id);
    setContacts(prev => prev.filter(c => c.id !== id));
  }

  async function markContacted(id) {
    const ts = new Date().toISOString();
    const { data, error } = await supabase
      .from('contacts')
      .update({ last_contact_date: ts, last_contacted_at: ts, updated_at: ts })
      .eq('id', id).select().single();
    if (!error && data) patch(id, data);
    awardPoints(userId, 5, 'contact_pinged');
  }

  async function saveNote(id) {
    if (!noteText.trim()) return;
    const c = contacts.find(x => x.id === id);
    const prev = c?.notes || '';
    const entry = `[${timestamp()}] ${noteText.trim()}`;
    const updated = prev ? `${prev}\n${entry}` : entry;
    const { data, error } = await supabase
      .from('contacts')
      .update({ notes: updated, updated_at: new Date().toISOString() })
      .eq('id', id).select().single();
    if (!error && data) patch(id, data);
    setNoteModal(null);
    setNoteText('');
  }

  async function updateStars(id, val) {
    const { data, error } = await supabase
      .from('contacts')
      .update({ relationship_strength: val, updated_at: new Date().toISOString() })
      .eq('id', id).select().single();
    if (!error && data) patch(id, data);
  }

  function toggleTag(key) {
    setFilterTags(p => p.includes(key) ? p.filter(t => t !== key) : [...p, key]);
  }

  function toggleFormTag(key) {
    setForm(p => ({
      ...p,
      tags: p.tags.includes(key) ? p.tags.filter(t => t !== key) : [...p.tags, key],
    }));
  }

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  return (
    <div className="page-container">

      {/* ============================================================ */}
      {/*  1. Header                                                    */}
      {/* ============================================================ */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: 12, marginBottom: 24,
      }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Mein Netzwerk <InfoTooltip moduleId="network" />
          </h1>
          <p className="page-subtitle">Dein Netzwerk ist dein Nettowert</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          + Neuen Kontakt anlegen
        </button>
      </div>

      {/* ============================================================ */}
      {/*  2. Warum Networking? Info Card                               */}
      {/* ============================================================ */}
      <div
        className="card animate-in"
        style={{ marginBottom: 28, background: 'var(--ki-bg-alt)', borderLeft: '4px solid var(--ki-red)' }}
      >
        <p style={{
          fontStyle: 'italic', color: 'var(--ki-text)', marginBottom: 16,
          fontSize: 15, lineHeight: 1.5,
        }}>
          &ldquo;80&#8201;% aller Stellen werden &uuml;ber Kontakte vergeben &mdash; nicht &uuml;ber Stellenanzeigen.&rdquo;
        </p>

        <div className="grid-3" style={{ gap: 16, marginBottom: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--ki-red)' }}>70&thinsp;%</span>
            <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 4 }}>
              der Jobs im verdeckten Arbeitsmarkt
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--ki-red)' }}>4x</span>
            <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 4 }}>
              h&ouml;here Chance f&uuml;r empfohlene Bewerber
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--ki-red)' }}>3</span>
            <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 4 }}>
              Kontakte bis zum Traumjob (Durchschnitt)
            </p>
          </div>
        </div>

        <a href="/masterclass" style={{ color: 'var(--ki-red)', fontWeight: 600, fontSize: 14 }}>
          &#9654; Networking E-Learning starten
        </a>
      </div>

      {/* ============================================================ */}
      {/*  2b. Ampel-System Summary Bar                                  */}
      {/* ============================================================ */}
      {contacts.length > 0 && (
        <div
          className="card animate-in"
          style={{
            marginBottom: 24, padding: '14px 20px',
            display: 'flex', flexWrap: 'wrap', gap: '8px 20px',
            alignItems: 'center', fontSize: 14,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{'\uD83D\uDFE2'}</span>
            <strong>{stats.ampelGreen}</strong>
            <span style={{ color: 'var(--ki-text-secondary)' }}>aktive Kontakte</span>
          </span>
          <span style={{ color: 'var(--ki-text-tertiary)' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{'\uD83D\uDFE1'}</span>
            <strong>{stats.ampelYellow}</strong>
            <span style={{ color: 'var(--ki-text-secondary)' }}>brauchen Touchpoint</span>
          </span>
          <span style={{ color: 'var(--ki-text-tertiary)' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{'\uD83D\uDD34'}</span>
            <strong>{stats.ampelRed}</strong>
            <span style={{ color: 'var(--ki-text-secondary)' }}>schlafen ein</span>
          </span>
          <span style={{ color: 'var(--ki-text-tertiary)' }}>|</span>
          <span style={{ fontWeight: 600 }}>
            Total: {stats.total}
          </span>
        </div>
      )}

      {/* ============================================================ */}
      {/*  3. Search + Sort Bar                                         */}
      {/* ============================================================ */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 20 }}>
        <input
          className="input"
          placeholder="Kontakt oder Firma suchen\u2026"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: '1 1 240px', maxWidth: 360 }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className={`btn ${sortBy === 'last' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: 13 }}
            onClick={() => setSortBy('last')}
          >
            Zuletzt kontaktiert
          </button>
          <button
            className={`btn ${sortBy === 'stars' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: 13 }}
            onClick={() => setSortBy('stars')}
          >
            Wichtigkeit
          </button>
        </div>
      </div>

      {/* Tag filter pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
        {TAG_OPTIONS.map(t => (
          <button
            key={t.key}
            className={`pill ${filterTags.includes(t.key) ? 'pill-gold' : 'pill-grey'}`}
            onClick={() => toggleTag(t.key)}
            style={{ cursor: 'pointer', fontSize: 13 }}
          >
            {t.icon} {t.label}
          </button>
        ))}
        {filterTags.length > 0 && (
          <button
            className="pill pill-red"
            onClick={() => setFilterTags([])}
            style={{ cursor: 'pointer', fontSize: 13 }}
          >
            Alle zur&uuml;cksetzen
          </button>
        )}
      </div>

      {/* ============================================================ */}
      {/*  4. Contact List                                              */}
      {/* ============================================================ */}
      {filtered.length === 0 && (
        <div className="card" style={{
          textAlign: 'center', padding: '40px 20px', color: 'var(--ki-text-tertiary)',
        }}>
          {contacts.length === 0
            ? 'Noch keine Kontakte. Lege deinen ersten Kontakt an!'
            : 'Keine Kontakte gefunden.'}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
        {filtered.map((c, idx) => {
          const border = statusBorder(c.status);
          const notesOpen = expandedNotes[c.id];
          const freshness = getContactFreshness(c.last_contact_date || c.last_contacted_at);

          return (
            <div
              key={c.id}
              className="card animate-in"
              style={{ borderLeft: border, animationDelay: `${idx * 40}ms`, padding: '20px 24px' }}
            >
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>

                {/* Avatar */}
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                  fontSize: 16, color: '#fff', flexShrink: 0,
                  background: initialsColor(c.name),
                }}>
                  {initials(c.name)}
                </div>

                {/* Info block */}
                <div style={{ flex: 1, minWidth: 200 }}>

                  {/* Name + stars + Ampel badge + status pill */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: 16 }}>{c.name}</strong>
                    <StarRating value={c.relationship_strength} onChange={val => updateStars(c.id, val)} />
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 8px',
                      borderRadius: 'var(--r-pill)',
                      background: `${freshness.color}18`,
                      color: freshness.color,
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                      {freshness.icon} {freshness.label}
                    </span>
                    {c.status === 'warm' && (
                      <span className="pill pill-gold" style={{ fontSize: 11 }}>Bald melden!</span>
                    )}
                    {c.status === 'cold' && (
                      <span className="pill pill-red" style={{ fontSize: 11 }}>Melde dich!</span>
                    )}
                  </div>

                  {/* Role | Company */}
                  <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginTop: 2 }}>
                    {c.role}{c.company ? ` | ${c.company}` : ''}
                  </p>

                  {/* Contact details row */}
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '6px 18px',
                    marginTop: 8, fontSize: 13, color: 'var(--ki-text-secondary)',
                  }}>
                    {c.phone && <span>&#9742; {c.phone}</span>}
                    {c.email && <span>&#9993; {c.email}</span>}
                    {c.city  && <span>&#x1F4CD; {c.city}</span>}
                    {c.linkedin_url && (
                      <a href={c.linkedin_url} target="_blank" rel="noopener noreferrer"
                        style={{ color: 'var(--ki-red)' }}>
                        LinkedIn
                      </a>
                    )}
                    {c.xing_url && (
                      <a href={c.xing_url} target="_blank" rel="noopener noreferrer"
                        style={{ color: 'var(--ki-red)' }}>
                        XING
                      </a>
                    )}
                  </div>

                  {/* Tags */}
                  {(c.tags || []).length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                      {c.tags.map(t => {
                        const tag = TAG_MAP[t];
                        return tag ? (
                          <span key={t} className="pill pill-grey" style={{ fontSize: 12 }}>
                            {tag.icon} {tag.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}

                  {/* How met */}
                  {c.how_met && (
                    <p style={{
                      fontSize: 12, color: 'var(--ki-text-tertiary)',
                      marginTop: 8, fontStyle: 'italic',
                    }}>
                      Kennengelernt: {c.how_met}
                    </p>
                  )}

                  {/* What can I give */}
                  {c.what_can_i_give && (
                    <p style={{
                      fontSize: 12, color: 'var(--ki-text-tertiary)',
                      marginTop: 4, fontStyle: 'italic',
                    }}>
                      Was kann ich geben: {c.what_can_i_give}
                    </p>
                  )}

                  {/* Notes (expandable) */}
                  {c.notes && (
                    <div style={{ marginTop: 8 }}>
                      <button
                        className="btn btn-ghost"
                        style={{ fontSize: 12, padding: '2px 6px' }}
                        onClick={() => setExpandedNotes(p => ({ ...p, [c.id]: !p[c.id] }))}
                      >
                        {notesOpen ? 'Notizen ausblenden' : 'Notizen anzeigen'}
                      </button>
                      {notesOpen && (
                        <pre style={{
                          marginTop: 6, fontSize: 12, whiteSpace: 'pre-wrap',
                          color: 'var(--ki-text-secondary)', background: 'var(--ki-bg-alt)',
                          padding: 10, borderRadius: 'var(--r-md)', lineHeight: 1.5,
                        }}>
                          {c.notes}
                        </pre>
                      )}
                    </div>
                  )}

                  {/* Last contact info */}
                  {c.daysSince !== null && (
                    <p style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', marginTop: 8 }}>
                      Letzter Kontakt: vor {c.daysSince} {c.daysSince === 1 ? 'Tag' : 'Tagen'}
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-primary"
                    style={{ fontSize: 13, padding: '6px 12px' }}
                    onClick={() => markContacted(c.id)}
                  >
                    &#x1F4DE; Kontaktiert
                  </button>
                  {c.email && (
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: 13, padding: '6px 12px' }}
                      onClick={() => {
                        const firstName = (c.name || '').split(' ')[0] || 'du';
                        setMessageText(`Hi ${firstName}, ich hoffe dir geht es gut! `);
                        setMessageModal(c.id);
                        setMessageCopied(false);
                      }}
                    >
                      &#x2709;&#xFE0F; Nachricht
                    </button>
                  )}
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: 13, padding: '6px 12px' }}
                    onClick={() => { setNoteModal(c.id); setNoteText(''); }}
                  >
                    &#x1F4DD; Notiz
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: 13, padding: '6px 12px' }}
                    onClick={() => openEdit(c)}
                  >
                    &#x270F;&#xFE0F; Bearbeiten
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: 13, padding: '6px 12px', color: 'var(--ki-error)' }}
                    onClick={() => deleteContact(c.id)}
                  >
                    &#x1F5D1;
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/*  6. Netzwerk-Statistik                                        */}
      {/* ============================================================ */}
      {contacts.length > 0 && (
        <div className="card animate-in" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16, color: 'var(--ki-text)' }}>
            Netzwerk-Statistik
          </h3>

          <div className="grid-3" style={{ gap: 16, marginBottom: 20 }}>
            <div style={{
              textAlign: 'center', padding: 16,
              background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)',
            }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--ki-text)' }}>{stats.total}</span>
              <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 4 }}>Kontakte gesamt</p>
            </div>
            <div style={{
              textAlign: 'center', padding: 16,
              background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)',
            }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--ki-success)' }}>{stats.active}</span>
              <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 4 }}>
                Aktiv (&lt;30 Tage)
              </p>
            </div>
            <div style={{
              textAlign: 'center', padding: 16,
              background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)',
            }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--ki-error)' }}>{stats.inactive}</span>
              <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 4 }}>
                Inaktiv (&gt;30 Tage)
              </p>
            </div>
          </div>

          {/* Tag breakdown */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {TAG_OPTIONS.map(t => (
              <span key={t.key} className="pill pill-grey" style={{ fontSize: 12 }}>
                {t.icon} {t.label}: {stats.tagCounts[t.key] || 0}
              </span>
            ))}
          </div>

          {/* Networking Score bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Networking-Score</p>
              <div style={{
                height: 12, background: 'var(--ki-bg-alt)',
                borderRadius: 'var(--r-pill)', overflow: 'hidden',
              }}>
                <div style={{
                  width: `${stats.score}%`, height: '100%',
                  background: scoreColor(stats.score),
                  borderRadius: 'var(--r-pill)', transition: 'width 500ms ease',
                }} />
              </div>
            </div>
            <span style={{
              fontSize: 24, fontWeight: 700, color: scoreColor(stats.score),
              minWidth: 56, textAlign: 'right',
            }}>
              {stats.score}%
            </span>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Note Modal                                                   */}
      {/* ============================================================ */}
      {noteModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 16,
          }}
          onClick={() => setNoteModal(null)}
        >
          <div
            className="card"
            style={{ maxWidth: 480, width: '100%', padding: 24 }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 12 }}>Notiz hinzuf&uuml;gen</h3>
            <textarea
              className="input"
              rows={4}
              placeholder="Notiz eingeben\u2026"
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              style={{ width: '100%', resize: 'vertical', marginBottom: 16 }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setNoteModal(null)}>Abbrechen</button>
              <button className="btn btn-primary" onClick={() => saveNote(noteModal)}>Speichern</button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  5. Add / Edit Contact Modal                                  */}
      {/* ============================================================ */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            zIndex: 1000, padding: 16, overflowY: 'auto',
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="card"
            style={{ maxWidth: 600, width: '100%', padding: 28, marginTop: 40, marginBottom: 40 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 20,
            }}>
              <h3 style={{ fontSize: 18 }}>
                {editId ? 'Kontakt bearbeiten' : 'Neuen Kontakt anlegen'}
              </h3>
              {!editId && (
                <span className="pill pill-green" style={{ fontSize: 12 }}>+20 XP</span>
              )}
            </div>

            {/* Vorname + Nachname */}
            <div className="grid-2" style={{ gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle}>Vorname *</label>
                <input
                  className="input" value={form.first_name}
                  onChange={e => f('first_name', e.target.value)}
                  placeholder="Max" style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={labelStyle}>Nachname *</label>
                <input
                  className="input" value={form.last_name}
                  onChange={e => f('last_name', e.target.value)}
                  placeholder="Mustermann" style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Firma + Position */}
            <div className="grid-2" style={{ gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle}>Firma / Organisation *</label>
                <input
                  className="input" value={form.company}
                  onChange={e => f('company', e.target.value)}
                  placeholder="Muster GmbH" style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={labelStyle}>Position / Rolle *</label>
                <input
                  className="input" value={form.role}
                  onChange={e => f('role', e.target.value)}
                  placeholder="HR Manager" style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Telefon + Email */}
            <div className="grid-2" style={{ gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle}>Telefon</label>
                <input
                  className="input" value={form.phone}
                  onChange={e => f('phone', e.target.value)}
                  placeholder="+49 170 1234567" style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  className="input" type="email" value={form.email}
                  onChange={e => f('email', e.target.value)}
                  placeholder="max@firma.de" style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Stadt */}
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Stadt</label>
              <input
                className="input" value={form.city}
                onChange={e => f('city', e.target.value)}
                placeholder="M\u00FCnchen" style={{ width: '100%' }}
              />
            </div>

            {/* LinkedIn + XING */}
            <div className="grid-2" style={{ gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle}>LinkedIn-URL</label>
                <input
                  className="input" value={form.linkedin_url}
                  onChange={e => f('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/in/..." style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={labelStyle}>XING-URL</label>
                <input
                  className="input" value={form.xing_url}
                  onChange={e => f('xing_url', e.target.value)}
                  placeholder="https://xing.com/profile/..." style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Tags multi-select */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Tags</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {TAG_OPTIONS.map(t => (
                  <button
                    key={t.key}
                    type="button"
                    className={`pill ${form.tags.includes(t.key) ? 'pill-gold' : 'pill-grey'}`}
                    style={{ cursor: 'pointer', fontSize: 12 }}
                    onClick={() => toggleFormTag(t.key)}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Beziehungsstaerke */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Beziehungsst&auml;rke</label>
              <StarRating
                value={form.relationship_strength}
                onChange={val => f('relationship_strength', val)}
              />
            </div>

            {/* Wie kennengelernt */}
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Wie kennengelernt</label>
              <input
                className="input" value={form.how_met}
                onChange={e => f('how_met', e.target.value)}
                placeholder="z.B. Messe, LinkedIn, Empfehlung\u2026"
                style={{ width: '100%' }}
              />
            </div>

            {/* Was kann ICH dieser Person geben? */}
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Was kann ICH dieser Person geben?</label>
              <textarea
                className="input" rows={2}
                value={form.what_can_i_give}
                onChange={e => f('what_can_i_give', e.target.value)}
                placeholder="z.B. Kontakte vermitteln, Fachwissen teilen, Feedback geben\u2026"
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            {/* Notizen */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Notizen</label>
              <textarea
                className="input" rows={3}
                value={form.notes}
                onChange={e => f('notes', e.target.value)}
                placeholder="Pers\u00F6nliche Notizen zum Kontakt\u2026"
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            {/* Modal actions */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>
                Abbrechen
              </button>
              <button className="btn btn-primary" onClick={saveContact} disabled={busy}>
                {busy ? 'Speichern\u2026' : editId ? 'Aktualisieren' : 'Kontakt anlegen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Quick Message Modal                                           */}
      {/* ============================================================ */}
      {messageModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 16,
          }}
          onClick={() => setMessageModal(null)}
        >
          <div
            className="card"
            style={{ maxWidth: 480, width: '100%', padding: 24 }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 4 }}>Nachricht schreiben</h3>
            <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
              Bearbeite die Nachricht und kopiere sie in die Zwischenablage.
            </p>
            <textarea
              className="input"
              rows={5}
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              style={{ width: '100%', resize: 'vertical', marginBottom: 16, fontSize: 14, lineHeight: 1.6 }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setMessageModal(null)}>
                Abbrechen
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  navigator.clipboard.writeText(messageText);
                  setMessageCopied(true);
                  setTimeout(() => setMessageCopied(false), 2000);
                }}
              >
                {messageCopied ? '\u2705 Kopiert!' : 'In Zwischenablage kopieren'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

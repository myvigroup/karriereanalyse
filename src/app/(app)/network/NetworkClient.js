'use client';
import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

const ROLE_OPTIONS = [
  { key: 'mentor', label: 'Mentor', icon: '🧠' },
  { key: 'headhunter', label: 'Headhunter', icon: '🔍' },
  { key: 'ex_boss', label: 'Ex-Vorgesetzte/r', icon: '👔' },
  { key: 'colleague', label: 'Kolleg/in', icon: '🤝' },
  { key: 'friend', label: 'Sparringspartner', icon: '💬' },
  { key: 'other', label: 'Sonstige', icon: '○' },
];

export default function NetworkClient({ contacts: initial, userId }) {
  const supabase = createClient();
  const [contacts, setContacts] = useState(initial || []);
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', role: 'colleague', company: '', notes: '', linkedin_url: '', relationship_strength: 3 });
  const [filter, setFilter] = useState('all');

  const today = new Date();
  const enriched = useMemo(() => contacts.map(c => {
    const lastDate = c.last_contact_date ? new Date(c.last_contact_date) : null;
    const daysSince = lastDate ? Math.floor((today - lastDate) / 86400000) : null;
    const status = !lastDate ? 'new' : daysSince > 90 ? 'cold' : daysSince > 30 ? 'warm' : 'active';
    return { ...c, daysSince, status };
  }), [contacts]);

  const filtered = filter === 'all' ? enriched : filter === 'reconnect' ? enriched.filter(c => c.status === 'cold' || c.status === 'warm') : enriched.filter(c => c.role === filter);
  const coldCount = enriched.filter(c => c.status === 'cold').length;

  const handleAdd = async () => {
    if (!newContact.name) return;
    const { data } = await supabase.from('contacts').insert({ user_id: userId, ...newContact }).select().single();
    if (data) { setContacts(p => [...p, data]); setShowAdd(false); setNewContact({ name: '', role: 'colleague', company: '', notes: '', linkedin_url: '', relationship_strength: 3 }); }
  };

  const handleDelete = async (id) => {
    await supabase.from('contacts').delete().eq('id', id);
    setContacts(p => p.filter(c => c.id !== id));
  };

  const markContacted = async (id) => {
    const now = new Date().toISOString().split('T')[0];
    await supabase.from('contacts').update({ last_contact_date: now }).eq('id', id);
    setContacts(p => p.map(c => c.id === id ? { ...c, last_contact_date: now } : c));
  };

  const statusColor = (s) => s === 'active' ? 'var(--ki-success)' : s === 'warm' ? 'var(--ki-warning)' : s === 'cold' ? 'var(--ki-red)' : 'var(--grey-4)';

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Netzwerk</h1>
          <p className="page-subtitle">{contacts.length} Kontakte{coldCount > 0 ? ` · ${coldCount} Re-Connects fällig` : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Kontakt</button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['all', 'Alle'], ['reconnect', `Re-Connect (${coldCount})`], ...ROLE_OPTIONS.map(r => [r.key, `${r.icon} ${r.label}`])].map(([key, label]) => (
          <button key={key} className={`btn ${filter === key ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(key)} style={{ fontSize: 12, padding: '6px 12px' }}>{label}</button>
        ))}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="card" style={{ width: 440, maxWidth: '90vw' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Kontakt hinzufügen</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input className="input" placeholder="Name *" value={newContact.name} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))} />
              <select className="input" value={newContact.role} onChange={e => setNewContact(p => ({ ...p, role: e.target.value }))}>
                {ROLE_OPTIONS.map(r => <option key={r.key} value={r.key}>{r.icon} {r.label}</option>)}
              </select>
              <input className="input" placeholder="Unternehmen" value={newContact.company} onChange={e => setNewContact(p => ({ ...p, company: e.target.value }))} />
              <input className="input" placeholder="LinkedIn-URL" value={newContact.linkedin_url} onChange={e => setNewContact(p => ({ ...p, linkedin_url: e.target.value }))} />
              <textarea className="input" placeholder="Notizen" rows={2} value={newContact.notes} onChange={e => setNewContact(p => ({ ...p, notes: e.target.value }))} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary" onClick={() => setShowAdd(false)} style={{ flex: 1 }}>Abbrechen</button>
                <button className="btn btn-primary" onClick={handleAdd} style={{ flex: 1 }}>Hinzufügen</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(c => {
          const roleInfo = ROLE_OPTIONS.find(r => r.key === c.role) || ROLE_OPTIONS[5];
          return (
            <div key={c.id} className="card animate-in" style={{ padding: 16, borderLeft: `3px solid ${statusColor(c.status)}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--ki-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {roleInfo.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>
                    {roleInfo.label}{c.company ? ` · ${c.company}` : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12 }}>
                  {c.daysSince !== null ? (
                    <span style={{ color: statusColor(c.status), fontWeight: 500 }}>
                      {c.daysSince === 0 ? 'Heute' : `vor ${c.daysSince}d`}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--grey-4)' }}>Kein Kontakt</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn-ghost" onClick={() => markContacted(c.id)} style={{ fontSize: 12, padding: '4px 10px' }} title="Als kontaktiert markieren">✓</button>
                  <button className="btn btn-ghost" onClick={() => handleDelete(c.id)} style={{ fontSize: 12, padding: '4px 10px', color: 'var(--ki-text-tertiary)' }}>×</button>
                </div>
              </div>
              {c.notes && <div style={{ marginTop: 8, fontSize: 13, color: 'var(--ki-text-secondary)', paddingLeft: 52 }}>{c.notes}</div>}
            </div>
          );
        })}
      </div>

      {contacts.length === 0 && (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🤝</div>
          <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 16 }}>Dein Netzwerk ist dein Karriere-Kapital. Füge deine wichtigsten Kontakte hinzu.</p>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>Ersten Kontakt hinzufügen</button>
        </div>
      )}
    </div>
  );
}

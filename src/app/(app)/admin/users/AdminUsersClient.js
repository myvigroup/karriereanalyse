'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const PHASE_OPTIONS = ['pre_coaching', 'active', 'alumni'];
const ROLE_OPTIONS = ['user', 'coach', 'admin'];
const FILTER_OPTIONS = [
  { label: 'Alle', value: 'all' },
  { label: 'Pre-Coaching', value: 'pre_coaching' },
  { label: 'Active', value: 'active' },
  { label: 'Alumni', value: 'alumni' },
];

export default function AdminUsersClient({ users: initialUsers }) {
  const supabase = createClient();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [docModal, setDocModal] = useState(null); // user object
  const [rejectionReason, setRejectionReason] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = users.filter(u => {
    if (filter !== 'all' && u.phase !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (u.name || '').toLowerCase().includes(s) || (u.email || '').toLowerCase().includes(s);
    }
    return true;
  });

  async function updateRole(userId, role) {
    await supabase.from('profiles').update({ role }).eq('id', userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  }

  async function updatePhase(userId, phase) {
    await supabase.from('profiles').update({ phase }).eq('id', userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, phase } : u));
  }

  async function updateDocStatus(docId, status, reason) {
    setSaving(true);
    const update = { status };
    if (reason) update.rejection_reason = reason;
    await supabase.from('career_documents').update(update).eq('id', docId);
    // Update local state
    setUsers(prev => prev.map(u => ({
      ...u,
      career_documents: (u.career_documents || []).map(d =>
        d.id === docId ? { ...d, ...update } : d
      )
    })));
    if (docModal) {
      setDocModal(prev => ({
        ...prev,
        career_documents: (prev.career_documents || []).map(d =>
          d.id === docId ? { ...d, ...update } : d
        )
      }));
    }
    setRejectionReason('');
    setSaving(false);
  }

  function getDocUrl(path) {
    const { data } = supabase.storage.from('career-documents').getPublicUrl(path);
    return data?.publicUrl || '#';
  }

  const initials = (name) => (name || '??').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="page-container animate-in">
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Nutzerverwaltung</h1>
        <p className="page-subtitle">{users.length} Nutzer registriert</p>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input
          className="input"
          placeholder="Name oder E-Mail suchen..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
        <div style={{ display: 'flex', gap: 4, background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-pill)', padding: 4 }}>
          {FILTER_OPTIONS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="btn"
              style={{
                padding: '6px 14px', fontSize: 13,
                background: filter === f.value ? 'var(--ki-card)' : 'transparent',
                boxShadow: filter === f.value ? 'var(--sh-sm)' : 'none',
                color: filter === f.value ? 'var(--ki-text)' : 'var(--ki-text-secondary)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--ki-border)' }}>
              {['', 'Name', 'E-Mail', 'Rolle', 'Phase', 'Level', 'XP', 'Registriert', 'Aktionen'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--ki-border)', transition: 'background var(--t-fast)' }}>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: 'var(--ki-red)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700,
                  }}>
                    {initials(user.name)}
                  </div>
                </td>
                <td style={{ padding: '10px 16px', fontWeight: 500 }}>{user.name || '—'}</td>
                <td style={{ padding: '10px 16px', color: 'var(--ki-text-secondary)' }}>{user.email || '—'}</td>
                <td style={{ padding: '10px 16px' }}>
                  <select
                    className="input"
                    value={user.role || 'user'}
                    onChange={e => updateRole(user.id, e.target.value)}
                    style={{ padding: '4px 8px', fontSize: 12, width: 'auto' }}
                  >
                    {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <select
                    className="input"
                    value={user.phase || 'pre_coaching'}
                    onChange={e => updatePhase(user.id, e.target.value)}
                    style={{ padding: '4px 8px', fontSize: 12, width: 'auto' }}
                  >
                    {PHASE_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
                <td style={{ padding: '10px 16px' }}>{user.level || 0}</td>
                <td style={{ padding: '10px 16px' }}>{user.xp || 0}</td>
                <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--ki-text-tertiary)' }}>
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('de-DE') : '—'}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  {(user.career_documents || []).length > 0 && (
                    <button onClick={() => setDocModal(user)} className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 10px' }}>
                      📄 Dokumente ({user.career_documents.length})
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--ki-text-tertiary)' }}>
            Keine Nutzer gefunden
          </div>
        )}
      </div>

      {/* Document Modal */}
      {docModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }} onClick={() => setDocModal(null)}>
          <div className="card" style={{ width: 560, maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Dokumente — {docModal.name}</h3>
              <button onClick={() => setDocModal(null)} className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 18 }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(docModal.career_documents || []).map(doc => (
                <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{doc.document_type}</div>
                    <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 2 }}>
                      {doc.file_path?.split('/').pop() || 'Datei'}
                    </div>
                    {doc.rejection_reason && (
                      <div style={{ fontSize: 12, color: 'var(--ki-red)', marginTop: 4 }}>Grund: {doc.rejection_reason}</div>
                    )}
                  </div>
                  <span className={`pill pill-${doc.status === 'accepted' ? 'green' : doc.status === 'rejected' ? 'red' : 'gold'}`} style={{ fontSize: 11 }}>
                    {doc.status === 'accepted' ? 'Akzeptiert' : doc.status === 'rejected' ? 'Abgelehnt' : 'Ausstehend'}
                  </span>
                  {doc.file_path && (
                    <a href={getDocUrl(doc.file_path)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 8px' }}>
                      Ansehen
                    </a>
                  )}
                  {doc.status !== 'accepted' && (
                    <button onClick={() => updateDocStatus(doc.id, 'accepted')} className="btn btn-primary" style={{ fontSize: 12, padding: '4px 10px' }} disabled={saving}>
                      ✓
                    </button>
                  )}
                  {doc.status !== 'rejected' && (
                    <button
                      onClick={() => {
                        const reason = prompt('Ablehnungsgrund:');
                        if (reason) updateDocStatus(doc.id, 'rejected', reason);
                      }}
                      className="btn btn-ghost"
                      style={{ fontSize: 12, padding: '4px 10px', color: 'var(--ki-red)' }}
                      disabled={saving}
                    >
                      ✗
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

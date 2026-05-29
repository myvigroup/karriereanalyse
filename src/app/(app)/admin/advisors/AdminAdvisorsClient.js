'use client';
import { useState, useEffect } from 'react';
import Icon from '@/components/ui/Icon';
import { saveAdvisor, deleteAdvisor, toggleAdvisorStatus } from './actions';

const EMPTY = { id: null, display_name: '', email: '', phone: '', status: 'active', slug: '' };

function initials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?';
}

export default function AdminAdvisorsClient({ initialAdvisors, baseUrl }) {
  const [advisors, setAdvisors] = useState(initialAdvisors);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  function copyAffiliateUrl(url) {
    if (!url) return;
    navigator.clipboard.writeText(url).then(
      () => showToast('Affiliate-Link kopiert.'),
      () => showToast('Konnte nicht kopieren.', 'error')
    );
  }

  useEffect(() => {
    if (!editing) return;
    const onKey = (e) => { if (e.key === 'Escape') setEditing(null); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [editing]);

  function showToast(text, kind = 'ok') {
    setToast({ text, kind });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave() {
    if (!editing.display_name || !editing.email) {
      showToast('Bitte Name und E-Mail ausfüllen.', 'error');
      return;
    }
    try {
      await saveAdvisor(editing);
      if (editing.id) {
        setAdvisors(prev => prev.map(a => a.id === editing.id ? { ...a, ...editing } : a));
      } else {
        // Neu — pessimistisch refresh empfehlen
        showToast('Berater angelegt. Seite wird neu geladen…', 'ok');
        setTimeout(() => window.location.reload(), 800);
      }
      setEditing(null);
      showToast('Gespeichert.', 'ok');
    } catch (e) { showToast('Fehler: ' + e.message, 'error'); }
  }

  async function handleDelete(advisor) {
    if (!confirm(`„${advisor.display_name}" wirklich löschen?`)) return;
    try {
      await deleteAdvisor(advisor.id);
      setAdvisors(prev => prev.filter(a => a.id !== advisor.id));
      showToast('Berater gelöscht.', 'ok');
    } catch (e) { showToast('Fehler: ' + e.message, 'error'); }
  }

  async function handleToggleStatus(advisor) {
    const newStatus = advisor.status === 'active' ? 'inactive' : 'active';
    try {
      await toggleAdvisorStatus(advisor.id, newStatus);
      setAdvisors(prev => prev.map(a => a.id === advisor.id ? { ...a, status: newStatus } : a));
      showToast(newStatus === 'active' ? 'Berater aktiviert.' : 'Berater deaktiviert.', 'ok');
    } catch (e) { showToast('Fehler: ' + e.message, 'error'); }
  }

  const filtered = advisors.filter(a => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (a.display_name || '').toLowerCase().includes(q)
        || (a.email || '').toLowerCase().includes(q)
        || (a.phone || '').toLowerCase().includes(q);
  });

  return (
    <div className="admin-advisors admin-coaches">
      <div className="admin-pageheader">
        <div>
          <div className="title-kicker"><span className="pulse" /> Admin · Berater</div>
          <h1 className="page-title">Berater <span className="faded">{advisors.length}</span></h1>
          <p className="page-sub">Account-Manager und Karriere-Berater verwalten. Lead-Counts pro Person sind angezeigt.</p>
        </div>
        <button className="admin-cta-primary" type="button" onClick={() => setEditing({ ...EMPTY })}>
          <Icon name="plus" size={14} stroke={2} /> Neuer Berater
        </button>
      </div>

      <div className="admin-toolbar">
        <input className="admin-search-input" type="search"
               placeholder="Nach Name, E-Mail oder Telefon suchen…"
               value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="admin-list">
        {filtered.length === 0 && <div className="admin-empty">Keine Berater gefunden.</div>}
        {filtered.map(a => (
          <div key={a.id} className={`admin-row ${a.status === 'inactive' ? 'inactive' : ''}`}>
            <div className="admin-avatar" style={{ background: 'linear-gradient(135deg, #1d4e89 0%, #0f2e4f 100%)' }}>
              {initials(a.display_name)}
            </div>
            <div className="admin-row-body">
              <div className="admin-row-name">
                {a.display_name}
                <span className={`admin-coach-badge ${a.status === 'inactive' ? 'inactive' : 'ext'}`}>
                  {a.status === 'inactive' ? 'inaktiv' : 'aktiv'}
                </span>
              </div>
              <div className="admin-row-content">
                {a.email}{a.phone ? ` · ${a.phone}` : ''}
              </div>
              <div className="admin-row-meta">
                <span>{a.leadCount} Leads</span>
                <span>·</span>
                <span>{a.referralCount} Reg. via Link</span>
                <span>·</span>
                <span>{a.affiliate_clicks || 0} Klicks</span>
                {a.created_at && <><span>·</span><span>Seit {new Date(a.created_at).toLocaleDateString('de-DE')}</span></>}
              </div>
              {a.affiliateUrl && (
                <div className="admin-affiliate-link">
                  <Icon name="globe" size={11} stroke={1.8} />
                  <code>{a.affiliateUrl}</code>
                  <button type="button" className="admin-link-copy" onClick={() => copyAffiliateUrl(a.affiliateUrl)} title="Kopieren">
                    <Icon name="paperclip" size={12} stroke={1.8} />
                  </button>
                </div>
              )}
            </div>
            <div className="admin-coach-actions">
              <button type="button" className="admin-icon-btn" onClick={() => handleToggleStatus(a)}
                      title={a.status === 'active' ? 'Deaktivieren' : 'Aktivieren'}>
                <Icon name={a.status === 'active' ? 'eye' : 'eye-off'} size={16} stroke={1.7} />
              </button>
              <button type="button" className="admin-action-btn" onClick={() => setEditing({ ...a })}>
                Bearbeiten
              </button>
              <button type="button" className="admin-icon-btn danger" onClick={() => handleDelete(a)} title="Löschen">
                <Icon name="x" size={16} stroke={1.8} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="admin-modal-overlay" onClick={() => setEditing(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h2>{editing.id ? 'Berater bearbeiten' : 'Neuer Berater'}</h2>
              <button className="admin-modal-close" onClick={() => setEditing(null)} type="button">
                <Icon name="x" size={18} stroke={2} />
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-section">
                <h3>Kontakt</h3>
                <div className="admin-form-section-body">
                  <label className="admin-form-field">
                    <span className="admin-form-label">Voller Name *</span>
                    <input value={editing.display_name}
                           onChange={e => setEditing(prev => ({ ...prev, display_name: e.target.value }))}
                           placeholder="Max Mustermann" />
                  </label>
                  <div className="admin-form-row">
                    <label className="admin-form-field">
                      <span className="admin-form-label">E-Mail *</span>
                      <input type="email" value={editing.email}
                             onChange={e => setEditing(prev => ({ ...prev, email: e.target.value }))}
                             placeholder="max@karriereinstitut.de" />
                    </label>
                    <label className="admin-form-field">
                      <span className="admin-form-label">Telefon</span>
                      <input value={editing.phone || ''}
                             onChange={e => setEditing(prev => ({ ...prev, phone: e.target.value }))}
                             placeholder="+49 511 …" />
                    </label>
                  </div>
                  <label className="admin-form-field">
                    <span className="admin-form-label">Status</span>
                    <select value={editing.status}
                            onChange={e => setEditing(prev => ({ ...prev, status: e.target.value }))}>
                      <option value="active">Aktiv</option>
                      <option value="inactive">Inaktiv</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="admin-form-section">
                <h3>Affiliate-Link</h3>
                <div className="admin-form-section-body">
                  <label className="admin-form-field">
                    <span className="admin-form-label">URL-Slug</span>
                    <input value={editing.slug || ''}
                           onChange={e => setEditing(prev => ({ ...prev, slug: e.target.value }))}
                           placeholder="max-mustermann (automatisch generiert wenn leer)" />
                    <span className="admin-form-hint">
                      Wird zu <strong>{baseUrl}/r/{editing.slug || '<auto>'}</strong> — eindeutig pro Berater.
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div className="admin-modal-foot">
              <button type="button" onClick={() => setEditing(null)} className="admin-action-btn">Abbrechen</button>
              <button type="button" onClick={handleSave} className="admin-cta-primary">Speichern</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`admin-toast ${toast.kind}`}>{toast.text}</div>}
    </div>
  );
}

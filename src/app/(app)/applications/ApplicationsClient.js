'use client';
import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

const COLUMNS = [
  { key: 'research', label: '🔍 Recherche', color: '#86868B' },
  { key: 'applied', label: '✉️ Beworben', color: '#5856D6' },
  { key: 'interview', label: '📅 Interview', color: '#D4A017' },
  { key: 'assessment', label: '🏆 AC / Finale', color: '#E8742A' },
  { key: 'offer', label: '🤝 Angebot', color: '#2D6A4F' },
];

export default function ApplicationsClient({ applications: initial, userId }) {
  const supabase = createClient();
  const [apps, setApps] = useState(initial || []);
  const [draggedId, setDraggedId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newApp, setNewApp] = useState({ company_name: '', position: '', salary_range: '', notes: '' });
  const [briefing, setBriefing] = useState(null);
  const [briefingLoading, setBriefingLoading] = useState(false);

  const handleBriefing = async (app) => {
    setBriefingLoading(true);
    try {
      const res = await fetch('/api/interview-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: app.company_name, position: app.position }),
      });
      const data = await res.json();
      setBriefing(data);
    } catch (e) {
      setBriefing({ error: 'Briefing konnte nicht generiert werden.' });
    }
    setBriefingLoading(false);
  };

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.key] = apps.filter(a => a.status === col.key);
    return acc;
  }, {});

  // Drag & Drop
  const onDragStart = (e, id) => { setDraggedId(id); e.dataTransfer.effectAllowed = 'move'; };
  const onDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const onDrop = useCallback(async (e, newStatus) => {
    e.preventDefault();
    if (!draggedId) return;
    setApps(prev => prev.map(a => a.id === draggedId ? { ...a, status: newStatus } : a));
    await supabase.from('applications').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', draggedId);
    setDraggedId(null);
  }, [draggedId, supabase]);

  // Add new
  const handleAdd = async () => {
    if (!newApp.company_name) return;
    const { data, error } = await supabase.from('applications').insert({
      user_id: userId, ...newApp, status: 'research',
    }).select().single();
    if (data) { setApps(prev => [...prev, data]); setShowAdd(false); setNewApp({ company_name: '', position: '', salary_range: '', notes: '' }); }
  };

  // Delete
  const handleDelete = async (id) => {
    await supabase.from('applications').delete().eq('id', id);
    setApps(prev => prev.filter(a => a.id !== id));
  };

  const Card = ({ app }) => (
    <div draggable onDragStart={(e) => onDragStart(e, app.id)}
      style={{
        background: 'var(--ki-card)', borderRadius: 'var(--r-md)', padding: 12, cursor: 'grab',
        boxShadow: 'var(--sh-sm)', opacity: draggedId === app.id ? 0.5 : 1,
        transition: 'all var(--t-fast)', border: '1px solid var(--ki-border)',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{ width: 28, height: 28, borderRadius: 'var(--r-sm)', background: 'var(--ki-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
          {app.company_name?.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{app.company_name}</div>
          {app.position && <div style={{ fontSize: 11, color: 'var(--ki-text-secondary)' }}>{app.position}</div>}
        </div>
        <button onClick={() => handleDelete(app.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ki-text-tertiary)', fontSize: 14 }}>×</button>
      </div>
      {app.salary_range && <div style={{ fontSize: 11, color: 'var(--ki-success)', fontWeight: 500 }}>{app.salary_range}</div>}
      {app.priority === 1 && <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--ki-red)', marginTop: 4 }} />}
      {app.interview_date && (
        <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', marginTop: 4 }}>
          📅 {new Date(app.interview_date).toLocaleDateString('de-DE')}
        </div>
      )}
      {app.status === 'interview' && (
        <button
          onClick={(e) => { e.stopPropagation(); handleBriefing(app); }}
          className="btn btn-secondary"
          style={{ fontSize: 11, padding: '4px 10px', marginTop: 6, width: '100%' }}
          disabled={briefingLoading}
        >
          {briefingLoading ? '⏳ Lädt...' : '📋 Briefing'}
        </button>
      )}
    </div>
  );

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Bewerbungs-Tracker</h1>
          <p className="page-subtitle">{apps.length} Bewerbung{apps.length !== 1 ? 'en' : ''} im System</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Neue Bewerbung</button>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="card" style={{ width: 420, maxWidth: '90vw' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Neue Bewerbung</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input className="input" placeholder="Unternehmen *" value={newApp.company_name} onChange={e => setNewApp(p => ({ ...p, company_name: e.target.value }))} />
              <input className="input" placeholder="Position" value={newApp.position} onChange={e => setNewApp(p => ({ ...p, position: e.target.value }))} />
              <input className="input" placeholder="Gehaltsrange (z.B. 80-100k)" value={newApp.salary_range} onChange={e => setNewApp(p => ({ ...p, salary_range: e.target.value }))} />
              <textarea className="input" placeholder="Notizen" rows={3} value={newApp.notes} onChange={e => setNewApp(p => ({ ...p, notes: e.target.value }))} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary" onClick={() => setShowAdd(false)} style={{ flex: 1 }}>Abbrechen</button>
                <button className="btn btn-primary" onClick={handleAdd} style={{ flex: 1 }}>Hinzufügen</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16 }}>
        {COLUMNS.map(col => (
          <div key={col.key} onDragOver={onDragOver} onDrop={(e) => onDrop(e, col.key)}
            style={{ minWidth: 220, flex: 1, background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-lg)', padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '0 4px' }}>
              <span style={{ fontSize: 14 }}>{col.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', background: 'var(--ki-card)', padding: '2px 8px', borderRadius: 'var(--r-pill)' }}>
                {grouped[col.key]?.length || 0}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 60 }}>
              {(grouped[col.key] || []).map(app => <Card key={app.id} app={app} />)}
            </div>
          </div>
        ))}
      </div>

      {apps.length === 0 && (
        <div className="card" style={{ padding: 48, textAlign: 'center', marginTop: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✉</div>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Noch keine Bewerbungen</h3>
          <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 16 }}>Füge deine erste Opportunity hinzu und tracke deinen Fortschritt.</p>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>Erste Bewerbung hinzufügen</button>
        </div>
      )}

      {/* Interview Briefing Modal */}
      {briefing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={() => setBriefing(null)}>
          <div className="card" style={{ width: 560, maxWidth: '90vw', maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>📋 Interview-Briefing</h3>
              <button onClick={() => setBriefing(null)} className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 18 }}>×</button>
            </div>
            {briefing.error ? (
              <p style={{ color: 'var(--ki-red)' }}>{briefing.error}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {briefing.company_info && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Firmen-Info</div>
                    <p style={{ fontSize: 14, lineHeight: 1.6 }}>{briefing.company_info}</p>
                  </div>
                )}
                {briefing.questions && briefing.questions.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Mögliche Fragen</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {briefing.questions.map((q, i) => (
                        <div key={i} style={{ padding: '10px 14px', background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)', fontSize: 14 }}>
                          {i + 1}. {q}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {briefing.star_template && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>STAR-Template</div>
                    <div style={{ padding: 16, background: 'rgba(204,20,38,0.03)', borderRadius: 'var(--r-md)', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                      {briefing.star_template}
                    </div>
                  </div>
                )}
                {briefing.strengths && briefing.strengths.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Deine Stärken-Matches</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {briefing.strengths.map((s, i) => (
                        <span key={i} className="pill pill-green">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

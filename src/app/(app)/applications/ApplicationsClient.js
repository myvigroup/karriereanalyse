'use client';
import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import InfoTooltip from '@/components/ui/InfoTooltip';

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
  const [selectedApp, setSelectedApp] = useState(null);
  const [showGenerate, setShowGenerate] = useState(false);
  const [genInput, setGenInput] = useState({ company: '', position: '' });
  const [genResult, setGenResult] = useState('');
  const [genLoading, setGenLoading] = useState(false);
  const [genCopied, setGenCopied] = useState(false);

  const handleGenerateApplication = async () => {
    if (!genInput.company || !genInput.position) return;
    setGenLoading(true);
    setGenResult('');
    try {
      const res = await fetch('/api/generate-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: genInput.company, position: genInput.position }),
      });
      const data = await res.json();
      setGenResult(data.text || data.result || JSON.stringify(data));
    } catch (e) {
      setGenResult('Fehler beim Generieren. Bitte versuche es erneut.');
    }
    setGenLoading(false);
  };

  const handleCopyGen = () => {
    navigator.clipboard.writeText(genResult);
    setGenCopied(true);
    setTimeout(() => setGenCopied(false), 2000);
  };

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

  // Sidebar update functions
  const updateAppField = async (id, field, value) => {
    await supabase.from('applications').update({ [field]: value, updated_at: new Date().toISOString() }).eq('id', id);
    setApps(prev => prev.map(a => a.id === id ? { ...a, [field]: value, updated_at: new Date().toISOString() } : a));
    setSelectedApp(prev => prev && prev.id === id ? { ...prev, [field]: value, updated_at: new Date().toISOString() } : prev);
  };

  const updateSidebarNotes = async (id, notes) => { await updateAppField(id, 'notes', notes); };
  const updateSidebarSalary = async (id, salary_range) => { await updateAppField(id, 'salary_range', salary_range); };
  const updateSidebarStatus = async (id, status) => { await updateAppField(id, 'status', status); };

  const Card = ({ app }) => {
    const daysSinceUpdate = Math.floor((new Date() - new Date(app.updated_at || app.created_at)) / 86400000);
    const needsFollowUp = app.status === 'applied' && daysSinceUpdate > 7;
    const interviewDays = app.interview_date ? Math.ceil((new Date(app.interview_date) - new Date()) / 86400000) : null;

    return (
      <div draggable onDragStart={(e) => onDragStart(e, app.id)} onClick={() => setSelectedApp(app)}
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
          <button onClick={(e) => { e.stopPropagation(); handleDelete(app.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ki-text-tertiary)', fontSize: 14 }}>×</button>
        </div>
        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
          {needsFollowUp && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--r-pill)', background: '#D4A017', color: '#fff' }}>
              Follow-up!
            </span>
          )}
          {interviewDays !== null && interviewDays >= 0 && interviewDays < 3 && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--r-pill)', background: '#E8742A', color: '#fff' }}>
              Vorbereiten!
            </span>
          )}
          {interviewDays !== null && interviewDays >= 3 && (
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-pill)', background: '#D4A017', color: '#fff' }}>
              Interview in {interviewDays} Tagen
            </span>
          )}
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
  };

  return (
    <div className="page-container">
      {/* Video-Platzhalter */}
      <div className="card" style={{ aspectRatio: '16/9', maxHeight: 200, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(204,20,38,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>▶</div>
        <div style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>Die perfekte Bewerbung in 2025</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Verfügbar ab April 2026</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Bewerbungs-Tracker<InfoTooltip moduleId="applications" profile={null} /></h1>
          <p className="page-subtitle">{apps.length} Bewerbung{apps.length !== 1 ? 'en' : ''} im System</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => { setShowGenerate(true); setGenResult(''); setGenInput({ company: '', position: '' }); }}>🤖 Bewerbung generieren</button>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Neue Bewerbung</button>
        </div>
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

      {/* Generate Application Modal */}
      {showGenerate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={(e) => e.target === e.currentTarget && setShowGenerate(false)}>
          <div className="card" style={{ width: 520, maxWidth: '90vw', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>🤖 Bewerbung generieren</h3>
              <button onClick={() => setShowGenerate(false)} className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 18 }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                className="input"
                placeholder="Firmenname *"
                value={genInput.company}
                onChange={e => setGenInput(p => ({ ...p, company: e.target.value }))}
              />
              <input
                className="input"
                placeholder="Position *"
                value={genInput.position}
                onChange={e => setGenInput(p => ({ ...p, position: e.target.value }))}
              />
              <button
                className="btn btn-primary"
                onClick={handleGenerateApplication}
                disabled={genLoading || !genInput.company || !genInput.position}
                style={{ width: '100%' }}
              >
                {genLoading ? '⏳ Generiere...' : '✨ KI generieren'}
              </button>
              {genResult && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 4 }}>Ergebnis</div>
                  <textarea
                    className="input"
                    rows={10}
                    value={genResult}
                    onChange={e => setGenResult(e.target.value)}
                    style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit', fontSize: 13, lineHeight: 1.6 }}
                  />
                  <button
                    className="btn btn-secondary"
                    onClick={handleCopyGen}
                    style={{ width: '100%' }}
                  >
                    {genCopied ? '✅ Kopiert!' : '📋 Kopieren'}
                  </button>
                </>
              )}
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

      {/* Detail Sidebar */}
      {selectedApp && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}
          onClick={(e) => e.target === e.currentTarget && setSelectedApp(null)}>
          <div style={{
            width: 400, maxWidth: '90vw', height: '100vh', background: 'var(--ki-card)',
            borderLeft: '1px solid var(--ki-border)', boxShadow: 'var(--sh-lg)',
            overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20,
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{selectedApp.company_name}</div>
                {selectedApp.position && <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>{selectedApp.position}</div>}
              </div>
              <button onClick={() => setSelectedApp(null)} className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 18 }}>×</button>
            </div>

            {/* Timeline */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>Timeline</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, paddingLeft: 12 }}>
                {[
                  { key: 'research', label: 'Erstellt', icon: '🔍' },
                  { key: 'applied', label: 'Gesendet', icon: '✉️' },
                  { key: 'interview', label: 'Interview', icon: '📅' },
                  { key: 'assessment', label: 'AC / Finale', icon: '🏆' },
                  { key: 'offer', label: 'Angebot / Absage', icon: '🤝' },
                ].map((step, i, arr) => {
                  const statusOrder = ['research', 'applied', 'interview', 'assessment', 'offer'];
                  const currentIdx = statusOrder.indexOf(selectedApp.status);
                  const stepIdx = statusOrder.indexOf(step.key);
                  const isActive = stepIdx <= currentIdx;
                  return (
                    <div key={step.key} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                          width: 10, height: 10, borderRadius: '50%',
                          background: isActive ? 'var(--ki-primary)' : 'var(--ki-border)',
                          border: isActive ? '2px solid var(--ki-primary)' : '2px solid var(--ki-border)',
                        }} />
                        {i < arr.length - 1 && (
                          <div style={{ width: 2, height: 24, background: stepIdx < currentIdx ? 'var(--ki-primary)' : 'var(--ki-border)' }} />
                        )}
                      </div>
                      <div style={{ paddingBottom: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--ki-text)' : 'var(--ki-text-tertiary)' }}>
                          {step.icon} {step.label}
                        </div>
                        {step.key === 'research' && selectedApp.created_at && (
                          <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>{new Date(selectedApp.created_at).toLocaleDateString('de-DE')}</div>
                        )}
                        {step.key === selectedApp.status && selectedApp.updated_at && (
                          <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>{new Date(selectedApp.updated_at).toLocaleDateString('de-DE')}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Nächster Schritt */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Nächster Schritt</div>
              <select className="input" value={selectedApp.status}
                onChange={(e) => updateSidebarStatus(selectedApp.id, e.target.value)}
                style={{ width: '100%' }}>
                {COLUMNS.map(col => (
                  <option key={col.key} value={col.key}>{col.label}</option>
                ))}
              </select>
            </div>

            {/* Gehalt-Range */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Gehalt-Range</div>
              <input className="input" placeholder="z.B. 80-100k"
                defaultValue={selectedApp.salary_range || ''}
                onBlur={(e) => updateSidebarSalary(selectedApp.id, e.target.value)}
                style={{ width: '100%' }} />
            </div>

            {/* Notizen */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Notizen</div>
              <textarea className="input" placeholder="Notizen hinzufügen..."
                defaultValue={selectedApp.notes || ''}
                onBlur={(e) => updateSidebarNotes(selectedApp.id, e.target.value)}
                style={{ width: '100%', minHeight: 120, flex: 1, resize: 'vertical' }} />
            </div>
          </div>
        </div>
      )}

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

'use client';
import { useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { awardPoints } from '@/lib/gamification';
import InfoTooltip from '@/components/ui/InfoTooltip';

const COLUMNS = [
  { key: 'research', label: '🔍 Recherche', color: '#86868B' },
  { key: 'applied', label: '✉️ Beworben', color: '#5856D6' },
  { key: 'interview', label: '📅 Interview', color: '#D4A017' },
  { key: 'assessment', label: '🏆 AC / Finale', color: '#E8742A' },
  { key: 'offer', label: '🤝 Angebot', color: '#2D6A4F' },
];

/* ── Dokumenten-Safe constants ── */
const DOC_STATUS_CONFIG = {
  missing: { label: 'Fehlt', color: 'var(--grey-4)', bg: 'var(--ki-bg-alt)', icon: '○' },
  pending: { label: 'Wird geprüft', color: 'var(--ki-warning)', bg: 'rgba(212,160,23,0.06)', icon: '◐' },
  accepted: { label: 'Akzeptiert', color: 'var(--ki-success)', bg: 'rgba(45,106,79,0.06)', icon: '✓' },
  rejected: { label: 'Abgelehnt', color: 'var(--ki-red)', bg: 'rgba(204,20,38,0.06)', icon: '✕' },
  feedback: { label: 'KI-Feedback', color: '#5856D6', bg: 'rgba(88,86,214,0.06)', icon: '◎' },
};

const DOC_TYPE_FILTERS = [
  { key: 'cv',          label: 'Lebenslauf',  icon: '📄' },
  { key: 'certificate', label: 'Zeugnisse',   icon: '📜' },
  { key: 'zertifikat',  label: 'Zertifikate', icon: '🎓' },
  { key: 'reference',   label: 'Referenzen',  icon: '📋' },
  { key: 'cover_letter',label: 'Anschreiben', icon: '📝' },
];

const PAGE_TABS = [
  { key: 'bewerbungen', label: '✉️ Bewerbungen' },
  { key: 'dokumente', label: '📂 Dokumenten-Safe' },
  { key: 'vorlagen', label: '📋 Vorlagen' },
];

export default function ApplicationsClient({ applications: initial, documents: initialDocs, userId }) {
  const supabase = createClient();

  /* ── Page-level tab ── */
  const [activePageTab, setActivePageTab] = useState('bewerbungen');

  /* ── Bewerbungen state ── */
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

  /* ── Dokumenten-Safe state ── */
  const [docs, setDocs] = useState(initialDocs || []);
  const [docUploading, setDocUploading] = useState(null);
  const [docAnalyzing, setDocAnalyzing] = useState(false);
  const [expandedAI, setExpandedAI] = useState(null);
  const [showMerge, setShowMerge] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [docMerging, setDocMerging] = useState(false);
  const [activeDocFilter, setActiveDocFilter] = useState(null);
  const [docDragOver, setDocDragOver] = useState(false);
  const docDropZoneRef = useRef(null);

  /* ── Dokumenten-Safe derived ── */
  const docRequired = docs.filter(d => d.is_required);
  const docAccepted = docs.filter(d => d.status === 'accepted').length;
  const docPending = docs.filter(d => d.status === 'pending').length;
  const docTotal = docRequired.length;
  const docPct = docTotal > 0 ? Math.round(((docAccepted + docPending) / docTotal) * 100) : 0;
  const docAllDone = docAccepted >= docTotal;
  const filteredDocs = activeDocFilter ? docs.filter(d => d.doc_type === activeDocFilter) : docs;

  /* ── Dokumenten-Safe handlers ── */
  const handleDocUpload = useCallback(async (doc, file) => {
    if (!file) return;
    setDocUploading(doc.id);
    try {
      const path = `${userId}/${doc.doc_type}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('career-documents').upload(path, file);
      if (uploadError) throw uploadError;
      const { error: updateError } = await supabase.from('career_documents').update({
        status: 'pending', file_path: path, file_name: file.name, uploaded_at: new Date().toISOString(),
      }).eq('id', doc.id);
      if (updateError) throw updateError;
      setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'pending', file_name: file.name, file_path: path } : d));
      await awardPoints(userId, 30);
    } catch (err) {
      console.error('Upload failed:', err);
    }
    setDocUploading(null);
  }, [supabase, userId]);

  const handleDocAIAnalysis = async (doc) => {
    setDocAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText: 'Lebenslauf-Inhalt wird aus dem hochgeladenen PDF extrahiert...', careerGoal: 'Führungsposition' }),
      });
      const analysis = await res.json();
      setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, ai_analysis: analysis, status: 'feedback' } : d));
      setExpandedAI(doc.id);
    } catch (err) {
      console.error('AI Analysis failed:', err);
    }
    setDocAnalyzing(false);
  };

  const handleDocMerge = async () => {
    setDocMerging(true);
    try {
      const res = await fetch('/api/merge-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_ids: selectedDocs }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'Bewerbungsmappe.pdf'; a.click();
        URL.revokeObjectURL(url);
        setShowMerge(false);
      }
    } catch (err) {
      console.error('Merge failed:', err);
    }
    setDocMerging(false);
  };

  const handleDocGlobalDrop = useCallback(async (e) => {
    e.preventDefault();
    setDocDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    const target = filteredDocs.find(d => d.status === 'missing' || d.status === 'rejected');
    if (target) await handleDocUpload(target, file);
  }, [filteredDocs, handleDocUpload]);

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
      {/* ── Page Title ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h1 className="page-title">Bewerbungen<InfoTooltip moduleId="applications" profile={null} /></h1>
      </div>
      <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', marginBottom: 20 }}>
        Bewerbungen tracken, Dokumente verwalten und Vorlagen nutzen.
      </p>

      {/* ── Tab Navigation ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
        {PAGE_TABS.map(t => (
          <button
            key={t.key}
            className={`btn ${activePageTab === t.key ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: 13, padding: '8px 18px', whiteSpace: 'nowrap', flexShrink: 0 }}
            onClick={() => setActivePageTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/*  TAB 1: Bewerbungen                                            */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activePageTab === 'bewerbungen' && <>
      {/* Video-Platzhalter */}
      <div className="card" style={{ aspectRatio: '16/9', maxHeight: 200, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(204,20,38,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>▶</div>
        <div style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>Die perfekte Bewerbung in 2025</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Verfügbar ab April 2026</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Bewerbungs-Tracker</h2>
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
      </>}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/*  TAB 2: Dokumenten-Safe                                        */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activePageTab === 'dokumente' && (
        <div style={{ maxWidth: 700 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Dokumenten-Safe</h2>
          <p className="page-subtitle" style={{ marginBottom: 24 }}>
            {docAllDone ? 'Dein Profil ist komplett!' : `Noch ${docTotal - docAccepted} Dokument${docTotal - docAccepted !== 1 ? 'e' : ''} bis zum Profil-Check`}
          </p>

          {/* Video Placeholder */}
          <div className="card" style={{ aspectRatio: '16/9', maxHeight: 200, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(204,20,38,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>▶</div>
            <div style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>Der perfekte Lebenslauf 2025</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Verfügbar ab April 2026</div>
          </div>

          {/* Global Drag & Drop Zone */}
          <div
            ref={docDropZoneRef}
            onDragOver={e => { e.preventDefault(); setDocDragOver(true); }}
            onDragLeave={() => setDocDragOver(false)}
            onDrop={handleDocGlobalDrop}
            style={{
              marginBottom: 24, padding: '28px 20px',
              border: `2px dashed ${docDragOver ? 'var(--ki-red)' : 'var(--grey-4)'}`,
              borderRadius: 'var(--r-lg)',
              background: docDragOver ? 'rgba(204,20,38,0.04)' : 'var(--ki-bg-alt)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 10, cursor: 'pointer', transition: 'all var(--t-fast)',
            }}
            onClick={() => {
              const target = filteredDocs.find(d => d.status === 'missing' || d.status === 'rejected');
              if (target) docDropZoneRef.current?.querySelector('input[type="file"]')?.click();
            }}
          >
            <div style={{ fontSize: 32 }}>📂</div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Datei hier ablegen oder klicken</div>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>PDF, JPG, PNG, DOC/DOCX</div>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0];
                const target = filteredDocs.find(d => d.status === 'missing' || d.status === 'rejected');
                if (file && target) handleDocUpload(target, file);
              }} />
          </div>

          {/* Document Type Filter Cards */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            {DOC_TYPE_FILTERS.map(ft => (
              <button
                key={ft.key}
                onClick={() => setActiveDocFilter(activeDocFilter === ft.key ? null : ft.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                  borderRadius: 'var(--r-md)',
                  border: `1.5px solid ${activeDocFilter === ft.key ? 'var(--ki-red)' : 'var(--grey-4)'}`,
                  background: activeDocFilter === ft.key ? 'rgba(204,20,38,0.06)' : 'var(--ki-bg-alt)',
                  color: activeDocFilter === ft.key ? 'var(--ki-red)' : 'var(--ki-text)',
                  fontWeight: activeDocFilter === ft.key ? 700 : 500,
                  fontSize: 13, cursor: 'pointer', transition: 'all var(--t-fast)',
                }}
              >
                <span>{ft.icon}</span><span>{ft.label}</span>
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="card" style={{ marginBottom: 24, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
              <span style={{ fontWeight: 600 }}>Profil-Fortschritt</span>
              <span style={{ fontWeight: 700, color: docAllDone ? 'var(--ki-success)' : 'var(--ki-red)' }}>{docPct}%</span>
            </div>
            <div className="progress-bar" style={{ height: 8 }}>
              <div className="progress-bar-fill" style={{ width: `${docPct}%`, background: docAllDone ? 'var(--ki-success)' : 'var(--ki-red)' }} />
            </div>
            {docAllDone && (
              <div style={{ marginTop: 12, padding: '10px 16px', background: 'rgba(45,106,79,0.06)', borderRadius: 'var(--r-md)', color: 'var(--ki-success)', fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
                ✓ Alle Pflichtdokumente eingereicht — dein Coach wird sie prüfen.
              </div>
            )}
          </div>

          {/* Document Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredDocs.map(doc => {
              const cfg = DOC_STATUS_CONFIG[doc.status] || DOC_STATUS_CONFIG.missing;
              const isCV = doc.doc_type === 'cv';
              const hasAI = doc.ai_analysis && Object.keys(doc.ai_analysis).length > 0;

              return (
                <div key={doc.id} className="card animate-in" style={{ padding: 20, borderLeft: `3px solid ${cfg.color}`, background: cfg.bg }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 20, color: cfg.color }}>{cfg.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{doc.doc_label}</div>
                      <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>
                        {doc.file_name ? doc.file_name : doc.is_required ? 'Pflichtdokument' : 'Optional'}
                      </div>
                    </div>
                    <span className={`pill ${doc.status === 'accepted' ? 'pill-green' : doc.status === 'rejected' ? 'pill-red' : doc.status === 'pending' ? 'pill-gold' : 'pill-grey'}`}>
                      {cfg.label}
                    </span>
                  </div>

                  {doc.status === 'rejected' && doc.feedback_note && (
                    <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(204,20,38,0.04)', borderRadius: 'var(--r-sm)', fontSize: 13, color: 'var(--ki-red)' }}>
                      Grund: {doc.feedback_note}
                    </div>
                  )}

                  {(doc.status === 'missing' || doc.status === 'rejected') && (
                    <div style={{ marginTop: 12 }}>
                      <label style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        padding: '12px', border: '2px dashed var(--grey-4)', borderRadius: 'var(--r-md)',
                        cursor: 'pointer', fontSize: 14, color: 'var(--ki-text-secondary)',
                        transition: 'all var(--t-fast)',
                      }}>
                        {docUploading === doc.id ? '⏳ Wird hochgeladen...' : '📎 Datei auswählen oder hierher ziehen'}
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style={{ display: 'none' }}
                          onChange={(e) => handleDocUpload(doc, e.target.files?.[0])} disabled={docUploading === doc.id} />
                      </label>
                    </div>
                  )}

                  {isCV && (doc.status === 'pending' || doc.status === 'feedback') && (
                    <div style={{ marginTop: 12 }}>
                      <button className="btn btn-secondary" onClick={() => hasAI ? setExpandedAI(expandedAI === doc.id ? null : doc.id) : handleDocAIAnalysis(doc)}
                        disabled={docAnalyzing} style={{ width: '100%', fontSize: 13 }}>
                        {docAnalyzing ? '🤖 KI analysiert...' : hasAI ? `🤖 KI-Analyse ${expandedAI === doc.id ? 'ausblenden' : 'anzeigen'}` : '🤖 KI-Analyse starten'}
                      </button>
                    </div>
                  )}

                  {hasAI && expandedAI === doc.id && (
                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {doc.ai_analysis.strengths?.length > 0 && (
                        <div style={{ padding: 12, background: 'rgba(45,106,79,0.04)', borderRadius: 'var(--r-md)' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-success)', marginBottom: 6 }}>Stärken</div>
                          {doc.ai_analysis.strengths.map((s, i) => <div key={i} style={{ fontSize: 13, color: 'var(--ki-text-secondary)', padding: '2px 0' }}>• {s}</div>)}
                        </div>
                      )}
                      {doc.ai_analysis.improvements?.length > 0 && (
                        <div style={{ padding: 12, background: 'rgba(212,160,23,0.04)', borderRadius: 'var(--r-md)' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-warning)', marginBottom: 6 }}>Optimierungspotenzial</div>
                          {doc.ai_analysis.improvements.map((s, i) => <div key={i} style={{ fontSize: 13, color: 'var(--ki-text-secondary)', padding: '2px 0' }}>• {s}</div>)}
                        </div>
                      )}
                      {doc.ai_analysis.missingKeywords?.length > 0 && (
                        <div style={{ padding: 12, background: 'rgba(204,20,38,0.04)', borderRadius: 'var(--r-md)' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-red)', marginBottom: 6 }}>Fehlende Keywords</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {doc.ai_analysis.missingKeywords.map((k, i) => <span key={i} className="pill pill-red">{k}</span>)}
                          </div>
                        </div>
                      )}
                      {doc.ai_analysis.summary && (
                        <div style={{ padding: 12, background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--ki-text)', lineHeight: 1.6 }}>
                          {doc.ai_analysis.summary}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <a href="/analyse" className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>
              Weiter zur Karriereanalyse →
            </a>
          </div>

          <button className="btn btn-secondary" onClick={() => setShowMerge(true)} style={{ width: '100%', marginTop: 12 }}>
            Bewerbungsmappe erstellen
          </button>

          {showMerge && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
              onClick={e => e.target === e.currentTarget && setShowMerge(false)}>
              <div className="card" style={{ width: 480, maxWidth: '90vw' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Bewerbungsmappe erstellen</h3>
                <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>Wähle die Dokumente für deine Bewerbungsmappe:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {docs.filter(d => d.file_path).map(doc => (
                    <label key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)', cursor: 'pointer' }}>
                      <input type="checkbox" checked={selectedDocs.includes(doc.id)}
                        onChange={() => setSelectedDocs(prev => prev.includes(doc.id) ? prev.filter(id => id !== doc.id) : [...prev, doc.id])} />
                      <span style={{ fontSize: 14 }}>{doc.doc_label}</span>
                      <span style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginLeft: 'auto' }}>{doc.file_name}</span>
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary" onClick={() => setShowMerge(false)} style={{ flex: 1 }}>Abbrechen</button>
                  <button className="btn btn-primary" onClick={handleDocMerge} disabled={selectedDocs.length === 0 || docMerging} style={{ flex: 1 }}>
                    {docMerging ? 'Wird erstellt...' : `${selectedDocs.length} Dokumente zusammenfügen`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/*  TAB 3: Vorlagen                                               */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {activePageTab === 'vorlagen' && (
        <div style={{ maxWidth: 700 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Vorlagen & Tipps</h2>
          <p className="page-subtitle" style={{ marginBottom: 24 }}>
            Nützliche Vorlagen und Tipps für deine Bewerbungsunterlagen.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Lebenslauf Tipps */}
            <div className="card animate-in" style={{ padding: 24, borderLeft: '3px solid var(--ki-red)' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 32 }}>📄</span>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Lebenslauf</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <li style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}><span style={{ color: 'var(--ki-red)', flexShrink: 0 }}>✓</span> Maximal 2 Seiten, antichronologisch aufgebaut</li>
                    <li style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}><span style={{ color: 'var(--ki-red)', flexShrink: 0 }}>✓</span> Professionelles Foto (kein Selfie, kein Urlaubsbild)</li>
                    <li style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}><span style={{ color: 'var(--ki-red)', flexShrink: 0 }}>✓</span> Keywords aus der Stellenanzeige einbauen</li>
                    <li style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}><span style={{ color: 'var(--ki-red)', flexShrink: 0 }}>✓</span> Erfolge quantifizieren (z.B. "Umsatz um 20% gesteigert")</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Anschreiben Tipps */}
            <div className="card animate-in" style={{ padding: 24, borderLeft: '3px solid #5856D6', animationDelay: '0.05s' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 32 }}>📝</span>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Anschreiben</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <li style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}><span style={{ color: '#5856D6', flexShrink: 0 }}>✓</span> Persönlicher Einstieg — warum genau dieses Unternehmen?</li>
                    <li style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}><span style={{ color: '#5856D6', flexShrink: 0 }}>✓</span> Maximal 1 Seite, klar strukturiert</li>
                    <li style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}><span style={{ color: '#5856D6', flexShrink: 0 }}>✓</span> Bezug zwischen eigener Erfahrung und Stellenanforderung herstellen</li>
                    <li style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}><span style={{ color: '#5856D6', flexShrink: 0 }}>✓</span> Aktive Sprache verwenden, Konjunktiv vermeiden</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Interview Tipps */}
            <div className="card animate-in" style={{ padding: 24, borderLeft: '3px solid var(--ki-warning)', animationDelay: '0.1s' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 32 }}>🎤</span>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Interview-Vorbereitung</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <li style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}><span style={{ color: 'var(--ki-warning)', flexShrink: 0 }}>✓</span> STAR-Methode für Verhaltensbasierte Fragen vorbereiten</li>
                    <li style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}><span style={{ color: 'var(--ki-warning)', flexShrink: 0 }}>✓</span> 3 eigene Fragen an den Interviewer vorbereiten</li>
                    <li style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}><span style={{ color: 'var(--ki-warning)', flexShrink: 0 }}>✓</span> Unternehmen und Branche vorab recherchieren</li>
                    <li style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}><span style={{ color: 'var(--ki-warning)', flexShrink: 0 }}>✓</span> Gehaltsvorstellung mit Marktwert-Tool abgleichen</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Networking Tipps */}
            <div className="card animate-in" style={{ padding: 24, borderLeft: '3px solid var(--ki-success)', animationDelay: '0.15s' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 32 }}>🤝</span>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Networking & Empfehlungen</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <li style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}><span style={{ color: 'var(--ki-success)', flexShrink: 0 }}>✓</span> LinkedIn-Profil aktuell halten und aktiv posten</li>
                    <li style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}><span style={{ color: 'var(--ki-success)', flexShrink: 0 }}>✓</span> Kontakte regelmäßig pflegen — alle 2 Wochen melden</li>
                    <li style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}><span style={{ color: 'var(--ki-success)', flexShrink: 0 }}>✓</span> Referenzen proaktiv anfragen und vorbereiten</li>
                    <li style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}><span style={{ color: 'var(--ki-success)', flexShrink: 0 }}>✓</span> Informational Interviews für den verdeckten Arbeitsmarkt nutzen</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

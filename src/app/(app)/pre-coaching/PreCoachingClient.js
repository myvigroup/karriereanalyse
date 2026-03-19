'use client';
import { useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { awardPoints } from '@/lib/gamification';
import InfoTooltip from '@/components/ui/InfoTooltip';

const STATUS_CONFIG = {
  missing: { label: 'Fehlt', color: 'var(--grey-4)', bg: 'var(--ki-bg-alt)', icon: '○' },
  pending: { label: 'Wird geprüft', color: 'var(--ki-warning)', bg: 'rgba(212,160,23,0.06)', icon: '◐' },
  accepted: { label: 'Akzeptiert', color: 'var(--ki-success)', bg: 'rgba(45,106,79,0.06)', icon: '✓' },
  rejected: { label: 'Abgelehnt', color: 'var(--ki-red)', bg: 'rgba(204,20,38,0.06)', icon: '✕' },
  feedback: { label: 'KI-Feedback', color: '#5856D6', bg: 'rgba(88,86,214,0.06)', icon: '◎' },
};

export default function PreCoachingClient({ documents: initial, userId }) {
  const supabase = createClient();
  const [docs, setDocs] = useState(initial || []);
  const [uploading, setUploading] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [expandedAI, setExpandedAI] = useState(null);
  const [showMerge, setShowMerge] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [merging, setMerging] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const dropZoneRef = useRef(null);

  const required = docs.filter(d => d.is_required);
  const accepted = docs.filter(d => d.status === 'accepted').length;
  const pending = docs.filter(d => d.status === 'pending').length;
  const total = required.length;
  const pct = total > 0 ? Math.round(((accepted + pending) / total) * 100) : 0;
  const allDone = accepted >= total;

  // Upload file
  const handleUpload = useCallback(async (doc, file) => {
    if (!file) return;
    setUploading(doc.id);
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
    setUploading(null);
  }, [supabase, userId]);

  // AI Analysis (CV only)
  const handleAIAnalysis = async (doc) => {
    setAnalyzing(true);
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
    setAnalyzing(false);
  };

  const handleMerge = async () => {
    setMerging(true);
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
        a.href = url;
        a.download = 'Bewerbungsmappe.pdf';
        a.click();
        URL.revokeObjectURL(url);
        setShowMerge(false);
      }
    } catch (err) {
      console.error('Merge failed:', err);
    }
    setMerging(false);
  };

  const DOC_TYPE_FILTERS = [
    { key: 'cv',          label: 'Lebenslauf',  icon: '📄' },
    { key: 'certificate', label: 'Zeugnisse',   icon: '📜' },
    { key: 'zertifikat',  label: 'Zertifikate', icon: '🎓' },
    { key: 'reference',   label: 'Referenzen',  icon: '📋' },
    { key: 'cover_letter',label: 'Anschreiben', icon: '📝' },
  ];

  const filteredDocs = activeFilter ? docs.filter(d => d.doc_type === activeFilter) : docs;

  // Global drag-and-drop: find first uploadable doc and upload the dropped file
  const handleGlobalDrop = useCallback(async (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    const target = filteredDocs.find(d => d.status === 'missing' || d.status === 'rejected');
    if (target) await handleUpload(target, file);
  }, [filteredDocs, handleUpload]);

  return (
    <div className="page-container" style={{ maxWidth: 700 }}>
      <h1 className="page-title">Dokumenten-Safe <InfoTooltip moduleId="pre-coaching" profile={null} /></h1>
      <p className="page-subtitle" style={{ marginBottom: 24 }}>
        {allDone ? 'Dein Profil ist komplett!' : `Noch ${total - accepted} Dokument${total - accepted !== 1 ? 'e' : ''} bis zum Profil-Check`}
      </p>

      {/* Video Placeholder */}
      <div className="card" style={{ aspectRatio: '16/9', maxHeight: 200, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(204,20,38,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>▶</div>
        <div style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>Der perfekte Lebenslauf 2025</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Verfügbar ab April 2026</div>
      </div>

      {/* Global Drag & Drop Zone */}
      <div
        ref={dropZoneRef}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleGlobalDrop}
        style={{
          marginBottom: 24,
          padding: '28px 20px',
          border: `2px dashed ${dragOver ? 'var(--ki-red)' : 'var(--grey-4)'}`,
          borderRadius: 'var(--r-lg)',
          background: dragOver ? 'rgba(204,20,38,0.04)' : 'var(--ki-bg-alt)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 10, cursor: 'pointer', transition: 'all var(--t-fast)',
        }}
        onClick={() => {
          const target = filteredDocs.find(d => d.status === 'missing' || d.status === 'rejected');
          if (target) dropZoneRef.current?.querySelector('input[type="file"]')?.click();
        }}
      >
        <div style={{ fontSize: 32 }}>📂</div>
        <div style={{ fontWeight: 600, fontSize: 15 }}>Datei hier ablegen oder klicken</div>
        <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>PDF, JPG, PNG, DOC/DOCX · Wird dem ersten offenen Slot zugewiesen</div>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files?.[0];
            const target = filteredDocs.find(d => d.status === 'missing' || d.status === 'rejected');
            if (file && target) handleUpload(target, file);
          }} />
      </div>

      {/* Document Type Filter Cards */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        {DOC_TYPE_FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(activeFilter === f.key ? null : f.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px',
              borderRadius: 'var(--r-md)',
              border: `1.5px solid ${activeFilter === f.key ? 'var(--ki-red)' : 'var(--grey-4)'}`,
              background: activeFilter === f.key ? 'rgba(204,20,38,0.06)' : 'var(--ki-bg-alt)',
              color: activeFilter === f.key ? 'var(--ki-red)' : 'var(--ki-text)',
              fontWeight: activeFilter === f.key ? 700 : 500,
              fontSize: 13, cursor: 'pointer', transition: 'all var(--t-fast)',
            }}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="card" style={{ marginBottom: 24, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
          <span style={{ fontWeight: 600 }}>Profil-Fortschritt</span>
          <span style={{ fontWeight: 700, color: allDone ? 'var(--ki-success)' : 'var(--ki-red)' }}>{pct}%</span>
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-bar-fill" style={{ width: `${pct}%`, background: allDone ? 'var(--ki-success)' : 'var(--ki-red)' }} />
        </div>
        {allDone && (
          <div style={{ marginTop: 12, padding: '10px 16px', background: 'rgba(45,106,79,0.06)', borderRadius: 'var(--r-md)', color: 'var(--ki-success)', fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
            ✓ Alle Pflichtdokumente eingereicht — dein Coach wird sie prüfen.
          </div>
        )}
      </div>

      {/* Document Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredDocs.map(doc => {
          const cfg = STATUS_CONFIG[doc.status] || STATUS_CONFIG.missing;
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

              {/* Rejection reason */}
              {doc.status === 'rejected' && doc.feedback_note && (
                <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(204,20,38,0.04)', borderRadius: 'var(--r-sm)', fontSize: 13, color: 'var(--ki-red)' }}>
                  Grund: {doc.feedback_note}
                </div>
              )}

              {/* Upload area */}
              {(doc.status === 'missing' || doc.status === 'rejected') && (
                <div style={{ marginTop: 12 }}>
                  <label style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px', border: '2px dashed var(--grey-4)', borderRadius: 'var(--r-md)',
                    cursor: 'pointer', fontSize: 14, color: 'var(--ki-text-secondary)',
                    transition: 'all var(--t-fast)',
                  }}>
                    {uploading === doc.id ? '⏳ Wird hochgeladen...' : '📎 Datei auswählen oder hierher ziehen'}
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style={{ display: 'none' }}
                      onChange={(e) => handleUpload(doc, e.target.files?.[0])} disabled={uploading === doc.id} />
                  </label>
                </div>
              )}

              {/* AI Analysis Button (CV only) */}
              {isCV && (doc.status === 'pending' || doc.status === 'feedback') && (
                <div style={{ marginTop: 12 }}>
                  <button className="btn btn-secondary" onClick={() => hasAI ? setExpandedAI(expandedAI === doc.id ? null : doc.id) : handleAIAnalysis(doc)}
                    disabled={analyzing} style={{ width: '100%', fontSize: 13 }}>
                    {analyzing ? '🤖 KI analysiert...' : hasAI ? `🤖 KI-Analyse ${expandedAI === doc.id ? 'ausblenden' : 'anzeigen'}` : '🤖 KI-Analyse starten'}
                  </button>
                </div>
              )}

              {/* AI Results */}
              {hasAI && expandedAI === doc.id && (
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {doc.ai_analysis.strengths?.length > 0 && (
                    <div style={{ padding: 12, background: 'rgba(45,106,79,0.04)', borderRadius: 'var(--r-md)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-success)', marginBottom: 6 }}>✅ Stärken</div>
                      {doc.ai_analysis.strengths.map((s, i) => <div key={i} style={{ fontSize: 13, color: 'var(--ki-text-secondary)', padding: '2px 0' }}>• {s}</div>)}
                    </div>
                  )}
                  {doc.ai_analysis.improvements?.length > 0 && (
                    <div style={{ padding: 12, background: 'rgba(212,160,23,0.04)', borderRadius: 'var(--r-md)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-warning)', marginBottom: 6 }}>🔧 Optimierungspotenzial</div>
                      {doc.ai_analysis.improvements.map((s, i) => <div key={i} style={{ fontSize: 13, color: 'var(--ki-text-secondary)', padding: '2px 0' }}>• {s}</div>)}
                    </div>
                  )}
                  {doc.ai_analysis.missingKeywords?.length > 0 && (
                    <div style={{ padding: 12, background: 'rgba(204,20,38,0.04)', borderRadius: 'var(--r-md)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-red)', marginBottom: 6 }}>🔑 Fehlende Keywords</div>
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
              <button className="btn btn-primary" onClick={handleMerge} disabled={selectedDocs.length === 0 || merging} style={{ flex: 1 }}>
                {merging ? 'Wird erstellt...' : `${selectedDocs.length} Dokumente zusammenfügen`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

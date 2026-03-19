'use client';
import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function CoachDashboardClient({
  clients,
  chatCount,
  coachNotes,
  analysisSessions,
  courseProgress,
  coachId,
}) {
  const supabase = createClient();
  const [expandedClientId, setExpandedClientId] = useState(null);
  const [notes, setNotes] = useState(() => {
    const map = {};
    coachNotes.forEach(n => { map[n.client_id] = n.content || ''; });
    return map;
  });
  const [savingNote, setSavingNote] = useState({});
  const [saveStatus, setSaveStatus] = useState({});

  // --- Derived KPIs ---
  const activeClients = clients.length;

  const scoresByClient = {};
  analysisSessions.forEach(s => {
    if (!scoresByClient[s.user_id]) scoresByClient[s.user_id] = s.overall_score;
  });
  const scores = Object.values(scoresByClient).filter(s => s != null);
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  const completedProgressCount = courseProgress.filter(p => p.completed_at != null).length;
  const totalProgressCount = courseProgress.length;
  const completionRate = totalProgressCount > 0
    ? Math.round((completedProgressCount / totalProgressCount) * 100)
    : 0;

  const openChats = chatCount;

  // --- Handlers ---
  const toggleClient = (id) => {
    setExpandedClientId(prev => (prev === id ? null : id));
  };

  const handleNoteChange = (clientId, value) => {
    setNotes(prev => ({ ...prev, [clientId]: value }));
  };

  const saveNote = useCallback(async (clientId) => {
    setSavingNote(prev => ({ ...prev, [clientId]: true }));
    const content = notes[clientId] || '';

    // Upsert into coach_notes
    const { error } = await supabase
      .from('coach_notes')
      .upsert(
        { coach_id: coachId, client_id: clientId, content, updated_at: new Date().toISOString() },
        { onConflict: 'coach_id,client_id' }
      );

    setSavingNote(prev => ({ ...prev, [clientId]: false }));
    setSaveStatus(prev => ({ ...prev, [clientId]: error ? 'Fehler beim Speichern' : 'Gespeichert' }));
    setTimeout(() => setSaveStatus(prev => ({ ...prev, [clientId]: '' })), 2500);
  }, [notes, coachId, supabase]);

  // --- Helpers ---
  const getClientScore = (clientId) => scoresByClient[clientId] ?? null;

  const getClientProgress = (clientId) => {
    const clientCourses = courseProgress.filter(p => p.user_id === clientId);
    if (clientCourses.length === 0) return null;
    const avg = Math.round(
      clientCourses.reduce((sum, p) => sum + (p.progress_pct || 0), 0) / clientCourses.length
    );
    const completed = clientCourses.filter(p => p.completed_at != null).length;
    return { avg, completed, total: clientCourses.length };
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const KPICard = ({ label, value, sub, accent }) => (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: 'var(--ki-text-secondary)',
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 40, fontWeight: 700, letterSpacing: '-0.04em',
        color: accent || 'var(--ki-text)',
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 4 }}>{sub}</div>
      )}
    </div>
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Coach Dashboard</h1>
      <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 32, fontSize: 15 }}>
        Übersicht deiner Klienten und deren Fortschritt
      </p>

      {/* KPI Grid */}
      <div className="grid-4" style={{ marginBottom: 40 }}>
        <KPICard label="Aktive Klienten" value={activeClients} sub="Gesamt registriert" />
        <KPICard label="Ø Analyse-Score" value={avgScore > 0 ? `${avgScore}` : '—'} sub="Über alle Klienten" accent="var(--ki-red)" />
        <KPICard label="Completion-Rate" value={`${completionRate}%`} sub={`${completedProgressCount} / ${totalProgressCount} Kurse`} accent="var(--ki-success)" />
        <KPICard label="Offene Chats" value={openChats} sub="Coaching-Nachrichten" />
      </div>

      {/* Client List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {clients.length === 0 && (
          <div className="card" style={{ textAlign: 'center', color: 'var(--ki-text-secondary)', padding: 48 }}>
            Noch keine Klienten vorhanden.
          </div>
        )}

        {clients.map(client => {
          const score = getClientScore(client.id);
          const progress = getClientProgress(client.id);
          const isExpanded = expandedClientId === client.id;
          const noteValue = notes[client.id] || '';
          const isSaving = savingNote[client.id];
          const status = saveStatus[client.id];

          return (
            <div key={client.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Client Row */}
              <div
                onClick={() => toggleClient(client.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                  cursor: 'pointer', transition: 'background var(--t-fast)',
                  background: isExpanded ? 'var(--ki-bg-alt)' : 'transparent',
                }}
                onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = 'var(--ki-bg-alt)'; }}
                onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Avatar / Initials */}
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--ki-red)', color: 'white', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
                }}>
                  {(client.name || client.email || '?').charAt(0).toUpperCase()}
                </div>

                {/* Name + Email */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {client.name || '—'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {client.email}
                  </div>
                </div>

                {/* Score pill */}
                <div style={{ flexShrink: 0 }}>
                  {score != null ? (
                    <span className="pill" style={{
                      background: score >= 70 ? 'rgba(34,197,94,0.12)' : score >= 40 ? 'rgba(234,179,8,0.12)' : 'rgba(204,20,38,0.10)',
                      color: score >= 70 ? 'var(--ki-success)' : score >= 40 ? '#ca8a04' : 'var(--ki-red)',
                    }}>
                      Score: {score}
                    </span>
                  ) : (
                    <span className="pill">Kein Score</span>
                  )}
                </div>

                {/* Letzte Aktivität */}
                <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', flexShrink: 0, width: 120, textAlign: 'right' }}>
                  {formatDate(client.updated_at)}
                </div>

                {/* Chat Button */}
                <a
                  href={`/admin/coaching?client=${client.id}`}
                  onClick={e => e.stopPropagation()}
                  className="btn btn-secondary"
                  style={{ flexShrink: 0, fontSize: 13, padding: '6px 14px' }}
                >
                  Chat öffnen
                </a>

                {/* Expand indicator */}
                <div style={{
                  flexShrink: 0, fontSize: 12, color: 'var(--ki-text-secondary)',
                  transform: isExpanded ? 'rotate(180deg)' : 'none',
                  transition: 'transform var(--t-fast)',
                }}>
                  ▼
                </div>
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div style={{
                  padding: '20px 20px 24px',
                  borderTop: '1px solid var(--ki-border)',
                  background: 'transparent',
                }}>
                  <div className="grid-3" style={{ gap: 20, marginBottom: 24 }}>
                    {/* Radar Score Placeholder */}
                    <div className="card" style={{ textAlign: 'center', background: 'var(--ki-bg-alt)' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                        Analyse-Score
                      </div>
                      <div style={{
                        width: 80, height: 80, borderRadius: '50%', margin: '0 auto 12px',
                        background: `conic-gradient(var(--ki-red) ${score != null ? score * 3.6 : 0}deg, var(--ki-border) 0deg)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative',
                      }}>
                        <div style={{
                          width: 60, height: 60, borderRadius: '50%', background: 'var(--ki-card)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 20, fontWeight: 700,
                        }}>
                          {score != null ? score : '—'}
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>
                        {score != null
                          ? score >= 70 ? 'Stark' : score >= 40 ? 'Mittel' : 'Ausbaufähig'
                          : 'Keine Analyse'}
                      </div>
                    </div>

                    {/* Kurs-Fortschritt */}
                    <div className="card" style={{ background: 'var(--ki-bg-alt)' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                        Kurs-Fortschritt
                      </div>
                      {progress ? (
                        <>
                          <div style={{ marginBottom: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                              <span>Ø Fortschritt</span>
                              <span style={{ fontWeight: 600 }}>{progress.avg}%</span>
                            </div>
                            <div className="progress-bar">
                              <div className="progress-bar-fill" style={{ width: `${progress.avg}%` }} />
                            </div>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginTop: 8 }}>
                            {progress.completed} von {progress.total} Kursen abgeschlossen
                          </div>
                        </>
                      ) : (
                        <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>Kein Kursfortschritt</div>
                      )}
                    </div>

                    {/* Client Info */}
                    <div className="card" style={{ background: 'var(--ki-bg-alt)' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                        Klient-Info
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ fontSize: 13 }}>
                          <span style={{ color: 'var(--ki-text-secondary)' }}>Onboarding: </span>
                          <span style={{ fontWeight: 500, color: client.onboarding_complete ? 'var(--ki-success)' : 'var(--ki-red)' }}>
                            {client.onboarding_complete ? 'Abgeschlossen' : 'Ausstehend'}
                          </span>
                        </div>
                        <div style={{ fontSize: 13 }}>
                          <span style={{ color: 'var(--ki-text-secondary)' }}>Punkte: </span>
                          <span style={{ fontWeight: 500 }}>{client.total_points || 0} KI-P</span>
                        </div>
                        <div style={{ fontSize: 13 }}>
                          <span style={{ color: 'var(--ki-text-secondary)' }}>Letzte Aktivität: </span>
                          <span style={{ fontWeight: 500 }}>{formatDate(client.updated_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coach Notes */}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Coach-Notizen</div>
                    <textarea
                      className="input"
                      value={noteValue}
                      onChange={e => handleNoteChange(client.id, e.target.value)}
                      placeholder="Notizen zu diesem Klienten..."
                      rows={4}
                      style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit', fontSize: 14, lineHeight: 1.6 }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => saveNote(client.id)}
                        disabled={isSaving}
                        style={{ fontSize: 13, padding: '8px 20px' }}
                      >
                        {isSaving ? 'Speichert...' : 'Notiz speichern'}
                      </button>
                      {status && (
                        <span style={{
                          fontSize: 13,
                          color: status === 'Gespeichert' ? 'var(--ki-success)' : 'var(--ki-red)',
                          fontWeight: 500,
                        }}>
                          {status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

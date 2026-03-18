'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function CoachingClient({ users, analysisResults, lessonProgress, applications, analysisScores }) {
  const supabase = createClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const [coachingNotes, setCoachingNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Aggregate data per user
  const userStats = useMemo(() => {
    const scoresByUser = {};
    (analysisScores || []).forEach(a => { scoresByUser[a.user_id] = a.overall_score; });

    const lessonsByUser = {};
    (lessonProgress || []).forEach(p => {
      if (!lessonsByUser[p.user_id]) lessonsByUser[p.user_id] = { total: 0, completed: 0 };
      lessonsByUser[p.user_id].total++;
      if (p.completed) lessonsByUser[p.user_id].completed++;
    });

    const appsByUser = {};
    (applications || []).forEach(a => {
      if (!appsByUser[a.user_id]) appsByUser[a.user_id] = { total: 0, offers: 0 };
      appsByUser[a.user_id].total++;
      if (a.status === 'offer' || a.status === 'accepted') appsByUser[a.user_id].offers++;
    });

    return users.map(u => ({
      ...u,
      score: scoresByUser[u.id] || null,
      lessons: lessonsByUser[u.id] || { total: 0, completed: 0 },
      apps: appsByUser[u.id] || { total: 0, offers: 0 },
    }));
  }, [users, analysisScores, lessonProgress, applications]);

  // Stats
  const activeCoachees = users.filter(u => u.phase === 'active').length;
  const avgScore = (() => {
    const scores = (analysisScores || []).map(a => a.overall_score).filter(Boolean);
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  })();
  const totalLessons = (lessonProgress || []).filter(p => p.completed).length;
  const totalOffers = (applications || []).filter(a => a.status === 'offer' || a.status === 'accepted').length;

  // Inactive users (>5 days)
  const now = Date.now();
  const inactiveUsers = userStats.filter(u => {
    if (!u.last_active_at) return true;
    return (now - new Date(u.last_active_at).getTime()) > 5 * 24 * 60 * 60 * 1000;
  }).filter(u => u.phase === 'active');

  function getDaysInactive(user) {
    if (!user.last_active_at) return '∞';
    return Math.floor((now - new Date(user.last_active_at).getTime()) / (1000 * 60 * 60 * 24));
  }

  async function sendImpuls(userId, userName) {
    setSaving(true);
    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'coaching_impulse',
      title: 'Coaching-Impuls',
      content: `Dein Coach hat an dich gedacht! Schau mal wieder vorbei.`,
      link: '/dashboard',
    });
    alert(`Impuls an ${userName} gesendet!`);
    setSaving(false);
  }

  return (
    <div className="page-container animate-in">
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Coaching-Cockpit</h1>
        <p className="page-subtitle">Übersicht, Fortschritt & Interventionsbedarf</p>
      </div>

      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {[
          { label: 'Aktive Coachees', value: activeCoachees, accent: 'var(--ki-red)' },
          { label: 'Ø Analyse-Score', value: `${avgScore}%`, accent: 'var(--ki-warning)' },
          { label: 'Lektionen gesamt', value: totalLessons, accent: 'var(--ki-success)' },
          { label: 'Angebote erhalten', value: totalOffers, accent: 'var(--ki-success)' },
        ].map((stat, i) => (
          <div key={i} className={`card animate-in delay-${i + 1}`}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em', color: stat.accent }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Early Warning */}
      {inactiveUsers.length > 0 && (
        <div className="card" style={{ marginBottom: 24, background: 'rgba(204,20,38,0.03)', border: '1px solid rgba(204,20,38,0.1)' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ki-red)', marginBottom: 12 }}>
            ⚠ {inactiveUsers.length} Coachee{inactiveUsers.length > 1 ? 's' : ''} brauchen Aufmerksamkeit
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {inactiveUsers.slice(0, 6).map(u => (
              <div key={u.id} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                background: 'rgba(204,20,38,0.06)', borderRadius: 'var(--r-pill)', fontSize: 13,
              }}>
                <span style={{ fontWeight: 500 }}>{u.name || 'Unbekannt'}</span>
                <span style={{ color: 'var(--ki-red)', fontSize: 12 }}>{getDaysInactive(u)}d inaktiv</span>
                <button onClick={() => sendImpuls(u.id, u.name)} className="btn" style={{ padding: '2px 8px', fontSize: 11, background: 'var(--ki-red)', color: 'white', borderRadius: 'var(--r-pill)' }} disabled={saving}>
                  Impuls
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column: List + Detail */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedUser ? '1fr 400px' : '1fr', gap: 24 }}>
        {/* Coachee List */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ki-border)' }}>
                {['Name', 'Phase', 'Score', 'Fortschritt', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {userStats.map(u => {
                const pct = u.lessons.total > 0 ? Math.round((u.lessons.completed / u.lessons.total) * 100) : 0;
                const isInactive = inactiveUsers.some(iu => iu.id === u.id);
                return (
                  <tr
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    style={{
                      borderBottom: '1px solid var(--ki-border)', cursor: 'pointer',
                      background: selectedUser?.id === u.id ? 'rgba(204,20,38,0.04)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '10px 16px', fontWeight: 500 }}>{u.name || '—'}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <span className={`pill pill-${u.phase === 'active' ? 'green' : u.phase === 'alumni' ? 'gold' : 'grey'}`} style={{ fontSize: 11 }}>
                        {u.phase || 'pre_coaching'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px' }}>{u.score ? `${Math.round(u.score)}%` : '—'}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ flex: 1, maxWidth: 100 }}>
                          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      {isInactive && <span style={{ fontSize: 12, color: 'var(--ki-red)', fontWeight: 600 }}>⚠ Inaktiv</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
        {selectedUser && (
          <div className="card animate-in" style={{ position: 'sticky', top: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>{selectedUser.name}</h3>
              <button onClick={() => setSelectedUser(null)} className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 16 }}>×</button>
            </div>

            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
              {selectedUser.email}<br />
              Phase: {selectedUser.phase || 'pre_coaching'} · Level {selectedUser.level || 0} · {selectedUser.xp || 0} XP
            </div>

            {/* Analyse */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Analyse-Score</div>
              {selectedUser.score ? (
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ki-red)' }}>{Math.round(selectedUser.score)}%</div>
              ) : (
                <div style={{ color: 'var(--ki-text-tertiary)', fontSize: 13 }}>Noch nicht durchgeführt</div>
              )}
            </div>

            {/* Progress */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Masterclass-Fortschritt</div>
              <div style={{ fontSize: 14 }}>{selectedUser.lessons.completed} / {selectedUser.lessons.total} Lektionen</div>
              <div className="progress-bar" style={{ marginTop: 6 }}>
                <div className="progress-bar-fill" style={{ width: `${selectedUser.lessons.total > 0 ? Math.round((selectedUser.lessons.completed / selectedUser.lessons.total) * 100) : 0}%` }} />
              </div>
            </div>

            {/* Applications */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Bewerbungen</div>
              <div style={{ fontSize: 14 }}>{selectedUser.apps.total} gesamt · {selectedUser.apps.offers} Angebote</div>
            </div>

            {/* Coaching Notes */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Coaching-Notizen</div>
              <textarea
                className="input"
                value={coachingNotes}
                onChange={e => setCoachingNotes(e.target.value)}
                rows={4}
                placeholder="Notizen zu diesem Coachee..."
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Impuls Button */}
            <button
              onClick={() => sendImpuls(selectedUser.id, selectedUser.name)}
              className="btn btn-primary"
              style={{ width: '100%', fontSize: 14 }}
              disabled={saving}
            >
              {saving ? 'Sendet...' : '💡 Impuls senden'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

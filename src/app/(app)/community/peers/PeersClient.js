'use client';
import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { hasAccess } from '@/lib/access-control';
import { getLevel } from '@/lib/gamification';
import UpgradePrompt from '@/components/ui/UpgradePrompt';
import EmptyState from '@/components/ui/EmptyState';

export default function PeersClient({ profile, potentialMatches, requests: initialRequests, userId }) {
  const supabase = createClient();
  const [requests, setRequests] = useState(initialRequests);
  const [sending, setSending] = useState(null);

  if (!hasAccess(profile, 'community')) {
    return (
      <div className="page-container">
        <h1 className="page-title">Peer-Matching</h1>
        <UpgradePrompt productName="Community" features={['Matching nach Branche & Ziel', 'Peer-Chat', 'Gemeinsame Challenges']} />
      </div>
    );
  }

  // Score matches by similarity
  const matches = useMemo(() => {
    return potentialMatches
      .map(m => {
        let score = 0;
        if (m.industry === profile?.industry) score += 3;
        if (m.career_obstacle === profile?.career_obstacle) score += 2;
        const salaryDiff = Math.abs((m.target_salary || 0) - (profile?.target_salary || 0));
        if (salaryDiff < (profile?.target_salary || 50000) * 0.2) score += 2;
        const levelDiff = Math.abs(getLevel(m.total_points || 0).level - getLevel(profile?.total_points || 0).level);
        if (levelDiff <= 1) score += 1;
        return { ...m, matchScore: score };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  }, [potentialMatches, profile]);

  const sentIds = requests.filter(r => r.from_user === userId).map(r => r.to_user);
  const receivedIds = requests.filter(r => r.to_user === userId && r.status === 'pending').map(r => r.from_user);

  const sendRequest = async (toUserId) => {
    setSending(toUserId);
    await supabase.from('peer_requests').insert({ from_user: userId, to_user: toUserId, status: 'pending' });
    setRequests(prev => [...prev, { from_user: userId, to_user: toUserId, status: 'pending' }]);
    setSending(null);
  };

  const acceptRequest = async (fromUserId) => {
    await supabase.from('peer_requests').update({ status: 'accepted' }).eq('from_user', fromUserId).eq('to_user', userId);
    setRequests(prev => prev.map(r => r.from_user === fromUserId && r.to_user === userId ? { ...r, status: 'accepted' } : r));
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Peer-Matching</h1>
      <p className="page-subtitle" style={{ marginBottom: 8 }}>Finde Gleichgesinnte für deinen Karriereweg</p>

      {!profile?.peer_matching_enabled && (
        <div className="card" style={{ marginBottom: 24, padding: 16, background: 'rgba(204,20,38,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14 }}>Peer-Matching aktivieren, um gefunden zu werden</span>
          <button className="btn btn-primary" style={{ fontSize: 13, padding: '8px 16px' }} onClick={async () => {
            await supabase.from('profiles').update({ peer_matching_enabled: true }).eq('id', userId);
            window.location.reload();
          }}>Aktivieren</button>
        </div>
      )}

      {/* Incoming requests */}
      {receivedIds.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Eingehende Anfragen</h3>
          {potentialMatches.filter(m => receivedIds.includes(m.id)).map(m => (
            <div key={m.id} className="card" style={{ padding: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--ki-red)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{m.first_name?.charAt(0) || '?'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{m.first_name}</div>
                <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>{m.industry}</div>
              </div>
              <button className="btn btn-primary" style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => acceptRequest(m.id)}>Annehmen</button>
            </div>
          ))}
        </div>
      )}

      {/* Suggested matches */}
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Deine Top-Matches</h3>
      {matches.length === 0 ? (
        <EmptyState icon={'\u{1F91D}'} title="Keine Matches gefunden" description="Aktiviere Peer-Matching und warte auf weitere Community-Mitglieder." />
      ) : (
        <div className="grid-3" style={{ marginBottom: 32 }}>
          {matches.map(m => {
            const level = getLevel(m.total_points || 0);
            const alreadySent = sentIds.includes(m.id);
            return (
              <div key={m.id} className="card animate-in" style={{ padding: 24, textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--ki-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: 'var(--ki-red)', margin: '0 auto 12px' }}>
                  {m.first_name?.charAt(0) || '?'}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{m.first_name}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 12 }}>
                  <span className="pill pill-grey" style={{ fontSize: 11 }}>{m.industry || 'k.A.'}</span>
                  <span className="pill pill-grey" style={{ fontSize: 11 }}>{level.icon} {level.name}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
                  Match-Score: {Math.round(m.matchScore / 8 * 100)}%
                </div>
                <button
                  className={`btn ${alreadySent ? 'btn-ghost' : 'btn-primary'}`}
                  style={{ width: '100%', fontSize: 13 }}
                  disabled={alreadySent || sending === m.id}
                  onClick={() => sendRequest(m.id)}
                >
                  {alreadySent ? 'Anfrage gesendet' : sending === m.id ? 'Wird gesendet...' : 'Anfrage senden'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

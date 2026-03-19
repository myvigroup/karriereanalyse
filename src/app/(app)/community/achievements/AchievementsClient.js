'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { hasAccess } from '@/lib/access-control';
import UpgradePrompt from '@/components/ui/UpgradePrompt';
import EmptyState from '@/components/ui/EmptyState';

export default function AchievementsClient({ achievements: initial, profile, userId }) {
  const supabase = createClient();
  const [achievements, setAchievements] = useState(initial);
  const [filter, setFilter] = useState('all');

  if (!hasAccess(profile, 'community')) {
    return (
      <div className="page-container">
        <h1 className="page-title">Community</h1>
        <UpgradePrompt
          productName="Community"
          features={['Achievement-Wall', 'Peer-Matching', 'Erfolgs-Stories']}
          trialText="7 Tage kostenlos mit der Masterclass testen"
        />
      </div>
    );
  }

  const now = new Date();
  const filtered = achievements.filter(a => {
    if (filter === 'today') return (now - new Date(a.created_at)) < 86400000;
    if (filter === 'week') return (now - new Date(a.created_at)) < 7 * 86400000;
    if (filter === 'month') return (now - new Date(a.created_at)) < 30 * 86400000;
    return true;
  });

  const handleLike = async (id) => {
    setAchievements(prev => prev.map(a => a.id === id ? { ...a, likes: (a.likes || 0) + 1 } : a));
    await supabase.from('public_achievements').update({ likes: filtered.find(a => a.id === id)?.likes + 1 || 1 }).eq('id', id);
  };

  const filters = [
    { key: 'all', label: 'Alle' },
    { key: 'today', label: 'Heute' },
    { key: 'week', label: 'Diese Woche' },
    { key: 'month', label: 'Diesen Monat' },
  ];

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Achievement-Wall</h1>
          <p className="page-subtitle">Feiere Erfolge mit der Community</p>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`btn ${filter === f.key ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: 12, padding: '6px 12px' }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={'\u{1F3C6}'} title="Noch keine Achievements" description="Sobald Community-Mitglieder Meilensteine erreichen, erscheinen sie hier." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(a => (
            <div key={a.id} className="card animate-in" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--ki-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'var(--ki-red)', flexShrink: 0 }}>
                  {a.profiles?.first_name?.charAt(0) || '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14 }}>
                    <strong>{a.profiles?.first_name || 'Anonym'}</strong>
                    {a.profiles?.industry && <span style={{ color: 'var(--ki-text-secondary)' }}> ({a.profiles.industry})</span>}
                  </div>
                  <div style={{ fontSize: 15, marginTop: 2 }}>{a.achievement_text}</div>
                  <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 4 }}>
                    {new Date(a.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <button onClick={() => handleLike(a.id)} className="btn btn-ghost" style={{ fontSize: 13, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {'\u2764\uFE0F'} {a.likes || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

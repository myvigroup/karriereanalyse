'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import EmptyState from '@/components/ui/EmptyState';

export default function OrgDashboardClient({ org, members: initial, userId }) {
  const supabase = createClient();
  const [members, setMembers] = useState(initial);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const activeMembers = members.filter(m => m.profiles?.onboarding_complete);
  const avgXP = members.length > 0
    ? Math.round(members.reduce((s, m) => s + (m.profiles?.total_points || 0), 0) / members.length)
    : 0;

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      const res = await fetch('/api/org/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, organizationId: org.id }),
      });
      const data = await res.json();
      if (data.success) {
        setInviteEmail('');
        setShowInvite(false);
        alert('Einladung gesendet!');
      } else {
        alert(data.error || 'Einladung fehlgeschlagen');
      }
    } catch {
      alert('Verbindungsfehler');
    }
    setInviting(false);
  };

  const handleRemove = async (memberId, memberUserId) => {
    if (!confirm('Mitglied wirklich entfernen?')) return;
    await supabase.from('org_members').delete().eq('id', memberId);
    setMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const KPI = ({ label, value, sub }) => (
    <div className="card animate-in" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em' }}>{value}</div>
      {sub && <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 4 }}>{sub}</div>}
    </div>
  );

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 className="page-title">{org?.name || 'Team'}</h1>
          <p className="page-subtitle">Team-Dashboard</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowInvite(!showInvite)} style={{ fontSize: 13 }}>
          + Mitglied einladen
        </button>
      </div>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <KPI label="Mitglieder" value={members.length} sub={`Max ${org?.max_seats || 10}`} />
        <KPI label="Aktiv" value={activeMembers.length} />
        <KPI label={'\u00D8 XP'} value={avgXP} />
        <KPI label="Pl\u00E4tze frei" value={Math.max(0, (org?.max_seats || 10) - members.length)} />
      </div>

      {/* Invite Form */}
      {showInvite && (
        <div className="card animate-in" style={{ marginBottom: 24, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Neues Mitglied einladen</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" type="email" placeholder="email@firma.de" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={handleInvite} disabled={inviting || !inviteEmail.trim()} style={{ fontSize: 13, opacity: inviting ? 0.6 : 1 }}>
              {inviting ? 'Wird gesendet...' : 'Einladen'}
            </button>
          </div>
        </div>
      )}

      {/* Members */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Mitglieder</h3>
        {members.length === 0 ? (
          <EmptyState icon={'\u{1F465}'} title="Noch keine Mitglieder" description="Lade dein Team ein um loszulegen." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {members.map(m => {
              const p = m.profiles;
              const days = p?.updated_at ? Math.floor((Date.now() - new Date(p.updated_at).getTime()) / 86400000) : null;
              const isYou = p?.id === userId;
              return (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--ki-border)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--ki-red)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                    {(p?.name || '?').charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{p?.name || 'Unbenannt'} {isYou && <span className="pill pill-grey" style={{ fontSize: 10 }}>Du</span>}</div>
                    <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>{p?.email}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text-secondary)' }}>{p?.total_points || 0} XP</div>
                  <span className={`pill ${days !== null && days < 7 ? 'pill-green' : 'pill-grey'}`} style={{ fontSize: 11 }}>
                    {days !== null ? (days === 0 ? 'Heute' : `vor ${days}d`) : 'Nie'}
                  </span>
                  <span className="pill pill-grey" style={{ fontSize: 11 }}>{m.role}</span>
                  {!isYou && m.role !== 'admin' && (
                    <button className="btn btn-ghost" onClick={() => handleRemove(m.id, p?.id)} style={{ fontSize: 11, padding: '4px 8px', color: 'var(--ki-error)' }}>
                      Entfernen
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

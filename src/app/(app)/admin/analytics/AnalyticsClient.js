'use client';
import { useMemo } from 'react';

export default function AnalyticsClient({ activeUsers7d, totalUsers, recentEvents, profiles }) {
  // KPIs
  const newRegistrations7d = useMemo(() => {
    const cutoff = new Date(Date.now() - 7 * 86400000);
    return profiles.filter(p => new Date(p.created_at) > cutoff).length;
  }, [profiles]);

  const onboardingRate = useMemo(() => {
    if (profiles.length === 0) return 0;
    const completed = profiles.filter(p => p.onboarding_complete).length;
    return Math.round((completed / profiles.length) * 100);
  }, [profiles]);

  const avgPoints = useMemo(() => {
    if (profiles.length === 0) return 0;
    return Math.round(profiles.reduce((s, p) => s + (p.total_points || 0), 0) / profiles.length);
  }, [profiles]);

  // Event distribution
  const eventCounts = useMemo(() => {
    const counts = {};
    recentEvents.forEach(e => { counts[e.event_name] = (counts[e.event_name] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [recentEvents]);

  const maxEventCount = eventCounts.length > 0 ? eventCounts[0][1] : 1;

  // Weekly registrations (last 8 weeks)
  const weeklyRegs = useMemo(() => {
    const weeks = [];
    for (let i = 7; i >= 0; i--) {
      const start = new Date(Date.now() - (i + 1) * 7 * 86400000);
      const end = new Date(Date.now() - i * 7 * 86400000);
      const count = profiles.filter(p => {
        const d = new Date(p.created_at);
        return d >= start && d < end;
      }).length;
      weeks.push({ label: `KW${Math.ceil((start.getTime() - new Date(start.getFullYear(), 0, 1).getTime()) / 604800000)}`, count });
    }
    return weeks;
  }, [profiles]);

  const maxWeekly = Math.max(...weeklyRegs.map(w => w.count), 1);

  const KPICard = ({ label, value, sub }) => (
    <div className="card animate-in" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.04em' }}>{value}</div>
      {sub && <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 4 }}>{sub}</div>}
    </div>
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Analytics</h1>
      <p className="page-subtitle" style={{ marginBottom: 32 }}>Plattform-\u00DCbersicht der letzten 30 Tage</p>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        <KPICard label="Aktive User (7d)" value={activeUsers7d} />
        <KPICard label="Neue Registrierungen" value={newRegistrations7d} sub="Letzte 7 Tage" />
        <KPICard label="Onboarding-Rate" value={`${onboardingRate}%`} />
        <KPICard label="\u00D8 KI-Points" value={avgPoints} sub={`${totalUsers} User gesamt`} />
      </div>

      <div className="grid-2" style={{ marginBottom: 32 }}>
        {/* Weekly Registrations Bar Chart */}
        <div className="card animate-in">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Registrierungen / Woche</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
            {weeklyRegs.map((w, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-text-secondary)' }}>{w.count}</div>
                <div style={{
                  width: '100%', borderRadius: '4px 4px 0 0',
                  background: 'var(--ki-red)', opacity: 0.2 + (w.count / maxWeekly) * 0.8,
                  height: `${Math.max((w.count / maxWeekly) * 120, 4)}px`,
                  transition: 'height 0.5s var(--ease-apple)',
                }} />
                <div style={{ fontSize: 10, color: 'var(--ki-text-tertiary)' }}>{w.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Used Modules */}
        <div className="card animate-in">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Meistgenutzte Module</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {eventCounts.map(([name, count], i) => (
              <div key={name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500 }}>{name.replace(/_/g, ' ')}</span>
                  <span style={{ color: 'var(--ki-text-secondary)' }}>{count}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${(count / maxEventCount) * 100}%` }} />
                </div>
              </div>
            ))}
            {eventCounts.length === 0 && <div style={{ fontSize: 14, color: 'var(--ki-text-tertiary)', padding: 16, textAlign: 'center' }}>Noch keine Events</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

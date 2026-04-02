import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';

export default async function AdvisorDashboard() {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: advisor } = await admin
    .from('advisors')
    .select('id, display_name')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!advisor) {
    return (
      <div style={{ textAlign: 'center', padding: 64 }}>
        <p style={{ color: '#86868b' }}>Kein Berater-Profil gefunden.</p>
      </div>
    );
  }

  // Zugewiesene Messen
  const { data: assignments } = await admin
    .from('fair_advisors')
    .select('fair_id')
    .eq('advisor_user_id', user.id);

  const fairIds = (assignments || []).map(a => a.fair_id);

  const { data: fairs } = fairIds.length > 0
    ? await admin.from('fairs').select('*').in('id', fairIds).order('start_date')
    : { data: [] };

  // Lead-Counts
  const { data: allLeads } = fairIds.length > 0
    ? await admin.from('fair_leads').select('fair_id, status, advisor_id').in('fair_id', fairIds).eq('advisor_id', advisor.id)
    : { data: [] };

  const today = new Date().toISOString().split('T')[0];
  const { data: todayLeads } = fairIds.length > 0
    ? await admin.from('fair_leads').select('id').in('fair_id', fairIds).eq('advisor_id', advisor.id).gte('created_at', today)
    : { data: [] };

  const openChecks = (allLeads || []).filter(l => ['cv_uploaded', 'feedback_given'].includes(l.status)).length;
  const totalLeads = (allLeads || []).length;

  const countByFair = (allLeads || []).reduce((acc, l) => {
    acc[l.fair_id] = (acc[l.fair_id] || 0) + 1;
    return acc;
  }, {});

  const activeFairs = (fairs || []).filter(f => ['upcoming', 'active'].includes(f.status));
  const pastFairs = (fairs || []).filter(f => f.status === 'completed');

  const formatDate = (d) => new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>
        Guten Tag{advisor.display_name ? `, ${advisor.display_name.split(' ')[0]}` : ''}
      </h1>
      <p style={{ color: '#86868b', marginBottom: 32 }}>
        Dein Berater-Dashboard
      </p>

      {/* Kennzahlen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
        {[
          { label: 'Gespräche heute', value: (todayLeads || []).length, color: '#CC1426' },
          { label: 'Offene CV-Checks', value: openChecks, color: '#D97706' },
          { label: 'Gespräche gesamt', value: totalLeads, color: '#059669' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: '#fff',
            borderRadius: 16,
            padding: '20px 24px',
            border: '1px solid #E8E6E1',
          }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: stat.color, marginBottom: 4 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 13, color: '#86868b' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Aktive Messen */}
      <h2 style={{ fontSize: 17, fontWeight: 600, color: '#1A1A1A', marginBottom: 16 }}>
        Meine Messen
      </h2>

      {activeFairs.length === 0 ? (
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 40,
          textAlign: 'center',
          border: '1px solid #E8E6E1',
          marginBottom: 32,
        }}>
          <p style={{ color: '#86868b' }}>Keine bevorstehenden Messen zugewiesen.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', marginBottom: 40 }}>
          {activeFairs.map(fair => (
            <Link
              key={fair.id}
              href={`/advisor/fair/${fair.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                background: '#fff',
                borderRadius: 16,
                padding: 20,
                border: '1px solid #E8E6E1',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              className="fair-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: '#1A1A1A' }}>{fair.name}</h3>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: 980,
                    background: fair.status === 'active' ? '#D1FAE5' : '#FFF3E0',
                    color: fair.status === 'active' ? '#059669' : '#D97706',
                    whiteSpace: 'nowrap',
                  }}>
                    {fair.status === 'active' ? 'Aktiv' : 'Bevorstehend'}
                  </span>
                </div>
                {fair.city && (
                  <p style={{ color: '#86868b', fontSize: 13, margin: '2px 0' }}>{fair.city}</p>
                )}
                <p style={{ color: '#86868b', fontSize: 13, margin: '2px 0 12px' }}>
                  {formatDate(fair.start_date)}
                  {fair.end_date && fair.end_date !== fair.start_date ? ` – ${formatDate(fair.end_date)}` : ''}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#86868b' }}>
                    <strong style={{ color: '#1A1A1A', fontSize: 18 }}>{countByFair[fair.id] || 0}</strong> Gespräche
                  </span>
                  <span style={{ fontSize: 13, color: '#CC1426', fontWeight: 600 }}>
                    Öffnen →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Vergangene Messen */}
      {pastFairs.length > 0 && (
        <>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: '#1A1A1A', marginBottom: 16 }}>
            Abgeschlossene Messen
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pastFairs.map(fair => (
              <div key={fair.id} style={{
                background: '#fff',
                borderRadius: 12,
                padding: '14px 20px',
                border: '1px solid #E8E6E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>{fair.name}</span>
                  <span style={{ color: '#86868b', fontSize: 13, marginLeft: 12 }}>{formatDate(fair.start_date)}</span>
                </div>
                <span style={{ fontSize: 13, color: '#86868b' }}>
                  {countByFair[fair.id] || 0} Gespräche
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        .fair-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}

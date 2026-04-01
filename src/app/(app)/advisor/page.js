import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';

export default async function AdvisorHome() {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Advisor-Profil laden (admin client umgeht RLS)
  const { data: advisor, error: advisorError } = await admin
    .from('advisors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!advisor) {
    return (
      <div style={{ textAlign: 'center', padding: 64 }}>
        <p style={{ color: '#86868b' }}>Kein Berater-Profil gefunden. (Debug: user_id={user.id}, error={advisorError?.message})</p>
      </div>
    );
  }

  // Zugewiesene Messen laden
  const { data: assignments } = await admin
    .from('fair_advisors')
    .select('fair_id')
    .eq('advisor_user_id', user.id);

  const fairIds = (assignments || []).map(a => a.fair_id);

  // Messe-Details separat laden
  const { data: fairs } = fairIds.length > 0
    ? await admin.from('fairs').select('*').in('id', fairIds)
    : { data: [] };

  // Lead-Counts pro Messe laden
  const { data: leads } = fairIds.length > 0
    ? await admin.from('fair_leads').select('fair_id').in('fair_id', fairIds)
    : { data: [] };

  const leadCountByFair = (leads || []).reduce((acc, l) => {
    acc[l.fair_id] = (acc[l.fair_id] || 0) + 1;
    return acc;
  }, {});

  const activeFairs = (fairs || [])
    .filter(f => ['upcoming', 'active'].includes(f.status));

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>
        Meine Messen
      </h1>
      <p style={{ color: '#86868b', marginBottom: 32 }}>
        Wähle eine Messe, um Gespräche zu führen.
      </p>

      {activeFairs.length === 0 ? (
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 48,
          textAlign: 'center',
          border: '1px solid #E8E6E1',
        }}>
          <p style={{ color: '#86868b', fontSize: 16 }}>
            Dir sind aktuell keine Messen zugewiesen.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {activeFairs.map((fair) => (
            <Link
              key={fair.id}
              href={`/advisor/fair/${fair.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                background: '#fff',
                borderRadius: 16,
                padding: 24,
                border: '1px solid #E8E6E1',
                transition: 'box-shadow 0.2s, transform 0.2s',
                cursor: 'pointer',
              }}
              className="fair-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>{fair.name}</h2>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: 980,
                    background: fair.status === 'active' ? '#E8F5E9' : '#FFF3E0',
                    color: fair.status === 'active' ? '#2D6A4F' : '#E65100',
                  }}>
                    {fair.status === 'active' ? 'Aktiv' : 'Bevorstehend'}
                  </span>
                </div>
                {fair.location && (
                  <p style={{ color: '#86868b', fontSize: 14, margin: '4px 0' }}>
                    {fair.location}
                  </p>
                )}
                <p style={{ color: '#86868b', fontSize: 14, margin: '4px 0' }}>
                  {formatDate(fair.date_start)}
                  {fair.date_end && fair.date_end !== fair.date_start ? ` – ${formatDate(fair.date_end)}` : ''}
                </p>
                <div style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: '1px solid #E8E6E1',
                  fontSize: 14,
                  color: '#86868b',
                }}>
                  <strong style={{ color: '#1A1A1A', fontSize: 24 }}>{leadCountByFair[fair.id] || 0}</strong> Gespräche
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .fair-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

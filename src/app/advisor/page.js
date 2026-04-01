import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdvisorHome() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Advisor-Profil laden
  const { data: advisor } = await supabase
    .from('advisors')
    .select('id')
    .eq('user_id', user.id)
    .single();

  // Zugewiesene Messen laden
  const { data: assignments } = await supabase
    .from('fair_advisors')
    .select('fair_id, fairs(id, name, location, date_start, date_end, status)')
    .eq('advisor_id', advisor.id);

  // Lead-Counts pro Messe laden
  const fairIds = (assignments || []).map(a => a.fair_id);
  const { data: leads } = fairIds.length > 0
    ? await supabase.from('fair_leads').select('fair_id').in('fair_id', fairIds)
    : { data: [] };

  const leadCountByFair = (leads || []).reduce((acc, l) => {
    acc[l.fair_id] = (acc[l.fair_id] || 0) + 1;
    return acc;
  }, {});

  const activeFairs = (assignments || [])
    .filter(a => a.fairs && ['upcoming', 'active'].includes(a.fairs.status))
    .map(a => a.fairs);

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
          {activeFairs.map(fair => (
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

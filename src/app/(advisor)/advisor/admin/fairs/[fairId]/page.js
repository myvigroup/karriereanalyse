import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { updateFair, assignAdvisorToFair, removeAdvisorFromFair } from '../../../actions';

const STATUS_LABELS = {
  new: 'Neu',
  analyzing: 'CV hochgeladen',
  feedback_pending: 'Feedback offen',
  completed: 'Abgeschlossen',
  contacted: 'Kontaktiert',
  converted: 'Konvertiert',
  lost: 'Verloren',
};

export default async function FairManagePage({ params }) {
  const { fairId } = params;
  const supabase = createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') redirect('/advisor');

  const [
    { data: fair },
    { data: leads },
    { data: assignments },
    { data: allAdvisors },
    { data: allProfiles },
  ] = await Promise.all([
    admin.from('fairs').select('*').eq('id', fairId).single(),
    admin.from('fair_leads').select('id, first_name, last_name, status, advisor_user_id, created_at').eq('fair_id', fairId).order('created_at', { ascending: false }),
    admin.from('fair_advisors').select('advisor_user_id, is_manager').eq('fair_id', fairId),
    admin.from('advisors').select('id, user_id, display_name'),
    admin.from('profiles').select('id, email'),
  ]);

  if (!fair) redirect('/advisor/admin');

  const assignedUserIds = new Set((assignments || []).map(a => a.advisor_user_id));
  const unassignedAdvisors = (allAdvisors || []).filter(a => !assignedUserIds.has(a.user_id));
  const profileById = (allProfiles || []).reduce((acc, p) => { acc[p.id] = p; return acc; }, {});
  const advisorByUserId = (allAdvisors || []).reduce((acc, a) => { acc[a.user_id] = a; return acc; }, {});

  // Status-Verteilung
  const statusCounts = (leads || []).reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '–';

  const inputStyle = {
    width: '100%',
    padding: '9px 13px',
    borderRadius: 8,
    border: '1px solid #E8E6E1',
    fontSize: 14,
    color: '#1A1A1A',
    background: '#fff',
    boxSizing: 'border-box',
  };

  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#86868b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' };

  const totalLeads = (leads || []).length;
  const openLeads = (leads || []).filter(l => ['new', 'analyzing', 'feedback_pending'].includes(l.status)).length;
  const completedLeads = (leads || []).filter(l => ['completed', 'contacted', 'converted'].includes(l.status)).length;

  return (
    <div>
      <Link href="/advisor/admin" style={{ fontSize: 13, color: '#86868b', textDecoration: 'none' }}>← Zurück zur Übersicht</Link>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', margin: '12px 0 4px' }}>{fair.name}</h1>
      <p style={{ color: '#86868b', marginBottom: 32, fontSize: 14 }}>{fair.city && `${fair.city} · `}{formatDate(fair.start_date)}</p>

      {/* KPI-Zeile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 36 }}>
        {[
          { label: 'Gespräche', value: totalLeads, color: '#CC1426' },
          { label: 'Offen', value: openLeads, color: '#D97706' },
          { label: 'Abgeschlossen', value: completedLeads, color: '#059669' },
          { label: 'Berater', value: (assignments || []).length, color: '#7C3AED' },
        ].map((k, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: '1px solid #E8E6E1' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 12, color: '#86868b', marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* ── Messe bearbeiten ── */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 14 }}>Messe bearbeiten</h2>
          <form action={updateFair}>
            <input type="hidden" name="id" value={fairId} />
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Name</label>
                <input name="name" defaultValue={fair.name} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Stadt</label>
                <input name="city" defaultValue={fair.city || ''} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Startdatum</label>
                  <input name="start_date" type="date" defaultValue={fair.start_date?.split('T')[0]} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Enddatum</label>
                  <input name="end_date" type="date" defaultValue={fair.end_date?.split('T')[0]} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select name="status" defaultValue={fair.status} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="upcoming">Bevorstehend</option>
                  <option value="active">Aktiv</option>
                  <option value="completed">Abgeschlossen</option>
                </select>
              </div>
              <button type="submit" style={{ padding: '10px 0', background: '#CC1426', color: '#fff', border: 'none', borderRadius: 980, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                Speichern
              </button>
            </div>
          </form>
        </div>

        {/* ── Berater ── */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 14 }}>Berater zuweisen</h2>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 24 }}>

            {/* Zugewiesene Berater */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                Zugewiesen ({(assignments || []).length})
              </div>
              {(assignments || []).length === 0 ? (
                <p style={{ fontSize: 13, color: '#86868b', margin: 0 }}>Noch kein Berater zugewiesen.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(assignments || []).map(a => {
                    const adv = advisorByUserId[a.advisor_user_id];
                    const prof = profileById[a.advisor_user_id];
                    return (
                      <div key={a.advisor_user_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#FAFAF8', borderRadius: 8, border: '1px solid #F0EEE9' }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{adv?.display_name || '–'}</div>
                          <div style={{ fontSize: 12, color: '#86868b' }}>{prof?.email || '–'}</div>
                        </div>
                        <form action={removeAdvisorFromFair} style={{ margin: 0 }}>
                          <input type="hidden" name="fair_id" value={fairId} />
                          <input type="hidden" name="advisor_user_id" value={a.advisor_user_id} />
                          <button type="submit" style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '4px 8px' }}>
                            Entfernen
                          </button>
                        </form>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Berater hinzufügen */}
            {unassignedAdvisors.length > 0 && (
              <div style={{ borderTop: '1px solid #F0EEE9', paddingTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                  Berater hinzufügen
                </div>
                <form action={assignAdvisorToFair} style={{ display: 'flex', gap: 8 }}>
                  <input type="hidden" name="fair_id" value={fairId} />
                  <select name="advisor_user_id" style={{ ...inputStyle, flex: 1 }}>
                    {unassignedAdvisors.map(a => (
                      <option key={a.user_id} value={a.user_id}>{a.display_name}</option>
                    ))}
                  </select>
                  <button type="submit" style={{ padding: '9px 16px', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap' }}>
                    + Zuweisen
                  </button>
                </form>
              </div>
            )}

            {unassignedAdvisors.length === 0 && (assignments || []).length === 0 && (
              <p style={{ fontSize: 13, color: '#86868b', margin: 0 }}>
                Keine Berater verfügbar. <Link href="/advisor/admin/advisors/new" style={{ color: '#CC1426' }}>Neuen Berater erstellen →</Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Status-Verteilung ── */}
      {totalLeads > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 14 }}>Status-Verteilung</h2>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 24 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(STATUS_LABELS).map(([status, label]) => {
                const count = statusCounts[status] || 0;
                if (count === 0) return null;
                const pct = Math.round((count / totalLeads) * 100);
                return (
                  <div key={status} style={{ padding: '8px 16px', background: '#FAFAF8', borderRadius: 10, border: '1px solid #E8E6E1', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>{count}</div>
                    <div style={{ fontSize: 11, color: '#86868b' }}>{label}</div>
                    <div style={{ fontSize: 11, color: '#86868b' }}>{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Leads-Liste ── */}
      {totalLeads > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 14 }}>
            Gespräche ({totalLeads})
          </h2>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 120px 140px', padding: '10px 20px', borderBottom: '1px solid #F0EEE9', background: '#FAFAF8' }}>
              {['Name', 'Berater', 'Status', 'Datum'].map(h => (
                <div key={h} style={{ fontSize: 11, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</div>
              ))}
            </div>
            {(leads || []).slice(0, 20).map((lead, i) => {
              const adv = advisorByUserId[lead.advisor_user_id];
              return (
                <div key={lead.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 120px 140px', padding: '12px 20px', alignItems: 'center', borderBottom: i < Math.min(leads.length, 20) - 1 ? '1px solid #F0EEE9' : 'none' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>{`${lead.first_name} ${lead.last_name || ''}`.trim()}</div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>{adv?.display_name || '–'}</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>{STATUS_LABELS[lead.status] || lead.status}</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>{formatDate(lead.created_at)}</div>
                </div>
              );
            })}
            {(leads || []).length > 20 && (
              <div style={{ padding: '12px 20px', fontSize: 13, color: '#86868b', borderTop: '1px solid #F0EEE9' }}>
                + {leads.length - 20} weitere Gespräche
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

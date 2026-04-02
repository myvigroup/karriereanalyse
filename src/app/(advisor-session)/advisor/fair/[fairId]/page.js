import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const STATUS_LABELS = {
  registered: { label: 'Registriert', bg: '#F3F4F6', color: '#6B7280' },
  cv_uploaded: { label: 'CV hochgeladen', bg: '#DBEAFE', color: '#1D4ED8' },
  feedback_given: { label: 'Feedback gegeben', bg: '#FEF3C7', color: '#D97706' },
  completed: { label: 'Abgeschlossen', bg: '#D1FAE5', color: '#059669' },
  activated: { label: 'Aktiviert', bg: '#E8F5E9', color: '#2D6A4F' },
  converted: { label: 'Konvertiert', bg: '#FCE4EC', color: '#CC1426' },
};

function getNextStep(lead) {
  switch (lead.status) {
    case 'registered': return `/advisor/fair/${lead.fair_id}/lead/${lead.id}/upload`;
    case 'cv_uploaded': return `/advisor/fair/${lead.fair_id}/lead/${lead.id}/review`;
    case 'feedback_given': return lead.email
      ? `/advisor/fair/${lead.fair_id}/lead/${lead.id}/summary`
      : `/advisor/fair/${lead.fair_id}/lead/${lead.id}/contact`;
    case 'completed': return `/advisor/fair/${lead.fair_id}/lead/${lead.id}/review`;
    case 'activated': return `/advisor/fair/${lead.fair_id}/lead/${lead.id}/review`;
    case 'converted': return `/advisor/fair/${lead.fair_id}/lead/${lead.id}/review`;
    default: return `/advisor/fair/${lead.fair_id}/lead/${lead.id}/upload`;
  }
}

export default async function FairDashboard({ params }) {
  const { fairId } = params;
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Messe laden
  const { data: fair } = await admin
    .from('fairs')
    .select('*')
    .eq('id', fairId)
    .single();

  if (!fair) redirect('/advisor');

  // Berater-ID prüfen
  const { data: advisor } = await admin
    .from('advisors')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!advisor) redirect('/advisor');

  // Prüfe Zuordnung + Messeleiter-Status
  const { data: assignment } = await admin
    .from('fair_advisors')
    .select('id, is_manager')
    .eq('fair_id', fairId)
    .eq('advisor_user_id', user.id)
    .maybeSingle();

  if (!assignment) redirect('/advisor');

  const isManager = assignment.is_manager === true;

  // Leads laden (heute) — Messeleiter sieht alle, Berater nur eigene
  const today = new Date().toISOString().split('T')[0];
  let todayQuery = admin
    .from('fair_leads')
    .select('*')
    .eq('fair_id', fairId)
    .gte('created_at', today)
    .order('created_at', { ascending: false });
  if (!isManager) todayQuery = todayQuery.eq('advisor_id', advisor.id);
  const { data: todayLeads } = await todayQuery;

  // Alle Leads zählen
  let countQuery = admin
    .from('fair_leads')
    .select('*', { count: 'exact', head: true })
    .eq('fair_id', fairId);
  if (!isManager) countQuery = countQuery.eq('advisor_id', advisor.id);
  const { count: totalLeads } = await countQuery;

  const formatDate = (d) => new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formatTime = (d) => new Date(d).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Link href="/advisor" style={{ fontSize: 13, color: '#86868b', textDecoration: 'none', display: 'inline-block', marginBottom: 8 }}>
          &larr; Alle Messen
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px' }}>
          {fair.name}
        </h1>
        <p style={{ color: '#86868b', margin: 0 }}>
          {fair.city && `${fair.city} · `}{formatDate(fair.start_date)}
        </p>
      </div>

      {/* Counter + CTA */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 24,
          border: '1px solid #E8E6E1',
          flex: '1 1 200px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: '#1A1A1A' }}>{(todayLeads || []).length}</div>
          <div style={{ fontSize: 14, color: '#86868b' }}>Gespräche heute</div>
        </div>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 24,
          border: '1px solid #E8E6E1',
          flex: '1 1 200px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: '#1A1A1A' }}>{totalLeads || 0}</div>
          <div style={{ fontSize: 14, color: '#86868b' }}>Gespräche gesamt</div>
        </div>
      </div>

      {/* Neues Gespräch */}
      <Link href={`/advisor/fair/${fairId}/new-lead`} style={{ textDecoration: 'none' }}>
        <div style={{
          background: '#CC1426',
          color: '#fff',
          borderRadius: 16,
          padding: '20px 32px',
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 32,
          cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}>
          + Neues Gespräch starten
        </div>
      </Link>

      {/* Heutige Leads */}
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1A1A1A', marginBottom: 16 }}>
        Heutige Gespräche
      </h2>

      {(!todayLeads || todayLeads.length === 0) ? (
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 32,
          textAlign: 'center',
          border: '1px solid #E8E6E1',
          color: '#86868b',
        }}>
          Noch keine Gespräche heute. Starte jetzt!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {todayLeads.map(lead => {
            const statusInfo = STATUS_LABELS[lead.status] || STATUS_LABELS.registered;
            return (
              <Link
                key={lead.id}
                href={getNextStep(lead)}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: '16px 20px',
                  border: '1px solid #E8E6E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{lead.name}</div>
                    <div style={{ fontSize: 13, color: '#86868b' }}>
                      {lead.email} · {formatTime(lead.created_at)}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: 980,
                    background: statusInfo.bg,
                    color: statusInfo.color,
                    whiteSpace: 'nowrap',
                  }}>
                    {statusInfo.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

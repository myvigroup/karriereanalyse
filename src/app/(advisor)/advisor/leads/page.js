import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';

const STATUS_LABELS = {
  registered: { label: 'Erfasst', bg: '#F3F4F6', color: '#6B7280' },
  cv_uploaded: { label: 'CV vorhanden', bg: '#DBEAFE', color: '#1D4ED8' },
  feedback_given: { label: 'Feedback offen', bg: '#FEF3C7', color: '#D97706' },
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
    default: return `/advisor/fair/${lead.fair_id}/lead/${lead.id}/review`;
  }
}

export default async function LeadsPage({ searchParams }) {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: advisor } = await admin
    .from('advisors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!advisor) return null;

  // Filter aus URL-Params
  const statusFilter = searchParams?.status || 'open';
  const fairFilter = searchParams?.fair || null;

  // Alle zugewiesenen Messen
  const { data: assignments } = await admin
    .from('fair_advisors')
    .select('fair_id')
    .eq('advisor_user_id', user.id);

  const fairIds = (assignments || []).map(a => a.fair_id);

  const { data: fairs } = fairIds.length > 0
    ? await admin.from('fairs').select('id, name').in('id', fairIds).order('date_start', { ascending: false })
    : { data: [] };

  // Leads laden
  let query = admin
    .from('fair_leads')
    .select('id, name, email, phone, status, fair_id, created_at, updated_at')
    .eq('advisor_id', advisor.id)
    .order('created_at', { ascending: false });

  if (fairFilter) {
    query = query.eq('fair_id', fairFilter);
  } else if (fairIds.length > 0) {
    query = query.in('fair_id', fairIds);
  }

  if (statusFilter === 'open') {
    query = query.in('status', ['registered', 'cv_uploaded', 'feedback_given']);
  } else if (statusFilter === 'completed') {
    query = query.in('status', ['completed', 'activated', 'converted']);
  }

  const { data: leads } = await query;

  const fairById = (fairs || []).reduce((acc, f) => { acc[f.id] = f; return acc; }, {});

  const formatDate = (d) => new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formatTime = (d) => new Date(d).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  const filterHref = (params) => {
    const p = new URLSearchParams({ status: statusFilter, ...(fairFilter ? { fair: fairFilter } : {}), ...params });
    return `/advisor/leads?${p.toString()}`;
  };

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>
        Lebenslauf-Checks
      </h1>
      <p style={{ color: '#86868b', marginBottom: 32 }}>
        Alle Gespräche und CV-Checks im Überblick.
      </p>

      {/* Filter-Leiste */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Status-Filter */}
        {[
          { key: 'open', label: 'Offen' },
          { key: 'completed', label: 'Abgeschlossen' },
          { key: 'all', label: 'Alle' },
        ].map(f => (
          <Link
            key={f.key}
            href={filterHref({ status: f.key })}
            style={{
              padding: '7px 16px',
              borderRadius: 980,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              background: statusFilter === f.key ? '#1A1A1A' : '#fff',
              color: statusFilter === f.key ? '#fff' : '#6B7280',
              border: '1px solid',
              borderColor: statusFilter === f.key ? '#1A1A1A' : '#E8E6E1',
            }}
          >
            {f.label}
          </Link>
        ))}

        {/* Messe-Filter */}
        {(fairs || []).length > 1 && (
          <div style={{ marginLeft: 8, display: 'flex', gap: 6 }}>
            <Link
              href={filterHref({ fair: undefined })}
              style={{
                padding: '7px 14px',
                borderRadius: 980,
                fontSize: 13,
                textDecoration: 'none',
                background: !fairFilter ? '#E8E6E1' : '#fff',
                color: '#1A1A1A',
                border: '1px solid #E8E6E1',
                fontWeight: !fairFilter ? 600 : 400,
              }}
            >
              Alle Messen
            </Link>
            {(fairs || []).map(f => (
              <Link
                key={f.id}
                href={filterHref({ fair: f.id })}
                style={{
                  padding: '7px 14px',
                  borderRadius: 980,
                  fontSize: 13,
                  textDecoration: 'none',
                  background: fairFilter === f.id ? '#E8E6E1' : '#fff',
                  color: '#1A1A1A',
                  border: '1px solid #E8E6E1',
                  fontWeight: fairFilter === f.id ? 600 : 400,
                }}
              >
                {f.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Tabelle */}
      {(!leads || leads.length === 0) ? (
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 48,
          textAlign: 'center',
          border: '1px solid #E8E6E1',
          color: '#86868b',
        }}>
          Keine Einträge gefunden.
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', overflow: 'hidden' }}>
          {/* Tabellen-Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 160px 140px 100px',
            padding: '12px 20px',
            borderBottom: '1px solid #F0EEE9',
            background: '#FAFAF8',
          }}>
            {['Name', 'Messe', 'Datum', 'Status', 'Aktion'].map(h => (
              <div key={h} style={{ fontSize: 12, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {h}
              </div>
            ))}
          </div>

          {leads.map((lead, i) => {
            const statusInfo = STATUS_LABELS[lead.status] || STATUS_LABELS.registered;
            const fair = fairById[lead.fair_id];
            const isOpen = ['registered', 'cv_uploaded', 'feedback_given'].includes(lead.status);

            return (
              <div
                key={lead.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 160px 140px 100px',
                  padding: '14px 20px',
                  alignItems: 'center',
                  borderBottom: i < leads.length - 1 ? '1px solid #F0EEE9' : 'none',
                  background: '#fff',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>{lead.name}</div>
                  <div style={{ fontSize: 12, color: '#86868b' }}>{lead.email || '–'}</div>
                </div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>
                  {fair?.name || '–'}
                </div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>
                  {formatDate(lead.created_at)}<br />
                  <span style={{ fontSize: 12 }}>{formatTime(lead.created_at)}</span>
                </div>
                <div>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: 980,
                    background: statusInfo.bg,
                    color: statusInfo.color,
                    whiteSpace: 'nowrap',
                  }}>
                    {statusInfo.label}
                  </span>
                </div>
                <div>
                  {isOpen ? (
                    <Link
                      href={getNextStep(lead)}
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#CC1426',
                        textDecoration: 'none',
                      }}
                    >
                      Weiter →
                    </Link>
                  ) : (
                    <Link
                      href={`/advisor/fair/${lead.fair_id}/lead/${lead.id}/review`}
                      style={{
                        fontSize: 13,
                        color: '#86868b',
                        textDecoration: 'none',
                      }}
                    >
                      Ansehen
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import FollowUpSelect from './FollowUpSelect';

const STATUS_LABELS = {
  new: { label: 'Neu', bg: '#F3F4F6', color: '#6B7280' },
  analyzing: { label: 'CV hochgeladen', bg: '#DBEAFE', color: '#1D4ED8' },
  feedback_pending: { label: 'Feedback offen', bg: '#FEF3C7', color: '#D97706' },
  completed: { label: 'Abgeschlossen', bg: '#D1FAE5', color: '#059669' },
  contacted: { label: 'Kontaktiert', bg: '#E8F5E9', color: '#2D6A4F' },
  converted: { label: 'Konvertiert', bg: '#FCE4EC', color: '#CC1426' },
  lost: { label: 'Verloren', bg: '#F3F4F6', color: '#9CA3AF' },
};

function getNextStep(lead) {
  switch (lead.status) {
    case 'new': return `/advisor/fair/${lead.fair_id}/lead/${lead.id}/upload`;
    case 'analyzing': return `/advisor/fair/${lead.fair_id}/lead/${lead.id}/review`;
    case 'feedback_pending': return lead.email
      ? `/advisor/fair/${lead.fair_id}/lead/${lead.id}/summary`
      : `/advisor/fair/${lead.fair_id}/lead/${lead.id}/contact`;
    default: return `/advisor/fair/${lead.fair_id}/lead/${lead.id}/review`;
  }
}

export default async function LeadsPage({ searchParams }) {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
  const isSuperAdmin = ['admin', 'messeleiter'].includes(profile?.role);

  const { data: advisor } = await admin
    .from('advisors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  // Admins ohne Berater-Eintrag dürfen trotzdem rein
  if (!advisor && !isSuperAdmin) return (
    <div style={{ padding: 40, color: '#86868b' }}>Kein Berater-Profil gefunden.</div>
  );

  // Filter aus URL-Params
  const statusFilter = searchParams?.status || 'all';
  const fairFilter = searchParams?.fair || null;
  const followUpFilter = searchParams?.followUp || null;

  // Alle zugewiesenen Messen + Messeleiter-Status
  const { data: assignments } = await admin
    .from('fair_advisors')
    .select('fair_id, is_manager')
    .eq('advisor_user_id', user.id);

  const fairIds = (assignments || []).map(a => a.fair_id);
  const managerFairIds = (assignments || []).filter(a => a.is_manager).map(a => a.fair_id);

  // Alle Messen laden (Admin sieht alle, andere nur ihre)
  const { data: fairs } = isSuperAdmin
    ? await admin.from('fairs').select('id, name').order('start_date', { ascending: false })
    : fairIds.length > 0
      ? await admin.from('fairs').select('id, name').in('id', fairIds).order('start_date', { ascending: false })
      : { data: [] };

  // Leads laden — Admin sieht alle, Messeleiter alle seiner Messen, Berater nur eigene
  let query = admin
    .from('fair_leads')
    .select('id, first_name, last_name, email, phone, status, follow_up_status, fair_id, advisor_user_id, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (isSuperAdmin) {
    // Admin sieht alles, nur Messe-Filter anwenden wenn gesetzt
    if (fairFilter) query = query.eq('fair_id', fairFilter);
  } else if (fairFilter) {
    const isManagerForFair = managerFairIds.includes(fairFilter);
    query = query.eq('fair_id', fairFilter);
    if (!isManagerForFair) query = query.eq('advisor_user_id', user.id);
  } else if (fairIds.length > 0 && managerFairIds.length > 0) {
    query = query.in('fair_id', fairIds);
  } else {
    query = query.eq('advisor_user_id', user.id);
    if (fairIds.length > 0) query = query.in('fair_id', fairIds);
  }

  if (statusFilter === 'open') {
    query = query.in('status', ['new', 'analyzing', 'feedback_pending']);
  } else if (statusFilter === 'completed') {
    query = query.in('status', ['completed', 'contacted', 'converted', 'lost']);
  }

  if (followUpFilter === 'none') {
    query = query.is('follow_up_status', null);
  } else if (followUpFilter) {
    query = query.eq('follow_up_status', followUpFilter);
  }

  const { data: leads } = await query;

  const fairById = (fairs || []).reduce((acc, f) => { acc[f.id] = f; return acc; }, {});

  const formatDate = (d) => new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formatTime = (d) => new Date(d).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  const filterHref = (params) => {
    const base = {
      status: statusFilter,
      ...(fairFilter ? { fair: fairFilter } : {}),
      ...(followUpFilter ? { followUp: followUpFilter } : {}),
    };
    const merged = { ...base, ...params };
    // undefined-Werte entfernen
    Object.keys(merged).forEach(k => merged[k] === undefined && delete merged[k]);
    const p = new URLSearchParams(merged);
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

        {/* Follow-up Filter */}
        <div style={{ width: '100%', height: 0 }} />
        {[
          { key: null, label: 'Alle Nachfass-Status' },
          { key: 'none', label: 'Kein Status' },
          { key: 'not_reached', label: 'Nicht erreicht' },
          { key: 'appointment_set', label: 'Termin vereinbart' },
          { key: 'interested', label: 'Interessiert' },
          { key: 'no_interest', label: 'Kein Interesse' },
          { key: 'purchased', label: 'Gekauft ✓' },
        ].map(f => {
          const isActive = f.key === null ? !followUpFilter : followUpFilter === f.key;
          return (
            <Link
              key={String(f.key)}
              href={filterHref({ followUp: f.key === null ? undefined : f.key })}
              style={{
                padding: '5px 14px',
                borderRadius: 980,
                fontSize: 12,
                fontWeight: isActive ? 600 : 400,
                textDecoration: 'none',
                background: isActive ? '#1A1A1A' : '#fff',
                color: isActive ? '#fff' : '#6B7280',
                border: '1px solid',
                borderColor: isActive ? '#1A1A1A' : '#E8E6E1',
                whiteSpace: 'nowrap',
              }}
            >
              {f.label}
            </Link>
          );
        })}

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
            gridTemplateColumns: '1.4fr 1fr 140px 160px 80px',
            padding: '12px 20px',
            borderBottom: '1px solid #F0EEE9',
            background: '#FAFAF8',
          }}>
            {['Name & Kontakt', 'Messe', 'Datum', 'Nachfassen', 'Aktion'].map(h => (
              <div key={h} style={{ fontSize: 12, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {h}
              </div>
            ))}
          </div>

          {leads.map((lead, i) => {
            const statusInfo = STATUS_LABELS[lead.status] || STATUS_LABELS.new;
            const fair = fairById[lead.fair_id];
            const isOpen = ['new', 'analyzing', 'feedback_pending'].includes(lead.status);

            return (
              <div
                key={lead.id}
                className="lead-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.4fr 1fr 140px 160px 80px',
                  alignItems: 'center',
                  borderBottom: i < leads.length - 1 ? '1px solid #F0EEE9' : 'none',
                  position: 'relative',
                }}
              >
                {/* Klickbare Fläche über die ganze Zeile (außer Aktion-Spalte) */}
                <Link
                  href={`/advisor/leads/${lead.id}`}
                  style={{
                    position: 'absolute', inset: 0,
                    right: 100, // Aktion-Spalte freilassen
                    zIndex: 0,
                  }}
                  aria-label={`${lead.first_name} ${lead.last_name || ''} öffnen`}
                />

                {/* Name + Kontakt */}
                <div style={{ padding: '14px 0 14px 20px', position: 'relative', zIndex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A', marginBottom: 2 }}>
                    {`${lead.first_name} ${lead.last_name || ''}`.trim()}
                  </div>
                  {lead.phone && (
                    <span style={{ fontSize: 12, color: '#CC1426', fontWeight: 600, display: 'block' }}>
                      📞 {lead.phone}
                    </span>
                  )}
                  {lead.email && (
                    <div style={{ fontSize: 12, color: '#86868b' }}>{lead.email}</div>
                  )}
                  {!lead.phone && !lead.email && (
                    <div style={{ fontSize: 12, color: '#C5C5C7' }}>Keine Kontaktdaten</div>
                  )}
                </div>

                {/* Messe */}
                <div style={{ padding: '14px 0', position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>{fair?.name || '–'}</div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 980,
                    background: statusInfo.bg, color: statusInfo.color, whiteSpace: 'nowrap',
                  }}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Datum */}
                <div style={{ fontSize: 13, color: '#6B7280', padding: '14px 0', position: 'relative', zIndex: 1 }}>
                  {formatDate(lead.created_at)}<br />
                  <span style={{ fontSize: 12 }}>{formatTime(lead.created_at)}</span>
                </div>

                {/* Follow-up Status */}
                <div style={{ padding: '14px 0', position: 'relative', zIndex: 1 }}>
                  <FollowUpSelect leadId={lead.id} initialValue={lead.follow_up_status} />
                </div>

                {/* Aktion */}
                <div style={{ padding: '14px 20px 14px 0', position: 'relative', zIndex: 1 }}>
                  <Link
                    href={isOpen ? getNextStep(lead) : `/advisor/leads/${lead.id}`}
                    style={{ fontSize: 13, fontWeight: 600, color: isOpen ? '#CC1426' : '#86868b', textDecoration: 'none' }}
                  >
                    {isOpen ? 'Weiter →' : 'Ansehen'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

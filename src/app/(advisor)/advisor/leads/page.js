import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import FollowUpSelect from './FollowUpSelect';
import RetriggerButton from './RetriggerButton';

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
    ? await admin.from('fairs').select('id, name, city, status, start_date, end_date').order('start_date', { ascending: false })
    : fairIds.length > 0
      ? await admin.from('fairs').select('id, name, city, status, start_date, end_date').in('id', fairIds).order('start_date', { ascending: false })
      : { data: [] };

  // Leads laden — Admin sieht alle, Messeleiter alle seiner Messen, Berater nur eigene
  let query = admin
    .from('fair_leads')
    .select('id, first_name, last_name, email, phone, status, follow_up_status, fair_id, advisor_user_id, source, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (isSuperAdmin) {
    // Admin sieht alles, nur Messe-Filter anwenden wenn gesetzt
    if (fairFilter) query = query.eq('fair_id', fairFilter);
  } else if (fairFilter) {
    const isManagerForFair = managerFairIds.includes(fairFilter);
    query = query.eq('fair_id', fairFilter);
    if (!isManagerForFair) query = query.eq('advisor_user_id', user.id);
  } else {
    // Default-View: eigene Leads aller Quellen (Messe + Direkt + Affiliate)
    // — nicht mehr auf Messe-Leads beschränken für Messeleiter,
    //   das wäre dann ein expliziter Messe-Filter
    query = query.eq('advisor_user_id', user.id);
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

  const { data: rawLeads } = await query;

  // Duplikate entfernen: pro Name + Messe nur den besten Lead behalten
  // "Bester" = höchster Status, bei Gleichstand neuestes Datum
  const STATUS_PRIORITY = { completed: 5, converted: 5, contacted: 4, feedback_pending: 3, analyzing: 2, new: 1 };
  const dedupedLeads = (() => {
    const seen = new Map();
    for (const lead of rawLeads || []) {
      const key = [
        (lead.first_name || '').toLowerCase().trim(),
        (lead.last_name || '').toLowerCase().trim(),
        lead.fair_id,
      ].join('__');
      const existing = seen.get(key);
      if (!existing) {
        seen.set(key, lead);
      } else {
        const ep = STATUS_PRIORITY[existing.status] || 0;
        const np = STATUS_PRIORITY[lead.status] || 0;
        if (np > ep || (np === ep && new Date(lead.created_at) > new Date(existing.created_at))) {
          seen.set(key, lead);
        }
      }
    }
    return Array.from(seen.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  })();
  const duplicateCount = (rawLeads?.length || 0) - dedupedLeads.length;
  const leads = dedupedLeads;

  // Berater-Namen laden (für Admin-Ansicht)
  let advisorById = {};
  if (isSuperAdmin && leads && leads.length > 0) {
    const advisorUserIds = [...new Set(leads.map(l => l.advisor_user_id).filter(Boolean))];
    if (advisorUserIds.length > 0) {
      const { data: advisorProfiles } = await admin
        .from('profiles')
        .select('id, first_name, last_name, name')
        .in('id', advisorUserIds);
      (advisorProfiles || []).forEach(p => {
        advisorById[p.id] = p.first_name || p.name || 'Unbekannt';
      });
    }
  }

  // Self-Service Checks laden (QR-Code Scans von Bewerbern ohne Termin)
  let selfChecksQuery = admin
    .from('self_service_checks')
    .select('id, name, email, phone, fair_id, status, overall_rating, result_token, created_at, registered')
    .eq('status', 'completed')
    .order('created_at', { ascending: false });

  if (isSuperAdmin) {
    if (fairFilter) selfChecksQuery = selfChecksQuery.eq('fair_id', fairFilter);
  } else if (fairIds.length > 0) {
    if (fairFilter) selfChecksQuery = selfChecksQuery.eq('fair_id', fairFilter);
    else selfChecksQuery = selfChecksQuery.in('fair_id', fairIds);
  }

  const { data: selfChecks } = await selfChecksQuery;

  const fairById = (fairs || []).reduce((acc, f) => { acc[f.id] = f; return acc; }, {});

  // Stats für Dashboard-Sektion oben
  const today = new Date().toISOString().split('T')[0];
  const todayCount = (rawLeads || []).filter(l => (l.created_at || '').startsWith(today)).length;
  const openCount = (rawLeads || []).filter(l => ['new', 'analyzing', 'feedback_pending'].includes(l.status)).length;
  const totalCount = (rawLeads || []).length;
  const activeFairs = (fairs || []).filter(f => ['upcoming', 'active'].includes(f.status));

  const TZ = 'Europe/Berlin';
  const formatDate = (d) => new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: TZ });
  const formatTime = (d) => new Date(d).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', timeZone: TZ });

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
    <div className="admin-coaches">
      <div className="admin-pageheader">
        <div>
          <div className="title-kicker"><span className="pulse" /> Berater · CV-Checks</div>
          <h1 className="page-title">CV-Checks <span className="faded">{leads.length + (selfChecks?.length || 0)}</span></h1>
          <p className="page-sub">
            Alle Lebenslauf-Auswertungen in zwei Gruppen: aus Beratungsgesprächen (Messe + Direkt) und
            Self-Service-Checks (Affiliate-Link oder QR-Code).
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/advisor/cv-check/new" className="admin-cta-primary" style={{ whiteSpace: 'nowrap' }}>
            + Neuer CV-Check
          </Link>
          {isSuperAdmin && <RetriggerButton />}
        </div>
      </div>
      {duplicateCount > 0 && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#FEF3C7', border: '1px solid #FCD34D',
          borderRadius: 8, padding: '6px 12px', marginBottom: 24,
          fontSize: 12, color: '#92400E', fontWeight: 500,
        }}>
          <span>⚠️</span>
          <span>{duplicateCount} Duplikat{duplicateCount !== 1 ? 'e' : ''} ausgeblendet — es wird jeweils nur der neueste/fortgeschrittenste Eintrag pro Person angezeigt.</span>
        </div>
      )}

      {/* === Stats-Sektion (war früher Messe-Dashboard) === */}
      <div className="admin-stats-row" style={{ marginBottom: 24 }}>
        <div className="admin-stat highlight">
          <div className="admin-stat-icon" style={{ color: 'var(--ki-red)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div className="admin-stat-body">
            <div className="admin-stat-value">{todayCount}</div>
            <div className="admin-stat-label">Gespräche heute</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div className="admin-stat-body">
            <div className="admin-stat-value">{openCount}</div>
            <div className="admin-stat-label">Offene CV-Checks</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>
          <div className="admin-stat-body">
            <div className="admin-stat-value">{totalCount}</div>
            <div className="admin-stat-label">Gespräche gesamt</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          </div>
          <div className="admin-stat-body">
            <div className="admin-stat-value">{activeFairs.length}</div>
            <div className="admin-stat-label">Aktive Messen</div>
          </div>
        </div>
      </div>

      {/* Aktive Messen als kleine Karten */}
      {activeFairs.length > 0 && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
          {activeFairs.map(fair => (
            <Link
              key={fair.id}
              href={`/advisor/fair/${fair.id}`}
              style={{
                textDecoration: 'none', color: 'inherit',
                background: '#FFF7ED', border: '1px solid #FDBA74',
                borderRadius: 10, padding: '10px 14px',
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontSize: 13,
              }}
            >
              <span style={{ fontSize: 16 }}>🎪</span>
              <span style={{ fontWeight: 600, color: '#9A3412' }}>{fair.name}</span>
              {fair.city && <span style={{ color: '#9A3412', opacity: 0.7 }}>· {fair.city}</span>}
              <span style={{ color: '#CC1426', fontWeight: 600, marginLeft: 6 }}>Messe-Sitzung öffnen →</span>
            </Link>
          ))}
        </div>
      )}

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

      {/* === BOX 1: Aus Beratungsgesprächen (Messe + Direkt) === */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
          Aus Beratungsgesprächen
        </h2>
        <span style={{ fontSize: 13, color: '#86868b' }}>
          {leads.length} · Messe-Leads und direkte CV-Checks
        </span>
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
          Noch keine CV-Checks aus Beratungsgesprächen.
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', overflow: 'hidden' }}>
          {/* Tabellen-Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isSuperAdmin ? '1.2fr 0.9fr 110px 120px 160px 80px' : '1.4fr 1fr 140px 160px 80px',
            padding: '12px 20px',
            borderBottom: '1px solid #F0EEE9',
            background: '#FAFAF8',
          }}>
            {(isSuperAdmin
              ? ['Name & Kontakt', 'Messe', 'Datum', 'Berater', 'Nachfassen', 'Aktion']
              : ['Name & Kontakt', 'Messe', 'Datum', 'Nachfassen', 'Aktion']
            ).map(h => (
              <div key={h} style={{ fontSize: 12, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {h}
              </div>
            ))}
          </div>

          {leads.map((lead, i) => {
            const statusInfo = STATUS_LABELS[lead.status] || STATUS_LABELS.new;
            const fair = fairById[lead.fair_id];
            const isOpen = ['new', 'analyzing', 'feedback_pending'].includes(lead.status);
            const advisorName = isSuperAdmin ? (advisorById[lead.advisor_user_id] || '–') : null;

            return (
              <div
                key={lead.id}
                className="lead-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: isSuperAdmin ? '1.2fr 0.9fr 110px 120px 160px 80px' : '1.4fr 1fr 140px 160px 80px',
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

                {/* Quelle (Messe / Direkt / Affiliate) + Status */}
                <div style={{ padding: '14px 0', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {fair ? (
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 980,
                      background: '#FEF3C7', color: '#92400E', whiteSpace: 'nowrap',
                      display: 'inline-block', alignSelf: 'flex-start',
                    }} title={`Messe-Lead — ${fair.name}`}>
                      🎪 {fair.name}
                    </span>
                  ) : lead.source === 'affiliate' ? (
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 980,
                      background: '#F3E8FF', color: '#7C3AED', whiteSpace: 'nowrap',
                      display: 'inline-block', alignSelf: 'flex-start',
                    }} title="Über Affiliate-Link erfasst">
                      🔗 Affiliate
                    </span>
                  ) : (
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 980,
                      background: '#CCFBF1', color: '#0F766E', whiteSpace: 'nowrap',
                      display: 'inline-block', alignSelf: 'flex-start',
                    }} title="Direkter CV-Check ohne Messe-Kontext">
                      ⚡ Direkt
                    </span>
                  )}
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 980,
                    background: statusInfo.bg, color: statusInfo.color, whiteSpace: 'nowrap',
                    display: 'inline-block', alignSelf: 'flex-start',
                  }}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Datum */}
                <div style={{ fontSize: 13, color: '#6B7280', padding: '14px 0', position: 'relative', zIndex: 1 }}>
                  {formatDate(lead.created_at)}<br />
                  <span style={{ fontSize: 12 }}>{formatTime(lead.created_at)}</span>
                </div>

                {/* Berater (nur für Admins) */}
                {isSuperAdmin && (
                  <div style={{ padding: '14px 8px 14px 0', position: 'relative', zIndex: 1 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: '#1A1A1A',
                      background: '#F5F5F7',
                      padding: '3px 8px', borderRadius: 6,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'inline-block',
                      maxWidth: '100%',
                    }}>
                      {advisorName}
                    </span>
                  </div>
                )}

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

      {/* === BOX 2: Self-Service CV-Checks (Kunden machen den Check selbst) === */}
      {selfChecks && selfChecks.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
              Self-Service CV-Checks
            </h2>
            <span style={{ fontSize: 13, color: '#86868b' }}>
              {selfChecks.length} · Kunden haben selbst gescannt (QR-Code oder Affiliate-Link)
            </span>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 140px 100px', padding: '12px 20px', borderBottom: '1px solid #F0EEE9', background: '#FAFAF8' }}>
              {['Name & Kontakt', 'Messe', 'Datum', 'Ergebnis'].map(h => (
                <div key={h} style={{ fontSize: 12, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</div>
              ))}
            </div>
            {selfChecks.map((sc, i) => {
              const fair = fairById[sc.fair_id];
              const ratingColor = !sc.overall_rating ? '#9CA3AF' : sc.overall_rating <= 2 ? '#EF4444' : sc.overall_rating === 3 ? '#F59E0B' : '#22C55E';
              return (
                <div key={sc.id} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 140px 100px', alignItems: 'center', borderBottom: i < selfChecks.length - 1 ? '1px solid #F0EEE9' : 'none' }}>
                  <div style={{ padding: '14px 0 14px 20px' }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A', marginBottom: 2 }}>{sc.name || '–'}</div>
                    {sc.phone && <div style={{ fontSize: 12, color: '#CC1426', fontWeight: 600 }}>📞 {sc.phone}</div>}
                    {sc.email && <div style={{ fontSize: 12, color: '#86868b' }}>{sc.email}</div>}
                    {sc.registered && <span style={{ fontSize: 11, fontWeight: 600, color: '#059669', background: '#F0FDF4', padding: '1px 7px', borderRadius: 980, border: '1px solid #A7F3D0' }}>Registriert</span>}
                  </div>
                  <div style={{ fontSize: 13, color: '#6B7280', padding: '14px 0' }}>{fair?.name || '–'}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', padding: '14px 0' }}>
                    {formatDate(sc.created_at)}<br />
                    <span style={{ fontSize: 12 }}>{formatTime(sc.created_at)}</span>
                  </div>
                  <div style={{ padding: '14px 20px 14px 0' }}>
                    {sc.overall_rating ? (
                      <a href={`/scan/result/${sc.result_token}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 700, color: ratingColor, textDecoration: 'none' }}>
                        {sc.overall_rating}/5 →
                      </a>
                    ) : (
                      <span style={{ fontSize: 12, color: '#9CA3AF' }}>–</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

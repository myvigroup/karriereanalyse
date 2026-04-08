import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FollowUpSelect from '../FollowUpSelect';

const STATUS_LABELS = {
  new: { label: 'Neu', bg: '#F3F4F6', color: '#6B7280' },
  analyzing: { label: 'CV hochgeladen', bg: '#DBEAFE', color: '#1D4ED8' },
  feedback_pending: { label: 'Feedback offen', bg: '#FEF3C7', color: '#D97706' },
  completed: { label: 'Abgeschlossen', bg: '#D1FAE5', color: '#059669' },
  contacted: { label: 'Kontaktiert', bg: '#E8F5E9', color: '#2D6A4F' },
  converted: { label: 'Konvertiert', bg: '#FCE4EC', color: '#CC1426' },
  lost: { label: 'Verloren', bg: '#F3F4F6', color: '#9CA3AF' },
};

const CATEGORY_LABELS = {
  struktur: { label: 'Struktur', icon: '📐' },
  inhalt: { label: 'Inhalt', icon: '📝' },
  design: { label: 'Design', icon: '🎨' },
  wirkung: { label: 'Wirkung', icon: '✨' },
};

function Stars({ value, max = 5 }) {
  return (
    <span>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ color: i < value ? '#D4A017' : '#E8E6E1', fontSize: 16 }}>★</span>
      ))}
    </span>
  );
}

export default async function LeadDetailPage({ params }) {
  const { leadId } = params;
  const supabase = createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single();
  const isAdmin = profile?.role === 'admin';

  const { data: lead } = await admin
    .from('fair_leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (!lead) notFound();

  // Nur eigene Leads, außer Admin
  if (!isAdmin && lead.advisor_user_id !== user.id) notFound();

  const [{ data: fair }, { data: doc }, { data: feedback }] = await Promise.all([
    admin.from('fairs').select('name, start_date, end_date').eq('id', lead.fair_id).maybeSingle(),
    admin.from('cv_documents').select('*').eq('lead_id', leadId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    admin.from('cv_feedback').select('*, cv_feedback_items(*)').eq('lead_id', leadId).maybeSingle(),
  ]);

  // Signed URL für CV
  let cvUrl = null;
  if (doc) {
    const { data: urlData } = await admin.storage.from('cv-documents').createSignedUrl(doc.storage_path, 3600);
    cvUrl = urlData?.signedUrl;
  }

  const statusInfo = STATUS_LABELS[lead.status] || STATUS_LABELS.new;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '–';
  const formatDateTime = (d) => d ? new Date(d).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '–';

  // Feedback items nach Kategorie gruppieren
  const itemsByCategory = {};
  (feedback?.cv_feedback_items || []).forEach(item => {
    if (!itemsByCategory[item.category]) itemsByCategory[item.category] = { presets: [], freetext: null, rating: null };
    if (item.type === 'preset' && !item.content.startsWith('__rating_')) {
      itemsByCategory[item.category].presets.push(item);
    } else if (item.type === 'freetext') {
      itemsByCategory[item.category].freetext = item.content;
    } else if (item.content?.startsWith('__rating_')) {
      itemsByCategory[item.category].rating = item.rating;
    }
  });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link href="/advisor/leads" style={{ fontSize: 13, color: '#86868b', textDecoration: 'none' }}>
          ← Lebenslauf-Checks
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 8, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px' }}>
              {`${lead.first_name} ${lead.last_name || ''}`.trim()}
            </h1>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 980,
                background: statusInfo.bg, color: statusInfo.color,
              }}>
                {statusInfo.label}
              </span>
              {fair && (
                <span style={{ fontSize: 13, color: '#86868b' }}>
                  {fair.name} · {formatDate(fair.start_date)}
                </span>
              )}
            </div>
          </div>
          {['new', 'analyzing', 'feedback_pending'].includes(lead.status) && (
            <Link
              href={`/advisor/fair/${lead.fair_id}/lead/${lead.id}/review`}
              style={{
                padding: '10px 20px', background: '#CC1426', color: '#fff',
                borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14,
              }}
            >
              Gespräch fortsetzen →
            </Link>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Kontaktdaten */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: '0 0 16px' }}>Kontaktdaten</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lead.phone && (
              <div>
                <div style={{ fontSize: 11, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Telefon</div>
                <a href={`tel:${lead.phone}`} style={{ fontSize: 15, fontWeight: 600, color: '#CC1426', textDecoration: 'none' }}>
                  📞 {lead.phone}
                </a>
              </div>
            )}
            {lead.email && (
              <div>
                <div style={{ fontSize: 11, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>E-Mail</div>
                <a href={`mailto:${lead.email}`} style={{ fontSize: 14, color: '#1A1A1A', textDecoration: 'none' }}>
                  {lead.email}
                </a>
              </div>
            )}
            {!lead.phone && !lead.email && (
              <div style={{ fontSize: 13, color: '#C5C5C7' }}>Keine Kontaktdaten erfasst</div>
            )}
            <div>
              <div style={{ fontSize: 11, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Nachfassen</div>
              <FollowUpSelect leadId={lead.id} initialValue={lead.follow_up_status} />
            </div>
          </div>
        </div>

        {/* Gesprächsinfo */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: '0 0 16px' }}>Gesprächsinfo</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#86868b' }}>Erstellt</span>
              <span style={{ color: '#1A1A1A' }}>{formatDateTime(lead.created_at)}</span>
            </div>
            {lead.completed_at && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#86868b' }}>Abgeschlossen</span>
                <span style={{ color: '#1A1A1A' }}>{formatDateTime(lead.completed_at)}</span>
              </div>
            )}
            {lead.magic_link_sent_at && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#86868b' }}>Link gesendet</span>
                <span style={{ color: '#1A1A1A' }}>{formatDateTime(lead.magic_link_sent_at)}</span>
              </div>
            )}
            {lead.magic_link_opened_at && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#86868b' }}>Link geöffnet</span>
                <span style={{ color: '#059669', fontWeight: 600 }}>✓ {formatDateTime(lead.magic_link_opened_at)}</span>
              </div>
            )}
            {feedback?.overall_rating > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, alignItems: 'center' }}>
                <span style={{ color: '#86868b' }}>Gesamtbewertung</span>
                <Stars value={feedback.overall_rating} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 20, marginTop: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: '0 0 16px' }}>CV-Feedback</h2>

          {feedback.summary && (
            <div style={{ background: '#F5F5F7', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 14, color: '#1A1A1A', lineHeight: 1.6 }}>
              {feedback.summary}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {Object.entries(CATEGORY_LABELS).map(([key, cat]) => {
              const catData = itemsByCategory[key];
              if (!catData && !feedback) return null;
              const rating = catData?.rating;
              const presets = catData?.presets || [];
              const freetext = catData?.freetext;
              return (
                <div key={key} style={{ border: '1px solid #E8E6E1', borderRadius: 12, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{cat.icon} {cat.label}</span>
                    {rating && <Stars value={rating} />}
                  </div>
                  {presets.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: freetext ? 8 : 0 }}>
                      {presets.map(p => (
                        <span key={p.id} style={{
                          fontSize: 11, padding: '3px 8px', borderRadius: 980, fontWeight: 600,
                          background: p.sentiment === 'positive' ? '#D1FAE5' : p.sentiment === 'negative' ? '#FEE2E2' : '#F3F4F6',
                          color: p.sentiment === 'positive' ? '#059669' : p.sentiment === 'negative' ? '#DC2626' : '#6B7280',
                        }}>
                          {p.sentiment === 'positive' ? '✓ ' : p.sentiment === 'negative' ? '✗ ' : ''}{p.content}
                        </span>
                      ))}
                    </div>
                  )}
                  {freetext && (
                    <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>{freetext}</div>
                  )}
                  {presets.length === 0 && !freetext && (
                    <div style={{ fontSize: 12, color: '#C5C5C7' }}>Kein Feedback</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CV Vorschau */}
      {doc && cvUrl && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 20, marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>Lebenslauf</h2>
            <a
              href={cvUrl}
              download={doc.file_name}
              style={{ fontSize: 13, color: '#CC1426', textDecoration: 'none', fontWeight: 600 }}
            >
              ↓ Herunterladen
            </a>
          </div>
          {doc.file_type === 'pdf' ? (
            <iframe src={cvUrl} style={{ width: '100%', height: 600, border: 'none', borderRadius: 8 }} title="Lebenslauf" />
          ) : doc.file_type === 'image' ? (
            <img src={cvUrl} alt="Lebenslauf" style={{ maxWidth: '100%', borderRadius: 8 }} />
          ) : (
            <div style={{ fontSize: 13, color: '#86868b' }}>DOCX-Vorschau nicht verfügbar — bitte herunterladen.</div>
          )}
        </div>
      )}
    </div>
  );
}

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

function Stars({ value, max = 5 }) {
  return (
    <span>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ color: i < value ? '#D4A017' : '#E8E6E1', fontSize: 16 }}>★</span>
      ))}
    </span>
  );
}

const CATEGORY_LABELS = {
  struktur: { label: 'Struktur', icon: '📐' },
  inhalt:   { label: 'Inhalt',   icon: '📝' },
  design:   { label: 'Design',   icon: '🎨' },
  wirkung:  { label: 'Wirkung',  icon: '✨' },
};

const isPositive = (c) => !['fehlt','mangel','schwach','verbesserung','unklar','unvollständig',
  'veraltet','generisch','keine','zu vage','zu lang','zu kurz','lücken','inkonsistent',
  'unprofessionell','schwer lesbar','eher schwach','zu unübersichtlich'].some(k => c.toLowerCase().includes(k));

export default async function AdvisorScanDetailPage({ params }) {
  const { checkId } = params;

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const admin = createAdminClient();
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
  const isAdmin = ['admin', 'messeleiter'].includes(profile?.role);

  const { data: check } = await admin
    .from('self_service_checks')
    .select('*')
    .eq('id', checkId)
    .single();

  if (!check) notFound();

  // Advisors can only see checks assigned to them (or from their fairs)
  if (!isAdmin && check.advisor_user_id && check.advisor_user_id !== user.id) notFound();

  const [{ data: items }, { data: fair }] = await Promise.all([
    admin.from('self_service_check_items').select('*').eq('check_id', checkId).order('sort_order'),
    check.fair_id ? admin.from('fairs').select('name, start_date').eq('id', check.fair_id).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  // Signed CV URL
  let cvUrl = null;
  let cvIsImage = false;
  if (check.cv_storage_path) {
    const { data: urlData } = await admin.storage.from('cv-documents').createSignedUrl(check.cv_storage_path, 3600);
    cvUrl = urlData?.signedUrl;
    const ext = (check.cv_file_name || '').split('.').pop().toLowerCase();
    cvIsImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
  }

  const itemsByCategory = {};
  for (const cat of ['struktur', 'inhalt', 'design', 'wirkung']) {
    itemsByCategory[cat] = (items || []).filter(it => it.category === cat);
  }

  const TZ = 'Europe/Berlin';
  const fmt = (d) => d ? new Date(d).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: TZ }) : '–';

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
              {check.name || '–'}
            </h1>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 980, background: '#EDE9FE', color: '#7C3AED' }}>
                Self-Service
              </span>
              {fair && <span style={{ fontSize: 13, color: '#86868b' }}>{fair.name}</span>}
              {check.target_position && (
                <span style={{ fontSize: 13, color: '#86868b' }}>Zielposition: <strong>{check.target_position}</strong></span>
              )}
            </div>
          </div>
          {check.result_token && (
            <a
              href={`/scan/result/${check.result_token}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: '10px 20px', background: '#F3F4F6', color: '#6B7280', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}
            >
              Kandidaten-Ansicht →
            </a>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Kontaktdaten */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: '0 0 16px' }}>Kontaktdaten</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {check.phone ? (
              <div>
                <div style={{ fontSize: 11, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Telefon</div>
                <a href={`tel:${check.phone}`} style={{ fontSize: 15, fontWeight: 600, color: '#CC1426', textDecoration: 'none' }}>📞 {check.phone}</a>
              </div>
            ) : null}
            {check.email ? (
              <div>
                <div style={{ fontSize: 11, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>E-Mail</div>
                <a href={`mailto:${check.email}`} style={{ fontSize: 14, color: '#1A1A1A', textDecoration: 'none' }}>{check.email}</a>
              </div>
            ) : null}
            {!check.phone && !check.email && (
              <div style={{ fontSize: 13, color: '#C5C5C7' }}>Keine Kontaktdaten erfasst</div>
            )}
          </div>
        </div>

        {/* Info */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: '0 0 16px' }}>Details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#86868b' }}>Eingereicht</span>
              <span>{fmt(check.created_at)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#86868b' }}>Status</span>
              <span style={{ fontWeight: 600 }}>{check.registered ? '✓ Registriert' : 'Nicht registriert'}</span>
            </div>
            {check.overall_rating ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, alignItems: 'center' }}>
                <span style={{ color: '#86868b' }}>Gesamtbewertung</span>
                <Stars value={check.overall_rating} />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* KI-Analyse */}
      {check.summary && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>CV-Analyse</h2>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', background: '#F3E8FF', padding: '3px 10px', borderRadius: 980 }}>🤖 KI</span>
          </div>
          <div style={{ background: '#F5F5F7', borderRadius: 12, padding: 16, marginBottom: 14, fontSize: 14, color: '#1A1A1A', lineHeight: 1.6 }}>
            {check.summary}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {Object.entries(CATEGORY_LABELS).map(([key, cat]) => {
              const catItems = itemsByCategory[key] || [];
              const ratingItem = catItems.find(it => it.content?.startsWith('__rating_'));
              const rating = ratingItem ? parseInt(ratingItem.content.replace('__rating_', '')) : null;
              const presets = catItems.filter(it => it.type === 'preset' && !it.content?.startsWith('__rating_'));
              const freetext = catItems.find(it => it.type === 'freetext');
              return (
                <div key={key} style={{ border: '1px solid #E8E6E1', borderRadius: 12, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{cat.icon} {cat.label}</span>
                    {rating && <Stars value={rating} />}
                  </div>
                  {presets.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: freetext ? 8 : 0 }}>
                      {presets.map((p, i) => (
                        <span key={i} style={{
                          fontSize: 11, padding: '3px 8px', borderRadius: 980, fontWeight: 600,
                          background: isPositive(p.content) ? '#D1FAE5' : '#FEF3C7',
                          color: isPositive(p.content) ? '#059669' : '#92400E',
                        }}>
                          {isPositive(p.content) ? '✓ ' : '→ '}{p.content}
                        </span>
                      ))}
                    </div>
                  )}
                  {freetext && <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, fontStyle: 'italic' }}>"{freetext.content}"</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CV Vorschau */}
      {cvUrl ? (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>Lebenslauf</h2>
            <a href={cvUrl} download={check.cv_file_name} style={{ fontSize: 13, color: '#CC1426', textDecoration: 'none', fontWeight: 600 }}>
              ↓ Herunterladen
            </a>
          </div>
          {cvIsImage ? (
            <img src={cvUrl} alt="Lebenslauf" style={{ maxWidth: '100%', borderRadius: 8 }} />
          ) : (
            <iframe src={cvUrl} style={{ width: '100%', height: 700, border: 'none', borderRadius: 8 }} title="Lebenslauf" />
          )}
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: '0 0 8px' }}>Lebenslauf</h2>
          <div style={{ fontSize: 13, color: '#9CA3AF' }}>Kein CV-Dokument vorhanden.</div>
        </div>
      )}
    </div>
  );
}

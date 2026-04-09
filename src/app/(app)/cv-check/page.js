import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import SetPasswordBanner from '@/components/cv-check/SetPasswordBanner';

const CATEGORY_INFO = {
  struktur: { label: 'Struktur', icon: '📐' },
  inhalt:   { label: 'Inhalt',   icon: '📝' },
  design:   { label: 'Design',   icon: '🎨' },
  wirkung:  { label: 'Wirkung',  icon: '✨' },
};

const POSITIVE_KEYWORDS = ['Guter', 'Gut', 'Klarer', 'Übersichtlich', 'Vollständig', 'Professionell', 'Stark', 'Konsistent', 'Angemessen', 'Motivierend', 'Persönlichkeit', 'Messbar', 'Relevante', 'Kompetenzen klar'];
const isPositive = (label) => POSITIVE_KEYWORDS.some(k => label.includes(k));

function Stars({ count, size = 18 }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= count ? '#D4A017' : '#E8E6E1', fontSize: size }}>★</span>
      ))}
    </span>
  );
}

export default async function CVCheckPage() {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  // CV-Dokument: erst per user_id, dann Fallback über fair_leads
  let doc = null;
  const { data: docByUser } = await admin
    .from('cv_documents').select('*').eq('user_id', user.id)
    .order('created_at', { ascending: false }).limit(1).maybeSingle();

  if (docByUser) {
    doc = docByUser;
  } else {
    const { data: userLead } = await admin
      .from('fair_leads').select('id').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (userLead) {
      const { data: docByLead } = await admin
        .from('cv_documents').select('*').eq('lead_id', userLead.id)
        .order('created_at', { ascending: false }).limit(1).maybeSingle();
      doc = docByLead || null;
    }
  }

  if (!doc) redirect('/cv-check/upload');

  // Feedback + Items
  const { data: feedback } = await admin
    .from('cv_feedback').select('*')
    .eq('cv_document_id', doc.id).eq('status', 'completed').maybeSingle();

  const { data: items } = feedback
    ? await admin.from('cv_feedback_items').select('*')
        .eq('cv_feedback_id', feedback.id).order('sort_order')
    : { data: [] };

  // Messe-Kontext
  const { data: lead } = await admin
    .from('fair_leads').select('*, fairs(name, start_date), advisors(display_name)')
    .eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle();

  // Signed URL
  let previewUrl = null;
  if (doc) {
    const { data: urlData } = await admin.storage
      .from('cv-documents').createSignedUrl(doc.storage_path || doc.file_path, 3600);
    previewUrl = urlData?.signedUrl;
  }

  // First-login tracking
  const { data: existingLogin } = await admin
    .from('analytics_events').select('id')
    .eq('user_id', user.id).eq('event_name', 'cv_check_first_login').limit(1).maybeSingle();
  if (!existingLogin) {
    await admin.from('analytics_events').insert({
      user_id: user.id, event_name: 'cv_check_first_login',
      metadata: { source: 'magic_link' },
    });
  }

  // Items nach Kategorie gruppieren
  const byCategory = {};
  (items || []).forEach(item => {
    if (!byCategory[item.category]) byCategory[item.category] = { presets: [], freetext: null, rating: 0 };
    if (item.content?.startsWith('__rating_')) {
      byCategory[item.category].rating = item.rating;
    } else if (item.type === 'preset') {
      byCategory[item.category].presets.push(item.content);
    } else if (item.type === 'freetext') {
      byCategory[item.category].freetext = item.content;
    }
  });

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

  return (
    <div className="page-container" style={{ paddingTop: 28, paddingBottom: 64 }}>

      <SetPasswordBanner />

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 4px' }}>Dein Lebenslauf-Check</h1>
        <div style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {lead?.fairs?.name && <span>{lead.fairs.name}</span>}
          {lead?.fairs?.start_date && <span>· {formatDate(lead.fairs.start_date)}</span>}
          {lead?.advisors?.display_name && <span>· Coach: {lead.advisors.display_name}</span>}
          {!lead && <span>Selbst hochgeladen · {formatDate(doc.created_at)}</span>}
        </div>
      </div>

      {/* Gesamtbewertung */}
      {feedback?.overall_rating > 0 && (
        <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 20, padding: '20px 24px' }}>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Gesamt</div>
            <Stars count={feedback.overall_rating} size={22} />
          </div>
          {feedback.summary && (
            <div style={{ flex: 1, fontSize: 14, color: 'var(--ki-text)', lineHeight: 1.65, borderLeft: '2px solid var(--ki-border)', paddingLeft: 20 }}>
              {feedback.summary}
            </div>
          )}
          <a href="/cv-check/upload" style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
            ↑ Neu hochladen
          </a>
        </div>
      )}

      {/* Keine Analyse vorhanden */}
      {!feedback && (
        <div className="card" style={{ textAlign: 'center', padding: '32px 24px', marginBottom: 20 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Analyse wird vorbereitet</div>
          <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>Dein Berater hat das Feedback noch nicht abgeschlossen.</div>
        </div>
      )}

      {/* 4 Kategorien 2×2 */}
      {feedback && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {Object.entries(CATEGORY_INFO).map(([key, { label, icon }]) => {
            const cat = byCategory[key] || { presets: [], freetext: null, rating: 0 };
            return (
              <div key={key} className="card" style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{icon} {label}</span>
                  {cat.rating > 0 && <Stars count={cat.rating} size={14} />}
                </div>
                {cat.presets.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: cat.freetext ? 10 : 0 }}>
                    {cat.presets.map((p, i) => {
                      const pos = isPositive(p);
                      return (
                        <span key={i} style={{
                          fontSize: 11, padding: '3px 9px', borderRadius: 980, fontWeight: 600,
                          background: pos ? '#D1FAE5' : '#FEE2E2',
                          color: pos ? '#059669' : '#DC2626',
                        }}>
                          {pos ? '✓' : '✗'} {p}
                        </span>
                      );
                    })}
                  </div>
                )}
                {cat.freetext && (
                  <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', lineHeight: 1.55, fontStyle: 'italic' }}>
                    „{cat.freetext}"
                  </div>
                )}
                {cat.presets.length === 0 && !cat.freetext && (
                  <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>Kein Feedback</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CV Preview */}
      {previewUrl && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid var(--ki-border)' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text-secondary)' }}>{doc.file_name}</span>
            <a href={previewUrl} download={doc.file_name} style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-red)', textDecoration: 'none' }}>
              ↓ Herunterladen
            </a>
          </div>
          {doc.file_type === 'pdf' ? (
            <iframe src={previewUrl} style={{ width: '100%', height: 640, border: 'none', display: 'block' }} title="Lebenslauf" />
          ) : doc.file_type === 'image' ? (
            <div style={{ padding: 16 }}>
              <img src={previewUrl} alt="Lebenslauf" style={{ maxWidth: '100%', borderRadius: 8 }} />
            </div>
          ) : (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--ki-text-secondary)', fontSize: 13 }}>
              DOCX-Vorschau nicht verfügbar
            </div>
          )}
        </div>
      )}

      {/* Nächste Schritte */}
      <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Nächster Schritt: Karriere-Analyse</div>
          <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>12 Kompetenzfelder · ~10 Min. · personalisierte Kursempfehlungen</div>
        </div>
        <a href="/analyse" className="btn btn-primary" style={{ fontSize: 13, padding: '10px 20px', flexShrink: 0 }}>
          Analyse starten →
        </a>
      </div>

      <style>{`@media (max-width: 700px) {
        .cv-grid { grid-template-columns: 1fr !important; }
      }`}</style>
    </div>
  );
}

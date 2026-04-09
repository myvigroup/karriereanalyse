import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SetPasswordBanner from '@/components/cv-check/SetPasswordBanner';

const CATEGORY_INFO = {
  struktur: { label: 'Struktur', icon: '📐' },
  inhalt: { label: 'Inhalt', icon: '📝' },
  design: { label: 'Design', icon: '🎨' },
  wirkung: { label: 'Wirkung', icon: '✨' },
};

function Stars({ count }) {
  return (
    <span style={{ color: '#D4A017', fontSize: 18 }}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  );
}

export default async function CVCheckPage() {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  // CV-Dokument laden
  const { data: doc } = await admin
    .from('cv_documents')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_current', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!doc) redirect('/dashboard');

  // Feedback laden
  const { data: feedback } = await admin
    .from('cv_feedback')
    .select('*')
    .eq('cv_document_id', doc.id)
    .eq('status', 'completed')
    .maybeSingle();

  // Feedback-Items
  const { data: items } = feedback
    ? await supabase
        .from('cv_feedback_items')
        .select('*')
        .eq('cv_feedback_id', feedback.id)
        .order('sort_order')
    : { data: [] };

  // Messe-Kontext
  const { data: lead } = await admin
    .from('fair_leads')
    .select('*, fairs(name, start_date), advisors(display_name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // Signed URL für CV-Preview
  let previewUrl = null;
  if (doc) {
    const { data: urlData } = await admin.storage
      .from('cv-documents')
      .createSignedUrl(doc.file_path, 3600);
    previewUrl = urlData?.signedUrl;
  }

  // Logge first_login event (nur einmal)
  const { data: existingLogin } = await admin
    .from('analytics_events')
    .select('id')
    .eq('user_id', user.id)
    .eq('event_name', 'cv_check_first_login')
    .limit(1)
    .maybeSingle();

  if (!existingLogin) {
    await admin.from('analytics_events').insert({
      user_id: user.id,
      event_name: 'cv_check_first_login',
      metadata: { source: 'magic_link' },
    });
  }

  // Items nach Kategorie gruppieren
  const byCategory = {};
  (items || []).forEach(item => {
    if (item.content.startsWith('__rating_')) {
      if (!byCategory[item.category]) byCategory[item.category] = { presets: [], freetext: null, rating: 0 };
      byCategory[item.category].rating = item.rating;
    } else if (item.type === 'preset') {
      if (!byCategory[item.category]) byCategory[item.category] = { presets: [], freetext: null, rating: 0 };
      byCategory[item.category].presets.push(item.content);
    } else if (item.type === 'freetext') {
      if (!byCategory[item.category]) byCategory[item.category] = { presets: [], freetext: null, rating: 0 };
      byCategory[item.category].freetext = item.content;
    }
  });

  const formatDate = (d) => new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Presets: positive vs negative identifizieren (heuristik: ✓/✗ prefix oder bekannte Labels)
  // Da wir die Presets nicht direkt joinen, nutzen wir eine einfache Heuristik
  const positiveKeywords = ['Guter', 'Gut', 'Klarer', 'Übersichtlich', 'Vollständig', 'Professionell', 'Stark', 'Konsistent', 'Angemessen', 'Motivierend', 'Persönlichkeit', 'Messbar', 'Relevante', 'Kompetenzen klar'];
  const isPositive = (label) => positiveKeywords.some(k => label.includes(k));

  return (
    <div className="page-container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      {/* Welcome Banner (einmalig bei erstem Besuch) */}
      {!existingLogin && (
        <div style={{
          background: 'linear-gradient(135deg, #CC1426 0%, #a01020 100%)',
          borderRadius: 16,
          padding: 24,
          color: '#fff',
          marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Willkommen!</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Hier sind die Ergebnisse deines Lebenslauf-Checks
            {lead?.fairs?.name ? ` von der ${lead.fairs.name}` : ''}.
          </p>
        </div>
      )}

      {/* Passwort-Banner */}
      <SetPasswordBanner />

      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>
        Dein Lebenslauf-Check
      </h1>
      <p style={{ color: '#86868b', marginBottom: 24 }}>
        {lead?.fairs?.name && `${lead.fairs.name}`}
        {lead?.fairs?.start_date && ` · ${formatDate(lead.fairs.start_date)}`}
        {lead?.advisors?.display_name && ` · Coach: ${lead.advisors.display_name}`}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Links: CV Preview */}
        <div>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #E8E6E1',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #E8E6E1', fontSize: 13, fontWeight: 600, color: '#86868b' }}>
              {doc.file_name}
            </div>
            <div style={{ minHeight: 400 }}>
              {doc.file_type === 'pdf' && previewUrl ? (
                <iframe src={previewUrl} style={{ width: '100%', height: 500, border: 'none' }} title="CV" />
              ) : doc.file_type === 'image' && previewUrl ? (
                <div style={{ padding: 16 }}>
                  <img src={previewUrl} alt="CV" style={{ maxWidth: '100%', borderRadius: 8 }} />
                </div>
              ) : (
                <div style={{ padding: 32, textAlign: 'center', color: '#86868b' }}>
                  <p>Vorschau nicht verfügbar</p>
                  {previewUrl && (
                    <a href={previewUrl} download style={{ color: '#CC1426', fontWeight: 600 }}>
                      Datei herunterladen
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rechts: Feedback */}
        <div>
          {/* Gesamtbewertung */}
          {feedback?.overall_rating && (
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              border: '1px solid #E8E6E1',
              marginBottom: 16,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#86868b', marginBottom: 8 }}>Gesamtbewertung</div>
              <div style={{ fontSize: 32 }}><Stars count={feedback.overall_rating} /></div>
              {feedback.summary && (
                <p style={{ color: '#1A1A1A', marginTop: 12, lineHeight: 1.5, fontSize: 14 }}>
                  {feedback.summary}
                </p>
              )}
            </div>
          )}

          {/* Kategorien */}
          {Object.entries(CATEGORY_INFO).map(([key, { label, icon }]) => {
            const cat = byCategory[key];
            if (!cat || (cat.presets.length === 0 && !cat.freetext && !cat.rating)) return null;

            return (
              <div
                key={key}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: 20,
                  border: '1px solid #E8E6E1',
                  marginBottom: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{icon} {label}</h3>
                  {cat.rating > 0 && <Stars count={cat.rating} />}
                </div>
                {cat.presets.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: cat.freetext ? 12 : 0 }}>
                    {cat.presets.map((p, i) => {
                      const positive = isPositive(p);
                      return (
                        <span
                          key={i}
                          style={{
                            padding: '4px 12px',
                            borderRadius: 980,
                            background: positive ? '#D1FAE5' : '#FEE2E2',
                            color: positive ? '#059669' : '#DC2626',
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          {positive ? '✓' : '✗'} {p}
                        </span>
                      );
                    })}
                  </div>
                )}
                {cat.freetext && (
                  <p style={{ fontSize: 14, color: '#6B7280', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
                    &ldquo;{cat.freetext}&rdquo;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits + CTAs */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', marginBottom: 20, textAlign: 'center' }}>
          Dein Karriere-Portal — das ist erst der Anfang
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { icon: '🎯', title: 'Karriereanalyse', desc: '12 Kompetenzfelder analysieren und deinen persönlichen Karriere-Score entdecken.', link: '/analyse', cta: 'Analyse starten' },
            { icon: '🎓', title: 'Masterclass', desc: 'Karriere-Grundlagen und Expertenwissen in kompakten E-Learning-Modulen.', link: '/masterclass', cta: 'Module entdecken' },
            { icon: '🤖', title: 'KI-Coach', desc: 'Dein persönlicher Karriere-Assistent — stelle jede Frage zu Bewerbung, Gehalt und Karriere.', link: '/coach', cta: 'Coach starten' },
            { icon: '📊', title: 'Karrierepfad', desc: 'Verfolge deinen Fortschritt und sehe wo du im Vergleich stehst.', link: '/career', cta: 'Pfad ansehen' },
          ].map((item, i) => (
            <Link key={i} href={item.link} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: '#fff', borderRadius: 16, padding: 24,
                border: '1px solid #E8E6E1', height: '100%',
                transition: 'box-shadow 0.2s, transform 0.2s',
                cursor: 'pointer',
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px', color: '#1A1A1A' }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#86868b', lineHeight: 1.5, margin: '0 0 16px' }}>{item.desc}</p>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#CC1426' }}>{item.cta} &rarr;</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Haupt-CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2E 100%)',
          borderRadius: 20, padding: 40, textAlign: 'center', color: '#fff',
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px' }}>
            Das war nur die Oberfläche.
          </h2>
          <p style={{ fontSize: 16, opacity: 0.8, lineHeight: 1.6, maxWidth: 500, margin: '0 auto 24px' }}>
            Dein Lebenslauf zeigt, wie du dich präsentierst – aber nicht, was wirklich in dir steckt.
            Mach jetzt die komplette Karriereanalyse und entdecke dein volles Potenzial.
          </p>
          <Link
            href="/analyse"
            style={{
              display: 'inline-block', padding: '16px 40px',
              background: '#CC1426', color: '#fff', borderRadius: 980,
              textDecoration: 'none', fontWeight: 700, fontSize: 16,
            }}
          >
            Karriereanalyse starten
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .page-container > div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

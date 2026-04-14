import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const CATEGORIES = [
  { key: 'struktur', label: 'Struktur-Analyse', icon: '📐' },
  { key: 'inhalt',   label: 'Inhalts-Analyse',  icon: '📝' },
  { key: 'design',   label: 'Design-Analyse',   icon: '🎨' },
  { key: 'wirkung',  label: 'Wirkungs-Analyse', icon: '✨' },
];

const POSITIVE_KEYWORDS = ['Guter', 'Gut ', 'Klarer', 'Übersichtlich', 'Vollständig', 'Professionell', 'Stark', 'Konsistent', 'Angemessen', 'Motivierend', 'Persönlichkeit', 'Messbar', 'Relevante', 'Kompetenzen klar'];
const isPositive = (label) => POSITIVE_KEYWORDS.some(k => label.includes(k));

function ScoreGauge({ rating }) {
  const score = Math.round((rating / 5) * 100);
  const color = score >= 70 ? '#22C55E' : score >= 50 ? '#F59E0B' : '#EF4444';
  const label = score >= 70 ? 'Stark' : score >= 50 ? 'Gut' : 'Ausbaufähig';

  // SVG arc gauge
  const r = 52;
  const cx = 70, cy = 70;
  const circumference = Math.PI * r; // half circle
  const dash = (score / 100) * circumference;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <div style={{ position: 'relative', width: 140, height: 80, flexShrink: 0 }}>
        <svg width="140" height="80" viewBox="0 0 140 80">
          {/* Track */}
          <path
            d={`M 18 70 A ${r} ${r} 0 0 1 122 70`}
            fill="none" stroke="#E5E7EB" strokeWidth="12" strokeLinecap="round"
          />
          {/* Fill */}
          <path
            d={`M 18 70 A ${r} ${r} 0 0 1 122 70`}
            fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
        </svg>
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          textAlign: 'center', lineHeight: 1,
        }}>
          <div style={{ fontSize: 26, fontWeight: 800, color }}>{score}%</div>
          <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>{label}</div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#1A1A1A', marginBottom: 4 }}>
          Dein Lebenslauf-Score
        </div>
        <div style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.5 }}>
          Basierend auf Struktur, Inhalt, Design und Wirkung — bewertet von deinem Karriere-Coach.
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ label, icon, cat }) {
  const items = cat?.presets || [];
  const freetext = cat?.freetext;
  const total = items.length + (freetext ? 1 : 0);
  const positive = items.filter(isPositive).length;

  return (
    <div style={{
      background: '#fff', borderRadius: 16,
      border: '1px solid #E8E6E1', overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', borderBottom: total > 0 ? '1px solid #F3F4F6' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>{label}</span>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 600, color: '#6B7280',
          background: '#F3F4F6', padding: '2px 8px', borderRadius: 980,
        }}>
          {total > 0 ? `${positive}/${total} positiv` : 'Kein Feedback'}
        </span>
      </div>
      {total > 0 && (
        <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((p, i) => {
            const pos = isPositive(p);
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '10px 12px', borderRadius: 10,
                background: pos ? '#F0FDF4' : '#FFF5F5',
                border: `1px solid ${pos ? '#BBF7D0' : '#FECACA'}`,
              }}>
                <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>{pos ? '✓' : '✗'}</span>
                <span style={{ fontSize: 13, color: pos ? '#15803D' : '#DC2626', fontWeight: 500 }}>{p}</span>
              </div>
            );
          })}
          {freetext && (
            <div style={{
              padding: '10px 12px', borderRadius: 10,
              background: '#F8FAFC', border: '1px solid #E2E8F0',
            }}>
              <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                &ldquo;{freetext}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default async function CVCheckPage() {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const needsPasswordSetup = user.user_metadata?.needs_password_setup === true;

  // CV-Dokument laden — versuche zuerst mit is_current, dann ohne
  let doc = null;
  const { data: currentDoc } = await admin
    .from('cv_documents')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  doc = currentDoc;

  if (!doc) redirect('/dashboard');

  // Feedback laden — zuerst via fair_leads, dann direkt über cv_document_id
  const { data: lead } = await admin
    .from('fair_leads')
    .select('*, fairs(name, start_date)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  let feedback = null;

  // 1. Versuch: via fair_lead (Berater-Flow)
  if (lead) {
    const { data: fb } = await admin
      .from('cv_feedback')
      .select('*')
      .eq('fair_lead_id', lead.id)
      .maybeSingle();
    feedback = fb;
  }

  // 2. Fallback: direkt über cv_document_id (Self-Upload-Flow)
  if (!feedback && doc) {
    const { data: fb } = await admin
      .from('cv_feedback')
      .select('*')
      .eq('cv_document_id', doc.id)
      .maybeSingle();
    feedback = fb;
  }

  const { data: rawItems } = feedback
    ? await admin
        .from('cv_feedback_items')
        .select('*')
        .eq('cv_feedback_id', feedback.id)
        .order('sort_order')
    : { data: [] };

  const items = rawItems || [];

  // Signed URL
  let previewUrl = null;
  const { data: urlData } = await admin.storage
    .from('cv-documents')
    .createSignedUrl(doc.storage_path || doc.file_path, 3600);
  previewUrl = urlData?.signedUrl;

  // Analytics (fire-and-forget)
  admin.from('analytics_events').insert({
    user_id: user.id,
    event_name: 'cv_check_viewed',
    metadata: { source: 'magic_link' },
  }).then(() => {}).catch(() => {});

  // Items nach Kategorie gruppieren
  const byCategory = {};
  items.forEach(item => {
    if (!item.content) return;
    const key = item.category;
    if (!byCategory[key]) byCategory[key] = { presets: [], freetext: null, rating: 0 };
    if (item.content.startsWith('__rating_')) {
      byCategory[key].rating = item.rating || 0;
    } else if (item.type === 'preset') {
      byCategory[key].presets.push(item.content);
    } else if (item.type === 'freetext') {
      byCategory[key].freetext = item.content;
    }
  });

  // Karriere-Analyse Status laden
  const { data: analysisSession } = await supabase
    .from('analysis_sessions')
    .select('overall_score, completed_at')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const hasAnalysis = !!analysisSession;

  const fairName = lead?.fairs?.name;
  const hasRating = feedback?.overall_rating > 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #f5f3ee 0%, #faf8f4 50%, #f0f4f0 100%)',
      paddingBottom: 64,
    }}>
      <div className="page-container" style={{ paddingTop: 32, maxWidth: 1100, margin: '0 auto' }}>

        {/* Passwort-Setup Banner */}
        {needsPasswordSetup && (
          <div style={{
            background: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)',
            border: '1px solid #FCD34D',
            borderRadius: 16, padding: '16px 20px',
            marginBottom: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>🔑</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#92400E' }}>Eigenes Passwort setzen</div>
                <div style={{ fontSize: 13, color: '#78350F', lineHeight: 1.4 }}>
                  Du hast ein temporäres Passwort. Bitte ändere es jetzt, um deinen Account zu sichern.
                </div>
              </div>
            </div>
            <Link
              href="/auth/set-password?returnTo=/cv-check"
              style={{
                padding: '10px 18px', background: '#D97706', color: '#fff',
                borderRadius: 980, textDecoration: 'none', fontWeight: 600, fontSize: 13,
                whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              Passwort ändern →
            </Link>
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1A1A1A', margin: '0 0 4px' }}>
            Analyse-Ergebnisse
          </h1>
          {fairName && (
            <p style={{ fontSize: 14, color: '#9CA3AF', margin: 0 }}>
              {fairName}{lead?.fairs?.start_date ? ` · ${new Date(lead.fairs.start_date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}` : ''}
            </p>
          )}
        </div>

        {/* Score Banner */}
        {hasRating && (
          <div style={{
            background: '#fff', borderRadius: 20, padding: '24px 32px',
            border: '1px solid #E8E6E1', marginBottom: 24,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            {lead?.target_position && (
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#9CA3AF' }}>Analysiert für:</span>
                <span style={{
                  fontSize: 14, fontWeight: 700, color: '#CC1426',
                  background: '#FFF0F1', padding: '3px 12px', borderRadius: 980,
                  border: '1px solid #FECDD3',
                }}>
                  🎯 {lead.target_position}
                </span>
              </div>
            )}
            <ScoreGauge rating={feedback.overall_rating} />
            {feedback.summary && (
              <p style={{
                marginTop: 16, paddingTop: 16, borderTop: '1px solid #F3F4F6',
                fontSize: 14, color: '#6B7280', lineHeight: 1.7, margin: '16px 0 0',
              }}>
                {feedback.summary}
              </p>
            )}
          </div>
        )}

        {/* Two-column */}
        <div className="cv-check-layout">

          {/* Left: CV Preview */}
          <div style={{
            background: '#fff', borderRadius: 20,
            border: '1px solid #E8E6E1', overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div style={{
              padding: '12px 20px', borderBottom: '1px solid #F3F4F6',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#6B7280' }}>{doc.file_name}</span>
              {previewUrl && (
                <a href={previewUrl} download style={{ fontSize: 12, color: '#CC1426', fontWeight: 600, textDecoration: 'none' }}>
                  ↓ Download
                </a>
              )}
            </div>
            <div>
              {doc.file_type === 'pdf' && previewUrl ? (
                <iframe src={previewUrl} style={{ width: '100%', height: 620, border: 'none', display: 'block' }} title="CV" />
              ) : doc.file_type === 'image' && previewUrl ? (
                <div style={{ padding: 20 }}>
                  <img src={previewUrl} alt="CV" style={{ maxWidth: '100%', borderRadius: 12 }} />
                </div>
              ) : (
                <div style={{ padding: 48, textAlign: 'center', color: '#9CA3AF' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
                  <p style={{ margin: '0 0 16px' }}>Vorschau nicht verfügbar</p>
                  {previewUrl && (
                    <a href={previewUrl} download style={{ color: '#CC1426', fontWeight: 600 }}>Datei herunterladen</a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Analysis Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CATEGORIES.map(({ key, label, icon }) => (
              <CategoryCard key={key} label={label} icon={icon} cat={byCategory[key]} />
            ))}

            {/* CTA Card — Analyse abgeschlossen oder noch nicht */}
            {hasAnalysis ? (
              <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #E8E6E1', background: '#fff' }}>
                {/* Completed header */}
                <div style={{
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  padding: '18px 20px', color: '#fff',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 20 }}>✅</span>
                    <span style={{ fontSize: 15, fontWeight: 800 }}>Karriere-Analyse abgeschlossen</span>
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.4 }}>
                    Dein Karriere-Blutbild wurde erstellt — Gesamtscore:{' '}
                    <strong>{analysisSession.overall_score}%</strong>
                  </div>
                </div>
                {/* Next steps */}
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                    Deine nächsten Schritte
                  </div>
                  {[
                    { icon: '📊', title: 'Analyse-Ergebnisse ansehen', desc: 'Deine 12 Kompetenzscores im Detail', href: '/analyse', primary: true },
                    { icon: '🎓', title: 'Empfohlene Masterclass', desc: 'Dein schwächstes Feld gezielt stärken', href: '/masterclass' },
                    { icon: '🤖', title: 'KI-Coach fragen', desc: 'Persönliche Karrieretipps auf Basis deiner Analyse', href: '/coach' },
                  ].map((step, i) => (
                    <Link key={i} href={step.href} style={{ textDecoration: 'none' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 12px', borderRadius: 10, marginBottom: 6,
                        background: step.primary ? '#F0FDF4' : '#F9FAFB',
                        border: `1px solid ${step.primary ? '#BBF7D0' : '#F3F4F6'}`,
                        transition: 'opacity 0.15s',
                      }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{step.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: step.primary ? '#065F46' : '#1A1A1A' }}>{step.title}</div>
                          <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.3 }}>{step.desc}</div>
                        </div>
                        <span style={{ fontSize: 14, color: step.primary ? '#059669' : '#9CA3AF', flexShrink: 0 }}>→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                background: 'linear-gradient(135deg, #CC1426 0%, #a01020 100%)',
                borderRadius: 16, padding: 24, color: '#fff', textAlign: 'center',
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 8px' }}>
                  Karriereanalyse starten
                </h3>
                <p style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.5, margin: '0 0 16px' }}>
                  Entdecke in 12 Kompetenzfeldern, was wirklich in dir steckt.
                </p>
                <Link href="/analyse" style={{
                  display: 'block', padding: '12px', background: '#fff',
                  color: '#CC1426', borderRadius: 980, textDecoration: 'none',
                  fontWeight: 700, fontSize: 14,
                }}>
                  Jetzt kostenlos starten →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Features */}
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1A1A1A', marginBottom: 20, textAlign: 'center' }}>
            Das steckt noch in deinem Portal
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { icon: '🎓', title: 'Masterclass', desc: 'Expertenwissen in kompakten E-Learning-Modulen.', link: '/masterclass', cta: 'Module entdecken' },
              { icon: '🤖', title: 'KI-Coach', desc: 'Dein persönlicher Karriere-Assistent – 24/7.', link: '/coach', cta: 'Coach starten' },
              { icon: '🎯', title: 'Karriereanalyse', desc: '12 Kompetenzfelder – dein persönlicher Score.', link: '/analyse', cta: hasAnalysis ? 'Ergebnisse ansehen' : 'Analyse starten' },
            ].map((item, i) => (
              <Link key={i} href={item.link} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#fff', borderRadius: 16, padding: 24,
                  border: '1px solid #E8E6E1', height: '100%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px', color: '#1A1A1A' }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5, margin: '0 0 14px' }}>{item.desc}</p>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#CC1426' }}>{item.cta} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 960px) {
          .page-container > div[style*="gridTemplateColumns: 1fr 380px"] {
            grid-template-columns: 1fr !important;
          }
          .page-container > div[style*="gridTemplateColumns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AppIcon from '@/components/ui/Icon';

const CATEGORIES = [
  { key: 'struktur', label: 'Struktur' },
  { key: 'inhalt',   label: 'Inhalt' },
  { key: 'design',   label: 'Design' },
  { key: 'wirkung',  label: 'Wirkung' },
];

const POSITIVE_KEYWORDS = [
  'Guter', 'Gut ', 'Klarer', 'Übersichtlich', 'Vollständig',
  'Professionell', 'Stark', 'Konsistent', 'Angemessen',
  'Motivierend', 'Persönlichkeit', 'Messbar', 'Relevante', 'Kompetenzen klar',
];
const isPositive = (label) => POSITIVE_KEYWORDS.some(k => (label || '').includes(k));

// ─── Icons ───────────────────────────────────────────────────────────────
function Icon({ name, size = 16, stroke = 1.7 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
              stroke: 'currentColor', strokeWidth: stroke,
              strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'doc':    return (<svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>);
    case 'check':  return (<svg {...p}><polyline points="20 6 9 17 4 12"/></svg>);
    case 'target': return (<svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
    case 'play':   return (<svg {...p}><polygon points="6 3 20 12 6 21 6 3"/></svg>);
    case 'chat':   return (<svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
    case 'dl':     return (<svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
    default: return null;
  }
}

function ScoreRing({ score100, size = 180 }) {
  const r = (size - 24) / 2;
  const c = 2 * Math.PI * r;
  const val = Math.max(0, Math.min(100, score100));
  const offset = c - (val / 100) * c;
  return (
    <div className="cvc-ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle className="track" cx={size / 2} cy={size / 2} r={r} />
        <circle className="prog" cx={size / 2} cy={size / 2} r={r}
                strokeDasharray={c} strokeDashoffset={offset} />
      </svg>
      <div className="label">
        <div>
          <div className="v">{val}</div>
          <div className="o">von 100</div>
        </div>
      </div>
    </div>
  );
}

export default async function CVCheckPage() {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const needsPasswordSetup = user.user_metadata?.needs_password_setup === true;

  // CV-Dokument laden
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
  if (lead) {
    const { data: fb } = await admin
      .from('cv_feedback').select('*').eq('fair_lead_id', lead.id).maybeSingle();
    feedback = fb;
  }
  if (!feedback && doc) {
    const { data: fb } = await admin
      .from('cv_feedback').select('*').eq('cv_document_id', doc.id).maybeSingle();
    feedback = fb;
  }

  const { data: rawItems } = feedback
    ? await admin
        .from('cv_feedback_items').select('*').eq('cv_feedback_id', feedback.id).order('sort_order')
    : { data: [] };
  const items = rawItems || [];

  // Signed URL für Preview
  let previewUrl = null;
  const { data: urlData } = await admin.storage
    .from('cv-documents')
    .createSignedUrl(doc.storage_path || doc.file_path, 3600);
  previewUrl = urlData?.signedUrl;

  admin.from('analytics_events').insert({
    user_id: user.id,
    event_name: 'cv_check_viewed',
    metadata: { source: 'magic_link' },
  }).then(() => {}).catch(() => {});

  // Items gruppieren (manuelles Berater-Feedback hat Vorrang vor KI)
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

  // Karriere-Analyse Status
  const { data: analysisSession } = await supabase
    .from('analysis_sessions')
    .select('overall_score, completed_at')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  const hasAnalysis = !!analysisSession;

  // KI-Auswertung
  const ai = feedback?.ai_analysis || null;
  const aiCategories = ai?.categories || {};
  const improvements = Array.isArray(ai?.improvements) ? ai.improvements : [];
  const displayRating = feedback?.overall_rating || ai?.overallRating || 0;
  const displaySummary = feedback?.summary || ai?.summary || null;
  const fairName = lead?.fairs?.name;
  const hasRating = displayRating > 0;

  // 1-5 → 0-100
  const score100 = Math.round((displayRating / 5) * 100);
  const scoreHeadline = score100 >= 85 ? 'Top-Liga. Halte das Niveau.'
    : score100 >= 70 ? 'Solide Basis. Drei Hebel für den Sprung in die Top-Liga.'
    : score100 >= 50 ? 'Solider Stand mit klaren Stellschrauben.'
    : score100 > 0 ? 'Da geht mehr — wir zeigen dir genau wo.'
    : 'Deine Auswertung wird gerade vorbereitet.';
  const scoreLead = score100 >= 85 ? 'Recruiter scannen 6 Sekunden. Bei dir reichen die ersten zwei Zeilen — perfekter Stand.'
    : score100 >= 70 ? 'Recruiter scannen 6 Sekunden. Deine ersten zwei Zeilen tragen — danach verlierst du sie. Wir wissen wo.'
    : score100 >= 50 ? 'Recruiter scannen 6 Sekunden. Du hast den Stand. Jetzt schärfen wir die Wirkung — Hebel sind klar.'
    : score100 > 0 ? 'Recruiter scannen 6 Sekunden. Aktuell verlierst du sie früh. Drei konkrete Hebel ändern das sofort.'
    : '';

  const dateStr = lead?.fairs?.start_date
    ? new Date(lead.fairs.start_date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
    : null;

  // Tageszeit-Begrüßung für Kicker
  const now = new Date();
  const greeting = now.getHours() < 11 ? 'Guten Morgen'
    : now.getHours() < 14 ? 'Guten Mittag'
    : now.getHours() < 18 ? 'Guten Nachmittag' : 'Guten Abend';
  const weekday = now.toLocaleDateString('de-DE', { weekday: 'long' });
  const dayMonth = now.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' });

  // CV-Version (derzeit nur "Aktuelle Version" — Versionshistorie kommt später)
  const versionStr = 'Aktuelle Version';
  const checkedAtStr = feedback?.created_at
    ? new Date(feedback.created_at).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    : 'heute';

  // Map auf 5 Mockup-Kategorien — wo Daten fehlen → graceful fallback aus existierenden
  const getCat = (key) => aiCategories?.[key] || byCategory[key] || {};
  const ratingToScore = (r) => Math.round((Number(r) || 0) * 20);
  const tierFromScore = (s) => s >= 80 ? 'good' : s >= 60 ? 'mid' : s > 0 ? 'low' : 'mid';
  const tierToLabel = (t) => t === 'good' ? 'STARK' : t === 'mid' ? 'MITTEL' : 'SCHWACH';

  const fiveCats = [
    { key: 'design',    label: 'Design & Layout',       score: ratingToScore(getCat('design').rating)  || 0,  data: getCat('design') },
    { key: 'struktur',  label: 'Struktur & Lesbarkeit', score: ratingToScore(getCat('struktur').rating) || 0, data: getCat('struktur') },
    { key: 'inhalt',    label: 'Inhalt & Wirkung',      score: ratingToScore(getCat('inhalt').rating)  || 0,  data: getCat('inhalt') },
    { key: 'wirkung',   label: 'Skills & Match',        score: ratingToScore(getCat('wirkung').rating) || 0,  data: getCat('wirkung') },
    { key: 'keywords',  label: 'Keywords & ATS',        score: ai?.keywordScore || 0,                          data: { detail: ai?.keywordHint || 'Keyword-Analyse wird laufend ergänzt.' } },
  ];

  // Job-Match-Daten (heuristisch aus AI ableiten oder Defaults)
  const jobPosition = lead?.target_position || 'Deine Wunsch-Position';
  const jobMatchPct = ai?.jobMatchScore || score100;
  const missingSkills = ai?.missingSkills || [];

  // Coach-Vorschlag (passend zur Position — default Alexander Zill für Leadership/Senior, Maximilian für Bewerbung)
  const suggestedCoach = (jobPosition.toLowerCase().includes('lead') || jobPosition.toLowerCase().includes('senior'))
    ? { name: 'Alexander Zill', role: 'Leadership-Coach', initials: 'AZ', gradient: 'linear-gradient(135deg, #1d4d2e 0%, #0e2818 100%)', years: '30+ Jahre' }
    : { name: 'Maximilian Wimmer', role: 'Bewerbungsstratege', initials: 'MW', gradient: 'linear-gradient(135deg, #1d4e89 0%, #0f2e4f 100%)', years: '4+ Jahre' };

  return (
    <div className="cvcheck-v2">
      {/* Passwort-Setup Banner */}
      {needsPasswordSetup && (
        <div style={{
          background: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)',
          border: '1px solid #FCD34D',
          borderRadius: 14, padding: '14px 18px',
          marginBottom: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 14, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: 'var(--ki-red)', display: 'flex' }}><AppIcon name="key" size={22} stroke={1.6} /></span>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#92400E' }}>Eigenes Passwort setzen</div>
              <div style={{ fontSize: 12.5, color: '#78350F', lineHeight: 1.4 }}>
                Du hast ein temporäres Passwort. Bitte ändere es jetzt, um deinen Account zu sichern.
              </div>
            </div>
          </div>
          <Link href="/auth/set-password?returnTo=/cv-check" style={{
            padding: '8px 14px', background: '#D97706', color: '#fff',
            borderRadius: 980, textDecoration: 'none', fontWeight: 600, fontSize: 12.5,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            Passwort ändern →
          </Link>
        </div>
      )}

      {/* Title block — Tageszeit-Kicker + Headline + Dynamic Sub */}
      <div className="title-kicker">
        <span className="pulse" />
        {weekday}, {dayMonth} · {greeting}
      </div>
      <h1 className="page-title">
        Lebenslauf-Check.{' '}
        <span className="faded">Was wirklich beim Recruiter ankommt.</span>
      </h1>
      <p className="page-sub">
        Wir scannen deinen CV in 6 Sekunden — was Recruiter sehen, in welcher Reihenfolge, was sie überspringen.
        {lead?.target_position && <> Aktuelle Jobbeschreibung: <strong>{lead.target_position}</strong>.</>}
      </p>

      {/* Action Bar: Upload-Button · Version-Info · Edit-Job-Button */}
      <div className="cvc-actionbar">
        <Link href="/cv-check/upload" className="cvc-action-primary">
          <AppIcon name="arrow-up" size={14} stroke={1.8} /> Neue Version hochladen
        </Link>
        <span className="cvc-action-meta">
          {versionStr} · zuletzt geprüft {checkedAtStr}
        </span>
        <span className="cvc-spacer" />
        <Link href="/profile" className="cvc-action-secondary">
          Jobbeschreibung ändern
        </Link>
      </div>

      {/* Top grid: Score Hero (left, LARGER) + Categories (right, 5 Bereiche) */}
      <div className="cvc-grid">
        <div className="cvc-col-left">
          <div className="cvc-score-hero">
            <div className="hero-grain" />
            <div className="cvc-score-grid">
              {hasRating ? (
                <ScoreRing score100={score100} />
              ) : (
                <div className="cvc-ring">
                  <svg viewBox="0 0 180 180">
                    <circle className="track" cx="90" cy="90" r="78" />
                  </svg>
                  <div className="label">
                    <div>
                      <div className="v" style={{ fontSize: 38 }}>—</div>
                      <div className="o">in Arbeit</div>
                    </div>
                  </div>
                </div>
              )}
              <div className="cvc-score-meta">
                <div className="eyebrow">Dein CV-Score</div>
                <h2>{scoreHeadline}</h2>
                <p>{scoreLead || displaySummary}</p>
                {hasRating && (
                  <div className="cvc-score-progress">
                    <AppIcon name="trending-up" size={13} stroke={2} />
                    Aktuelle Auswertung · {versionStr}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Categories — 5 Bereiche mit Score /100 + colored bars */}
        <div className="card cvc-cats-card">
          <div className="card-head">
            <h3 className="card-title">
              Kategorien
              <span className="kicker">5 Bereiche</span>
            </h3>
            <span className="cvc-method-link">Methodik</span>
          </div>
          <div className="cvc-cats">
            {fiveCats.map(c => {
              const tier = tierFromScore(c.score);
              const presets = c.data?.selectedPresets || c.data?.presets || [];
              const comment = c.data?.comment;
              const detail = c.data?.detail;
              const hasAnyContent = presets.length > 0 || !!comment || !!detail;
              return (
                <div className="cvc-cat" key={c.key}>
                  <span className="cvc-cat-name">{c.label}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    {c.score > 0 && <span className={`cvc-cat-tag t-${tier}`}>{tierToLabel(tier)}</span>}
                    {c.score > 0 && (
                      <span className="cvc-cat-score">
                        {c.score}<span className="of">/100</span>
                      </span>
                    )}
                  </span>
                  <div className={`cvc-cat-bar s-${tier}`}>
                    <div style={{ width: `${c.score}%` }} />
                  </div>
                  {hasAnyContent && (
                    <div className="cvc-cat-detail" style={{ gridColumn: '1 / -1' }}>
                      {detail && <div>{detail}</div>}
                      {presets.length > 0 && (
                        <ul className="cvc-presets">
                          {presets.map((p, i) => {
                            const pos = isPositive(p);
                            return (
                              <li key={i} className={`cvc-preset ${pos ? 'pos' : 'neg'}`}>
                                <span className="cvc-preset-dot" />
                                <span>{p}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      {comment && <div className="cvc-cat-comment">„{comment}"</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Job-Match Section (innerhalb der Categories-Card unten) */}
          {lead?.target_position && (
            <div className="cvc-jobmatch">
              <div className="cvc-jobmatch-ring">
                <svg viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="26" fill="none" stroke="var(--fill)" strokeWidth="6" />
                  <circle cx="30" cy="30" r="26" fill="none" stroke="var(--ki-red)" strokeWidth="6"
                          strokeDasharray={`${(jobMatchPct / 100) * 163.36} 163.36`}
                          strokeLinecap="round" transform="rotate(-90 30 30)" />
                </svg>
                <span>{jobMatchPct}%</span>
              </div>
              <div className="cvc-jobmatch-text">
                <div className="cvc-jobmatch-label">JOB-MATCH</div>
                <div className="cvc-jobmatch-title">{jobPosition}</div>
                <div className="cvc-jobmatch-sub">
                  {missingSkills.length > 0
                    ? <>Du erfüllst {Math.round(jobMatchPct / 10)} von 10+ Schlüsselkompetenzen. Drei fehlen: <strong>{missingSkills.slice(0, 3).join(', ')}</strong>.</>
                    : <>Wir analysieren gerade deine Schlüsselkompetenzen für diese Position.</>
                  }
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Coach-CTA Card */}
      <div className="cvc-coach-card">
        <div className="cvc-coach-avatar" style={{ background: suggestedCoach.gradient }}>
          {suggestedCoach.initials}
        </div>
        <div className="cvc-coach-info">
          <div className="cvc-coach-name">{suggestedCoach.name}</div>
          <div className="cvc-coach-role">{suggestedCoach.role} · {suggestedCoach.years} Erfahrung</div>
        </div>
        <div className="cvc-coach-actions">
          <Link href="/coach" className="cvc-coach-cta-primary">CV-Termin buchen · 30 Min</Link>
          <Link href="/coach" className="cvc-coach-cta-secondary">Profil ansehen</Link>
        </div>
      </div>

      {/* CV Preview (full width below) */}
      <div className="card cvc-doc-card" style={{ marginBottom: 'var(--gap)' }}>
        <div className="cvc-doc-toolbar">
          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--label-2)' }}>
            {doc.file_name}
          </span>
          <div className="right">
            {previewUrl && (
              <a href={previewUrl} download style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: 'var(--fill)', padding: '4px 10px', borderRadius: 6,
                fontSize: 12, fontWeight: 500, color: 'var(--label-2)',
                textDecoration: 'none',
              }}>
                <Icon name="dl" size={12} /> Download
              </a>
            )}
          </div>
        </div>
        <div className="cvc-doc-stage">
          {doc.file_type === 'pdf' && previewUrl ? (
            <iframe className="cvc-doc-frame" src={previewUrl} title="CV" />
          ) : doc.file_type === 'image' && previewUrl ? (
            <img className="cvc-doc-img" src={previewUrl} alt="CV" />
          ) : (
            <div className="cvc-doc-empty">
              <div className="ic"><Icon name="doc" size={24} /></div>
              <div className="ttl">Vorschau nicht verfügbar</div>
              <div className="sub">
                Für diese Datei ist keine Inline-Vorschau möglich. Lade die Datei herunter oder erstelle eine neue Version als PDF.
              </div>
              {previewUrl && (
                <a className="btn btn-ghost" href={previewUrl} download>Datei herunterladen</a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Verbesserungen */}
      {improvements.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--gap)' }}>
          <div className="card-head">
            <h3 className="card-title">
              Verbesserungen
              <span className="kicker">{improvements.length} Hebel</span>
            </h3>
          </div>
          <div className="cvc-improvements">
            {improvements.map((imp, i) => (
              <div className="cvc-imp" key={i}>
                <div className="cvc-imp-num">{i + 1}</div>
                <div className="cvc-imp-body">
                  <div className="cvc-imp-head">
                    {imp.category && <span className="cvc-imp-cat">{imp.category}</span>}
                    <span className="cvc-imp-title">{imp.title}</span>
                  </div>
                  {(imp.before || imp.after) && (
                    <div className="cvc-imp-ba">
                      {imp.before ? (
                        <div className="cvc-imp-side before">
                          <span className="lbl">Vorher</span>
                          {imp.before}
                        </div>
                      ) : <div style={{ display: 'none' }} />}
                      {imp.after && (
                        <div className="cvc-imp-side after">
                          <span className="lbl">{imp.before ? 'Nachher' : 'Tipp'}</span>
                          {imp.after}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Karriere-Analyse Status */}
      {hasAnalysis && (
        <div className="card" style={{
          marginBottom: 'var(--gap)',
          background: 'linear-gradient(135deg, var(--green-soft), #DFF5E5)',
          border: '0.5px solid #C7E8CC',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: '#fff', color: 'var(--green-dark)',
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              <Icon name="check" size={20} stroke={2.5} />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--green-dark)', letterSpacing: '-0.01em' }}>
                Karriere-Analyse abgeschlossen
              </div>
              <div style={{ fontSize: 13, color: 'var(--label-2)', lineHeight: 1.5, marginTop: 2 }}>
                Dein Karriere-Score: <strong>{analysisSession.overall_score}%</strong> — sieh dir die 12 Kompetenzfelder im Detail an.
              </div>
            </div>
            <Link href="/analyse" className="btn btn-tinted" style={{ textDecoration: 'none' }}>
              Analyse ansehen →
            </Link>
          </div>
        </div>
      )}

      {/* Bottom CTAs */}
      <div className="cvc-ctas">
        {[
          {
            eyebrow: 'Karriere-Analyse',
            title: '12 Kompetenzfelder kennen',
            sub: 'Entdecke, wo du wirklich stehst und welche Module dich am schnellsten weiterbringen.',
            href: '/analyse',
            cta: hasAnalysis ? 'Ergebnisse ansehen' : 'Analyse starten',
            icon: 'target',
          },
          {
            eyebrow: 'Masterclass',
            title: 'Expertenwissen in Modulen',
            sub: 'Kompakte E-Learning Kurse mit konkreten Techniken für Bewerbung, Gehalt und Karriere.',
            href: '/masterclass',
            cta: 'Module entdecken',
            icon: 'play',
          },
          {
            eyebrow: 'KI-Coach',
            title: 'Deine 24/7-Begleitung',
            sub: 'Stell deine Fragen, lass dich auf Gespräche vorbereiten, hol dir individuelle Tipps.',
            href: '/coach',
            cta: 'Coach starten',
            icon: 'chat',
          },
        ].map((c, i) => (
          <a key={i} className="cvc-cta" href={c.href}>
            <div className="cvc-cta-ic"><Icon name={c.icon} size={18} /></div>
            <div className="cvc-cta-eyebrow">{c.eyebrow}</div>
            <div className="cvc-cta-title">{c.title}</div>
            <div className="cvc-cta-sub">{c.sub}</div>
            <span className="cvc-cta-link">{c.cta} →</span>
          </a>
        ))}
      </div>
    </div>
  );
}

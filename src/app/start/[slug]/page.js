// Affiliate-Landing — zeigt dem eingeladenen Mitglied erst den BENEFIT,
// danach die Registrierung. „Schau was du bekommst, dann meld dich an."

import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Karriere-Analyse starten · Karriere-Institut',
  description: 'Persönliche KI-Analyse deiner Karriere — in 10 Minuten.',
};

const BENEFITS = [
  {
    icon: 'target',
    title: 'KI-Karriere-Analyse',
    desc: '12 Kompetenzfelder · in 10 Min · sofortiges Feedback.',
  },
  {
    icon: 'doc',
    title: 'Lebenslauf-Check',
    desc: 'Was bei Recruitern in 6 Sekunden ankommt — und was nicht.',
  },
  {
    icon: 'play',
    title: 'Masterclasses & Live-Seminare',
    desc: 'Rhetorik, Gehaltsverhandlung, Personal Leadership — Premium-Format.',
  },
  {
    icon: 'users',
    title: 'Persönlicher Karriere-Coach',
    desc: 'Bei Bedarf 1:1 mit unseren lizenzierten Coaches.',
  },
];

function Icon({ name, size = 18 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'target': return (<svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
    case 'doc':    return (<svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>);
    case 'play':   return (<svg {...p}><polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none"/></svg>);
    case 'users':  return (<svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
    case 'check':  return (<svg {...p}><polyline points="20 6 9 17 4 12"/></svg>);
    case 'arrow':  return (<svg {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>);
    default: return null;
  }
}

export default async function AffiliateLanding({ params }) {
  const slug = (params.slug || '').toLowerCase().trim();
  if (!slug) notFound();

  const admin = createAdminClient();
  const { data: advisor } = await admin
    .from('advisors')
    .select('id, display_name, email, status')
    .ilike('slug', slug)
    .maybeSingle();

  if (!advisor || advisor.status === 'inactive') notFound();

  const firstName = (advisor.display_name || '').split(' ')[0];

  // Register-URL behält ?ref=name (für UI-Personalisierung)
  // Cookie wird in /r/[slug] gesetzt — wenn der User direkt auf /start/[slug] kommt,
  // setzen wir hier den Ref-Parameter nochmal mit, damit das Advisor-Mapping greift.
  const registerUrl = `/auth/register?ref=${encodeURIComponent(advisor.display_name)}&advisor=${encodeURIComponent(advisor.id)}`;

  return (
    <div className="affiliate-landing">
      {/* Header */}
      <header className="aff-header">
        <div className="aff-logo">KARRIERE-INSTITUT</div>
        <Link href={registerUrl} className="aff-header-cta">Direkt zum Konto</Link>
      </header>

      {/* Hero */}
      <section className="aff-hero">
        <div className="aff-eyebrow">
          <span className="dot" /> Persönliche Einladung von <strong>{advisor.display_name}</strong>
        </div>
        <h1 className="aff-title">
          {firstName ? `${firstName} hat dich eingeladen.` : 'Du wurdest eingeladen.'}
          {' '}
          <span className="aff-title-faded">Schau dir an, was du bekommst.</span>
        </h1>
        <p className="aff-sub">
          Das Karriere-Institut begleitet seit über 30 Jahren Berufseinsteiger:innen, Fach- und Führungskräfte.
          Über deine persönliche Einladung bekommst du <strong>kostenlosen Zugang</strong> zur
          KI-Karriere-Analyse, dem Lebenslauf-Check und unseren Masterclasses.
        </p>

        <div className="aff-hero-cta">
          <Link href={registerUrl} className="aff-cta-primary">
            Jetzt Karriere-Analyse starten <Icon name="arrow" size={16} />
          </Link>
          <span className="aff-cta-meta">
            <Icon name="check" size={14} /> 10 Minuten · <Icon name="check" size={14} /> kostenlos · <Icon name="check" size={14} /> kein Risiko
          </span>
        </div>
      </section>

      {/* Benefit Grid */}
      <section className="aff-benefits">
        <div className="aff-benefits-head">Was du als Mitglied bekommst</div>
        <div className="aff-benefits-grid">
          {BENEFITS.map((b, i) => (
            <div key={i} className="aff-benefit">
              <div className="aff-benefit-icon"><Icon name={b.icon} size={20} /></div>
              <div className="aff-benefit-body">
                <div className="aff-benefit-title">{b.title}</div>
                <div className="aff-benefit-desc">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust / Social Proof */}
      <section className="aff-trust">
        <div className="aff-trust-item">
          <div className="aff-trust-value">18.000+</div>
          <div className="aff-trust-label">Mitglieder vertrauen uns</div>
        </div>
        <div className="aff-trust-item">
          <div className="aff-trust-value">100+</div>
          <div className="aff-trust-label">lizenzierte Coaches</div>
        </div>
        <div className="aff-trust-item">
          <div className="aff-trust-value">★ 4.9 / 5</div>
          <div className="aff-trust-label">Durchschnittsbewertung</div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="aff-final">
        <h2 className="aff-final-title">Bereit?</h2>
        <p className="aff-final-sub">
          Die Karriere-Analyse dauert keine 10 Minuten. Danach weißt du, wo du stehst —
          und {firstName || advisor.display_name} bekommt eine Notiz, dass du gestartet bist.
        </p>
        <Link href={registerUrl} className="aff-cta-primary aff-final-cta">
          Konto erstellen & starten <Icon name="arrow" size={16} />
        </Link>
        <div className="aff-final-tos">
          Mit der Registrierung akzeptierst du unsere Nutzungsbedingungen und Datenschutzrichtlinie.
        </div>
      </section>
    </div>
  );
}

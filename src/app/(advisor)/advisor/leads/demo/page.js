import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
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

function CVPreview() {
  const label = {
    fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
    color: '#CC1426', borderBottom: '1.5px solid #CC1426', paddingBottom: 3, marginBottom: 10,
  };
  const jobTitle = { fontWeight: 700, fontSize: 11, color: '#1A1A1A' };
  const jobMeta  = { fontSize: 10, color: '#6B7280', marginBottom: 4 };
  const bullet   = { fontSize: 10, color: '#374151', lineHeight: 1.5, marginBottom: 2 };

  return (
    <div style={{
      background: '#fff', borderRadius: 4,
      boxShadow: '0 2px 20px rgba(0,0,0,0.15)',
      fontFamily: '"Times New Roman", Georgia, serif',
      fontSize: 11, color: '#1A1A1A', maxWidth: '100%',
    }}>
      {/* CV Header */}
      <div style={{ background: '#1A1A1A', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{
          width: 64, height: 76, background: '#374151', borderRadius: 3, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #4B5563',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.1 }}>Max Mustermann</div>
          <div style={{ fontSize: 12, color: '#CC1426', fontWeight: 600, marginTop: 3, letterSpacing: '0.5px' }}>SENIOR SALES MANAGER</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {['max.mustermann@email.de', '+49 170 1234567', 'Hannover'].map((c, i) => (
              <span key={i} style={{ fontSize: 9, color: '#9CA3AF' }}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '18px 24px', display: 'grid', gridTemplateColumns: '1fr 160px', gap: 20 }}>
        {/* Left */}
        <div>
          <div style={{ marginBottom: 18 }}>
            <div style={label}>Berufserfahrung</div>

            <div style={{ marginBottom: 13 }}>
              <div style={jobTitle}>Sales Manager DACH</div>
              <div style={jobMeta}>TechSales GmbH, Hamburg · 2020 – heute</div>
              <div style={bullet}>• Betreuung von Key-Account-Kunden im B2B-Bereich</div>
              <div style={bullet}>• Verantwortung für die Neukundenakquise in der DACH-Region</div>
              <div style={bullet}>• Führung eines Teams von 4 Außendienstmitarbeitern</div>
              <div style={bullet}>• Aufbau und Pflege von CRM-Prozessen (Salesforce)</div>
            </div>

            <div style={{ marginBottom: 13 }}>
              <div style={jobTitle}>Account Executive</div>
              <div style={jobMeta}>Digital Solutions AG, Frankfurt · 2017 – 2020</div>
              <div style={bullet}>• Kundenbetreuung im Software-Vertrieb (SaaS)</div>
              <div style={bullet}>• Durchführung von Demos und Verhandlungen</div>
              <div style={bullet}>• Zusammenarbeit mit Marketing und Produktentwicklung</div>
            </div>

            <div>
              <div style={jobTitle}>Junior Sales Representative</div>
              <div style={jobMeta}>MediaGroup GmbH, Berlin · 2015 – 2017</div>
              <div style={bullet}>• Telefonische und persönliche Kaltakquise</div>
              <div style={bullet}>• Angebotserstellung und Auftragsabwicklung</div>
            </div>
          </div>

          <div>
            <div style={label}>Ausbildung</div>
            <div style={{ marginBottom: 8 }}>
              <div style={jobTitle}>B.A. Betriebswirtschaftslehre</div>
              <div style={jobMeta}>Universität Hannover · 2011 – 2015 · Note: 2,3</div>
            </div>
            <div>
              <div style={jobTitle}>Allgemeine Hochschulreife</div>
              <div style={jobMeta}>Gymnasium Hannover-Mitte · 2011 · Note: 1,9</div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div>
          <div style={{ marginBottom: 16 }}>
            <div style={label}>Kenntnisse</div>
            {[['Salesforce CRM', 90], ['Verhandlungsführung', 85], ['B2B-Vertrieb', 95], ['Präsentation', 80], ['MS Office', 85]].map(([skill, pct]) => (
              <div key={skill} style={{ marginBottom: 7 }}>
                <div style={{ fontSize: 9.5, color: '#374151', marginBottom: 2 }}>{skill}</div>
                <div style={{ background: '#F3F4F6', borderRadius: 2, height: 4 }}>
                  <div style={{ background: '#CC1426', width: `${pct}%`, height: '100%', borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={label}>Sprachen</div>
            {[['Deutsch', 'Muttersprache'], ['Englisch', 'Verhandlungssicher'], ['Spanisch', 'Grundkenntnisse']].map(([lang, lvl]) => (
              <div key={lang} style={{ marginBottom: 5 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: '#1A1A1A' }}>{lang}</div>
                <div style={{ fontSize: 9, color: '#6B7280' }}>{lvl}</div>
              </div>
            ))}
          </div>

          <div>
            <div style={label}>Zertifikate</div>
            <div style={{ fontSize: 9.5, color: '#374151', lineHeight: 1.7 }}>
              <div>Salesforce Certified (2022)</div>
              <div>HubSpot Sales Software (2021)</div>
              <div>SPIN Selling Zertifikat (2019)</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '8px 24px 12px', borderTop: '1px solid #F3F4F6', textAlign: 'center' }}>
        <div style={{ fontSize: 8, color: '#9CA3AF', letterSpacing: '0.5px' }}>Hannover, Juni 2025 · Max Mustermann</div>
      </div>
    </div>
  );
}

const FEEDBACK = {
  summary: 'Dein Lebenslauf zeigt eine solide Grundlage mit klarer Struktur und ansprechendem Design. Das größte Potenzial liegt im Bereich Inhalt: Konkrete Zahlen, messbare Erfolge und eine schärfere Positionierung würden die Bewerbungschancen deutlich steigern.',
  overall_rating: 3,
  categories: {
    struktur: {
      rating: 4,
      presets: [
        { content: 'Kontaktdaten vollständig', sentiment: 'positive' },
        { content: 'Klare chronologische Gliederung', sentiment: 'positive' },
        { content: 'Foto vorhanden & professionell', sentiment: 'positive' },
        { content: 'Seitenumfang angemessen (2 S.)', sentiment: 'positive' },
      ],
      freetext: 'Professionell und übersichtlich aufgebaut. Alle Sektionen vorhanden und logisch geordnet.',
    },
    inhalt: {
      rating: 3,
      presets: [
        { content: 'Berufserfahrung gut beschrieben', sentiment: 'positive' },
        { content: 'Ausbildung & Zertifikate aufgeführt', sentiment: 'positive' },
        { content: 'Fehlende Kennzahlen & Erfolge', sentiment: 'negative' },
        { content: 'Zu vage Formulierungen', sentiment: 'negative' },
        { content: 'Keine konkreten KPIs', sentiment: 'negative' },
      ],
      freetext: 'Konkrete Zahlen fehlen. Statt „Kundenakquise verantwortet" besser: „Neukundenportfolio um 34 % ausgebaut".',
    },
    design: {
      rating: 4,
      presets: [
        { content: 'Klares, professionelles Layout', sentiment: 'positive' },
        { content: 'Gute Lesbarkeit & Schriftgröße', sentiment: 'positive' },
        { content: 'Ausreichend Weißraum', sentiment: 'positive' },
      ],
      freetext: 'Aufgeräumt und modern. Visuelle Hierarchie ist stimmig.',
    },
    wirkung: {
      rating: 3,
      presets: [
        { content: 'Solide Gesamtwirkung', sentiment: 'positive' },
        { content: 'Zu generisch für Führungsposition', sentiment: 'negative' },
        { content: 'Persönliches Profil fehlt', sentiment: 'negative' },
      ],
      freetext: 'Für eine Senior-Position fehlt die klare Positionierung als Experte. Ein persönliches Profil (3–4 Sätze) würde das sofort verbessern.',
    },
  },
};

const CAT_LABELS = {
  struktur: { label: 'Struktur', icon: '📐' },
  inhalt:   { label: 'Inhalt',   icon: '📝' },
  design:   { label: 'Design',   icon: '🎨' },
  wirkung:  { label: 'Wirkung',  icon: '✨' },
};

export default async function AdvisorDemoPage() {
  // Require advisor login (not just auth — so demo stays in the advisor context)
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Banner */}
      <div style={{ background: '#FFF9E6', border: '1px solid #FDE68A', borderRadius: 12, padding: '10px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 16 }}>🎬</span>
        <span style={{ fontSize: 13, color: '#92400E', fontWeight: 500 }}>Demo-Ansicht — Dies ist ein Muster-Lebenslauf für die Präsentation</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link href="/advisor/leads" style={{ fontSize: 13, color: '#86868b', textDecoration: 'none' }}>
          ← Lebenslauf-Checks
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 8, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px' }}>Max Mustermann</h1>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 980, background: '#D1FAE5', color: '#059669' }}>
                Abgeschlossen
              </span>
              <span style={{ fontSize: 13, color: '#86868b' }}>Karrieretag Hannover · 15.06.2025</span>
            </div>
          </div>
          <span style={{
            padding: '10px 20px', background: '#F3F4F6', color: '#6B7280',
            borderRadius: 10, fontWeight: 600, fontSize: 14,
          }}>
            Feedback bearbeiten
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Kontaktdaten */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: '0 0 16px' }}>Kontaktdaten</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Telefon</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#CC1426' }}>📞 +49 170 1234567</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>E-Mail</div>
              <div style={{ fontSize: 14, color: '#1A1A1A' }}>max.mustermann@email.de</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Nachfassen</div>
              <div style={{ fontSize: 13, padding: '8px 12px', background: '#F5F5F7', borderRadius: 8, color: '#6B7280', display: 'inline-block' }}>Nicht nachgefasst</div>
            </div>
          </div>
        </div>

        {/* Gesprächsinfo */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: '0 0 16px' }}>Gesprächsinfo</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['Erstellt', '15.06.2025, 10:32'],
              ['Abgeschlossen', '15.06.2025, 10:48'],
              ['Link gesendet', '15.06.2025, 10:49'],
              ['Link geöffnet', null],
            ].map(([key, val]) => val ? (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#86868b' }}>{key}</span>
                <span style={{ color: key === 'Link geöffnet' ? '#059669' : '#1A1A1A', fontWeight: key === 'Link geöffnet' ? 600 : 400 }}>
                  {key === 'Link geöffnet' ? `✓ ${val}` : val}
                </span>
              </div>
            ) : null)}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, alignItems: 'center' }}>
              <span style={{ color: '#86868b' }}>Gesamtbewertung</span>
              <Stars value={FEEDBACK.overall_rating} />
            </div>
          </div>
        </div>
      </div>

      {/* CV Feedback */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 20, marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>CV-Feedback</h2>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', background: '#F3E8FF', padding: '3px 10px', borderRadius: 980 }}>
            🤖 KI-Analyse
          </span>
        </div>

        <div style={{ background: '#F5F5F7', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 14, color: '#1A1A1A', lineHeight: 1.6 }}>
          {FEEDBACK.summary}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {Object.entries(CAT_LABELS).map(([key, cat]) => {
            const c = FEEDBACK.categories[key];
            return (
              <div key={key} style={{ border: '1px solid #E8E6E1', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{cat.icon} {cat.label}</span>
                  <Stars value={c.rating} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {c.presets.map((p, i) => (
                    <span key={i} style={{
                      fontSize: 11, padding: '3px 8px', borderRadius: 980, fontWeight: 600,
                      background: p.sentiment === 'positive' ? '#D1FAE5' : '#FEE2E2',
                      color: p.sentiment === 'positive' ? '#059669' : '#DC2626',
                    }}>
                      {p.sentiment === 'positive' ? '✓ ' : '✗ '}{p.content}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>{c.freetext}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lebenslauf */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 20, marginTop: 16 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: '0 0 16px' }}>Lebenslauf</h2>
        <CVPreview />
      </div>
    </div>
  );
}

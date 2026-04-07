import { Target, TrendingUp, Bot, DollarSign, BookOpen, CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Gehaltsverhandlung meistern — Karriere-Institut',
  description: 'Lerne, wie du dein Gehalt erfolgreich verhandelst. Mit echten Gehaltsdaten, KI-Coaching und bewährten Strategien. Kostenlos starten.',
};

export default function GehaltsverhandlungPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8' }}>

      {/* ── Nav ── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 48px', maxWidth: 1200, margin: '0 auto',
      }}>
        <a href="/" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#CC1426', textTransform: 'uppercase', textDecoration: 'none' }}>
          Karriere-Institut
        </a>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/auth/login" style={{ fontSize: 14, color: '#6B6B6B', textDecoration: 'none', fontWeight: 500 }}>Einloggen</a>
          <a href="/auth/register" style={{
            fontSize: 13, fontWeight: 600, padding: '8px 20px', borderRadius: 999,
            background: '#CC1426', color: 'white', textDecoration: 'none',
          }}>
            Kostenlos starten
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ textAlign: 'center', padding: '80px 24px 64px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px',
          borderRadius: 999, background: 'rgba(204,20,38,0.06)', border: '1px solid rgba(204,20,38,0.1)',
          fontSize: 12, fontWeight: 600, color: '#CC1426', marginBottom: 24,
        }}>
          <DollarSign size={14} strokeWidth={2} />
          Gehalt & Verhandlung
        </div>

        <h1 style={{
          fontSize: 48, fontWeight: 700, letterSpacing: '-0.04em',
          lineHeight: 1.1, marginBottom: 20, color: '#1A1A1A',
        }}>
          Du verdienst mehr.<br />
          <span style={{ color: '#CC1426' }}>Lerne, es zu verhandeln.</span>
        </h1>

        <p style={{
          fontSize: 18, color: '#6B6B6B', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.65,
        }}>
          Die meisten Menschen lassen tausende Euro auf dem Tisch liegen — weil sie nicht wissen, wie man verhandelt. Das ändern wir.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          <a href="/auth/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 16, fontWeight: 600, padding: '16px 32px', borderRadius: 14,
            background: '#CC1426', color: 'white', textDecoration: 'none',
            boxShadow: '0 2px 12px rgba(204,20,38,0.2)',
          }}>
            Kostenlos starten <ArrowRight size={18} />
          </a>
        </div>
        <p style={{ fontSize: 13, color: '#9A9A9A' }}>Kein Abo nötig. Analyse + Gehaltsdaten kostenlos.</p>
      </section>

      {/* ── Problem Section ── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          background: 'white', borderRadius: 16, padding: '48px 40px',
          border: '1px solid #E8E6E1',
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 24, textAlign: 'center' }}>
            Kommt dir das bekannt vor?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              'Du weißt nicht, was du realistisch verlangen kannst',
              'Du hast Angst, zu viel oder zu wenig zu fordern',
              'Du bekommst im Gespräch ein "Nein" und weißt nicht weiter',
              'Deine Kollegen verdienen mehr — obwohl du besser bist',
              'Du hast das Gefühl, dich unter Wert zu verkaufen',
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 15, color: '#1A1A1A', lineHeight: 1.5 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(204,20,38,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CheckCircle2 size={16} strokeWidth={2} style={{ color: '#CC1426' }} />
                </div>
                {text}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#CC1426' }}>
              Du bist nicht allein. 73% der Berufseinsteiger verhandeln ihr Gehalt nie.
            </p>
          </div>
        </div>
      </section>

      {/* ── Lösung: 3 Schritte ── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 12 }}>
            In 3 Schritten zur erfolgreichen Verhandlung
          </h2>
          <p style={{ fontSize: 16, color: '#6B6B6B', maxWidth: 480, margin: '0 auto' }}>
            Kein vages Mindset-Coaching. Sondern ein klares System mit echten Daten.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            {
              Icon: Target, num: '01', title: 'Deinen Wert kennen',
              desc: 'Karriere-Analyse + Gehaltsdatenbank zeigen dir exakt, was du wert bist — mit echten Marktdaten für deine Position und Region.',
            },
            {
              Icon: BookOpen, num: '02', title: 'Strategien lernen',
              desc: 'Unser E-Learning zur Gehaltsverhandlung gibt dir bewährte Techniken, Formulierungen und Taktiken — in unter 2 Stunden.',
            },
            {
              Icon: Bot, num: '03', title: 'Verhandlung üben',
              desc: 'Simuliere dein Gehaltsgespräch mit dem KI-Coach. Er kennt dein Profil und gibt dir Echtzeit-Feedback.',
            },
          ].map((step, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: 16, padding: '32px 28px',
              border: '1px solid #E8E6E1',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <step.Icon size={24} strokeWidth={1.5} style={{ color: '#CC1426' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#9A9A9A' }}>{step.num}</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gehaltsdaten Teaser ── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2E 100%)',
          borderRadius: 20, padding: '48px 40px', color: 'white', textAlign: 'center',
        }}>
          <DollarSign size={36} strokeWidth={1.3} style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 16 }} />
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 12 }}>
            Was verdienen andere in deiner Position?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', maxWidth: 420, margin: '0 auto 8px', lineHeight: 1.6 }}>
            Unsere Gehaltsdatenbank basiert auf dem Entgeltatlas der Bundesagentur für Arbeit — echte Zahlen, keine Schätzungen.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 36, margin: '32px 0' }}>
            {[
              ['€42.800', 'Median Einstiegsgehalt'],
              ['€5.200', 'Ø Gehaltsplus nach Verhandlung'],
              ['87%', 'Erfolgsquote mit Vorbereitung'],
            ].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{val}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          <a href="/auth/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 999, fontSize: 15, fontWeight: 600,
            background: 'white', color: '#1A1A1A', textDecoration: 'none',
          }}>
            Gehaltsdaten abrufen <ChevronRight size={16} />
          </a>
        </div>
      </section>

      {/* ── Features List ── */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 32, textAlign: 'center' }}>
          Was du bekommst
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { Icon: Target, title: 'Karriere-Analyse', desc: '13 Kompetenzfelder — finde heraus, was dich wirklich ausmacht', free: true },
            { Icon: DollarSign, title: 'Gehaltsdatenbank', desc: 'Echte Gehaltsdaten für deine Position, Region und Erfahrungsstufe', free: true },
            { Icon: BookOpen, title: 'E-Learning: Gehaltsverhandlung', desc: 'Strategien, Taktiken und Formulierungen für dein nächstes Gespräch', free: false },
            { Icon: Bot, title: 'KI-Coach', desc: 'Simuliere Verhandlungen, übe Argumente, bekomme Echtzeit-Feedback', free: false },
            { Icon: TrendingUp, title: 'Marktwert-Tracker', desc: 'Verfolge, wie sich dein Marktwert über die Zeit entwickelt', free: false },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '20px 0',
              borderBottom: i < 4 ? '1px solid #E8E6E1' : 'none',
            }}>
              <item.Icon size={22} strokeWidth={1.5} style={{ color: '#6B6B6B', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#6B6B6B', marginTop: 2 }}>{item.desc}</div>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999,
                background: item.free ? 'rgba(45,106,79,0.08)' : 'rgba(204,20,38,0.06)',
                color: item.free ? '#2D6A4F' : '#CC1426',
              }}>
                {item.free ? 'Kostenlos' : 'Pro'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ textAlign: 'center', padding: '64px 24px 80px', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 12, lineHeight: 1.15 }}>
          Dein nächstes Gehaltsgespräch<br />wird anders.
        </h2>
        <p style={{ fontSize: 16, color: '#6B6B6B', marginBottom: 32, lineHeight: 1.6 }}>
          Starte mit der kostenlosen Karriere-Analyse und finde heraus, was du wirklich wert bist.
        </p>
        <a href="/auth/register" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 16, fontWeight: 600, padding: '16px 36px', borderRadius: 14,
          background: '#CC1426', color: 'white', textDecoration: 'none',
          boxShadow: '0 2px 12px rgba(204,20,38,0.2)',
        }}>
          Kostenlos starten <ArrowRight size={18} />
        </a>
        <p style={{ fontSize: 12, color: '#9A9A9A', marginTop: 12 }}>
          Kein Abo. Keine Kreditkarte. Analyse + Gehaltsdaten sofort verfügbar.
        </p>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid #E8E6E1', padding: '32px 48px', maxWidth: 1200, margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#CC1426', textTransform: 'uppercase' }}>
          Karriere-Institut
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, color: '#9A9A9A' }}>
          <a href="/datenschutz" style={{ color: 'inherit', textDecoration: 'none' }}>Datenschutz</a>
          <a href="/impressum" style={{ color: 'inherit', textDecoration: 'none' }}>Impressum</a>
          <a href="/agb" style={{ color: 'inherit', textDecoration: 'none' }}>AGB</a>
        </div>
      </footer>
    </div>
  );
}

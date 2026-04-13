import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';

const CATEGORY_LABELS = {
  struktur: { label: 'Struktur', icon: '📋', desc: 'Aufbau & Vollständigkeit' },
  inhalt: { label: 'Inhalt', icon: '💼', desc: 'Erfahrungen & Kompetenzen' },
  design: { label: 'Design', icon: '🎨', desc: 'Optik & Lesbarkeit' },
  wirkung: { label: 'Wirkung', icon: '✨', desc: 'Gesamteindruck & Positionierung' },
};

function ScoreGauge({ rating }) {
  const pct = ((rating - 1) / 4) * 100;
  const color = rating <= 2 ? '#EF4444' : rating === 3 ? '#F59E0B' : '#22C55E';
  const label = rating <= 2 ? 'Verbesserungsbedarf' : rating === 3 ? 'Solide Basis' : rating === 4 ? 'Gut' : 'Sehr gut';

  return (
    <div style={{ textAlign: 'center', padding: '28px 24px 20px' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
        Gesamtbewertung
      </div>
      <div style={{ fontSize: 72, fontWeight: 900, color, lineHeight: 1, marginBottom: 4 }}>
        {rating}
        <span style={{ fontSize: 32, fontWeight: 400, color: '#D1D5DB' }}>/5</span>
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color, marginBottom: 16 }}>{label}</div>
      <div style={{ background: '#F3F4F6', borderRadius: 980, height: 10, overflow: 'hidden', maxWidth: 200, margin: '0 auto' }}>
        <div style={{ background: color, width: `${pct}%`, height: '100%', borderRadius: 980, transition: 'width 0.8s ease' }} />
      </div>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: 16, color: i <= rating ? '#F59E0B' : '#E5E7EB' }}>★</span>
      ))}
    </div>
  );
}

function CategoryCard({ category, items }) {
  const meta = CATEGORY_LABELS[category] || { label: category, icon: '📌', desc: '' };
  const ratingItem = items.find(it => it.content.startsWith('__rating_'));
  const rating = ratingItem ? parseInt(ratingItem.content.replace('__rating_', '')) : null;
  const presets = items.filter(it => it.type === 'preset' && !it.content.startsWith('__rating_'));
  const freetexts = items.filter(it => it.type === 'freetext');

  const ratingColor = !rating ? '#9CA3AF' : rating <= 2 ? '#EF4444' : rating === 3 ? '#F59E0B' : '#22C55E';

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      border: '1px solid #E8E6E1',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>{meta.icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1A1A1A' }}>{meta.label}</div>
            <div style={{ fontSize: 12, color: '#9CA3AF' }}>{meta.desc}</div>
          </div>
        </div>
        {rating && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
            <StarRating rating={rating} />
            <span style={{ fontSize: 12, fontWeight: 700, color: ratingColor }}>{rating}/5</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px' }}>
        {presets.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: freetexts.length > 0 ? 14 : 0 }}>
            {presets.map((it, i) => {
              const isPositive = !it.content.toLowerCase().includes('fehlt') &&
                !it.content.toLowerCase().includes('mangel') &&
                !it.content.toLowerCase().includes('schwach') &&
                !it.content.toLowerCase().includes('verbesserung') &&
                !it.content.toLowerCase().includes('unklar') &&
                !it.content.toLowerCase().includes('unvollständig') &&
                !it.content.toLowerCase().includes('veraltet') &&
                !it.content.toLowerCase().includes('generisch') &&
                !it.content.toLowerCase().includes('keine') &&
                !it.content.toLowerCase().includes('zu vage') &&
                !it.content.toLowerCase().includes('zu lang') &&
                !it.content.toLowerCase().includes('zu kurz') &&
                !it.content.toLowerCase().includes('lücken') &&
                !it.content.toLowerCase().includes('inkonsistent') &&
                !it.content.toLowerCase().includes('unprofessionell') &&
                !it.content.toLowerCase().includes('schwer lesbar') &&
                !it.content.toLowerCase().includes('eher schwach') &&
                !it.content.toLowerCase().includes('zu unübersichtlich');
              return (
                <span key={i} style={{
                  padding: '5px 12px', borderRadius: 980, fontSize: 13, fontWeight: 500,
                  background: isPositive ? '#ECFDF5' : '#FEF3C7',
                  color: isPositive ? '#065F46' : '#92400E',
                  border: `1px solid ${isPositive ? '#A7F3D0' : '#FDE68A'}`,
                }}>
                  {isPositive ? '✓ ' : '→ '}{it.content}
                </span>
              );
            })}
          </div>
        )}
        {freetexts.map((it, i) => (
          <p key={i} style={{ margin: 0, fontSize: 14, color: '#4B5563', lineHeight: 1.6, fontStyle: 'italic' }}>
            "{it.content}"
          </p>
        ))}
        {presets.length === 0 && freetexts.length === 0 && (
          <p style={{ margin: 0, fontSize: 14, color: '#9CA3AF' }}>Keine Detailangaben</p>
        )}
      </div>
    </div>
  );
}

export default async function ScanResultPage({ params }) {
  const { token } = params;
  const admin = createAdminClient();

  const { data: check, error } = await admin
    .from('self_service_checks')
    .select('*')
    .eq('result_token', token)
    .single();

  if (error || !check) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>Ergebnis nicht gefunden</h1>
        <p style={{ color: '#6B7280', fontSize: 15 }}>Dieser Link ist ungültig oder abgelaufen.</p>
      </div>
    );
  }

  // Pending / analyzing
  if (check.status === 'pending' || check.status === 'uploading' || check.status === 'analyzing') {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 16px', textAlign: 'center' }}>
        <div style={{
          background: '#fff', borderRadius: 20, border: '1px solid #E8E6E1',
          padding: '40px 28px', boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⏳</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', margin: '0 0 10px' }}>
            Wird analysiert...
          </h1>
          <p style={{ color: '#6B7280', fontSize: 15, margin: '0 0 28px', lineHeight: 1.6 }}>
            Dein Lebenslauf wird gerade von unserer KI analysiert. Das dauert meist nur ein paar Sekunden.
          </p>
          <a
            href={`/scan/result/${token}`}
            style={{
              display: 'inline-block', padding: '14px 32px', borderRadius: 980,
              background: '#CC1426', color: '#fff', fontWeight: 700, fontSize: 15,
              textDecoration: 'none',
            }}
          >
            Seite neu laden
          </a>
        </div>
      </div>
    );
  }

  // Error state
  if (check.status === 'error') {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 16px', textAlign: 'center' }}>
        <div style={{
          background: '#fff', borderRadius: 20, border: '1px solid #FECACA',
          padding: '40px 28px',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', marginBottom: 10 }}>Fehler bei der Analyse</h1>
          <p style={{ color: '#6B7280', fontSize: 15, margin: '0 0 24px' }}>
            Bei der Analyse deines Lebenslaufs ist leider ein Fehler aufgetreten. Bitte versuche es erneut.
          </p>
          <Link href={`/scan/${check.fair_id || 'start'}`} style={{
            display: 'inline-block', padding: '14px 32px', borderRadius: 980,
            background: '#CC1426', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none',
          }}>
            Erneut versuchen
          </Link>
        </div>
      </div>
    );
  }

  // Fetch items
  const { data: items } = await admin
    .from('self_service_check_items')
    .select('*')
    .eq('check_id', check.id)
    .order('sort_order');

  const categories = ['struktur', 'inhalt', 'design', 'wirkung'];
  const itemsByCategory = {};
  for (const cat of categories) {
    itemsByCategory[cat] = (items || []).filter(it => it.category === cat);
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 64px' }}>
      {/* Hero Card */}
      <div style={{
        background: '#fff', borderRadius: 20, border: '1px solid #E8E6E1',
        marginBottom: 20, overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        {/* Name header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6', background: '#FAFAF8' }}>
          <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 2 }}>Ergebnis für</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>{check.name}</div>
          {check.target_position && (
            <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
              Zielposition: <strong>{check.target_position}</strong>
            </div>
          )}
        </div>

        {/* Score */}
        {check.overall_rating && <ScoreGauge rating={check.overall_rating} />}

        {/* Summary */}
        {check.summary && (
          <div style={{ padding: '0 24px 24px' }}>
            <div style={{ padding: '16px', borderRadius: 12, background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
              <p style={{ margin: 0, fontSize: 14, color: '#4B5563', lineHeight: 1.7 }}>
                {check.summary}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Category Cards */}
      <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1A1A1A', margin: '0 0 14px' }}>
        Detailanalyse
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
        {categories.map(cat => (
          <CategoryCard key={cat} category={cat} items={itemsByCategory[cat] || []} />
        ))}
      </div>

      {/* CTA Card */}
      <div style={{
        background: 'linear-gradient(135deg, #CC1426 0%, #A01020 100%)',
        borderRadius: 20,
        padding: '28px 24px',
        textAlign: 'center',
        color: '#fff',
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
        <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>
          Lebenslauf weiter verbessern?
        </h3>
        <p style={{ fontSize: 14, margin: '0 0 20px', opacity: 0.9, lineHeight: 1.6 }}>
          Mit einem kostenlosen Konto bekommst du Zugang zu allen Karriere-Tools und kannst deinen Lebenslauf jederzeit neu analysieren.
        </p>
        <Link href="/auth/login" style={{
          display: 'inline-block', padding: '14px 32px', borderRadius: 980,
          background: '#fff', color: '#CC1426', fontWeight: 700, fontSize: 15,
          textDecoration: 'none',
        }}>
          Jetzt kostenlos registrieren →
        </Link>
      </div>
    </div>
  );
}

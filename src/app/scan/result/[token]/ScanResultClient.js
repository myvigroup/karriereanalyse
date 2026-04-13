'use client';
import { useState } from 'react';

const CATEGORY_LABELS = {
  struktur: { label: 'Struktur', icon: '📋', desc: 'Aufbau & Vollständigkeit' },
  inhalt:   { label: 'Inhalt',   icon: '💼', desc: 'Erfahrungen & Kompetenzen' },
  design:   { label: 'Design',   icon: '🎨', desc: 'Optik & Lesbarkeit' },
  wirkung:  { label: 'Wirkung',  icon: '✨', desc: 'Gesamteindruck & Positionierung' },
};

function ScoreGauge({ rating }) {
  const pct = ((rating - 1) / 4) * 100;
  const color = rating <= 2 ? '#EF4444' : rating === 3 ? '#F59E0B' : '#22C55E';
  const label = rating <= 2 ? 'Verbesserungsbedarf' : rating === 3 ? 'Solide Basis' : rating === 4 ? 'Gut' : 'Sehr gut';
  return (
    <div style={{ textAlign: 'center', padding: '28px 24px 20px' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Gesamtbewertung</div>
      <div style={{ fontSize: 72, fontWeight: 900, color, lineHeight: 1, marginBottom: 4 }}>
        {rating}<span style={{ fontSize: 32, fontWeight: 400, color: '#D1D5DB' }}>/5</span>
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color, marginBottom: 16 }}>{label}</div>
      <div style={{ background: '#F3F4F6', borderRadius: 980, height: 10, overflow: 'hidden', maxWidth: 200, margin: '0 auto' }}>
        <div style={{ background: color, width: `${pct}%`, height: '100%', borderRadius: 980 }} />
      </div>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: 16, color: i <= rating ? '#F59E0B' : '#E5E7EB' }}>★</span>)}
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
  const isPos = (c) => !['fehlt','mangel','schwach','verbesserung','unklar','unvollständig','veraltet','generisch','keine','zu vage','zu lang','zu kurz','lücken','inkonsistent','unprofessionell','schwer lesbar','eher schwach','zu unübersichtlich'].some(k => c.toLowerCase().includes(k));

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', overflow: 'hidden' }}>
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
      <div style={{ padding: '16px 20px' }}>
        {presets.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: freetexts.length > 0 ? 14 : 0 }}>
            {presets.map((it, i) => (
              <span key={i} style={{ padding: '5px 12px', borderRadius: 980, fontSize: 13, fontWeight: 500, background: isPos(it.content) ? '#ECFDF5' : '#FEF3C7', color: isPos(it.content) ? '#065F46' : '#92400E', border: `1px solid ${isPos(it.content) ? '#A7F3D0' : '#FDE68A'}` }}>
                {isPos(it.content) ? '✓ ' : '→ '}{it.content}
              </span>
            ))}
          </div>
        )}
        {freetexts.map((it, i) => <p key={i} style={{ margin: 0, fontSize: 14, color: '#4B5563', lineHeight: 1.6, fontStyle: 'italic' }}>"{it.content}"</p>)}
        {presets.length === 0 && freetexts.length === 0 && <p style={{ margin: 0, fontSize: 14, color: '#9CA3AF' }}>Keine Detailangaben</p>}
      </div>
    </div>
  );
}

export default function ScanResultClient({ check, itemsByCategory, token }) {
  const [unlocked, setUnlocked] = useState(check.registered === true);
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loginUrl, setLoginUrl] = useState(null);

  const categories = ['struktur', 'inhalt', 'design', 'wirkung'];

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/self-check/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fehler');
      setLoginUrl(data.loginUrl);
      setUnlocked(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 64px' }}>

      {/* Hero Card — immer sichtbar */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E8E6E1', marginBottom: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6', background: '#FAFAF8' }}>
          <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 2 }}>Ergebnis für</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>{check.name}</div>
          {check.target_position && <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>Zielposition: <strong>{check.target_position}</strong></div>}
        </div>
        {check.overall_rating && <ScoreGauge rating={check.overall_rating} />}
        {check.summary && (
          <div style={{ padding: '0 24px 24px' }}>
            <div style={{ padding: '16px', borderRadius: 12, background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
              <p style={{ margin: 0, fontSize: 14, color: '#4B5563', lineHeight: 1.7 }}>{check.summary}</p>
            </div>
          </div>
        )}
      </div>

      {/* Detailanalyse — gesperrt oder freigeschaltet */}
      <div style={{ position: 'relative' }}>
        <div style={{ filter: unlocked ? 'none' : 'blur(6px)', transition: 'filter 0.6s ease', pointerEvents: unlocked ? 'auto' : 'none', userSelect: unlocked ? 'auto' : 'none' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1A1A1A', margin: '0 0 14px' }}>Detailanalyse</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
            {categories.map(cat => (
              <CategoryCard key={cat} category={cat} items={itemsByCategory[cat] || []} />
            ))}
          </div>
        </div>

        {/* Gate Overlay */}
        {!unlocked && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(16px)',
              borderRadius: 24,
              padding: '32px 28px',
              width: '100%',
              maxWidth: 420,
              boxShadow: '0 8px 40px rgba(0,0,0,0.14)',
              border: '1px solid #E8E6E1',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1A1A1A', margin: '0 0 8px' }}>Detailanalyse freischalten</h3>
              <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 24px', lineHeight: 1.6 }}>
                Gib deine Telefonnummer ein und erhalte sofort Zugang zur vollständigen Analyse — kostenlos.
              </p>
              <form onSubmit={handleRegister}>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+49 170 1234567"
                  required
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: 12,
                    border: '1.5px solid #E8E6E1', fontSize: 16, marginBottom: 12,
                    boxSizing: 'border-box', outline: 'none', textAlign: 'center',
                    WebkitAppearance: 'none',
                  }}
                />
                {error && (
                  <div style={{ padding: '10px 14px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 13, marginBottom: 12 }}>
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting || !phone.trim()}
                  style={{
                    width: '100%', padding: '15px', borderRadius: 980,
                    background: !phone.trim() ? '#E8E6E1' : '#CC1426',
                    color: !phone.trim() ? '#9CA3AF' : '#fff',
                    border: 'none', fontWeight: 700, fontSize: 15,
                    cursor: !phone.trim() ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  {submitting ? 'Wird gespeichert...' : 'Analyse freischalten →'}
                </button>
              </form>
              <p style={{ fontSize: 12, color: '#9CA3AF', margin: '14px 0 0', lineHeight: 1.5 }}>
                Kostenlos & unverbindlich.{' '}
                <a href="/datenschutz" style={{ color: '#6B7280' }}>Datenschutz</a>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CTA nach Freischaltung */}
      {unlocked && (
        <div style={{ background: 'linear-gradient(135deg, #CC1426 0%, #A01020 100%)', borderRadius: 20, padding: '28px 24px', textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>Dein Konto ist fertig!</h3>
          <p style={{ fontSize: 14, margin: '0 0 20px', opacity: 0.9, lineHeight: 1.6 }}>
            Erhalte Zugang zu Masterclass, KI-Coach und allen Karriere-Tools.
          </p>
          <a
            href={loginUrl || '/auth/login'}
            style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 980, background: '#fff', color: '#CC1426', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}
          >
            Zum Dashboard →
          </a>
        </div>
      )}
    </div>
  );
}

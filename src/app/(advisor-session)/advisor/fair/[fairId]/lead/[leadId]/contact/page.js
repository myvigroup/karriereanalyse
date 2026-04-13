'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { saveContactDetails } from '@/app/(advisor-session)/advisor/actions';
import Link from 'next/link';

export default function ContactPage() {
  const { fairId, leadId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    try {
      const result = await saveContactDetails(leadId, formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err;
      setError(err.message || 'Ein Fehler ist aufgetreten');
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>

      {/* Visitor-facing header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #CC1426, #8B0000)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: 24,
        }}>
          🎯
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1A1A', marginBottom: 8, letterSpacing: '-0.02em' }}>
          Ergebnisse kostenlos sichern
        </h1>
        <p style={{ color: '#6B7280', fontSize: 15, lineHeight: 1.5 }}>
          Erhalte dein persönliches CV-Feedback per E-Mail — direkt in dein Karriere-Portal.
        </p>
      </div>

      {/* Benefits — visible for visitor */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: 16, padding: '16px 20px', marginBottom: 28,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
      }}>
        {[
          ['📋', 'Dein CV-Feedback'],
          ['🎯', 'Kostenlose Karriereanalyse'],
          ['🎓', 'Gratis Seminar-Zugang'],
          ['🤖', 'KI-Karriere-Coach'],
        ].map(([icon, label], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>{icon}</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>
            E-Mail-Adresse *
          </label>
          <input
            type="email"
            name="email"
            required
            autoFocus
            placeholder="deine@email.de"
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 16,
              border: '1.5px solid #E8E6E1',
              borderRadius: 12,
              outline: 'none',
              background: '#fff',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>
            Telefon <span style={{ fontWeight: 400, color: '#9CA3AF', fontSize: 13 }}>(optional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+49 151 ..."
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 16,
              border: '1.5px solid #E8E6E1',
              borderRadius: 12,
              outline: 'none',
              background: '#fff',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.5, marginBottom: 20, textAlign: 'center' }}>
          Kostenlos & jederzeit kündbar. Mit der Anmeldung stimmst du unserer{' '}
          <a href="/datenschutz" target="_blank" style={{ color: '#CC1426' }}>Datenschutzerklärung</a> zu.
        </p>

        {error && (
          <div style={{
            background: '#FEF2F2', color: '#CC1426', padding: '12px 16px',
            borderRadius: 12, fontSize: 14, marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            background: loading ? '#E8E6E1' : '#CC1426',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}
        >
          {loading ? 'Wird gespeichert...' : 'Jetzt kostenlos anmelden →'}
        </button>
      </form>

      {/* Back link — small, for advisor only */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <Link
          href={`/advisor/fair/${fairId}/lead/${leadId}/review`}
          style={{ fontSize: 12, color: '#C4C4C4', textDecoration: 'none' }}
        >
          ← Zurück
        </Link>
      </div>
    </div>
  );
}

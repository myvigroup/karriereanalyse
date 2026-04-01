'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { saveContactDetails } from '@/app/advisor/actions';
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
      await saveContactDetails(leadId, formData);
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <Link
        href={`/advisor/fair/${fairId}/lead/${leadId}/review`}
        style={{ fontSize: 13, color: '#86868b', textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}
      >
        &larr; Zurück zum Review
      </Link>

      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>
        Kontaktdaten erfassen
      </h1>
      <p style={{ color: '#86868b', marginBottom: 8 }}>
        Damit dein Gesprächspartner die Ergebnisse in seinem Portal sehen kann.
      </p>
      <p style={{ color: '#86868b', fontSize: 14, marginBottom: 32, lineHeight: 1.5 }}>
        <strong>Tipp:</strong> Sag: &ldquo;Ich melde dich jetzt kostenlos an — dann hast du dein Feedback, eine Karriereanalyse und mehr direkt in deinem Portal.&rdquo;
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>
            E-Mail *
          </label>
          <input
            type="email"
            name="email"
            required
            autoFocus
            placeholder="besucher@email.de"
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 16,
              border: '1px solid #E8E6E1',
              borderRadius: 12,
              outline: 'none',
              background: '#fff',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>
            Telefon <span style={{ fontWeight: 400, color: '#86868b' }}>(empfohlen)</span>
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+49 151 ..."
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 16,
              border: '1px solid #E8E6E1',
              borderRadius: 12,
              outline: 'none',
              background: '#fff',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Benefits Preview */}
        <div style={{
          background: '#FAFAF8', borderRadius: 12, padding: 16,
          marginBottom: 20, border: '1px solid #E8E6E1',
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 8 }}>
            Das bekommt der Besucher:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              '📋 Persönliches CV-Feedback im Portal',
              '🎯 Kostenlose Karriereanalyse',
              '🎓 Karriere-Grundlagen-Seminar',
              '🤖 KI-Coach für Karrierefragen',
            ].map((b, i) => (
              <span key={i} style={{ fontSize: 13, color: '#6B7280' }}>{b}</span>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12, color: '#86868b', lineHeight: 1.5, marginBottom: 24 }}>
          Mit der Teilnahme stimmt der Besucher der Verarbeitung seiner Daten gemäß unserer{' '}
          <a href="/datenschutz" target="_blank" style={{ color: '#CC1426' }}>Datenschutzerklärung</a> zu.
        </p>

        {error && (
          <div style={{
            background: '#FEF2F2',
            color: '#CC1426',
            padding: '12px 16px',
            borderRadius: 12,
            fontSize: 14,
            marginBottom: 16,
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
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}
        >
          {loading ? 'Wird gespeichert...' : 'Weiter zur Zusammenfassung'}
        </button>
      </form>
    </div>
  );
}

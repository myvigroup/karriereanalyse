'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { createLead } from '@/app/(app)/advisor/actions';
import Link from 'next/link';

export default function NewLead() {
  const { fairId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    try {
      await createLead(fairId, formData);
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <Link
        href={`/advisor/fair/${fairId}`}
        style={{ fontSize: 13, color: '#86868b', textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}
      >
        &larr; Zurück
      </Link>

      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>
        Neues Gespräch
      </h1>
      <p style={{ color: '#86868b', marginBottom: 32 }}>
        Wie heißt dein Gesprächspartner?
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>
            Vorname *
          </label>
          <input
            type="text"
            name="name"
            required
            autoFocus
            placeholder="z.B. Max"
            style={{
              width: '100%',
              padding: '16px 18px',
              fontSize: 18,
              border: '1px solid #E8E6E1',
              borderRadius: 12,
              outline: 'none',
              background: '#fff',
              boxSizing: 'border-box',
            }}
          />
        </div>

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
          {loading ? 'Wird gespeichert...' : 'Weiter zum CV-Upload'}
        </button>
      </form>
    </div>
  );
}

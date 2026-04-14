'use client';

import { useState } from 'react';

export default function RetriggerButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleRetrigger() {
    if (!confirm('KI-Analyse für alle ausstehenden CVs neu starten? (Kann 2-5 Minuten dauern)')) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/admin/retrigger-analysis', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fehler');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <button
        onClick={handleRetrigger}
        disabled={loading}
        style={{
          padding: '8px 14px', background: loading ? '#E8E6E1' : '#FEF3C7',
          color: loading ? '#9CA3AF' : '#92400E',
          border: '1px solid #FCD34D', borderRadius: 8,
          fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? '⏳ Analyse läuft...' : '🔄 KI-Analyse nachholen'}
      </button>
      {result && (
        <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>
          ✓ {result.succeeded}/{result.processed} erfolgreich
        </span>
      )}
      {error && (
        <span style={{ fontSize: 12, color: '#CC1426' }}>⚠ {error}</span>
      )}
    </div>
  );
}

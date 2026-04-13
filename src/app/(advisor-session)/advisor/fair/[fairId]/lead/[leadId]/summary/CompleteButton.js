'use client';

import { useState } from 'react';
import { completeFeedback } from '@/app/(advisor-session)/advisor/actions';

export default function CompleteButton({ leadId }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleComplete() {
    setSubmitting(true);
    setError(null);
    try {
      await completeFeedback(leadId);
    } catch (err) {
      if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err;
      setError(err.message || 'Ein Fehler ist aufgetreten');
      setSubmitting(false);
    }
  }

  return (
    <div style={{ marginTop: 8, marginBottom: 32 }}>
      {error && (
        <div style={{ background: '#FEF2F2', color: '#CC1426', padding: '12px 16px', borderRadius: 12, fontSize: 14, marginBottom: 16 }}>
          {error}
        </div>
      )}
      <button
        onClick={handleComplete}
        disabled={submitting}
        style={{
          width: '100%', padding: '18px',
          background: submitting ? '#E8E6E1' : '#CC1426',
          color: '#fff', border: 'none', borderRadius: 16,
          fontSize: 17, fontWeight: 700,
          cursor: submitting ? 'not-allowed' : 'pointer',
          transition: 'background 0.15s',
        }}
      >
        {submitting ? 'Wird gesendet...' : 'Gespräch abschließen & Magic Link senden'}
      </button>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { resendEmail } from '@/app/(advisor-session)/advisor/actions';

export default function ResendEmailButton({ leadId, email, sentAt }) {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  async function handleResend() {
    setStatus('loading');
    setMessage('');
    try {
      const result = await resendEmail(leadId);
      if (result?.error) {
        setStatus('error');
        setMessage(result.error);
      } else {
        setStatus('success');
        setMessage('E-Mail erfolgreich gesendet!');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Unbekannter Fehler. Bitte erneut versuchen.');
    }
  }

  return (
    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, alignItems: 'center', marginBottom: 8 }}>
        <span style={{ color: '#86868b' }}>E-Mail gesendet</span>
        <span style={{
          color: (status === 'success' || sentAt) ? '#059669' : '#D97706',
          fontWeight: 600, fontSize: 13,
        }}>
          {status === 'success'
            ? '✓ Gerade gesendet'
            : sentAt
            ? `✓ ${new Date(sentAt).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' })}`
            : '⚠ Nicht gesendet'}
        </span>
      </div>

      {message && (
        <div style={{
          padding: '8px 12px', borderRadius: 8, fontSize: 13, marginBottom: 8,
          background: status === 'success' ? '#D1FAE5' : '#FEE2E2',
          color: status === 'success' ? '#065F46' : '#CC1426',
        }}>
          {message}
        </div>
      )}

      <button
        onClick={handleResend}
        disabled={status === 'loading'}
        style={{
          width: '100%', padding: '10px 16px',
          background: status === 'loading' ? '#F3F4F6' : status === 'success' ? '#D1FAE5' : '#FFF7ED',
          color: status === 'loading' ? '#9CA3AF' : status === 'success' ? '#059669' : '#CC1426',
          border: `1px solid ${status === 'success' ? '#BBF7D0' : '#FECACA'}`,
          borderRadius: 10, fontWeight: 600, fontSize: 13,
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s',
        }}
      >
        {status === 'loading' ? 'Wird gesendet...' : status === 'success' ? '✓ Erneut senden' : '↺ E-Mail erneut senden'}
      </button>
    </div>
  );
}

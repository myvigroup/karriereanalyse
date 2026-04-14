'use client';
import { useState } from 'react';
import { resendAllAdvisorInvites } from './actions';

export default function BulkInviteButton() {
  const [state, setState] = useState('idle'); // idle | confirm | loading | done
  const [sent, setSent] = useState(0);

  async function handleConfirm() {
    setState('loading');
    const result = await resendAllAdvisorInvites();
    setSent(result?.sent || 0);
    setState('done');
  }

  if (state === 'done') {
    return (
      <div style={{ padding: '9px 18px', background: '#D1FAE5', color: '#059669', borderRadius: 980, fontSize: 14, fontWeight: 600 }}>
        ✓ {sent} E-Mails gesendet
      </div>
    );
  }

  if (state === 'loading') {
    return (
      <div style={{ padding: '9px 18px', background: '#FEF3C7', color: '#D97706', borderRadius: 980, fontSize: 14, fontWeight: 600 }}>
        Sende E-Mails…
      </div>
    );
  }

  if (state === 'confirm') {
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 980, padding: '6px 14px' }}>
        <span style={{ fontSize: 13, color: '#DC2626', fontWeight: 500 }}>Alle neu einladen?</span>
        <button onClick={handleConfirm} style={{ padding: '4px 12px', background: '#CC1426', color: '#fff', border: 'none', borderRadius: 980, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Ja, senden
        </button>
        <button onClick={() => setState('idle')} style={{ padding: '4px 10px', background: 'none', border: 'none', fontSize: 13, color: '#6B7280', cursor: 'pointer' }}>
          Abbrechen
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setState('confirm')}
      style={{ padding: '9px 18px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: 980, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
    >
      🚨 Alle Berater neu einladen
    </button>
  );
}

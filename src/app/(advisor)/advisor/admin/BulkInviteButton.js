'use client';
import { useState } from 'react';
import { resendAllAdvisorInvites, getAdvisorsForRollout } from './actions';

const CHECK = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const X_IC  = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

export default function BulkInviteButton() {
  const [state, setState] = useState('idle'); // idle | preview | loading | done
  const [advisors, setAdvisors] = useState([]);
  const [results, setResults] = useState([]);
  const [sent, setSent] = useState(0);

  async function handleOpen() {
    setState('preview');
    const list = await getAdvisorsForRollout();
    setAdvisors(list);
  }

  async function handleSend() {
    setState('loading');
    const res = await resendAllAdvisorInvites();
    setResults(res.results || []);
    setSent(res.sent || 0);
    setState('done');
  }

  if (state === 'idle') {
    return (
      <button
        onClick={handleOpen}
        style={{ padding: '9px 18px', background: '#CC1426', color: '#fff', border: 'none', borderRadius: 980, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
      >
        Zugänge ausrollen →
      </button>
    );
  }

  // Overlay modal
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => state !== 'loading' && setState('idle')}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 999, backdropFilter: 'blur(4px)' }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 1000, width: 540, maxWidth: '95vw', maxHeight: '85vh',
        background: '#fff', borderRadius: 20, boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #F0EEE9' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
                {state === 'done' ? 'Zugänge ausgerollt' : 'Berater-Zugänge ausrollen'}
              </h2>
              <p style={{ fontSize: 13, color: '#86868b', margin: '4px 0 0' }}>
                {state === 'done'
                  ? `${sent} von ${results.length} E-Mails erfolgreich gesendet`
                  : state === 'loading'
                  ? 'E-Mails werden gesendet…'
                  : `${advisors.length} Berater erhalten eine E-Mail mit Zugangsdaten`}
              </p>
            </div>
            {state !== 'loading' && (
              <button onClick={() => setState('idle')} style={{ width: 32, height: 32, borderRadius: '50%', background: '#F5F5F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', fontSize: 18, lineHeight: 1 }}>
                ×
              </button>
            )}
          </div>
        </div>

        {/* Body — Berater-Liste */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px' }}>
          {state === 'preview' && advisors.length === 0 && (
            <div style={{ padding: '32px 0', textAlign: 'center', color: '#86868b', fontSize: 14 }}>Lade Beraterliste…</div>
          )}

          {(state === 'preview' || state === 'loading') && advisors.length > 0 && advisors.map((adv, i) => (
            <div key={adv.email} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < advisors.length - 1 ? '1px solid #F5F5F7' : 'none' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#CC1426', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                {adv.display_name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{adv.display_name}</div>
                <div style={{ fontSize: 12, color: '#86868b' }}>{adv.email}</div>
              </div>
              {state === 'loading' && (
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #E8E6E1', borderTopColor: '#CC1426', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
              )}
            </div>
          ))}

          {state === 'done' && results.map((r, i) => (
            <div key={r.email} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < results.length - 1 ? '1px solid #F5F5F7' : 'none' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: r.ok ? '#D1FAE5' : '#FEE2E2', color: r.ok ? '#059669' : '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {r.ok ? CHECK : X_IC}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{r.name}</div>
                <div style={{ fontSize: 12, color: r.ok ? '#059669' : '#DC2626' }}>{r.ok ? 'E-Mail gesendet' : `Fehler: ${r.error || 'unbekannt'}`}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 28px', borderTop: '1px solid #F0EEE9', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          {state === 'preview' && (
            <>
              <button onClick={() => setState('idle')} style={{ padding: '10px 20px', background: '#F5F5F7', border: 'none', borderRadius: 980, fontSize: 14, fontWeight: 500, color: '#6B7280', cursor: 'pointer' }}>
                Abbrechen
              </button>
              <button
                onClick={handleSend}
                disabled={advisors.length === 0}
                style={{ padding: '10px 24px', background: advisors.length === 0 ? '#E8E6E1' : '#CC1426', color: advisors.length === 0 ? '#9CA3AF' : '#fff', border: 'none', borderRadius: 980, fontSize: 14, fontWeight: 600, cursor: advisors.length === 0 ? 'not-allowed' : 'pointer' }}
              >
                {advisors.length > 0 ? `${advisors.length} Zugänge jetzt senden →` : 'Lade…'}
              </button>
            </>
          )}
          {state === 'done' && (
            <button onClick={() => setState('idle')} style={{ padding: '10px 24px', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: 980, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Schließen
            </button>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

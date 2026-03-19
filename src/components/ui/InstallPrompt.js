'use client';
import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('ki_install_dismissed')) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('ki_install_dismissed', 'true');
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9997, maxWidth: 380, width: 'calc(100vw - 32px)',
      background: 'var(--ki-card)', borderRadius: 'var(--r-lg)',
      boxShadow: 'var(--sh-xl)', padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: 12,
      animation: 'fadeIn 0.3s ease both',
      border: '1px solid var(--ki-border)',
    }}>
      <span style={{ fontSize: 24 }}>{'\u{1F4F1}'}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Als App installieren</div>
        <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Schnellerer Zugriff, Offline-Support</div>
      </div>
      <button className="btn btn-primary" onClick={install} style={{ fontSize: 12, padding: '6px 14px' }}>
        Installieren
      </button>
      <button onClick={dismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ki-text-tertiary)', fontSize: 16, padding: 4 }}>
        {'\u2715'}
      </button>
    </div>
  );
}

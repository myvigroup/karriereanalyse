'use client';

import { useState, useEffect } from 'react';

export default function NightModeShield() {
  const [isNight, setIsNight] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = () => {
      const h = new Date().getHours();
      setIsNight(h >= 22 || h < 6);
    };
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!isNight || dismissed) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
      background: '#1e293b', color: 'white', padding: '16px 20px',
      borderRadius: 16, maxWidth: 320, boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      fontSize: 13, lineHeight: 1.6,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 16, fontWeight: 700 }}>🌙 Nachtmodus</span>
        <button
          onClick={() => setDismissed(true)}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18, padding: 0 }}
        >
          ×
        </button>
      </div>
      <p style={{ margin: 0 }}>
        Deine wichtigste Aufgabe für morgen ist <strong>Schlaf</strong>. Schlaf konsolidiert alles was du heute gelernt hast.
      </p>
      <p style={{ marginTop: 8, marginBottom: 0, color: '#94a3b8', fontSize: 11 }}>
        Tipp: Starte dein Shutdown-Ritual. Kein Bildschirm 30 Min vor dem Schlafen.
      </p>
    </div>
  );
}

'use client';

import { useState } from 'react';

const ENDPOINT = '/api/admin/retrigger-analysis';

export default function RetriggerButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [done, setDone] = useState(null);
  const [error, setError] = useState(null);

  // Ausstehende Analysen zählen (mit kurzem Retry)
  async function getPending() {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(ENDPOINT, { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          if (typeof data.count === 'number') return data.count;
        }
      } catch {
        /* erneut versuchen */
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
    return null;
  }

  // Einen Stapel verarbeiten. Auf dem Hobby-Plan kann der Aufruf nach ~1 Min
  // mit einer Zeitüberschreitung enden — das ist unkritisch, die bis dahin
  // verarbeiteten CVs sind serverseitig gespeichert.
  async function runBatch() {
    try {
      await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
    } catch {
      /* Zeitüberschreitung/Netzwerk — Fortschritt ist trotzdem gespeichert */
    }
  }

  async function handleRetrigger() {
    if (!confirm(
      'KI-Analyse für alle ausstehenden CVs starten?\n\n' +
      'Das läuft automatisch durch und kann je nach Anzahl einige Minuten dauern. ' +
      'Bitte diesen Tab so lange geöffnet lassen.'
    )) return;

    setLoading(true);
    setDone(null);
    setError(null);
    setStatus('Wird vorbereitet…');

    const total = await getPending();
    if (total === null) {
      setError('Status konnte nicht geladen werden. Bitte Seite neu laden und erneut versuchen.');
      setStatus(null);
      setLoading(false);
      return;
    }
    if (total === 0) {
      setStatus(null);
      setDone('Alle CVs sind bereits ausgewertet.');
      setLoading(false);
      return;
    }

    let prev = total;
    let stuck = 0;
    let lastError = null;
    const MAX_ROUNDS = 120;

    for (let round = 0; round < MAX_ROUNDS; round++) {
      setStatus(`Verarbeite… noch ${prev} von ${total} CV${total === 1 ? '' : 's'}`);
      await runBatch();
      await new Promise((r) => setTimeout(r, 600));

      const pending = await getPending();
      if (pending === null) {
        lastError = 'Verbindung unterbrochen';
        stuck++;
        if (stuck >= 4) break;
        continue;
      }
      if (pending === 0) {
        prev = 0;
        break;
      }
      if (pending >= prev) {
        stuck++;
        if (stuck >= 3) break;
      } else {
        stuck = 0;
        lastError = null;
      }
      prev = pending;
    }

    setStatus(null);
    setLoading(false);
    const processed = total - prev;

    if (prev === 0) {
      setDone(`Fertig — ${total} CV${total === 1 ? '' : 's'} ausgewertet.`);
    } else if (lastError) {
      setError(
        `${processed} von ${total} ausgewertet, dann abgebrochen (${lastError}). ` +
        'Klick einfach erneut auf den Knopf, um fortzufahren.'
      );
    } else {
      setDone(
        `${processed} von ${total} ausgewertet. ${prev} CV${prev === 1 ? '' : 's'} ` +
        'konnten nicht gelesen werden (z. B. unscharfe Fotos oder HEIC-Format) — ' +
        'diese am besten als PDF oder JPG erneut hochladen.'
      );
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
        {loading ? '⏳ Analyse läuft…' : '🔄 KI-Analyse nachholen'}
      </button>
      {status && (
        <span style={{ fontSize: 12, color: '#92400E', fontWeight: 600 }}>{status}</span>
      )}
      {done && (
        <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>✓ {done}</span>
      )}
      {error && (
        <span style={{ fontSize: 12, color: '#CC1426' }}>⚠ {error}</span>
      )}
    </div>
  );
}

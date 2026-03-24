'use client';

import { useState } from 'react';

export default function FlowFormelBuilder({ onComplete }) {
  const [uhrzeit, setUhrzeit] = useState('');
  const [ort, setOrt] = useState('');
  const [musik, setMusik] = useState('');
  const [dauer, setDauer] = useState('');
  const [aufgabe, setAufgabe] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const allFilled = uhrzeit && ort && musik && dauer && aufgabe;

  return (
    <div className="card" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🌊</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Deine persönliche Flow-Formel</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
        Finde heraus unter welchen Bedingungen DU in den Flow-State kommst.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>🕐 Wann bist du am produktivsten?</label>
          <select className="input" value={uhrzeit} onChange={e => setUhrzeit(e.target.value)} style={{ fontSize: 13 }}>
            <option value="">Wähle...</option>
            <option value="frueh">Früh (6-9 Uhr)</option>
            <option value="vormittag">Vormittag (9-12 Uhr)</option>
            <option value="nachmittag">Nachmittag (13-16 Uhr)</option>
            <option value="abend">Abend (17-21 Uhr)</option>
            <option value="nacht">Nacht (21+ Uhr)</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>📍 Wo arbeitest du am besten?</label>
          <select className="input" value={ort} onChange={e => setOrt(e.target.value)} style={{ fontSize: 13 }}>
            <option value="">Wähle...</option>
            <option value="buero">Ruhiges Büro</option>
            <option value="home">Home Office</option>
            <option value="cafe">Café (Hintergrundgeräusche)</option>
            <option value="bibliothek">Bibliothek</option>
            <option value="natur">Draußen / Natur</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>🎵 Musik beim Arbeiten?</label>
          <select className="input" value={musik} onChange={e => setMusik(e.target.value)} style={{ fontSize: 13 }}>
            <option value="">Wähle...</option>
            <option value="stille">Absolute Stille</option>
            <option value="lo-fi">Lo-Fi / Ambient</option>
            <option value="klassik">Klassische Musik</option>
            <option value="natur">Naturgeräusche</option>
            <option value="songs">Songs mit Text</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>⏱ Optimale Session-Dauer?</label>
          <select className="input" value={dauer} onChange={e => setDauer(e.target.value)} style={{ fontSize: 13 }}>
            <option value="">Wähle...</option>
            <option value="25">25 Min (Pomodoro)</option>
            <option value="45">45 Min</option>
            <option value="60">60 Min</option>
            <option value="90">90 Min (Ultra-Focus)</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>🎯 Bei welcher Aufgabe erreichst du Flow?</label>
          <input className="input" value={aufgabe} onChange={e => setAufgabe(e.target.value)} placeholder="z.B. Code schreiben, Texte verfassen, Analyse..." style={{ fontSize: 13 }} />
        </div>
      </div>

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          className="btn btn-primary"
          disabled={!allFilled}
          style={{ marginTop: 16, opacity: allFilled ? 1 : 0.5 }}
        >
          Meine Flow-Formel erstellen
        </button>
      ) : (
        <div style={{ marginTop: 16 }}>
          <div style={{
            padding: '16px', borderRadius: 'var(--r-md)',
            background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)',
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#8b5cf6', marginBottom: 8 }}>🌊 Deine Flow-Formel:</div>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--ki-text-secondary)' }}>
              <strong>Wann:</strong> {uhrzeit}<br />
              <strong>Wo:</strong> {ort}<br />
              <strong>Musik:</strong> {musik}<br />
              <strong>Dauer:</strong> {dauer} Minuten<br />
              <strong>Aufgabe:</strong> {aufgabe}
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginBottom: 14 }}>
            Tipp: Blockiere diese Zeit in deinem Kalender. Schütze sie wie ein Meeting mit dem CEO.
          </p>
          <button onClick={onComplete} className="btn btn-primary">
            ✅ Flow-Formel speichern (+40 XP)
          </button>
        </div>
      )}
    </div>
  );
}

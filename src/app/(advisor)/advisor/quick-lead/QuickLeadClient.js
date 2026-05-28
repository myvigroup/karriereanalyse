'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createQuickLead } from './actions';

const BERUFSFELDER = [
  { group: 'Studium / Ausbildung', options: [
    'Duales Studium (allgemein)',
    'Ausbildungsplatz (allgemein)',
    'Studium (allgemein)',
  ]},
  { group: 'Kaufmännisch & Verwaltung', options: [
    'Kaufmann/-frau für Büromanagement',
    'Industriekaufmann/-frau',
    'Bankkaufmann/-frau',
    'Personalwesen / HR',
    'Buchhaltung / Controlling',
  ]},
  { group: 'IT & Technik', options: [
    'Softwareentwickler/-in',
    'Data Science / KI',
    'IT-Systemkaufmann/-frau',
    'Mechatroniker/-in',
    'Maschinenbau / Konstruktion',
  ]},
  { group: 'Marketing, Medien & Kreativ', options: [
    'Marketing / Online-Marketing',
    'Grafik & Design',
    'Social Media Management',
  ]},
  { group: 'Gesundheit & Soziales', options: [
    'Pflegefachkraft',
    'Erzieher/-in',
    'Sozialpädagoge/-in',
  ]},
  { group: 'Handwerk & Produktion', options: [
    'Elektriker/-in',
    'KFZ-Mechatroniker/-in',
    'Logistik / Lagerlogistik',
  ]},
];

const inputStyle = {
  width: '100%',
  padding: '14px 18px',
  fontSize: 16,
  border: '1px solid #E8E6E1',
  borderRadius: 12,
  outline: 'none',
  background: '#fff',
  boxSizing: 'border-box',
  color: '#1A1A1A',
  appearance: 'none',
};

export default function QuickLeadClient() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [field, setField] = useState('');
  const [customField, setCustomField] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) { setError('Vorname ist Pflicht.'); return; }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set('name', name.trim());
    formData.set('target_position', field === '__sonstiges__' ? customField.trim() : (field || ''));

    try {
      const result = await createQuickLead(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      // Direkt zum CV-Upload für diesen frisch erstellten Lead
      router.push(`/cv-upload/${result.leadId}`);
    } catch (err) {
      if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err;
      setError(err.message || 'Ein Fehler ist aufgetreten');
      setLoading(false);
    }
  }

  return (
    <div className="admin-coaches">
      <div className="admin-pageheader">
        <div>
          <div className="title-kicker"><span className="pulse" /> Berater · CV-Check starten</div>
          <h1 className="page-title">Neuen CV-Check starten</h1>
          <p className="page-sub">
            Nur zwei kurze Angaben — danach geht es direkt zum CV-Upload und zur KI-Auswertung.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        data-tour="quick-form"
        style={{
          background: '#fff',
          border: '1px solid #E8E6E1',
          borderRadius: 16,
          padding: 28,
          maxWidth: 560,
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>
            Vorname des Bewerbers *
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
            placeholder="z.B. Sarah"
            style={{ ...inputStyle, fontSize: 18, padding: '16px 18px' }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>
            Zielbranche / Berufsfeld
            <span style={{ fontWeight: 400, color: '#86868b', marginLeft: 6 }}>— in welche Richtung geht's?</span>
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={field}
              onChange={e => setField(e.target.value)}
              style={{ ...inputStyle, paddingRight: 40, cursor: 'pointer' }}
            >
              <option value="">— Bitte wählen —</option>
              {BERUFSFELDER.map(group => (
                <optgroup key={group.group} label={group.group}>
                  {group.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </optgroup>
              ))}
              <option value="__sonstiges__">✏️ Sonstiges / Freitext…</option>
            </select>
            <span style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              pointerEvents: 'none', color: '#86868b', fontSize: 12,
            }}>▼</span>
          </div>
        </div>

        {field === '__sonstiges__' && (
          <div style={{ marginBottom: 24 }}>
            <input
              type="text"
              value={customField}
              onChange={e => setCustomField(e.target.value)}
              autoFocus
              placeholder="z.B. Eventmanagement, Übersetzung, Architektur…"
              style={inputStyle}
            />
          </div>
        )}

        {error && (
          <div style={{
            background: '#FEF2F2', color: '#CC1426',
            padding: '12px 16px', borderRadius: 12,
            fontSize: 14, marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{
            width: '100%', padding: '16px',
            fontSize: 16, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Wird gestartet…' : 'Weiter zum CV-Upload →'}
        </button>

        <p style={{ fontSize: 12, color: '#86868b', marginTop: 14, textAlign: 'center' }}>
          E-Mail und Telefonnummer kannst du nach der Auswertung optional ergänzen.
        </p>
      </form>
    </div>
  );
}

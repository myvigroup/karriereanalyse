'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { createLead } from '@/app/(advisor-session)/advisor/actions';
import Link from 'next/link';

const BERUFSFELDER = [
  { group: 'Studium / Ausbildung (allgemein)', options: [
    'Duales Studium (allgemein)',
    'Ausbildungsplatz (allgemein)',
    'Studium (allgemein)',
  ]},
  { group: 'Kaufmännisch & Verwaltung', options: [
    'Kaufmann/-frau für Büromanagement',
    'Kaufmann/-frau im Einzelhandel',
    'Kaufmann/-frau im Groß- und Außenhandel',
    'Industriekaufmann/-frau',
    'Bankkaufmann/-frau',
    'Versicherungskaufmann/-frau',
    'Steuerfachangestellte/-r',
    'Buchhalter/-in / Controlling',
    'Personalwesen / HR',
  ]},
  { group: 'IT & Technik', options: [
    'Fachinformatiker/-in Anwendungsentwicklung',
    'Fachinformatiker/-in Systemintegration',
    'IT-Systemkaufmann/-frau',
    'Softwareentwickler/-in',
    'Data Science / KI',
    'Elektrotechnik / Elektronik',
    'Mechatroniker/-in',
    'Industriemechaniker/-in',
    'Maschinenbau / Konstruktion',
  ]},
  { group: 'Gesundheit & Soziales', options: [
    'Pflegefachkraft / Altenpflege',
    'Krankenpfleger/-in / Gesundheitswesen',
    'Medizinische Fachangestellte/-r',
    'Erzieher/-in / Kinderpädagogik',
    'Sozialpädagoge/-in / Sozialarbeit',
    'Physiotherapie / Therapieberufe',
  ]},
  { group: 'Handwerk & Produktion', options: [
    'Elektriker/-in / Elektroinstallation',
    'Schreiner/-in / Tischler/-in',
    'Maler/-in und Lackierer/-in',
    'KFZ-Mechatroniker/-in',
    'Anlagenmechaniker/-in SHK',
    'Logistik / Lagerlogistik',
    'Speditionskaufmann/-frau',
  ]},
  { group: 'Marketing, Medien & Kreativ', options: [
    'Marketing / Online-Marketing',
    'Grafik & Design',
    'Medien- / Veranstaltungskaufmann/-frau',
    'Journalist/-in / Redakteur/-in',
    'Social Media Management',
    'Fotografie / Videoproduktion',
  ]},
  { group: 'Gastronomie & Tourismus', options: [
    'Koch/Köchin',
    'Hotelfachmann/-frau',
    'Restaurantfachmann/-frau',
    'Tourismusmanagement',
  ]},
  { group: 'Bildung, Wissenschaft & Öffentlicher Dienst', options: [
    'Lehrer/-in / Bildung',
    'Wissenschaft / Forschung',
    'Öffentlicher Dienst / Verwaltung',
    'Polizei / Bundeswehr',
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

export default function NewLead() {
  const { fairId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedField, setSelectedField] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  function handleFieldChange(e) {
    const val = e.target.value;
    setSelectedField(val);
    setShowCustom(val === '__sonstiges__');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);

    // Wenn "Sonstiges" gewählt, custom_target_position als target_position übernehmen
    if (formData.get('target_position') === '__sonstiges__') {
      formData.set('target_position', formData.get('custom_target_position') || '');
    }
    formData.delete('custom_target_position');

    try {
      const result = await createLead(fairId, formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err;
      setError(err.message || 'Ein Fehler ist aufgetreten');
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <Link
        href={`/advisor/fair/${fairId}`}
        style={{ fontSize: 13, color: '#86868b', textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}
      >
        &larr; Zurück
      </Link>

      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>
        Neues Gespräch
      </h1>
      <p style={{ color: '#86868b', marginBottom: 32 }}>
        Kurz erfassen, dann geht es zum CV-Upload.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 6 }}>
            Vorname *
          </label>
          <input
            type="text"
            name="name"
            required
            autoFocus
            placeholder="z.B. Max"
            style={{ ...inputStyle, fontSize: 18, padding: '16px 18px' }}
          />
        </div>

        <div style={{ marginBottom: showCustom ? 12 : 24 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>
            Zielbranche / Berufsfeld
            <span style={{ fontWeight: 400, color: '#86868b', marginLeft: 6 }}>— in welche Richtung geht's?</span>
          </label>
          <div style={{ position: 'relative' }}>
            <select
              name="target_position"
              value={selectedField}
              onChange={handleFieldChange}
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

        {showCustom && (
          <div style={{ marginBottom: 24 }}>
            <input
              type="text"
              name="custom_target_position"
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
          style={{
            width: '100%', padding: '16px',
            background: loading ? '#E8E6E1' : '#CC1426',
            color: '#fff', border: 'none', borderRadius: 12,
            fontSize: 16, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}
        >
          {loading ? 'Wird gespeichert...' : 'Weiter zum CV-Upload'}
        </button>
      </form>
    </div>
  );
}

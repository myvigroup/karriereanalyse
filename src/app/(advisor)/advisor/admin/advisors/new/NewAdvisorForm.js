'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createAdvisorAccount } from '../../actions';

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #E8E6E1',
  fontSize: 14,
  color: '#1A1A1A',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#1A1A1A',
  marginBottom: 6,
};

export default function NewAdvisorForm({ returnFair }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    try {
      const result = await createAdvisorAccount(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
      // Bei Erfolg redirectet die Action selbst → kein weiteres Handling nötig
    } catch (err) {
      if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err;
      setError(err.message || 'Ein unbekannter Fehler ist aufgetreten.');
      setLoading(false);
    }
  }

  const backHref = returnFair ? `/advisor/admin/fairs/${returnFair}` : '/advisor/admin';

  return (
    <form onSubmit={handleSubmit}>
      {returnFair && <input type="hidden" name="returnFair" value={returnFair} />}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div>
          <label style={labelStyle}>Vollständiger Name *</label>
          <input name="name" required placeholder="z.B. Lisa Müller" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>E-Mail-Adresse *</label>
          <input name="email" type="email" required placeholder="lisa@beispiel.de" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Rolle</label>
          <select name="role" style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="advisor">Berater — eigene Gespräche verwalten</option>
            <option value="messeleiter">Messeleiter — Berater anlegen & alle Leads der Messe sehen</option>
            <option value="admin">Admin — Vollzugriff inkl. alle Messen verwalten</option>
          </select>
        </div>

        <div style={{ background: '#D1FAE5', borderRadius: 10, padding: '12px 14px' }}>
          <p style={{ fontSize: 13, color: '#059669', margin: 0, fontWeight: 500 }}>
            ✓ Eine Einladungs-E-Mail wird automatisch versendet. Kein Passwort nötig.
          </p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 14px' }}>
            <p style={{ fontSize: 13, color: '#DC2626', margin: 0, fontWeight: 500 }}>
              ✗ {error}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 0',
              background: loading ? '#6B7280' : '#1A1A1A',
              color: '#fff',
              border: 'none',
              borderRadius: 980,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Wird gesendet…' : 'Einladung senden →'}
          </button>
          <Link
            href={backHref}
            style={{
              padding: '12px 20px',
              background: '#F5F5F7',
              color: '#6B7280',
              borderRadius: 980,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            Abbrechen
          </Link>
        </div>
      </div>
    </form>
  );
}

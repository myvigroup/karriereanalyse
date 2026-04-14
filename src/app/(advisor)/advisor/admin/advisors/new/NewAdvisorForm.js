'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createAdvisorAccount, resendAdvisorInvite } from '../../actions';

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
  // Wenn Berater bereits existiert: Bestätigungsdialog
  const [existing, setExisting] = useState(null); // { email, name, returnFair }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return; // Doppelklick-Schutz
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    try {
      const result = await createAdvisorAccount(formData);
      if (result?.alreadyExists) {
        // Berater existiert → Bestätigungsdialog zeigen statt auto-resend
        setExisting({ email: result.email, name: result.name, returnFair: result.returnFair });
        setLoading(false);
        return;
      }
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
      // Bei Erfolg redirectet die Action selbst
    } catch (err) {
      if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err;
      setError(err.message || 'Ein unbekannter Fehler ist aufgetreten.');
      setLoading(false);
    }
  }

  async function handleResend() {
    if (loading) return;
    setLoading(true);
    const formData = new FormData();
    formData.set('email', existing.email);
    formData.set('name', existing.name);
    if (existing.returnFair) formData.set('returnFair', existing.returnFair);
    try {
      await resendAdvisorInvite(formData);
    } catch (err) {
      if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err;
      setError(err.message || 'Fehler beim Senden.');
      setLoading(false);
    }
  }

  const backHref = returnFair ? `/advisor/admin/fairs/${returnFair}` : '/advisor/admin';

  // ── Bestätigungsdialog (Berater existiert bereits) ────────────────────────
  if (existing) {
    return (
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 28 }}>
        <div style={{ background: '#FFF9E6', border: '1px solid #FDE68A', borderRadius: 12, padding: '16px 18px', marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#92400E', marginBottom: 6 }}>
            ⚠️ Berater bereits vorhanden
          </div>
          <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
            <strong>{existing.name}</strong> ({existing.email}) existiert bereits im System.
            Profil und Rolle wurden aktualisiert — eine neue Einladung wurde <strong>noch nicht</strong> gesendet.
          </p>
        </div>

        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20, lineHeight: 1.6 }}>
          Möchtest du eine neue Einladungs-E-Mail senden?<br />
          <strong style={{ color: '#DC2626' }}>Achtung:</strong> Alle bisherigen Einladungslinks werden damit ungültig. Der Berater muss den <em>neuesten</em> Link verwenden.
        </p>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>✗ {error}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleResend}
            disabled={loading}
            style={{
              flex: 1, padding: '12px 0',
              background: loading ? '#6B7280' : '#CC1426',
              color: '#fff', border: 'none', borderRadius: 980,
              fontSize: 14, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Wird gesendet…' : '📧 Neue Einladung senden'}
          </button>
          <Link
            href={backHref}
            style={{
              padding: '12px 20px', background: '#F5F5F7', color: '#6B7280',
              borderRadius: 980, fontSize: 14, fontWeight: 600,
              textDecoration: 'none', textAlign: 'center',
            }}
          >
            Abbrechen
          </Link>
        </div>
      </div>
    );
  }

  // ── Normales Formular ──────────────────────────────────────────────────────
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

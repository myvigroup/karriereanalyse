'use client';
import { QRCodeSVG } from 'qrcode.react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function QRCodePage() {
  const params = useParams();
  const fairId = params.fairId;
  const [origin, setOrigin] = useState('');

  useEffect(() => { setOrigin(window.location.origin); }, []);

  const scanUrl = origin ? `${origin}/scan/${fairId}` : '';

  return (
    <>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 24px' }}>
        <Link href={`/advisor/fair/${fairId}`} style={{ fontSize: 13, color: '#86868b', textDecoration: 'none', display: 'inline-block', marginBottom: 28 }}>
          ← Zurück zur Messe
        </Link>

        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', margin: '0 0 8px' }}>QR-Code · Selbst-Check</h1>
        <p style={{ color: '#6B7280', fontSize: 14, margin: '0 0 32px', lineHeight: 1.6 }}>
          Bewerber scannen diesen Code und füllen den Lebenslauf-Check selbstständig aus — kein Berater nötig.
        </p>

        {/* QR Code Card */}
        <div style={{
          background: '#fff', borderRadius: 24, padding: '36px 32px',
          border: '1px solid #E8E6E1', textAlign: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)', marginBottom: 20,
        }}>
          {scanUrl ? (
            <>
              <QRCodeSVG value={scanUrl} size={220} level="M" style={{ display: 'block', margin: '0 auto' }} />
              <div style={{ marginTop: 20, fontSize: 12, color: '#9CA3AF', wordBreak: 'break-all', lineHeight: 1.4 }}>
                {scanUrl}
              </div>
            </>
          ) : (
            <div style={{ width: 220, height: 220, background: '#F3F4F6', borderRadius: 12, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 14 }}>
              Lädt...
            </div>
          )}
        </div>

        {/* Actions */}
        {scanUrl && (
          <a
            href={scanUrl} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'block', padding: '14px 0', borderRadius: 980, background: '#F3F4F6',
              color: '#1A1A1A', fontWeight: 600, fontSize: 14, textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            🔗 Link testen
          </a>
        )}

        {/* Instructions */}
        <div style={{ marginTop: 28, padding: '20px', background: '#F9FAFB', borderRadius: 16, border: '1px solid #F3F4F6' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 12 }}>So funktioniert's</div>
          {[
            'Bewerber scannt den QR-Code mit dem Handy',
            'Gibt Name, E-Mail und Wunschposition ein',
            'Lädt seinen Lebenslauf hoch',
            'Erhält sofort KI-Feedback mit Gesamtbewertung',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < 3 ? 10 : 0 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#CC1426', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
              <span style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5 }}>{step}</span>
            </div>
          ))}
        </div>
      </div>

    </>
  );
}

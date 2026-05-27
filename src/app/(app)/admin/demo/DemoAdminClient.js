'use client';

import { useState, useTransition } from 'react';
import { setupDemoAction, resetDemoAction, wipeDemoAction } from './actions';

export default function DemoAdminClient({ isSetUp, stats, links, credentials }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  function run(action, label) {
    setMessage(null);
    startTransition(async () => {
      try {
        const result = await action();
        setMessage({ type: 'success', text: `${label} erfolgreich. ${result?.leadsCreated ? `${result.leadsCreated} Leads erstellt.` : ''}` });
        setConfirmReset(false);
      } catch (err) {
        setMessage({ type: 'error', text: `${label} fehlgeschlagen: ${err?.message || err}` });
      }
    });
  }

  function copyToClipboard(text) {
    navigator.clipboard?.writeText(text);
    setMessage({ type: 'success', text: 'In die Zwischenablage kopiert.' });
    setTimeout(() => setMessage(null), 2000);
  }

  return (
    <div className="admin-coaches">
      <div className="admin-pageheader">
        <div>
          <div className="title-kicker"><span className="pulse" /> Admin · Demo-Präsentation</div>
          <h1 className="page-title">Demo-Account verwalten</h1>
          <p className="page-sub">
            Eigener Berater-Account mit fiktiven Leads, vor-gescannten CVs und realistischen Affiliate-Stats —
            zum Vorführen auf der Bühne. Reset jederzeit per Klick.
          </p>
        </div>
      </div>

      {message && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 12,
          marginBottom: 24,
          background: message.type === 'success' ? 'rgba(5,150,105,0.08)' : 'rgba(204,20,38,0.08)',
          color: message.type === 'success' ? '#059669' : '#CC1426',
          border: `1px solid ${message.type === 'success' ? 'rgba(5,150,105,0.2)' : 'rgba(204,20,38,0.2)'}`,
          fontSize: 14,
        }}>
          {message.text}
        </div>
      )}

      {/* Status-Karten */}
      <div className="admin-stats-row" style={{ marginBottom: 32 }}>
        <div className="admin-stat highlight">
          <div className="admin-stat-body">
            <div className="admin-stat-value">{stats.leads}</div>
            <div className="admin-stat-label">Demo-Leads</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-body">
            <div className="admin-stat-value">{stats.cvs}</div>
            <div className="admin-stat-label">CV-Auswertungen</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-body">
            <div className="admin-stat-value">{stats.clicks}</div>
            <div className="admin-stat-label">Affiliate-Klicks</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-body">
            <div className="admin-stat-value">{stats.signups}</div>
            <div className="admin-stat-label">Sign-ups</div>
          </div>
        </div>
      </div>

      {/* Aktionen */}
      <section className="admin-hub-section">
        <div className="admin-hub-secthead">
          <h3>Aktionen</h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
          {!isSetUp && (
            <button
              className="btn btn-primary"
              disabled={isPending}
              onClick={() => run(setupDemoAction, 'Setup')}
              style={{ padding: '12px 24px', fontSize: 15 }}
            >
              {isPending ? 'Setup läuft...' : 'Demo-Account einrichten'}
            </button>
          )}
          {isSetUp && !confirmReset && (
            <button
              className="btn btn-primary"
              disabled={isPending}
              onClick={() => setConfirmReset(true)}
              style={{ padding: '12px 24px', fontSize: 15 }}
            >
              Demo zurücksetzen
            </button>
          )}
          {isSetUp && confirmReset && (
            <>
              <button
                className="btn btn-primary"
                disabled={isPending}
                onClick={() => run(resetDemoAction, 'Reset')}
                style={{ padding: '12px 24px', fontSize: 15, background: '#CC1426' }}
              >
                {isPending ? 'Reset läuft...' : 'Ja, alle Demo-Daten neu seeden'}
              </button>
              <button
                className="admin-action-btn"
                onClick={() => setConfirmReset(false)}
                disabled={isPending}
              >
                Abbrechen
              </button>
            </>
          )}
          {isSetUp && (
            <button
              className="admin-action-btn"
              disabled={isPending}
              onClick={() => run(wipeDemoAction, 'Wipe')}
              style={{ marginLeft: 'auto' }}
              title="Löscht nur die Daten, Account bleibt erhalten"
            >
              Nur Daten leeren
            </button>
          )}
        </div>
      </section>

      {/* Bühnen-URLs */}
      {isSetUp && (
        <section className="admin-hub-section" style={{ marginTop: 32 }}>
          <div className="admin-hub-secthead">
            <h3>Bühnen-Links</h3>
          </div>
          <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            <LinkRow
              label="Auto-Login (für die Bühne)"
              url={links.magic}
              hint="Einfach aufrufen → automatisch als Demo-Berater eingeloggt → Berater-Dashboard"
              onCopy={copyToClipboard}
            />
            <LinkRow
              label="Affiliate-Landing (Berater-spezifischer Funnel)"
              url={links.landing}
              hint="So sieht ein Lead die Seite, wenn er über den Berater-Link kommt"
              onCopy={copyToClipboard}
            />
            <LinkRow
              label="Affiliate-Redirect (das, was der Berater teilt)"
              url={links.affiliate}
              hint="Setzt Tracking-Cookie und leitet zur Landing weiter"
              onCopy={copyToClipboard}
            />
          </div>
        </section>
      )}

      {/* Muster-CV zum Download */}
      {isSetUp && (
        <section className="admin-hub-section" style={{ marginTop: 32 }}>
          <div className="admin-hub-secthead">
            <h3>Muster-Lebenslauf für die Bühne</h3>
          </div>
          <div style={{
            background: '#fff',
            border: '1px solid #E8E6E1',
            borderRadius: 12,
            padding: 16,
            marginTop: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                Sarah Berg — Senior Marketing Managerin (PDF, 4 KB)
              </div>
              <p style={{ fontSize: 13, color: '#86868b', margin: 0 }}>
                Fiktiver CV mit klarer Struktur, quantifizierten Erfolgen und 8 Jahren Erfahrung.
                Wurde so getestet, dass die KI eine starke Auswertung liefert. Lade ihn vor der Demo runter,
                damit du ihn auf der Bühne im Browser hochladen kannst.
              </p>
            </div>
            <a
              href="/demo-cv-sarah-berg.pdf"
              download
              className="btn btn-primary"
              style={{ padding: '10px 18px', fontSize: 14, whiteSpace: 'nowrap' }}
            >
              CV herunterladen
            </a>
          </div>
        </section>
      )}

      {/* Login-Daten zum Verteilen */}
      {isSetUp && (
        <section className="admin-hub-section" style={{ marginTop: 32 }}>
          <div className="admin-hub-secthead">
            <h3>Login-Daten (zum Verteilen an Mitarbeiter)</h3>
          </div>
          <div style={{
            background: '#FFF9E6',
            border: '1px solid #FDE68A',
            borderRadius: 10,
            padding: 16,
            marginTop: 12,
            fontSize: 14,
            color: '#92400E',
          }}>
            <div style={{ marginBottom: 8 }}>
              <strong>E-Mail:</strong> <code>{credentials.email}</code>
            </div>
            <div>
              <strong>Passwort:</strong> <code>{credentials.password}</code>
            </div>
            <p style={{ marginTop: 12, fontSize: 13, marginBottom: 0 }}>
              Hinweis: Demo-Daten werden geteilt — jeder Mitarbeiter sieht dasselbe Dashboard.
              Wenn jemand ausprobiert und die Daten verändert, einfach hier oben &bdquo;Demo zurücksetzen&ldquo;.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

function LinkRow({ label, url, hint, onCopy }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E8E6E1',
      borderRadius: 12,
      padding: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
        <button
          className="admin-action-btn"
          onClick={() => onCopy(url)}
          style={{ fontSize: 12, padding: '6px 12px' }}
        >
          Kopieren
        </button>
      </div>
      <code style={{
        display: 'block',
        fontSize: 13,
        color: '#374151',
        background: '#F9FAFB',
        padding: '8px 12px',
        borderRadius: 6,
        wordBreak: 'break-all',
      }}>{url}</code>
      {hint && (
        <p style={{ fontSize: 12, color: '#86868b', margin: '8px 0 0' }}>{hint}</p>
      )}
    </div>
  );
}

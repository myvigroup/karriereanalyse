'use client';

import { useState, useTransition } from 'react';
import { setupDemoAction, resetDemoAction, wipeDemoAction } from './actions';

export default function DemoAdminClient({ isSetUp, demoEmail, stats, links }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  function run(action, label) {
    setMessage(null);
    startTransition(async () => {
      try {
        const result = await action();
        setMessage({
          type: 'success',
          text: `${label} erfolgreich.${result?.leadsCreated ? ` ${result.leadsCreated} Leads + ${result.selfChecks || 0} Self-Service-Checks erstellt.` : ''}`,
        });
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
          <h1 className="page-title">Demo-Daten verwalten</h1>
          <p className="page-sub">
            Die Demo läuft auf deinem Admin-Account <strong>{demoEmail}</strong> — du bekommst einen
            Berater-Eintrag mit fiktiven Leads, vor-gescannten CVs und realistischen Affiliate-Stats.
            Nur Demo-Daten (Emails @beispiel.de) werden beim Reset gelöscht — echte Leads bleiben unangetastet.
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
            <div className="admin-stat-value">{stats.selfChecks}</div>
            <div className="admin-stat-label">Self-Service</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-body">
            <div className="admin-stat-value">{stats.clicks}</div>
            <div className="admin-stat-label">Affiliate-Klicks</div>
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
              {isPending ? 'Setup läuft...' : 'Demo-Daten anlegen'}
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
                {isPending ? 'Reset läuft...' : 'Ja, Demo-Daten neu seeden'}
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
              title="Löscht nur die fiktiven Demo-Daten (Emails @beispiel.de)"
            >
              Demo-Daten löschen
            </button>
          )}
        </div>
        <p style={{ fontSize: 13, color: '#86868b', marginTop: 12, lineHeight: 1.5 }}>
          <strong>Hinweis:</strong> Es werden ausschließlich die fiktiven Demo-Personen (Anna Müller,
          Marcus Berger, Sarah Vogt, Tobias Klein, Christina Walter, Julian Hoffmann, Lena Krause, Robin Schmidt)
          gelöscht. Echte Leads in deinem Account bleiben unangetastet.
        </p>
      </section>

      {/* Bühnen-URLs */}
      {isSetUp && (
        <section className="admin-hub-section" style={{ marginTop: 32 }}>
          <div className="admin-hub-secthead">
            <h3>Bühnen-Links</h3>
          </div>
          <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            <LinkRow
              label="Berater-Dashboard"
              url={links.advisor}
              hint="Du bist als Admin schon eingeloggt — Link öffnet direkt deinen Berater-Bereich mit den Demo-Daten."
              onCopy={copyToClipboard}
            />
            <LinkRow
              label="Affiliate-Landing (so sieht's der Lead)"
              url={links.landing}
              hint="So sieht ein Lead die Seite, wenn er über deinen Berater-Link kommt."
              onCopy={copyToClipboard}
            />
            <LinkRow
              label="Affiliate-Redirect (das, was der Berater teilt)"
              url={links.affiliate}
              hint="Setzt Tracking-Cookie und leitet zur Landing weiter."
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
                Wurde so getestet, dass die KI eine starke Auswertung liefert.
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

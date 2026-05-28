// Wahl-Page: wie soll der CV-Check ablaufen?
// — Mit dem Kunden zusammen (Berater erfasst persönlich) → /advisor/quick-lead
// — Kunde macht selbst (Affiliate-Link / QR teilen)       → /advisor/affiliate

import Link from 'next/link';

export default function NewCvCheckChooser() {
  return (
    <div className="admin-coaches">
      <div className="admin-pageheader">
        <div>
          <div className="title-kicker"><span className="pulse" /> Berater · Neuer CV-Check</div>
          <h1 className="page-title">Neuen CV-Check starten</h1>
          <p className="page-sub">
            Wähle, wie der CV-Check ablaufen soll. Beide Wege landen am Ende in deiner CV-Checks-Übersicht.
          </p>
        </div>
        <Link href="/advisor/leads" className="admin-action-btn" style={{ whiteSpace: 'nowrap' }}>
          ← Zur Übersicht
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gap: 20,
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        maxWidth: 880,
        marginTop: 24,
      }}>
        {/* OPTION 1 — Mit dem Kunden zusammen */}
        <Link href="/advisor/quick-lead" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="cv-choice-card">
            <div style={{ fontSize: 40, marginBottom: 6 }}>🤝</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
              Mit dem Kunden zusammen
            </h3>
            <p style={{ color: '#525252', fontSize: 14, lineHeight: 1.55, marginBottom: 16 }}>
              Du erfasst die Kundendaten persönlich, lädst seinen Lebenslauf hoch
              und besprichst die KI-Auswertung gemeinsam. Klassischer Beratungs-Flow
              für Messe-Gespräche und Telefon-Beratungen.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#86868b', lineHeight: 1.8 }}>
              <li>· Du behältst die Kontrolle über den Upload</li>
              <li>· Auswertung erscheint sofort im Berater-Dashboard</li>
              <li>· Lead-Status setzt du manuell (Termin, Coaching, ...)</li>
            </ul>
            <div style={{ marginTop: 20, color: '#CC1426', fontWeight: 600, fontSize: 14 }}>
              Quick-Lead anlegen →
            </div>
          </div>
        </Link>

        {/* OPTION 2 — Kunde macht selbst */}
        <Link href="/advisor/affiliate" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="cv-choice-card">
            <div style={{ fontSize: 40, marginBottom: 6 }}>🔗</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
              Kunde macht selbst
            </h3>
            <p style={{ color: '#525252', fontSize: 14, lineHeight: 1.55, marginBottom: 16 }}>
              Teile deinen Affiliate-Link oder QR-Code. Der Kunde lädt seinen CV
              selbst hoch und bekommt die Auswertung direkt — du siehst den Lead
              automatisch in der Self-Service-Box.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#86868b', lineHeight: 1.8 }}>
              <li>· Skaliert beliebig — du musst nicht dabei sein</li>
              <li>· Klicks und Sign-ups werden dir automatisch zugeordnet</li>
              <li>· Perfekt für LinkedIn-Posts, Newsletter, Visitenkarte</li>
            </ul>
            <div style={{ marginTop: 20, color: '#CC1426', fontWeight: 600, fontSize: 14 }}>
              Link & QR-Code holen →
            </div>
          </div>
        </Link>
      </div>

      <style>{`
        .cv-choice-card {
          background: #fff;
          border: 1px solid #E8E6E1;
          border-radius: 16px;
          padding: 28px;
          height: 100%;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        }
        .cv-choice-card:hover {
          border-color: #CC1426;
          box-shadow: 0 8px 24px rgba(204,20,38,0.08);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

'use client';

export default function UpgradePrompt({ feature, productName, features = [], trialText }) {
  return (
    <div className="card animate-in" style={{ textAlign: 'center', padding: 40, border: '1px solid var(--ki-border)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{'\u{1F512}'}</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
        {productName || 'Premium-Funktion'}
      </h3>
      <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 20, maxWidth: 340, margin: '0 auto 20px' }}>
        Diese Funktion ist Teil des {productName || 'Premium'}-Pakets.
      </p>

      {features.length > 0 && (
        <ul style={{ listStyle: 'none', marginBottom: 20, textAlign: 'left', maxWidth: 280, margin: '0 auto 20px' }}>
          {features.map((f, i) => (
            <li key={i} style={{ fontSize: 13, padding: '4px 0', color: 'var(--ki-text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--ki-success)' }}>{'\u2713'}</span> {f}
            </li>
          ))}
        </ul>
      )}

      <a href="/angebote" className="btn btn-primary" style={{ width: '100%', maxWidth: 280 }}>
        Jetzt freischalten
      </a>

      {trialText && (
        <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 12 }}>{trialText}</p>
      )}
    </div>
  );
}

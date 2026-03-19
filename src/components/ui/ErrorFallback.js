'use client';

export default function ErrorFallback({ error, onRetry }) {
  return (
    <div className="card animate-in" style={{ textAlign: 'center', padding: 48 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>&#x26A0;&#xFE0F;</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
        Etwas ist schiefgelaufen
      </h3>
      <p style={{ color: 'var(--ki-text-secondary)', fontSize: 14, marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>
        {error?.message || 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.'}
      </p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Erneut versuchen
        </button>
      )}
    </div>
  );
}

'use client';

export default function RootError({ error, reset }) {
  return (
    <div style={{
      maxWidth: 600,
      margin: '80px auto',
      padding: '40px',
      fontFamily: 'system-ui, sans-serif',
      background: '#FEF2F2',
      borderRadius: 16,
      border: '1px solid #FECACA',
    }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: '#DC2626', marginBottom: 16 }}>
        Fehler
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>
        <strong>Meldung:</strong> {error?.message || '(keine Nachricht)'}
      </p>
      <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
        <strong>Digest:</strong> {error?.digest || '(kein Digest)'}
      </p>
      <button
        onClick={reset}
        style={{
          padding: '10px 24px',
          background: '#DC2626',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Erneut versuchen
      </button>
    </div>
  );
}

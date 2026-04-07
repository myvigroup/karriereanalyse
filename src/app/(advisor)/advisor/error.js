'use client';

export default function AdvisorError({ error, reset }) {
  return (
    <div style={{
      maxWidth: 560,
      margin: '80px auto',
      padding: '32px',
      background: '#FEF2F2',
      borderRadius: 16,
      border: '1px solid #FECACA',
      textAlign: 'center',
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#DC2626', marginBottom: 12 }}>
        Fehler beim Laden des Dashboards
      </h2>
      <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>
        {error?.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
      </p>
      {error?.digest && (
        <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
          Fehler-Code: {error.digest}
        </p>
      )}
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
        Neu laden
      </button>
    </div>
  );
}

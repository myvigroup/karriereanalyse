'use client';

export default function EmptyState({ icon, title, description, ctaText, ctaLink }) {
  return (
    <div className="card animate-in" style={{ textAlign: 'center', padding: 48 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>{title}</h3>
      <p style={{ color: 'var(--ki-text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>{description}</p>
      {ctaText && ctaLink && (
        <a href={ctaLink} className="btn btn-primary">{ctaText}</a>
      )}
    </div>
  );
}

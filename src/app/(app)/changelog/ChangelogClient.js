'use client';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const TYPE_COLORS = {
  feature: 'var(--ki-success)',
  improvement: '#f5a623',
  fix: 'var(--ki-red)',
  deprecation: 'var(--ki-text-secondary)',
};

const TYPE_LABELS = {
  feature: 'Neu',
  improvement: 'Verbesserung',
  fix: 'Bugfix',
  deprecation: 'Entfernt',
};

function VersionBadge({ version }) {
  if (!version) return null;
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.04em',
        padding: '2px 10px',
        borderRadius: 'var(--r-pill)',
        background: 'var(--ki-charcoal, #1c2526)',
        color: 'white',
      }}
    >
      v{version}
    </span>
  );
}

function NewBadge() {
  return (
    <span
      className="pill pill-green"
      style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px' }}
    >
      Neu
    </span>
  );
}

function TypeBadge({ type }) {
  const color = TYPE_COLORS[type] || 'var(--ki-text-secondary)';
  const label = TYPE_LABELS[type] || type;
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 10px',
        borderRadius: 'var(--r-pill)',
        background: `${color}1A`,
        color: color,
        border: `1px solid ${color}33`,
      }}
    >
      {label}
    </span>
  );
}

export default function ChangelogClient({ entries, profile, userId }) {
  const lastSeen = profile?.last_changelog_seen ? new Date(profile.last_changelog_seen) : null;

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('profiles')
      .update({ last_changelog_seen: new Date().toISOString() })
      .eq('id', userId)
      .then(() => {});
  }, [userId]);

  const isNew = (entry) => {
    if (!lastSeen) return true;
    return new Date(entry.created_at) > lastSeen;
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Changelog</h1>
        <p style={{ color: 'var(--ki-text-secondary)', fontSize: 14, marginTop: 4 }}>
          Neuigkeiten und Updates der Karriere-Institut Akademie
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>&#x1F4CB;</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Keine Eintrge vorhanden</h3>
          <p style={{ color: 'var(--ki-text-secondary)', fontSize: 14 }}>
            Es wurden noch keine Changelog-Eintrge veroffentlicht.
          </p>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {/* Vertical timeline line */}
          <div
            style={{
              position: 'absolute',
              left: 19,
              top: 8,
              bottom: 8,
              width: 2,
              background: 'var(--ki-border)',
              borderRadius: 2,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {entries.map((entry, idx) => {
              const entryIsNew = isNew(entry);
              const typeColor = TYPE_COLORS[entry.type] || 'var(--ki-red)';
              const date = new Date(entry.created_at);
              const formattedDate = date.toLocaleDateString('de-DE', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              });

              return (
                <div
                  key={entry.id}
                  className="animate-in"
                  style={{
                    display: 'flex',
                    gap: 20,
                    paddingBottom: idx < entries.length - 1 ? 28 : 0,
                    position: 'relative',
                  }}
                >
                  {/* Timeline dot */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: 40,
                      display: 'flex',
                      justifyContent: 'center',
                      paddingTop: 18,
                    }}
                  >
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: entryIsNew ? typeColor : 'var(--ki-border)',
                        border: `2px solid ${entryIsNew ? typeColor : 'var(--ki-border)'}`,
                        boxShadow: entryIsNew ? `0 0 0 4px ${typeColor}22` : 'none',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    />
                  </div>

                  {/* Card */}
                  <div
                    className="card"
                    style={{
                      flex: 1,
                      borderLeft: entryIsNew ? `3px solid ${typeColor}` : '3px solid var(--ki-border)',
                    }}
                  >
                    {/* Meta row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      {entry.version && <VersionBadge version={entry.version} />}
                      {entry.type && <TypeBadge type={entry.type} />}
                      {entryIsNew && <NewBadge />}
                      <span
                        style={{
                          fontSize: 12,
                          color: 'var(--ki-text-secondary)',
                          marginLeft: 'auto',
                        }}
                      >
                        {formattedDate}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        marginBottom: entry.description ? 8 : 0,
                      }}
                    >
                      {entry.title}
                    </h3>

                    {/* Description */}
                    {entry.description && (
                      <p
                        style={{
                          fontSize: 14,
                          color: 'var(--ki-text-secondary)',
                          lineHeight: 1.6,
                          margin: 0,
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {entry.description}
                      </p>
                    )}

                    {/* Tags */}
                    {Array.isArray(entry.tags) && entry.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                        {entry.tags.map((tag, i) => (
                          <span key={i} className="pill pill-grey" style={{ fontSize: 11 }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

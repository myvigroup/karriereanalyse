'use client';
import { useState } from 'react';
import { hasAccess } from '@/lib/access-control';
import UpgradePrompt from '@/components/ui/UpgradePrompt';
import EmptyState from '@/components/ui/EmptyState';

function StarDisplay({ rating, count }) {
  const rounded = Math.round((rating || 0) * 2) / 2;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(i => {
          const filled = i <= Math.floor(rounded);
          const half = !filled && i - 0.5 === rounded;
          return (
            <span
              key={i}
              style={{
                fontSize: 14,
                color: filled || half ? '#f5a623' : 'var(--ki-border)',
                lineHeight: 1,
              }}
            >
              {filled ? '\u2605' : half ? '\u2BEA' : '\u2606'}
            </span>
          );
        })}
      </div>
      {count > 0 && (
        <span style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>
          {rating.toFixed(1)} ({count})
        </span>
      )}
      {count === 0 && (
        <span style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Noch keine Bewertungen</span>
      )}
    </div>
  );
}

function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return (
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 12 }}>
        Noch keine Bewertungen vorhanden.
      </p>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
      {reviews.map(r => (
        <div
          key={r.id}
          style={{
            padding: '10px 14px',
            background: 'var(--ki-bg-alt)',
            borderRadius: 'var(--r-md)',
            borderLeft: '3px solid var(--ki-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} style={{ fontSize: 12, color: i <= (r.rating || 0) ? '#f5a623' : 'var(--ki-border)' }}>
                  {i <= (r.rating || 0) ? '\u2605' : '\u2606'}
                </span>
              ))}
            </div>
            {r.reviewer_name && (
              <span style={{ fontSize: 12, fontWeight: 600 }}>{r.reviewer_name}</span>
            )}
            <span style={{ fontSize: 11, color: 'var(--ki-text-secondary)', marginLeft: 'auto' }}>
              {new Date(r.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
          {r.comment && (
            <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {r.comment}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function CoachCard({ coach, coachReviews, canBook }) {
  const [reviewsOpen, setReviewsOpen] = useState(false);

  const specializations = Array.isArray(coach.specialization)
    ? coach.specialization
    : typeof coach.specialization === 'string' && coach.specialization
    ? coach.specialization.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const avgRating =
    coachReviews.length > 0
      ? coachReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / coachReviews.length
      : 0;

  const handleBook = () => {
    if (!coach.calendly_url) return;
    window.open(coach.calendly_url, '_blank', 'noopener,noreferrer');
  };

  const displayName = [coach.first_name, coach.name].filter(Boolean).join(' ') || 'Coach';

  return (
    <div className="card animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'var(--ki-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 20,
            fontWeight: 700,
            color: 'white',
            overflow: 'hidden',
          }}
        >
          {coach.avatar_url ? (
            <img
              src={coach.avatar_url}
              alt={displayName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            displayName[0].toUpperCase()
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{displayName}</div>
          <StarDisplay rating={avgRating} count={coachReviews.length} />
        </div>
        {coach.hourly_rate && (
          <div
            style={{
              flexShrink: 0,
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--ki-red)',
            }}
          >
            {coach.hourly_rate} €/h
          </div>
        )}
      </div>

      {/* Bio */}
      {coach.bio && (
        <p
          style={{
            fontSize: 13,
            color: 'var(--ki-text-secondary)',
            lineHeight: 1.55,
            marginBottom: 12,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {coach.bio}
        </p>
      )}

      {/* Specialization pills */}
      {specializations.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {specializations.map((s, i) => (
            <span key={i} className="pill pill-grey" style={{ fontSize: 11 }}>
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 'auto' }}>
        <button
          className="btn btn-secondary"
          onClick={() => setReviewsOpen(o => !o)}
          style={{ fontSize: 12, padding: '6px 14px' }}
        >
          {reviewsOpen ? 'Bewertungen ausblenden' : `Bewertungen (${coachReviews.length})`}
        </button>

        {canBook ? (
          <button
            className="btn btn-primary"
            onClick={handleBook}
            disabled={!coach.calendly_url}
            title={coach.calendly_url ? 'Termin buchen' : 'Kein Buchungslink hinterlegt'}
            style={{ fontSize: 13 }}
          >
            Termin buchen
          </button>
        ) : (
          <a href="/angebote" className="btn btn-primary" style={{ fontSize: 13 }}>
            Freischalten
          </a>
        )}
      </div>

      {/* Expandable reviews */}
      {reviewsOpen && <ReviewList reviews={coachReviews} />}
    </div>
  );
}

export default function MarketplaceClient({ coaches, reviews, profile }) {
  const canBook = hasAccess(profile, 'coaching_session') || hasAccess(profile, 'coach_unlimited');

  const reviewsByCoach = (reviews || []).reduce((acc, r) => {
    if (!acc[r.coach_id]) acc[r.coach_id] = [];
    acc[r.coach_id].push(r);
    return acc;
  }, {});

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Coaching Marketplace</h1>
        <p style={{ color: 'var(--ki-text-secondary)', fontSize: 14, marginTop: 4 }}>
          Finde den passenden Coach und buche direkt deinen Termin.
        </p>
      </div>

      {/* Paywall banner for non-premium users */}
      {!canBook && (
        <div style={{ marginBottom: 24 }}>
          <UpgradePrompt
            feature="coaching_session"
            productName="Coaching-Paket"
            features={[
              'Persönliche 1:1 Sessions mit zertifizierten Coaches',
              'Direkte Terminbuchung via Calendly',
              'Bewertungen und Erfahrungsberichte',
              'Individuelle Karriereberatung',
            ]}
            trialText="Einmalig buchbar oder als Teil deines Premium-Abos."
          />
        </div>
      )}

      {/* Coach grid or empty state */}
      {coaches.length === 0 ? (
        <EmptyState
          icon="\uD83C\uDFC6"
          title="Keine Coaches verfugbar"
          description="Aktuell sind keine Coaches im Marketplace gelistet. Schau bald wieder rein!"
        />
      ) : (
        <div className="grid-3">
          {coaches.map(coach => (
            <CoachCard
              key={coach.id}
              coach={coach}
              coachReviews={reviewsByCoach[coach.id] || []}
              canBook={canBook}
            />
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';

export default function GeisterCounterWidget({ counterData = {}, onComplete }) {
  const [count, setCount] = useState(0);
  const [showBadge, setShowBadge] = useState(null);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const badges = counterData.badges || [];
  const quotes = counterData.mindset_quotes || [];
  const stats = counterData.statistiken || {};

  const handleClick = useCallback(() => {
    const newCount = count + 1;
    setCount(newCount);

    // Check for badge
    const badge = badges.find((b) => b.count === newCount);
    if (badge) {
      setShowBadge(badge);
      setTimeout(() => setShowBadge(null), 3000);
    }

    // Rotate quote
    if (quotes.length > 0) {
      setQuoteIdx((prev) => (prev + 1) % quotes.length);
    }
  }, [count, badges, quotes]);

  const currentQuote = quotes.length > 0 ? quotes[quoteIdx] : '';
  const nextBadge = badges.find((b) => b.count > count);
  const earnedBadges = badges.filter((b) => b.count <= count);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Geister-Counter</h2>
      <p style={styles.subtitle}>
        Jede Kaltanfrage zaehlt — auch wenn keine Antwort kommt. Druecke +1 fuer jede gesendete Anfrage.
      </p>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="card" style={styles.statCard}>
            <p style={styles.statText}>{value}</p>
          </div>
        ))}
      </div>

      {/* Counter */}
      <div style={styles.counterSection}>
        <div style={styles.counterDisplay}>
          <span style={styles.counterNumber}>{count}</span>
          <span style={styles.counterLabel}>Kaltanfragen gesendet</span>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleClick}
          style={styles.counterBtn}
        >
          +1 Anfrage gesendet
        </button>

        {nextBadge && (
          <p style={styles.nextBadgeText}>
            Naechstes Badge bei {nextBadge.count}: <strong>{nextBadge.name}</strong>
          </p>
        )}
      </div>

      {/* Badge animation */}
      {showBadge && (
        <div style={styles.badgeOverlay}>
          <div style={styles.badgeCard}>
            <div style={styles.badgeIcon}>🏆</div>
            <h3 style={styles.badgeName}>{showBadge.name}</h3>
            <p style={styles.badgeDesc}>{showBadge.beschreibung}</p>
          </div>
        </div>
      )}

      {/* Earned badges */}
      {earnedBadges.length > 0 && (
        <div style={styles.badgesSection}>
          <h3 style={styles.badgesTitle}>Deine Badges</h3>
          <div style={styles.badgesRow}>
            {earnedBadges.map((b) => (
              <div key={b.count} style={styles.earnedBadge}>
                <span style={styles.earnedIcon}>🏆</span>
                <span style={styles.earnedName}>{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quote */}
      {currentQuote && (
        <div style={styles.quoteBox}>
          <p style={styles.quoteText}>{currentQuote}</p>
        </div>
      )}

      {/* Progress / complete */}
      <div style={styles.progressBarOuter}>
        <div style={{ ...styles.progressBarInner, width: `${Math.min((count / 5) * 100, 100)}%` }} />
      </div>
      <p style={styles.progressText}>
        {count < 5 ? `Noch ${5 - count} bis zum ersten Badge` : `${count} Anfragen — weiter so!`}
      </p>

      {count >= 5 && (
        <div style={styles.completeSection}>
          <p style={styles.completeText}>
            {count} Kaltanfragen gesendet! Jede Anfrage ist ein Schritt. Ghosting ist normal — dein Mut ist es nicht.
          </p>
          <button className="btn btn-primary" onClick={() => onComplete?.()} style={styles.completeBtn}>
            Weiter
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Instrument Sans, sans-serif', maxWidth: 640, margin: '0 auto', padding: 16 },
  title: { fontSize: 24, fontWeight: 700, color: 'var(--ki-text, #1a1a1a)', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#888', marginBottom: 16, lineHeight: 1.5 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 10, marginBottom: 24 },
  statCard: { padding: 12 },
  statText: { fontSize: 14, color: 'var(--ki-text, #555)', lineHeight: 1.5, margin: 0 },
  counterSection: { textAlign: 'center', marginBottom: 24 },
  counterDisplay: { marginBottom: 16 },
  counterNumber: {
    fontSize: 72, fontWeight: 700, color: 'var(--ki-red, #CC1426)',
    display: 'block', lineHeight: 1,
  },
  counterLabel: { fontSize: 14, color: '#888', display: 'block', marginTop: 4 },
  counterBtn: {
    fontSize: 20, padding: '16px 40px', borderRadius: 50,
    transition: 'transform 0.1s',
  },
  nextBadgeText: { fontSize: 13, color: '#888', marginTop: 12 },
  badgeOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    animation: 'fadeIn 0.3s ease',
  },
  badgeCard: {
    background: '#fff', borderRadius: 20, padding: 32, textAlign: 'center',
    maxWidth: 320, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    animation: 'scaleIn 0.3s ease',
  },
  badgeIcon: { fontSize: '4rem', marginBottom: 12 },
  badgeName: {
    fontSize: 22, fontWeight: 700, color: 'var(--ki-text, #1a1a1a)',
    marginBottom: 8, fontFamily: 'Instrument Sans, sans-serif',
  },
  badgeDesc: { fontSize: 15, color: 'var(--ki-text, #555)', lineHeight: 1.5, margin: 0 },
  badgesSection: { marginBottom: 20 },
  badgesTitle: { fontSize: 16, fontWeight: 700, color: 'var(--ki-text, #1a1a1a)', marginBottom: 10, fontFamily: 'Instrument Sans, sans-serif' },
  badgesRow: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  earnedBadge: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
    background: 'rgba(204, 20, 38, 0.06)', borderRadius: 20,
    border: '1px solid rgba(204, 20, 38, 0.15)',
  },
  earnedIcon: { fontSize: '1rem' },
  earnedName: { fontSize: 13, fontWeight: 600, color: 'var(--ki-text, #333)' },
  quoteBox: {
    background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 12,
    padding: 16, marginBottom: 20, textAlign: 'center',
  },
  quoteText: {
    fontSize: 15, fontStyle: 'italic', color: 'var(--ki-text, #555)',
    lineHeight: 1.6, margin: 0,
  },
  progressBarOuter: { height: 4, background: '#e0e0e0', borderRadius: 2, marginBottom: 6, overflow: 'hidden' },
  progressBarInner: { height: '100%', background: 'var(--ki-red, #CC1426)', borderRadius: 2, transition: 'width 0.4s ease' },
  progressText: { fontSize: 12, color: '#aaa', marginBottom: 20 },
  completeSection: { textAlign: 'center', marginTop: 24, padding: 24, background: 'rgba(204, 20, 38, 0.03)', borderRadius: 16 },
  completeText: { fontSize: 16, color: 'var(--ki-text, #333)', marginBottom: 16, lineHeight: 1.5 },
  completeBtn: { fontSize: 18, padding: '14px 40px' },
};

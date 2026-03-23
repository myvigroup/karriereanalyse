'use client';

import { useState, useEffect, useCallback } from 'react';

const KEYFRAMES = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
@keyframes float {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-30px); }
}
@keyframes confettiFall {
  0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(60vh) rotate(720deg); opacity: 0; }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

export default function BossFightWidget({ config, onComplete }) {
  const { name, beschreibung, user_stat, boss_stat, wellen, sieg, niederlage } = config || {};
  const waves = wellen || [];

  const [screen, setScreen] = useState('intro'); // intro | fight | feedback | victory | defeat
  const [waveIndex, setWaveIndex] = useState(0);
  const [userHP, setUserHP] = useState(100);
  const [bossHP, setBossHP] = useState(100);
  const [feedback, setFeedback] = useState(null);
  const [animUser, setAnimUser] = useState(null);
  const [animBoss, setAnimBoss] = useState(null);
  const [floatDmg, setFloatDmg] = useState(null);

  const startFight = useCallback(() => {
    setScreen('fight');
    setWaveIndex(0);
    setUserHP(100);
    setBossHP(100);
    setFeedback(null);
  }, []);

  const handleOption = useCallback((option) => {
    const userDmg = option.user_damage || option.schaden_spieler || 0;
    const bossDmg = option.boss_damage || option.schaden_boss || 0;
    const fbText = option.feedback || option.rueckmeldung || '';

    const newUserHP = Math.max(0, userHP - userDmg);
    const newBossHP = Math.max(0, bossHP - bossDmg);

    setUserHP(newUserHP);
    setBossHP(newBossHP);
    setFeedback(fbText);
    setScreen('feedback');

    // Animations
    if (userDmg > 0) {
      setAnimUser('shake');
      setFloatDmg({ target: 'user', value: -userDmg });
    }
    if (bossDmg > 0) {
      setAnimBoss('pulse');
      if (!userDmg || bossDmg > userDmg) {
        setFloatDmg({ target: 'boss', value: -bossDmg });
      }
    }

    setTimeout(() => {
      setAnimUser(null);
      setAnimBoss(null);
      setFloatDmg(null);
    }, 600);

    // Auto advance after 2 seconds
    setTimeout(() => {
      if (newUserHP <= 0) {
        setScreen('defeat');
      } else if (newBossHP <= 0 || waveIndex >= waves.length - 1) {
        if (newBossHP <= 0) {
          setScreen('victory');
        } else {
          setWaveIndex((prev) => prev + 1);
          setScreen('fight');
        }
      } else {
        setWaveIndex((prev) => prev + 1);
        setScreen('fight');
      }
      setFeedback(null);
    }, 2000);
  }, [userHP, bossHP, waveIndex, waves.length]);

  // Check end conditions after wave
  useEffect(() => {
    if (screen === 'fight' && bossHP <= 0) {
      setScreen('victory');
    }
  }, [screen, bossHP]);

  const wave = waves[waveIndex] || {};
  const optionen = wave.optionen || wave.options || [];
  const bossRede = wave.boss_rede || wave.text || wave.ansage || '';

  // --- Intro ---
  if (screen === 'intro') {
    return (
      <div style={styles.container}>
        <style>{KEYFRAMES}</style>
        <div className="card" style={styles.introCard}>
          <div style={styles.bossEmoji}>👹</div>
          <h2 style={styles.heading}>{name || 'Boss Fight'}</h2>
          <p style={styles.introDesc}>{beschreibung || 'Besiege den Boss mit klugen Entscheidungen!'}</p>
          <div style={styles.statRow}>
            {user_stat && (
              <div style={styles.statBox}>
                <span style={styles.statLabel}>Dein Wert</span>
                <span style={styles.statValue}>{user_stat}</span>
              </div>
            )}
            {boss_stat && (
              <div style={{ ...styles.statBox, borderColor: '#EF4444' }}>
                <span style={styles.statLabel}>Boss Wert</span>
                <span style={{ ...styles.statValue, color: '#EF4444' }}>{boss_stat}</span>
              </div>
            )}
          </div>
          <button className="btn btn-primary" style={styles.startBtn} onClick={startFight}>
            Kampf starten
          </button>
        </div>
      </div>
    );
  }

  // --- Victory ---
  if (screen === 'victory') {
    const siegData = sieg || {};
    return (
      <div style={styles.container}>
        <style>{KEYFRAMES}</style>
        <div style={styles.confettiWrap}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: -10,
                width: 8,
                height: 8,
                borderRadius: i % 2 === 0 ? '50%' : 0,
                background: ['#CC1426', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'][i % 5],
                animation: `confettiFall ${1.5 + Math.random() * 2}s ease-in ${Math.random() * 0.5}s forwards`,
              }}
            />
          ))}
        </div>
        <div className="card" style={styles.victoryCard}>
          <div style={styles.victoryIcon}>🏆</div>
          <h2 style={{ ...styles.heading, color: '#10B981' }}>Sieg!</h2>
          <p style={styles.resultText}>{siegData.text || siegData.nachricht || 'Du hast den Boss besiegt!'}</p>
          {siegData.badge && (
            <div className="pill" style={styles.badge}>{siegData.badge}</div>
          )}
          {siegData.xp && (
            <p style={styles.xpText}>+{siegData.xp} XP</p>
          )}
          <button className="btn btn-primary" style={styles.startBtn} onClick={onComplete}>
            Weiter
          </button>
        </div>
      </div>
    );
  }

  // --- Defeat ---
  if (screen === 'defeat') {
    const niederlageData = niederlage || {};
    return (
      <div style={styles.container}>
        <style>{KEYFRAMES}</style>
        <div className="card" style={styles.defeatCard}>
          <div style={styles.defeatIcon}>💀</div>
          <h2 style={{ ...styles.heading, color: '#EF4444' }}>Niederlage</h2>
          <p style={styles.resultText}>{niederlageData.text || niederlageData.nachricht || 'Der Boss hat gewonnen. Versuche es erneut!'}</p>
          <button className="btn btn-primary" style={styles.startBtn} onClick={startFight}>
            Nochmal versuchen
          </button>
        </div>
      </div>
    );
  }

  // --- Fight / Feedback ---
  return (
    <div style={styles.container}>
      <style>{KEYFRAMES}</style>

      {/* Wave counter */}
      <div style={styles.waveCounter}>Welle {waveIndex + 1} / {waves.length}</div>

      {/* Health bars */}
      <div style={styles.hpRow}>
        <div style={styles.hpBlock}>
          <div style={styles.hpLabel}>
            <span>Du</span>
            <span>{Math.round(userHP)}%</span>
          </div>
          <div style={styles.hpTrack}>
            <div
              style={{
                ...styles.hpFill,
                width: `${userHP}%`,
                background: userHP > 50 ? '#10B981' : userHP > 25 ? '#F59E0B' : '#EF4444',
                animation: animUser ? `${animUser} 0.4s ease` : 'none',
              }}
            />
          </div>
          {floatDmg?.target === 'user' && (
            <div style={styles.floatDmg}>{floatDmg.value}</div>
          )}
        </div>
        <div style={styles.hpBlock}>
          <div style={styles.hpLabel}>
            <span>Boss</span>
            <span>{Math.round(bossHP)}%</span>
          </div>
          <div style={styles.hpTrack}>
            <div
              style={{
                ...styles.hpFill,
                width: `${bossHP}%`,
                background: '#CC1426',
                animation: animBoss ? `${animBoss} 0.4s ease` : 'none',
              }}
            />
          </div>
          {floatDmg?.target === 'boss' && (
            <div style={{ ...styles.floatDmg, color: '#10B981' }}>{floatDmg.value}</div>
          )}
        </div>
      </div>

      {/* Boss speech */}
      {bossRede && (
        <div style={styles.speechBubble}>
          <div style={styles.speechArrow} />
          <span style={styles.bossSmallIcon}>👹</span>
          <p style={styles.speechText}>{bossRede}</p>
        </div>
      )}

      {/* Options or Feedback */}
      {screen === 'feedback' && feedback ? (
        <div className="card" style={{ ...styles.feedbackCard, animation: 'fadeIn 0.3s ease' }}>
          <p style={styles.feedbackText}>{feedback}</p>
        </div>
      ) : screen === 'fight' ? (
        <div style={styles.optionGrid}>
          {optionen.map((opt, i) => (
            <button
              key={i}
              className="card"
              style={styles.optionCard}
              onClick={() => handleOption(opt)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#CC1426';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--ki-bg, #e5e7eb)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={styles.optionText}>{opt.text || opt.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Instrument Sans, sans-serif',
    maxWidth: 640,
    margin: '0 auto',
    padding: '1rem',
    position: 'relative',
  },
  heading: {
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: '1.5rem',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '0.75rem',
    color: 'var(--ki-text, #1a1a1a)',
  },
  introCard: {
    padding: '2rem',
    borderRadius: 12,
    textAlign: 'center',
  },
  bossEmoji: { fontSize: '4rem', marginBottom: '0.5rem' },
  introDesc: {
    color: 'var(--ki-text, #555)',
    fontSize: '0.95rem',
    lineHeight: 1.5,
    marginBottom: '1.5rem',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.75rem 1.25rem',
    border: '2px solid #10B981',
    borderRadius: 8,
  },
  statLabel: { fontSize: '0.8rem', color: 'var(--ki-text, #666)' },
  statValue: { fontSize: '1.3rem', fontWeight: 700, color: '#10B981' },
  startBtn: { width: '100%', maxWidth: 280 },
  waveCounter: {
    textAlign: 'center',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--ki-text, #666)',
    marginBottom: '1rem',
  },
  hpRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  hpBlock: {
    flex: 1,
    position: 'relative',
  },
  hpLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--ki-text, #333)',
    marginBottom: '0.25rem',
  },
  hpTrack: {
    height: 14,
    borderRadius: 7,
    background: 'var(--ki-bg, #e5e7eb)',
    overflow: 'hidden',
  },
  hpFill: {
    height: '100%',
    borderRadius: 7,
    transition: 'width 0.5s ease',
  },
  floatDmg: {
    position: 'absolute',
    right: 0,
    top: -8,
    fontWeight: 700,
    fontSize: '1rem',
    color: '#EF4444',
    animation: 'float 1s ease forwards',
    pointerEvents: 'none',
  },
  speechBubble: {
    position: 'relative',
    background: '#fef2f2',
    border: '2px solid #fecaca',
    borderRadius: 16,
    padding: '1rem 1rem 1rem 2.5rem',
    marginBottom: '1.5rem',
  },
  speechArrow: {
    position: 'absolute',
    bottom: -10,
    left: 30,
    width: 0,
    height: 0,
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderTop: '10px solid #fecaca',
  },
  bossSmallIcon: {
    position: 'absolute',
    left: 8,
    top: 10,
    fontSize: '1.2rem',
  },
  speechText: {
    fontSize: '0.95rem',
    color: 'var(--ki-text, #333)',
    lineHeight: 1.5,
    margin: 0,
  },
  optionGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  optionCard: {
    padding: '1rem 1.25rem',
    borderRadius: 10,
    border: '2px solid var(--ki-bg, #e5e7eb)',
    cursor: 'pointer',
    background: '#fff',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  },
  optionText: {
    fontSize: '0.95rem',
    color: 'var(--ki-text, #333)',
    fontWeight: 500,
  },
  feedbackCard: {
    padding: '1.5rem',
    borderRadius: 12,
    borderLeft: '4px solid #CC1426',
  },
  feedbackText: {
    fontSize: '0.95rem',
    color: 'var(--ki-text, #333)',
    lineHeight: 1.6,
    margin: 0,
  },
  confettiWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 10,
  },
  victoryCard: {
    padding: '2rem',
    borderRadius: 12,
    textAlign: 'center',
    borderTop: '4px solid #10B981',
  },
  victoryIcon: { fontSize: '3rem', marginBottom: '0.5rem' },
  defeatCard: {
    padding: '2rem',
    borderRadius: 12,
    textAlign: 'center',
    borderTop: '4px solid #EF4444',
  },
  defeatIcon: { fontSize: '3rem', marginBottom: '0.5rem' },
  resultText: {
    fontSize: '0.95rem',
    color: 'var(--ki-text, #555)',
    lineHeight: 1.6,
    marginBottom: '1rem',
  },
  badge: {
    display: 'inline-block',
    background: '#fef3c7',
    color: '#92400e',
    fontWeight: 600,
    padding: '0.4rem 1rem',
    borderRadius: 20,
    marginBottom: '0.75rem',
  },
  xpText: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#10B981',
    marginBottom: '1rem',
  },
};

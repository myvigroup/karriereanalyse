'use client';
import { useState, useEffect } from 'react';

export default function LevelUpModal({ level, onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  if (!level) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: show ? 1 : 0, transition: 'opacity 0.3s ease',
    }} onClick={onClose}>
      {/* Confetti */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: '-10px',
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            background: ['#CC1426', '#D4A017', '#2D6A4F', '#6366f1', '#ec4899'][Math.floor(Math.random() * 5)],
            animation: `lvlConfetti ${2 + Math.random() * 2}s ease-in forwards`,
            animationDelay: `${Math.random() * 1}s`,
          }} />
        ))}
        <style>{`@keyframes lvlConfetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }`}</style>
      </div>

      <div className="card" onClick={e => e.stopPropagation()} style={{
        textAlign: 'center', padding: 48, maxWidth: 400,
        transform: show ? 'scale(1)' : 'scale(0.8)', transition: 'transform 0.4s var(--ease-apple)',
      }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>{level.icon}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-red)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Level Up!</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 8 }}>Level {level.level}: {level.name}</h2>
        <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', marginBottom: 32 }}>
          Gl\u00FCckwunsch! Du hast {level.minXP} XP erreicht.
        </p>
        <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>Weiter</button>
      </div>
    </div>
  );
}

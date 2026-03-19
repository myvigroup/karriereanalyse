'use client';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ki_theme');
    if (saved === 'dark') {
      setDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('ki_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('ki_theme', 'light');
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Light Mode' : 'Dark Mode'}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 16, padding: '8px 16px', borderRadius: 'var(--r-md)',
        color: 'var(--ki-text-secondary)', transition: 'background var(--t-fast)',
        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--ki-bg-alt)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{dark ? '\u2600\uFE0F' : '\u{1F319}'}</span>
      <span style={{ fontSize: 14 }}>{dark ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  );
}

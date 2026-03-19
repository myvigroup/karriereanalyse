'use client';
import { useState, useEffect, useRef } from 'react';
import { getTooltipContent } from '@/lib/tooltip-config';

export default function InfoTooltip({ moduleId, profile }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const content = getTooltipContent(profile, moduleId);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!content) return null;

  return (
    <span style={{ position: 'relative', display: 'inline-flex', verticalAlign: 'middle', marginLeft: 8 }} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Info: ${content.title}`}
        data-tour="step-8"
        style={{
          width: 20, height: 20, borderRadius: '50%', border: '1.5px solid var(--ki-red)',
          background: 'transparent', color: 'var(--ki-red)', fontSize: 11, fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0.5, transition: 'opacity var(--t-fast)',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
      >
        ?
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          maxWidth: 320, width: 'calc(100vw - 48px)', zIndex: 9999,
          background: 'var(--ki-card)', borderRadius: 'var(--r-lg)',
          boxShadow: 'var(--sh-xl)', padding: 20,
          animation: 'fadeIn 0.2s ease both',
        }}>
          <button
            onClick={() => setOpen(false)}
            aria-label="Schlie\u00DFen"
            style={{
              position: 'absolute', top: 12, right: 12, background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 16, color: 'var(--ki-text-tertiary)', padding: 4,
            }}
          >
            {'\u2715'}
          </button>

          <h4 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
            {content.title}
          </h4>
          <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
            {content.description}
          </p>
          <a href={content.cta_link} className="btn btn-primary" style={{ width: '100%', fontSize: 13, padding: '10px 16px' }}>
            {content.cta_text}
          </a>
        </div>
      )}
    </span>
  );
}

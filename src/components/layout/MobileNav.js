'use client';
import { usePathname } from 'next/navigation';

const MOBILE_ITEMS = [
  { label: 'Home', path: '/dashboard', icon: '\u25FB' },
  { label: 'Coach', path: '/coach', icon: '\u{1F916}' },
  { label: 'Analyse', path: '/analyse', icon: '\u25CE' },
  { label: 'Kurse', path: '/masterclass', icon: '\u25B6' },
  { label: 'Mehr', path: '/profile', icon: '\u25CB' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-nav" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
      background: 'var(--ki-card)', borderTop: '1px solid var(--ki-border)',
      display: 'none', justifyContent: 'space-around', alignItems: 'center',
      padding: '8px 0 env(safe-area-inset-bottom, 8px)', height: 64,
    }}>
      {MOBILE_ITEMS.map(item => {
        const active = pathname === item.path;
        return (
          <a key={item.path} href={item.path} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            textDecoration: 'none', color: active ? 'var(--ki-red)' : 'var(--ki-text-secondary)',
            fontSize: 10, fontWeight: active ? 600 : 400, transition: 'color var(--t-fast)',
            padding: '4px 12px',
          }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

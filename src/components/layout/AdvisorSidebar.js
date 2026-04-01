'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/advisor', label: 'Dashboard', icon: '⊞', exact: true },
  { href: '/advisor/leads', label: 'Lebenslauf-Checks', icon: '📋' },
];

export default function AdvisorSidebar({ profile, advisor }) {
  const pathname = usePathname();

  const isActive = (href, exact) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const displayName = advisor?.display_name || profile?.display_name || profile?.email || 'Berater';

  return (
    <div style={{
      width: 240,
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: '#1A1A1A',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 200,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: '#CC1426', textTransform: 'uppercase', marginBottom: 4 }}>
          Karriere-Institut
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
          Berater-Portal
        </div>
      </div>

      {/* Profil */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: '#CC1426',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: 14,
          marginBottom: 8,
        }}>
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
          {displayName}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
          Karriere-Berater
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '12px 12px', flex: 1 }}>
        {NAV_ITEMS.map(item => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                textDecoration: 'none',
                marginBottom: 2,
                background: active ? 'rgba(204, 20, 38, 0.15)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Link
          href="/api/auth/signout"
          style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
        >
          Abmelden
        </Link>
      </div>
    </div>
  );
}

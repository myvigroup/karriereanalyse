'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const Ic = ({ d, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);

const I = {
  home:      <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>,
  analyse:   <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>,
  play:      <><circle cx="12" cy="12" r="9" /><path d="M10 8.5v7l5.5-3.5z" /></>,
  doc:       <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /></>,
  chat:      <path d="M21 12a8 8 0 0 1-8 8H5l3-3a8 8 0 1 1 13-5z" />,
  bell:      <><path d="M18 16l-1.5-3V10a4.5 4.5 0 0 0-9 0v3L6 16z" /><path d="M9 20a3 3 0 0 0 6 0" /></>,
  search:    <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
  chevR:     <path d="M9 5l7 7-7 7" />,
  logout:    <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></>,
  users:     <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  book:      <><path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z" /><path d="M4 5v14" /></>,
  cal:       <><rect x="4" y="5" width="16" height="16" rx="2.5" /><path d="M4 10h16M9 3v4M15 3v4" /></>,
  badge:     <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />,
  chart:     <><path d="M3 3v18h18" /><path d="M18 9l-5 5-3-3-5 5" /></>,
  grid:      <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
};

const NAV_ITEMS = [
  { label: 'Dashboard',        path: '/dashboard',   icon: 'home',    tourAttr: 'data-tour-dashboard' },
  { label: 'Karriere-Analyse', path: '/analyse',     icon: 'analyse', tourAttr: 'data-tour-analyse' },
  { label: 'Masterclass',      path: '/masterclass', icon: 'play' },
  { label: 'Lebenslauf-Check', path: '/cv-check',    icon: 'doc' },
  { label: 'Coach',            path: '/coach',       icon: 'chat' },
];

const ADMIN_ITEMS = [
  { label: 'Userverwaltung',    path: '/admin/users',     icon: 'users' },
  { label: 'Kursverwaltung',    path: '/admin/courses',   icon: 'book' },
  { label: 'Seminarverwaltung', path: '/admin/content',   icon: 'cal' },
  { label: 'Badges',            path: '/admin/coaching',  icon: 'badge' },
  { label: 'Analytics',         path: '/admin/analytics', icon: 'chart' },
  { label: 'FK Dashboard',      path: '/coach-dashboard', icon: 'grid' },
];

const SB_STYLE = {
  width: 240, height: '100vh',
  background: 'linear-gradient(180deg, #FAFAFC 0%, #F2F2F5 100%)',
  borderRight: '0.5px solid var(--ki-border)',
  display: 'flex', flexDirection: 'column',
  padding: '20px 12px 16px',
  position: 'fixed', left: 0, top: 0,
  overflowY: 'auto', zIndex: 100,
};

export default function Sidebar({ profile, analysisResults }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const isAdmin = profile?.role === 'admin' || profile?.role === 'coach';
  const initials = (profile?.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!profile?.id) return;
    supabase.from('notifications').select('*').eq('user_id', profile.id)
      .order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => setNotifications(data || []));
  }, [profile?.id]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  async function markAllRead() {
    const ids = notifications.filter(n => !n.read).map(n => n.id);
    if (!ids.length) return;
    await supabase.from('notifications').update({ read: true }).in('id', ids);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  async function handleNotifClick(n) {
    if (!n.read) {
      await supabase.from('notifications').update({ read: true }).eq('id', n.id);
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
    }
    setShowNotifs(false);
    if (n.link) router.push(n.link);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  }

  const active = (path) => pathname === path || (path !== '/dashboard' && pathname.startsWith(path + '/'));

  const navItem = (item) => {
    const on = active(item.path);
    const tourProps = item.tourAttr ? { [item.tourAttr]: '' } : {};
    return (
      <a key={item.path} href={item.path} {...tourProps} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '6px 10px', borderRadius: 7, margin: '1px 0',
        color: on ? '#fff' : 'var(--ki-text-secondary)',
        background: on ? 'var(--ki-red)' : 'transparent',
        fontSize: 13.5, fontWeight: on ? 600 : 400,
        letterSpacing: '-0.005em', textDecoration: 'none',
        boxShadow: on ? '0 1px 2px rgba(204,20,38,0.3), inset 0 0.5px 0 rgba(255,255,255,0.2)' : 'none',
        transition: 'all 0.12s ease',
      }}
        onMouseEnter={e => { if (!on) e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
        onMouseLeave={e => { if (!on) e.currentTarget.style.background = 'transparent'; }}
      >
        <span style={{ width: 16, display: 'grid', placeItems: 'center', opacity: on ? 1 : 0.8, flexShrink: 0 }}>
          <Ic d={I[item.icon]} />
        </span>
        <span style={{ flex: 1, fontSize: 13 }}>{item.label}</span>
      </a>
    );
  };

  const sidebarContent = (
    <>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 10px 16px' }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7, background: 'var(--ki-red)', color: '#fff',
          display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12,
          letterSpacing: '-0.02em', flexShrink: 0,
          boxShadow: '0 1px 2px rgba(204,20,38,0.3), inset 0 0.5px 0 rgba(255,255,255,0.25)',
        }}>Ki</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ki-text)', lineHeight: 1.1 }}>Karriere-Institut</div>
          <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', marginTop: 1 }}>Academy</div>
        </div>
      </div>

      {/* Search */}
      <button onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))}
        style={{
          display: 'flex', alignItems: 'center', gap: 7, padding: '7px 11px', borderRadius: 8,
          background: 'var(--ki-card)', border: '0.5px solid var(--ki-border)',
          color: 'var(--ki-text-tertiary)', fontSize: 13,
          margin: '0 2px 14px', boxShadow: '0 0.5px 1px rgba(0,0,0,0.04)',
          width: 'calc(100% - 4px)', cursor: 'pointer', textAlign: 'left',
        }}>
        <Ic d={I.search} size={13} />
        <span style={{ flex: 1 }}>Suchen</span>
        <span style={{ fontSize: 11, fontFamily: 'monospace' }}>⌘ K</span>
      </button>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', gap: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-text-tertiary)', padding: '4px 12px 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Lernen
        </div>
        {NAV_ITEMS.map(navItem)}

        {isAdmin && (
          <>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-text-tertiary)', padding: '16px 12px 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Admin
            </div>
            {ADMIN_ITEMS.map(navItem)}
          </>
        )}
      </nav>

      {/* User card */}
      <div style={{ margin: '8px 2px 0', position: 'relative' }}>
        <div style={{ background: 'var(--ki-card)', border: '0.5px solid var(--ki-border)', borderRadius: 10, boxShadow: '0 0.5px 1px rgba(0,0,0,0.04)', overflow: 'visible' }}>

          {/* Bell */}
          <div style={{ position: 'relative' }}>
            <button data-tour-notifications="" onClick={() => setShowNotifs(!showNotifs)} style={{
              position: 'absolute', top: 8, right: 8,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--ki-text-tertiary)', padding: 4, borderRadius: 6,
            }}>
              <Ic d={I.bell} size={14} />
              {unread > 0 && (
                <span style={{ position: 'absolute', top: 0, right: 0, width: 14, height: 14, borderRadius: '50%', background: 'var(--ki-red)', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</span>
              )}
            </button>
          </div>

          {/* Profile link */}
          <a href="/profile" data-tour-profile="" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #353A3B, #1a1c1d)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 11.5, fontWeight: 600 }}>
              {initials}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text)', lineHeight: 1.1, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {profile?.name || 'Profil'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', marginTop: 2 }}>
                {profile?.subscription_plan === 'premium' ? 'Premium' : 'Kostenlos'}
              </div>
            </div>
            <Ic d={I.chevR} size={12} />
          </a>

          <div style={{ borderTop: '0.5px solid var(--ki-border)', margin: '0 10px' }} />

          {/* Logout */}
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--ki-text-tertiary)', fontSize: 13, borderRadius: '0 0 10px 10px',
            transition: 'background 0.12s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <span style={{ width: 16, display: 'grid', placeItems: 'center' }}><Ic d={I.logout} size={13} /></span>
            <span>Abmelden</span>
          </button>
        </div>

        {/* Notification dropdown */}
        {showNotifs && (
          <div style={{
            position: 'absolute', bottom: '100%', left: 0, right: 0,
            background: 'var(--ki-card)', borderRadius: 'var(--r-lg)',
            boxShadow: 'var(--sh-xl)', zIndex: 1000, marginBottom: 8,
            maxHeight: 400, overflow: 'auto', border: '0.5px solid var(--ki-border)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '0.5px solid var(--ki-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Benachrichtigungen</span>
              {unread > 0 && <button onClick={markAllRead} style={{ fontSize: 12, color: 'var(--ki-red)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Alle gelesen</button>}
            </div>
            {notifications.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--ki-text-tertiary)', fontSize: 13 }}>Keine Benachrichtigungen</div>
            ) : notifications.map(n => (
              <div key={n.id} onClick={() => handleNotifClick(n)} style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: '0.5px solid var(--ki-border)', background: n.read ? 'transparent' : 'rgba(204,20,38,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{n.type === 'badge' ? '🏅' : n.type === 'achievement' ? '🏆' : '📌'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600 }}>{n.title}</div>
                    {n.content && <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginTop: 2 }}>{n.content}</div>}
                  </div>
                  {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ki-red)', flexShrink: 0 }} />}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', marginTop: 4, paddingLeft: 22 }}>
                  {new Date(n.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside data-tour-sidebar="" className="sidebar" style={SB_STYLE}>
        {sidebarContent}
      </aside>

      {/* Mobile Top Bar */}
      <div className="mobile-nav" style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0, height: 56,
        background: 'rgba(250,250,252,0.9)', borderBottom: '0.5px solid var(--ki-border)',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', zIndex: 200, backdropFilter: 'blur(20px)',
      }}>
        <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[0, 1, 2].map(i => <span key={i} style={{ display: 'block', width: 22, height: 2, background: 'var(--ki-text)', borderRadius: 2 }} />)}
        </button>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--ki-red)', textTransform: 'uppercase' }}>
          Karriere-Institut
        </div>
        <button onClick={() => setShowNotifs(!showNotifs)} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: 8, color: 'var(--ki-text-secondary)' }}>
          <Ic d={I.bell} size={18} />
          {unread > 0 && <span style={{ position: 'absolute', top: 4, right: 4, width: 14, height: 14, borderRadius: '50%', background: 'var(--ki-red)', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</span>}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300 }} />}

      {/* Mobile Drawer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 280, zIndex: 400,
        background: 'linear-gradient(180deg, #FAFAFC 0%, #F2F2F5 100%)',
        padding: '16px 12px', display: 'flex', flexDirection: 'column',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '0 8px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--ki-red)', textTransform: 'uppercase' }}>Menü</div>
          <button onClick={() => setMobileOpen(false)} style={{ background: 'var(--ki-bg-alt)', border: 'none', cursor: 'pointer', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--ki-text)' }}>✕</button>
        </div>
        {sidebarContent}
      </div>
    </>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const NAV_GROUPS = [
  {
    label: null,
    items: [
      { label: 'Dashboard',         path: '/dashboard',    icon: '◻' },
      { label: 'Karriere-Analyse',  path: '/analyse',      icon: '◎' },
      { label: 'Masterclass',       path: '/masterclass',  icon: '▶' },
      { label: 'Lebenslauf-Check',  path: '/cv-check',     icon: '📋' },
      { label: 'Coach',             path: '/coach',        icon: '◉' },
    ],
  },
];

const NAV_ITEMS = NAV_GROUPS.flatMap(g => g.items);

const ADMIN_ITEMS = [
  { label: 'Userverwaltung',    path: '/admin/users',     icon: '👤' },
  { label: 'Kursverwaltung',    path: '/admin/courses',   icon: '📚' },
  { label: 'Seminarverwaltung', path: '/admin/content',   icon: '🎓' },
  { label: 'Badges',            path: '/admin/coaching',  icon: '🏅' },
  { label: 'Analytics',         path: '/admin/analytics', icon: '📈' },
  { label: 'FK Dashboard',      path: '/coach-dashboard', icon: '📋' },
];

export default function Sidebar({ profile, analysisResults }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const isAdmin = profile?.role === 'admin' || profile?.role === 'coach';

  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!profile?.id) return;
    supabase.from('notifications').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => setNotifications(data || []));
  }, [profile?.id]);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  async function markAllRead() {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    await supabase.from('notifications').update({ read: true }).in('id', unreadIds);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  async function handleNotifClick(notif) {
    if (!notif.read) {
      await supabase.from('notifications').update({ read: true }).eq('id', notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    }
    setShowNotifs(false);
    if (notif.link) router.push(notif.link);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  }

  const linkStyle = (path) => ({
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 16px', borderRadius: 'var(--r-md)',
    fontSize: 14, fontWeight: pathname === path ? 600 : 400,
    color: pathname === path ? 'var(--ki-red)' : 'var(--ki-text-secondary)',
    background: pathname === path ? 'rgba(204,20,38,0.06)' : 'transparent',
    cursor: 'pointer', transition: 'all var(--t-fast)',
    textDecoration: 'none',
  });

  const sidebarContent = (
    <>
      {/* Logo + Notifications */}
      <div style={{ padding: '0 16px 24px', borderBottom: '1px solid var(--ki-border)', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--ki-red)', textTransform: 'uppercase' }}>Karriere-Institut</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <button
                data-tour-notifications=""
                onClick={() => setShowNotifs(!showNotifs)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--ki-text-secondary)', position: 'relative', padding: 4 }}
              >
                🔔
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderRadius: '50%',
                    background: 'var(--ki-red)', color: 'white', fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{unreadCount}</span>
                )}
              </button>
              {showNotifs && (
                <div style={{
                  position: 'absolute', top: '100%', right: -12, width: 300, background: 'var(--ki-card)',
                  borderRadius: 'var(--r-lg)', boxShadow: 'var(--sh-xl)', zIndex: 1000, marginTop: 8,
                  maxHeight: 400, overflow: 'auto', border: '1px solid var(--ki-border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--ki-border)' }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Benachrichtigungen</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} style={{ fontSize: 12, color: 'var(--ki-red)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                        Alle gelesen
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--ki-text-tertiary)', fontSize: 13 }}>Keine Benachrichtigungen</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} onClick={() => handleNotifClick(n)} style={{
                        padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid var(--ki-border)',
                        background: n.read ? 'transparent' : 'rgba(204,20,38,0.03)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 14 }}>
                            {n.type === 'coaching_impulse' ? '💡' : n.type === 'badge' ? '🏅' : n.type === 'achievement' ? '🏆' : '📌'}
                          </span>
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
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', marginTop: 2 }}>{profile?.name || 'Lädt...'}</div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--ki-text-tertiary)', padding: gi === 0 ? '4px 16px 6px' : '16px 16px 6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {group.label}
              </div>
            )}
            {group.items.map(item => {
              const tourAttr = item.path === '/dashboard' ? { 'data-tour-dashboard': '' }
                : item.path === '/analyse' ? { 'data-tour-analyse': '' } : {};
              return (
                <a key={item.path} href={item.path} style={linkStyle(item.path)} {...tourAttr}>
                  <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{item.icon}</span>
                  <span style={{ flex: 1, fontSize: 13 }}>{item.label}</span>
                </a>
              );
            })}
          </div>
        ))}

        {isAdmin && (
          <>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-text-tertiary)', padding: '16px 16px 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Admin
            </div>
            {ADMIN_ITEMS.map(item => (
              <a key={item.path} href={item.path} style={linkStyle(item.path)}>
                <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </>
        )}
      </nav>

      {/* Profil + Logout */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 2, borderTop: '1px solid var(--ki-border)', paddingTop: 12 }}>
        <a href="/profile" style={linkStyle('/profile')} data-tour-profile="">
          <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>○</span>
          <span style={{ flex: 1, fontSize: 13 }}>Profil</span>
        </a>
        <button onClick={handleLogout} style={{ ...linkStyle('/logout'), color: 'var(--ki-text-tertiary)', background: 'transparent', border: 'none', width: '100%' }}>
          <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>⏻</span>
          <span style={{ fontSize: 13 }}>Abmelden</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside data-tour-sidebar="" className="sidebar" style={{
        width: 240, height: '100vh', background: 'var(--ki-card)',
        borderRight: '1px solid var(--ki-border)', display: 'flex', flexDirection: 'column',
        padding: '24px 12px', position: 'fixed', left: 0, top: 0, overflowY: 'auto', zIndex: 100,
      }}>
        {sidebarContent}
      </aside>

      {/* Mobile Top Bar */}
      <div className="mobile-nav" style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0, height: 56,
        background: 'var(--ki-card)', borderBottom: '1px solid var(--ki-border)',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', zIndex: 200,
      }}>
        <button onClick={() => setMobileOpen(true)} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 8,
          display: 'flex', flexDirection: 'column', gap: 5,
        }}>
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--ki-text)', borderRadius: 2 }} />
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--ki-text)', borderRadius: 2 }} />
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--ki-text)', borderRadius: 2 }} />
        </button>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--ki-red)', textTransform: 'uppercase' }}>
          Karriere-Institut
        </div>
        <button onClick={() => setShowNotifs(!showNotifs)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, position: 'relative', padding: 8 }}>
          🔔
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderRadius: '50%',
              background: 'var(--ki-red)', color: 'white', fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{unreadCount}</span>
          )}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300,
          }}
        />
      )}

      {/* Mobile Drawer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 280,
        background: 'var(--ki-card)', zIndex: 400, padding: '16px 12px',
        display: 'flex', flexDirection: 'column',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
        overflowY: 'auto',
      }}>
        {/* Close button header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '0 8px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--ki-red)', textTransform: 'uppercase' }}>Menü</div>
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              background: 'var(--ki-bg-alt)', border: 'none', cursor: 'pointer',
              width: 36, height: 36, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, color: 'var(--ki-text)', fontWeight: 400,
            }}
          >✕</button>
        </div>
        {sidebarContent}
      </div>
    </>
  );
}

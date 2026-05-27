'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// ─── Nav configuration ───────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: 'Lernen',
    items: [
      { label: 'Übersicht',         path: '/dashboard',    icon: 'grid',     tour: 'dashboard' },
      { label: 'Karriere-Analyse',  path: '/analyse',      icon: 'target',   tour: 'analyse' },
      { label: 'Masterclass',       path: '/masterclass',  icon: 'play' },
      { label: 'Lebenslauf-Check',  path: '/cv-check',     icon: 'doc' },
      { label: 'Coach',             path: '/coach',        icon: 'chat' },
    ],
  },
  {
    label: 'Karriere',
    items: [
      { label: 'Bewerbungen', path: '/applications', icon: 'briefcase' },
      { label: 'Community',   path: '/community',    icon: 'users' },
    ],
  },
];

// Berater-spezifische Items (Messen, Quick-Lead, Leads-Liste, Affiliate)
const ADVISOR_ITEMS = [
  { label: 'Messe-Dashboard',   path: '/advisor',              icon: 'grid' },
  { label: 'Neuer CV-Check',    path: '/advisor/quick-lead',   icon: 'doc' },
  { label: 'Mein Affiliate',    path: '/advisor/affiliate',    icon: 'users' },
  { label: 'Alle Leads',        path: '/advisor/leads',        icon: 'briefcase' },
];

const ADMIN_ITEMS = [
  { label: 'Admin-Hub',         path: '/admin',            icon: 'grid' },
  { label: 'Mitglieder',        path: '/admin/users',      icon: 'user' },
  { label: 'Coaches',           path: '/admin/coaches',    icon: 'users' },
  { label: 'Berater',           path: '/admin/advisors',   icon: 'briefcase' },
  { label: 'Masterclasses',     path: '/admin/courses',    icon: 'books' },
  { label: 'Live-Seminare',     path: '/admin/content',    icon: 'cap' },
  { label: 'Community',         path: '/admin/community',  icon: 'chat' },
  { label: 'CV-Checks',         path: '/admin/cv-checks',  icon: 'doc' },
  { label: 'Badges',            path: '/admin/coaching',   icon: 'badge' },
  { label: 'Analytics',         path: '/admin/analytics',  icon: 'chart' },
];

// ─── Inline icons (Lucide-style, 16px) ───────────────────────────────────────
function Icon({ name }) {
  const p = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none',
              stroke: 'currentColor', strokeWidth: 1.7,
              strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'grid':      return (<svg {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>);
    case 'target':    return (<svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
    case 'play':      return (<svg {...p}><polygon points="6 3 20 12 6 21 6 3"/></svg>);
    case 'doc':       return (<svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>);
    case 'chat':      return (<svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
    case 'briefcase': return (<svg {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>);
    case 'users':     return (<svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
    case 'bell':      return (<svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>);
    case 'search':    return (<svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
    case 'logout':    return (<svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>);
    case 'chevron':   return (<svg {...p}><polyline points="15 18 9 12 15 6"/></svg>);
    case 'user':      return (<svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
    case 'books':     return (<svg {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>);
    case 'cap':       return (<svg {...p}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>);
    case 'badge':     return (<svg {...p}><circle cx="12" cy="8" r="6"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>);
    case 'chart':     return (<svg {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>);
    default:          return (<span aria-hidden>•</span>);
  }
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
export default function Sidebar({ profile, analysisResults, version, env }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const isAdmin = profile?.role === 'admin' || profile?.role === 'coach';
  const isAdvisor = ['admin', 'advisor', 'messeleiter', 'coach'].includes(profile?.role);

  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Load persisted collapse state
  useEffect(() => {
    try { if (typeof localStorage !== 'undefined' && localStorage.getItem('ki-sb-collapsed') === '1') setCollapsed(true); } catch {}
  }, []);

  // Mirror collapse to <html> for CSS grid + sidebar rules
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-sb', collapsed ? 'collapsed' : 'expanded');
    }
  }, [collapsed]);

  // ⌘B to toggle
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && e.key && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setCollapsed(c => {
          const next = !c;
          try { localStorage.setItem('ki-sb-collapsed', next ? '1' : '0'); } catch {}
          return next;
        });
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function toggleCollapsed() {
    setCollapsed(c => {
      const next = !c;
      try { localStorage.setItem('ki-sb-collapsed', next ? '1' : '0'); } catch {}
      return next;
    });
  }

  // Load notifications
  useEffect(() => {
    if (!profile?.id) return;
    supabase
      .from('notifications').select('*').eq('user_id', profile.id)
      .order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => setNotifications(data || []));
  }, [profile?.id]);

  // Close popovers on route change
  useEffect(() => { setMobileOpen(false); setShowNotifs(false); }, [pathname]);

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

  function openSearch() {
    if (typeof window === 'undefined') return;
    try {
      // Trigger existing GlobalSearch (listens for ⌘K)
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true, bubbles: true }));
    } catch {}
  }

  function isActive(path) {
    if (!pathname) return false;
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname === path || pathname.startsWith(path + '/');
  }

  function NavItem({ item }) {
    const active = isActive(item.path);
    const tourAttr = item.tour === 'dashboard' ? { 'data-tour-dashboard': '' }
      : item.tour === 'analyse' ? { 'data-tour-analyse': '' } : {};
    return (
      <a
        href={item.path}
        className={`sb-item${active ? ' active' : ''}`}
        title={collapsed ? item.label : undefined}
        {...tourAttr}
      >
        <span className="sb-i"><Icon name={item.icon} /></span>
        <span className="label-text">{item.label}</span>
      </a>
    );
  }

  // ─── User block content ────────────────────────────────────────────────
  const userInitials = (
    profile?.avatar_initials ||
    [profile?.first_name, profile?.last_name].filter(Boolean).map(s => s[0]).join('').toUpperCase() ||
    (profile?.name?.[0] || '?').toUpperCase()
  );
  const userDisplayName = (
    profile?.name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    'User'
  );
  const userMeta = isAdmin ? 'Admin' : 'Mitglieder-Portal';

  // ─── Shared content (used in desktop + mobile drawer) ──────────────────
  const sidebarBody = (
    <>
      <div className="sb-brand">
        <img src="/logo-karriereinstitut.png" alt="Karriere-Institut"
             width="72" height="28"
             className="sb-logo-img" style={{ display: 'block' }} />
        <div className="sb-brand-text">
          <div className="sb-brand-sub">{isAdmin ? 'Admin-Portal' : 'Mitglieder-Portal'}</div>
        </div>
      </div>

      <button className="sb-search" onClick={openSearch} type="button" title="Suchen (⌘K)">
        <span className="sb-i"><Icon name="search" /></span>
        <span className="label-text">Suchen</span>
        <span className="shortcut">⌘K</span>
      </button>

      <nav className="sb-nav">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className="sb-section">
            {group.label && <div className="sb-section-label">{group.label}</div>}
            {group.items.map(item => (<NavItem key={item.path} item={item} />))}
          </div>
        ))}

        {isAdvisor && (
          <div className="sb-section">
            <div className="sb-section-label">Berater</div>
            {ADVISOR_ITEMS.map(item => (<NavItem key={item.path} item={item} />))}
          </div>
        )}

        {isAdmin && (
          <div className="sb-section">
            <div className="sb-section-label">Admin</div>
            {ADMIN_ITEMS.map(item => (<NavItem key={item.path} item={item} />))}
          </div>
        )}
      </nav>

      <div className="sb-user-wrap">
        <a href="/profile" className="sb-user" data-tour-profile="" title={collapsed ? userDisplayName : undefined}>
          <span className="avatar">{userInitials}</span>
          <span className="sb-user-info">
            <span className="sb-user-name">{userDisplayName}</span>
            <span className="sb-user-meta">{userMeta}</span>
          </span>
        </a>
        <button className="sb-logout" onClick={handleLogout} type="button" title="Abmelden" aria-label="Abmelden">
          <Icon name="logout" />
        </button>
      </div>

      {version && (
        <div className="sb-version" title={`Build ${version}${env ? ` · ${env}` : ''}`}>
          v{version}{env && env !== 'production' ? ` · ${env}` : ''}
        </div>
      )}
    </>
  );

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sb" data-tour-sidebar="" aria-label="Hauptmenü">
        <button className="sb-toggle" onClick={toggleCollapsed} type="button" aria-label="Sidebar umschalten" title="Sidebar ein-/ausklappen">
          <Icon name="chevron" />
        </button>

        {sidebarBody}
      </aside>

      {/* Mobile top bar */}
      <div className="sb-mobile-bar">
        <button
          className="sb-mobile-burger"
          onClick={() => setMobileOpen(true)}
          type="button"
          aria-label="Menü öffnen"
        >
          <span /><span /><span />
        </button>
        <img src="/logo-karriereinstitut.png" alt="Karriere-Institut"
             width="58" height="22"
             className="sb-mobile-logo" style={{ display: 'block' }} />
        <div style={{ width: 32 }} />
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && <div className="sb-mobile-overlay" onClick={() => setMobileOpen(false)} />}

      {/* Mobile drawer */}
      <aside className={`sb-drawer${mobileOpen ? ' open' : ''}`} aria-label="Menü">
        <div className="sb-drawer-head">
          <img src="/logo-karriereinstitut.png" alt="Karriere-Institut"
               width="58" height="22" style={{ display: 'block' }} />
          <button onClick={() => setMobileOpen(false)} type="button" aria-label="Schließen">✕</button>
        </div>
        {sidebarBody}
      </aside>
    </>
  );
}

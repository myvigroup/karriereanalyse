'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AUDIO_INTROS, AUDIO_TTS_FALLBACKS } from '@/lib/audio-config';
import {
  LayoutDashboard, Play, Crown, Award, TrendingUp, Target, BarChart3, Bot, Trophy,
  DollarSign, Mail, Users, Link, Compass, DoorOpen, MessageCircle,
  User, Settings, LogOut, Bell, UserCog, BookOpen, GraduationCap, BarChart2, ClipboardList,
} from 'lucide-react';

// ── Notification Bell (Portal-based) ──
function NotificationBell({ notifications, unreadCount, showNotifs, setShowNotifs, markAllRead, handleNotifClick }) {
  const bellRef = useRef(null);
  const panelRef = useRef(null);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });

  // Position Panel next to bell
  useEffect(() => {
    if (showNotifs && bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect();
      setPanelPos({ top: rect.bottom + 8, left: rect.left });
    }
  }, [showNotifs]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!showNotifs) return;
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && bellRef.current && !bellRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    const handleEsc = (e) => { if (e.key === 'Escape') setShowNotifs(false); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => { document.removeEventListener('mousedown', handleClick); document.removeEventListener('keydown', handleEsc); };
  }, [showNotifs, setShowNotifs]);

  return (
    <>
      <button
        ref={bellRef}
        data-tour-notifications=""
        onClick={() => setShowNotifs(!showNotifs)}
        style={{
          background: showNotifs ? 'var(--ki-bg-alt)' : 'none', border: 'none', cursor: 'pointer',
          fontSize: 18, color: 'var(--ki-text-secondary)', position: 'relative', padding: '4px 6px',
          borderRadius: 'var(--r-sm)', transition: 'background 0.15s ease',
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: 0, right: 0, minWidth: 16, height: 16, borderRadius: '50%',
            background: 'var(--ki-red)', color: 'white', fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
          }}>{unreadCount}</span>
        )}
      </button>

      {showNotifs && typeof document !== 'undefined' && createPortal(
        <div ref={panelRef} style={{
          position: 'fixed', top: panelPos.top, left: panelPos.left, width: 360,
          background: 'var(--ki-card)', borderRadius: 'var(--r-lg)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
          zIndex: 9999, maxHeight: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column',
          animation: 'fadeUp 0.15s ease',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 18px', borderBottom: '1px solid var(--ki-border)', flexShrink: 0,
          }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Benachrichtigungen</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{
                fontSize: 12, color: 'var(--ki-red)', background: 'none', border: 'none',
                cursor: 'pointer', fontWeight: 500,
              }}>
                Alle gelesen
              </button>
            )}
          </div>

          {/* Content */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>🔔</div>
                <div style={{ fontSize: 13, color: 'var(--ki-text-tertiary)' }}>Keine Benachrichtigungen</div>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleNotifClick(n)}
                  style={{
                    padding: '12px 18px', cursor: 'pointer',
                    borderBottom: '1px solid var(--ki-border)',
                    background: n.read ? 'transparent' : 'rgba(204,20,38,0.02)',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--ki-bg-alt)'}
                  onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(204,20,38,0.02)'}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ fontSize: 16, marginTop: 1, flexShrink: 0 }}>
                      {n.type === 'coaching_impulse' ? '💡' : n.type === 'badge' ? '🏅' : n.type === 'achievement' ? '🏆' : '📌'}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, lineHeight: 1.4 }}>{n.title}</div>
                      {n.content && <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginTop: 3, lineHeight: 1.4 }}>{n.content}</div>}
                      <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', marginTop: 4 }}>
                        {new Date(n.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {!n.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--ki-red)', flexShrink: 0, marginTop: 5 }} />}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
import { getPersonalization } from '@/lib/personalization';
import { getLevel, getLevelProgress } from '@/lib/gamification';

// ══════════════════════════════════════════════════
// SIDEBAR NAVIGATION — MYVI-Mapping
// ══════════════════════════════════════════════════
// MYVI Akademie          → Karriere-Institut OS
// Dashboard              → Dashboard
// Online-Kurse           → Masterclass (E-Learnings)
// Präsenz & Prüfungen    → Premium (Seminare, Strukturgramm, INSIGHTS)
// Badges & XP            → Badges & XP
// Karrierepfad           → Karrierepfad
// Starthilfe-Status      → Karriere-Analyse (Startpunkt)
// Meine Ziele            → Mein Fortschritt (13 Kompetenzfelder)
// Activity Guide         → KI-Coach
// Rangliste              → Rangliste
// Profil                 → Profil
// ══════════════════════════════════════════════════

const NAV_GROUPS = [
  {
    label: null,
    items: [
      { label: 'Dashboard',         path: '/dashboard',    Icon: LayoutDashboard },
      { label: 'Masterclass',       path: '/masterclass',  Icon: Play },
      { label: 'Premium',           path: '/marketplace',  Icon: Crown },
      { label: 'Badges & XP',       path: '/community/achievements', Icon: Award },
      { label: 'Karrierepfad',      path: '/career',       Icon: TrendingUp },
      { label: 'Karriere-Analyse',  path: '/analyse',      Icon: Target },
      { label: 'Mein Fortschritt',  path: '/marktwert',    Icon: BarChart3 },
      { label: 'KI-Coach',          path: '/coach',        Icon: Bot },
      { label: 'Rangliste',         path: '/community/peers', Icon: Trophy },
    ],
  },
  {
    label: 'Karriere-Tools',
    items: [
      { label: 'Gehaltsdatenbank',  path: '/gehalt',             Icon: DollarSign },
      { label: 'Bewerbungen',       path: '/applications',       Icon: Mail },
      { label: 'Netzwerk',          path: '/network',            Icon: Users },
      { label: 'Jobportale',        path: '/branding',           Icon: Link },
      { label: 'Kompass',           path: '/strategy/decision',  Icon: Compass },
      { label: 'Exit-Strategie',    path: '/strategy/exit',      Icon: DoorOpen },
      { label: 'Community',         path: '/community',          Icon: MessageCircle },
    ],
  },
];

// Flat list for backward compatibility
const NAV_ITEMS = NAV_GROUPS.flatMap(g => g.items);

const ADMIN_ITEMS = [
  { label: 'Userverwaltung',    path: '/admin/users',     Icon: UserCog },
  { label: 'Kursverwaltung',    path: '/admin/courses',   Icon: BookOpen },
  { label: 'Seminarverwaltung', path: '/admin/content',   Icon: GraduationCap },
  { label: 'Badges',            path: '/admin/coaching',  Icon: Award },
  { label: 'Analytics',         path: '/admin/analytics', Icon: BarChart2 },
  { label: 'FK Dashboard',      path: '/coach-dashboard', Icon: ClipboardList },
];

export default function Sidebar({ profile, analysisResults }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const isAdmin = profile?.role === 'admin' || profile?.role === 'coach';

  const { visibleModules, recommendations } = getPersonalization(analysisResults, profile?.phase);
  const recommendedCourseIds = recommendations.map(r => r.courseId);

  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!profile?.id) return;
    supabase.from('notifications').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => setNotifications(data || []));
  }, [profile?.id]);

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

  const playIntro = (path, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (playingAudio) {
      playingAudio.pause();
      setPlayingAudio(null);
      return;
    }
    const audioUrl = AUDIO_INTROS[path];
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setPlayingAudio(null);
      audio.onerror = () => {
        // Fallback to TTS
        const text = AUDIO_TTS_FALLBACKS[path];
        if (text && window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'de-DE';
          utterance.rate = 0.95;
          utterance.onend = () => setPlayingAudio(null);
          window.speechSynthesis.speak(utterance);
          setPlayingAudio({ pause: () => window.speechSynthesis.cancel() });
        } else {
          setPlayingAudio(null);
        }
      };
      audio.play().catch(() => {
        const text = AUDIO_TTS_FALLBACKS[path];
        if (text && window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'de-DE';
          utterance.rate = 0.95;
          utterance.onend = () => setPlayingAudio(null);
          window.speechSynthesis.speak(utterance);
          setPlayingAudio({ pause: () => window.speechSynthesis.cancel() });
        }
      });
      setPlayingAudio(audio);
    } else {
      const text = AUDIO_TTS_FALLBACKS[path];
      if (text && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.rate = 0.95;
        utterance.onend = () => setPlayingAudio(null);
        window.speechSynthesis.speak(utterance);
        setPlayingAudio({ pause: () => window.speechSynthesis.cancel() });
      }
    }
  };

  const linkStyle = (path) => ({
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 16px', borderRadius: 'var(--r-md)',
    fontSize: 14, fontWeight: pathname === path ? 600 : 400,
    color: pathname === path ? 'var(--ki-red)' : 'var(--ki-text-secondary)',
    background: pathname === path ? 'rgba(204,20,38,0.06)' : 'transparent',
    cursor: 'pointer', transition: 'all var(--t-fast)',
    textDecoration: 'none',
  });

  return (
    <aside data-tour-sidebar="" className="sidebar" style={{
      width: 240, height: '100vh', background: 'var(--ki-card)',
      borderRight: '1px solid var(--ki-border)', display: 'flex', flexDirection: 'column',
      padding: '24px 12px', position: 'fixed', left: 0, top: 0, overflowY: 'auto',
    }}>
      {/* Logo + Notifications */}
      <div style={{ padding: '0 16px 24px', borderBottom: '1px solid var(--ki-border)', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--ki-red)', textTransform: 'uppercase' }}>Karriere-Institut</div>
          <NotificationBell
            notifications={notifications}
            unreadCount={unreadCount}
            showNotifs={showNotifs}
            setShowNotifs={setShowNotifs}
            markAllRead={markAllRead}
            handleNotifClick={handleNotifClick}
          />
        </div>
        <div style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', marginTop: 2 }}>{profile?.name || 'Lädt...'}</div>
      </div>

      {/* Level Badge (MYVI-Style) */}
      {profile && (() => {
        const xp = profile.total_points || profile.xp || 0;
        const { current, next, progress: lvlPct } = getLevelProgress(xp);
        return (
          <a href="/career" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ padding: '12px 16px', marginBottom: 16, background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)', cursor: 'pointer', transition: 'background var(--t-fast)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Level {current.level}
                </div>
                <span style={{ fontSize: 14 }}>{current.icon}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ki-text)', marginBottom: 2 }}>{current.name}</div>
              <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginBottom: 8 }}>{xp} KI-Points</div>
              <div className="progress-bar" style={{ height: 4 }}>
                <div className="progress-bar-fill" style={{ width: `${lvlPct}%` }} />
              </div>
              {next && (
                <div style={{ fontSize: 10, color: 'var(--ki-text-tertiary)', marginTop: 4 }}>
                  {next.minXP - xp} XP bis {next.name}
                </div>
              )}
            </div>
          </a>
        );
      })()}

      {/* Navigation — Gruppiert (MYVI-Style) */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {NAV_GROUPS.map((group, gi) => {
          const visibleItems = group.items.filter(item => {
            if (!visibleModules) return true;
            const pathKey = item.path.replace(/^\//, '');
            return visibleModules.some(m => pathKey === m || pathKey.startsWith(m + '/'));
          });
          if (visibleItems.length === 0) return null;
          return (
            <div key={gi}>
              {group.label && (
                <div style={{
                  fontSize: 10, fontWeight: 600, color: 'var(--ki-text-tertiary)',
                  padding: gi === 0 ? '4px 16px 6px' : '16px 16px 6px',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>
                  {group.label}
                </div>
              )}
              {visibleItems.map(item => {
                const tourAttr = item.path === '/dashboard' ? { 'data-tour-dashboard': '' }
                  : item.path === '/coach' ? { 'data-tour-coach': '' }
                  : item.path === '/analyse' ? { 'data-tour-analyse': '' }
                  : item.path === '/profile' ? { 'data-tour-profile': '' }
                  : {};
                return (
                  <a key={item.path} href={item.path} style={linkStyle(item.path)} {...tourAttr}>
                    <item.Icon size={18} strokeWidth={1.8} style={{ width: 20, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13 }}>{item.label}</span>
                  </a>
                );
              })}
            </div>
          );
        })}

        {isAdmin && (
          <>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-text-tertiary)', padding: '16px 16px 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Admin
            </div>
            {ADMIN_ITEMS.map(item => (
              <a key={item.path} href={item.path} style={linkStyle(item.path)}>
                <item.Icon size={18} strokeWidth={1.8} style={{ width: 20, flexShrink: 0 }} />
                <span style={{ fontSize: 13 }}>{item.label}</span>
              </a>
            ))}
          </>
        )}
      </nav>

      {/* Profil + Logout */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 2, borderTop: '1px solid var(--ki-border)', paddingTop: 12 }}>
        <a href="/profile" style={linkStyle('/profile')} data-tour-profile="">
          <User size={18} strokeWidth={1.8} style={{ width: 20, flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 13 }}>Profil</span>
        </a>
        <button onClick={handleLogout} style={{
          ...linkStyle('/logout'), color: 'var(--ki-text-tertiary)',
          background: 'transparent', border: 'none', width: '100%',
        }}>
          <LogOut size={18} strokeWidth={1.8} style={{ width: 20, flexShrink: 0 }} />
          <span style={{ fontSize: 13 }}>Abmelden</span>
        </button>
      </div>
    </aside>
  );
}

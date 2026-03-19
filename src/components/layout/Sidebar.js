'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AUDIO_INTROS, AUDIO_TTS_FALLBACKS } from '@/lib/audio-config';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: '◻' },
  { label: 'KI-Coach', path: '/coach', icon: '🤖' },
  { label: 'Kompass', path: '/strategy/decision', icon: '🧭' },
  { label: 'Karriereanalyse', path: '/analyse', icon: '◎' },
  { label: 'Masterclass', path: '/masterclass', icon: '▶' },
  { label: 'Gehaltsdatenbank', path: '/gehalt', icon: '📊' },
  { label: 'Bewerbungen', path: '/applications', icon: '✉' },
  { label: 'Marktwert', path: '/marktwert', icon: '◆' },
  { label: 'Gehalts-Tagebuch', path: '/salary-log', icon: '💰' },
  { label: 'Dokumenten-Safe', path: '/pre-coaching', icon: '◈' },
  { label: 'Netzwerk', path: '/network', icon: '🤝' },
  { label: 'LinkedIn & Branding', path: '/branding', icon: '🔗' },
  { label: 'Exit-Strategie', path: '/strategy/exit', icon: '🚪' },
  { label: 'Karrierepfad', path: '/career', icon: '↗' },
  { label: 'Profil', path: '/profile', icon: '○' },
];

const ADMIN_ITEMS = [
  { label: 'Coaching-Cockpit', path: '/admin/coaching', icon: '\u2295' },
  { label: 'Nutzerverwaltung', path: '/admin/users', icon: '\u229E' },
  { label: 'Kursverwaltung', path: '/admin/courses', icon: '\u22A1' },
  { label: 'Analytics', path: '/admin/analytics', icon: '\u{1F4C8}' },
  { label: 'Meine Klienten', path: '/coach-dashboard', icon: '📋' },
];

export default function Sidebar({ profile }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const isAdmin = profile?.role === 'admin' || profile?.role === 'coach';

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
      width: 240, minHeight: '100vh', background: 'var(--ki-card)',
      borderRight: '1px solid var(--ki-border)', display: 'flex', flexDirection: 'column',
      padding: '24px 12px', position: 'fixed', left: 0, top: 0,
    }}>
      {/* Logo + Notifications */}
      <div style={{ padding: '0 16px 24px', borderBottom: '1px solid var(--ki-border)', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--ki-red)', textTransform: 'uppercase' }}>Karriere-Institut</div>
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
                    <div
                      key={n.id}
                      onClick={() => handleNotifClick(n)}
                      style={{
                        padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid var(--ki-border)',
                        background: n.read ? 'transparent' : 'rgba(204,20,38,0.03)',
                        transition: 'background var(--t-fast)',
                      }}
                    >
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
        <div style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', marginTop: 2 }}>{profile?.name || 'Lädt...'}</div>
      </div>

      {/* Level Badge */}
      {profile && (
        <div style={{ padding: '12px 16px', marginBottom: 16, background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dein Level</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ki-text)' }}>{profile.xp || 0} KI-P</div>
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-bar-fill" style={{ width: `${Math.min((profile.xp || 0) / 10, 100)}%` }} />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(item => {
          const tourAttr = item.path === '/dashboard' ? { 'data-tour-dashboard': '' }
            : item.path === '/coach' ? { 'data-tour-coach': '' }
            : item.path === '/analyse' ? { 'data-tour-analyse': '' }
            : item.path === '/profile' ? { 'data-tour-profile': '' }
            : {};
          return (
          <a key={item.path} href={item.path} style={linkStyle(item.path)} {...tourAttr}>
            <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {AUDIO_INTROS[item.path] && (
              <span
                onClick={(e) => playIntro(item.path, e)}
                style={{ fontSize: 12, opacity: 0.4, cursor: 'pointer', transition: 'opacity var(--t-fast)' }}
                onMouseEnter={e => e.target.style.opacity = 1}
                onMouseLeave={e => e.target.style.opacity = 0.4}
              >{'\u{1F50A}'}</span>
            )}
          </a>
          );
        })}

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

      {/* Logout */}
      <button onClick={handleLogout} style={{
        ...linkStyle('/logout'), marginTop: 'auto', color: 'var(--ki-text-tertiary)',
        background: 'transparent', border: 'none', width: '100%',
      }}>
        <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>⏻</span>
        Abmelden
      </button>
    </aside>
  );
}

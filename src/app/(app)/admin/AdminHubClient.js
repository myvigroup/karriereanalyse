'use client';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';

const TILES = [
  {
    section: 'Inhalte & Pflege',
    items: [
      { href: '/admin/coaches',      iconName: 'users',      title: 'Coaches',         desc: 'Coach-Profile, Bios, Schwerpunkte pflegen.', statKey: 'coaches' },
      { href: '/admin/courses',      iconName: 'play',       title: 'Masterclasses',   desc: 'E-Learning-Kurse, Module, Lektionen.',       statKey: 'courses' },
      { href: '/admin/content',      iconName: 'gradcap',    title: 'Live-Seminare',   desc: 'Termine, Coach-Zuordnung, Beschreibungen.' },
      { href: '/admin/community',    iconName: 'speech',     title: 'Community',       desc: 'Peer-Matches, Posts, Moderation.' },
      { href: '/admin/coaching',     iconName: 'medal',      title: 'Badges',          desc: 'Achievements & Gamification.' },
    ],
  },
  {
    section: 'Mitglieder & CV',
    items: [
      { href: '/admin/users',        iconName: 'user',       title: 'Mitglieder',      desc: 'Alle registrierten User verwalten.',    statKey: 'users' },
      { href: '/admin/advisors',     iconName: 'briefcase',  title: 'Berater',         desc: 'Berater & Account-Manager pflegen.',    statKey: 'advisors' },
      { href: '/admin/cv-checks',    iconName: 'file-text',  title: 'Lebenslauf-Checks', desc: 'Eingereichte CVs sichten, Reviews.',  statKey: 'cvs' },
    ],
  },
  {
    section: 'Auswertung',
    items: [
      { href: '/admin/analytics',    iconName: 'chart',      title: 'Analytics',       desc: 'KPIs, Nutzung, Funnel-Metriken.' },
      { href: '/coach-dashboard',    iconName: 'target',     title: 'FK-Dashboard',    desc: 'Berater-Dashboard für Kundensicht.' },
    ],
  },
];

export default function AdminHubClient({ profile, stats }) {
  const firstName = profile?.first_name || profile?.name?.split(' ')[0] || 'Admin';

  return (
    <div className="admin-hub">
      <div className="title-kicker">
        <span className="pulse" />
        Admin-Portal · {profile.role === 'admin' ? 'Administrator' : 'Coach-Zugang'}
      </div>
      <h1 className="page-title">
        Hallo {firstName}.{' '}
        <span className="faded">Hier steuerst du alles.</span>
      </h1>
      <p className="page-sub">
        Zentrale Verwaltung für Mitglieder, Coaches, Inhalte und Auswertungen.
        Alle Änderungen sind sofort im Mitgliederportal sichtbar.
      </p>

      {TILES.map((group, gi) => (
        <section key={gi} className="admin-hub-section">
          <div className="admin-hub-secthead">
            <h3>{group.section}</h3>
          </div>
          <div className="admin-hub-grid">
            {group.items.map(item => {
              const count = item.statKey ? stats?.[item.statKey] : null;
              return (
                <Link key={item.href} href={item.href} className="admin-hub-tile">
                  <div className="admin-hub-tile-icon">
                    <Icon name={item.iconName} size={22} stroke={1.6} />
                  </div>
                  <div className="admin-hub-tile-body">
                    <div className="admin-hub-tile-titlerow">
                      <h4 className="admin-hub-tile-title">{item.title}</h4>
                      {count !== null && count !== undefined && (
                        <span className="admin-hub-tile-count">{count}</span>
                      )}
                    </div>
                    <p className="admin-hub-tile-desc">{item.desc}</p>
                  </div>
                  <div className="admin-hub-tile-arrow">
                    <Icon name="arrow-right" size={16} stroke={1.8} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

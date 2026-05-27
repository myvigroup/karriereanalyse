// Globaler Footer mit allen rechtlichen Links.
// In alle Page-Layouts einbinden (App, Advisor, Affiliate-Landing, Auth, CV-Upload).

import Link from 'next/link';

const LEGAL_LINKS = [
  { href: '/impressum',   label: 'Impressum' },
  { href: '/datenschutz', label: 'Datenschutz' },
  { href: '/agb',         label: 'AGB' },
  { href: '/widerruf',    label: 'Widerruf' },
];

const CONTACT_LINKS = [
  { href: 'mailto:info@daskarriereinstitut.de', label: 'info@daskarriereinstitut.de' },
  { href: 'tel:+4951154684547',                 label: '+49 511 5468 4547' },
];

export default function AppFooter({ variant = 'default', showLogo = false }) {
  const year = new Date().getFullYear();
  return (
    <footer className={`app-footer ${variant === 'minimal' ? 'minimal' : ''}`}>
      <div className="app-footer-inner">
        {showLogo && (
          <div className="app-footer-brand">
            <img src="/logo-karriereinstitut.png" alt="Karriere-Institut" style={{ height: 24, width: 'auto' }} />
          </div>
        )}
        <div className="app-footer-links">
          {LEGAL_LINKS.map(l => (
            <Link key={l.href} href={l.href} className="app-footer-link">{l.label}</Link>
          ))}
        </div>
        {variant !== 'minimal' && (
          <div className="app-footer-contact">
            {CONTACT_LINKS.map(l => (
              <a key={l.href} href={l.href} className="app-footer-link">{l.label}</a>
            ))}
          </div>
        )}
        <div className="app-footer-meta">
          <span>© {year} Karriere-Institut</span>
          <span className="app-footer-disclaimer">
            Aus Gründen der besseren Lesbarkeit verzichten wir auf gegenderte Sprache.
            Personenbezeichnungen gelten für alle Geschlechter.
          </span>
        </div>
      </div>
    </footer>
  );
}

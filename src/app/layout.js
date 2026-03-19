import './globals.css';
import CookieBanner from '@/components/ui/CookieBanner';

export const metadata = {
  title: 'Karriere-Institut | Dein Karriere-Betriebssystem',
  description: 'Karriereanalyse, Masterclass & Coaching f\u00FCr Fach- und F\u00FChrungskr\u00E4fte',
  manifest: '/manifest.json',
  themeColor: '#CC1426',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Karriere-OS' },
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
};

function SWRegistration() {
  return (
    <script dangerouslySetInnerHTML={{ __html: `
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').catch(() => {});
        });
      }
    `}} />
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        {children}
        <CookieBanner />
        <SWRegistration />
      </body>
    </html>
  );
}

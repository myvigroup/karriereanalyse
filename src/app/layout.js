import './globals.css';
import CookieBanner from '@/components/ui/CookieBanner';

export const metadata = {
  title: 'Karriere-Institut | Dein Karriere-Betriebssystem',
  description: 'Karriereanalyse, Masterclass & Coaching f\u00FCr Fach- und F\u00FChrungskr\u00E4fte',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}

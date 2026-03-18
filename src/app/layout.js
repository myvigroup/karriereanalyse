import './globals.css';

export const metadata = {
  title: 'Karriere-Institut | Dein Karriere-Betriebssystem',
  description: 'Karriereanalyse, Masterclass & Coaching für Fach- und Führungskräfte',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}

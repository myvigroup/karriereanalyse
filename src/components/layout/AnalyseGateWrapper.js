'use client';
import { usePathname } from 'next/navigation';
import AnalyseGate from './AnalyseGate';

// Seiten die NIE den Analyse-Banner zeigen (User ist dort schon richtig)
const HIDE_BANNER_PATHS = ['/analyse', '/profile', '/onboarding'];

export default function AnalyseGateWrapper({ hasAnalysis, children }) {
  const pathname = usePathname();

  // Auf Analyse/Profil/Onboarding Seiten: Kein Banner nötig
  const hideBanner = HIDE_BANNER_PATHS.some(p => pathname.startsWith(p));
  if (hideBanner || hasAnalysis) return children;

  // Auf allen anderen Seiten: Soft-Banner + Content (nie blockierend)
  return <AnalyseGate hasAnalysis={hasAnalysis}>{children}</AnalyseGate>;
}

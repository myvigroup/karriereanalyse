'use client';
import { usePathname } from 'next/navigation';
import AnalyseGate from './AnalyseGate';

const EXEMPT_PATHS = ['/analyse', '/profile', '/onboarding'];

export default function AnalyseGateWrapper({ hasAnalysis, children }) {
  const pathname = usePathname();
  const isExempt = EXEMPT_PATHS.some(p => pathname.startsWith(p));

  if (isExempt) return children;
  return <AnalyseGate hasAnalysis={hasAnalysis}>{children}</AnalyseGate>;
}

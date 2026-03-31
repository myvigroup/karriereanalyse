import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import AnalyseGateWrapper from '@/components/layout/AnalyseGateWrapper';
import AppTour from '@/components/ui/AppTour';
import GlobalSearch from '@/components/ui/GlobalSearch';
import InstallPrompt from '@/components/ui/InstallPrompt';
import SOSButton from '@/components/elearning/SOSButton';
import NightModeShield from '@/components/ui/NightModeShield';

export default async function AppLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Onboarding entfernt — neue User starten direkt mit der Karriere-Analyse
  // Basis-Profildaten (DSGVO, onboarding) werden beim ersten Zugriff gesetzt
  if (profile && !profile.onboarding_complete) {
    await supabase.from('profiles').update({
      onboarding_complete: true,
      dsgvo_consent_at: profile.dsgvo_consent_at || new Date().toISOString(),
    }).eq('id', user.id);
  }

  // Check if user has completed analysis (robust: bei Fehler → nicht blockieren)
  let hasCompletedAnalysis = true; // Default: nicht blockieren
  try {
    const { data: analysisSession } = await supabase
      .from('analysis_sessions')
      .select('id')
      .eq('user_id', user.id)
      .not('completed_at', 'is', null)
      .limit(1)
      .maybeSingle();
    hasCompletedAnalysis = !!analysisSession;
  } catch {
    // Bei DB-Fehler: User nicht aussperren
    hasCompletedAnalysis = true;
  }

  // Fetch analysis results for personalization
  const { data: analysisResults } = await supabase
    .from('analysis_results')
    .select('*, competency_fields(slug, title)')
    .eq('user_id', user.id);

  const formattedResults = (analysisResults || []).map(r => ({
    ...r,
    field_slug: r.competency_fields?.slug,
    field_title: r.competency_fields?.title,
  }));

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar profile={profile} analysisResults={formattedResults} />
      <main style={{ flex: 1, marginLeft: 240, background: 'var(--ki-bg)', minHeight: '100vh' }}>
        <AnalyseGateWrapper hasAnalysis={hasCompletedAnalysis}>
          {children}
        </AnalyseGateWrapper>
      </main>
      <MobileNav />
      <AppTour profile={profile} userId={user.id} />
      <GlobalSearch />
      <InstallPrompt />
      <SOSButton userId={user.id} />
      <NightModeShield />
    </div>
  );
}

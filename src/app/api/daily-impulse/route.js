import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, streak_count, total_points, industry, onboarding_complete')
      .eq('id', user.id)
      .single();

    const { count: openApps } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'applied');

    const { count: coldContacts } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .lt('last_contacted_at', new Date(Date.now() - 30 * 86400000).toISOString());

    // Generate personalized impulse
    let message, suggestedAction, moduleLink;

    if (openApps > 0) {
      message = `Du hast ${openApps} offene Bewerbung${openApps > 1 ? 'en' : ''} ohne Update. Sollen wir Follow-ups schreiben?`;
      suggestedAction = 'Follow-up Email schreiben';
      moduleLink = '/applications';
    } else if (coldContacts > 0) {
      message = `${coldContacts} Kontakt${coldContacts > 1 ? 'e' : ''} warten auf ein Lebenszeichen. Networking ist dein Karriere-Turbo!`;
      suggestedAction = 'Kontakt aufnehmen';
      moduleLink = '/network';
    } else if ((profile?.streak_count || 0) >= 3) {
      message = `${profile.streak_count} Tage Streak! Du bist auf einem Roll. Nutze den Schwung f\u00FCr deine n\u00E4chste Lektion.`;
      suggestedAction = 'N\u00E4chste Lektion starten';
      moduleLink = '/masterclass';
    } else {
      const impulses = [
        { message: 'Starte den Tag mit einer kurzen Karriere-Reflexion. Was ist dein wichtigstes Ziel diese Woche?', suggestedAction: 'Ziele definieren', moduleLink: '/strategy/decision' },
        { message: 'Hast du dein LinkedIn-Profil diese Woche aktualisiert? 85% der Recruiter nutzen LinkedIn.', suggestedAction: 'Profil optimieren', moduleLink: '/branding' },
        { message: 'Dokumentiere einen Erfolg von gestern. Dein zuk\u00FCnftiges Ich wird dir danken!', suggestedAction: 'Win eintragen', moduleLink: '/salary-log' },
      ];
      const daily = impulses[new Date().getDay() % impulses.length];
      message = daily.message;
      suggestedAction = daily.suggestedAction;
      moduleLink = daily.moduleLink;
    }

    return NextResponse.json({ message, suggested_action: suggestedAction, module_link: moduleLink });
  } catch (error) {
    console.error('Daily impulse error:', error);
    return NextResponse.json({ error: 'Failed to generate impulse' }, { status: 500 });
  }
}

export async function trackEvent(supabase, userId, event, metadata = {}) {
  if (!userId || !event) return;
  try {
    await supabase.from('analytics_events').insert({
      user_id: userId,
      event_name: event,
      metadata,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('Analytics tracking failed:', e);
  }
}

export const EVENTS = {
  PAGE_VIEW: 'page_view',
  LESSON_COMPLETE: 'lesson_complete',
  ANALYSIS_DONE: 'analysis_done',
  APPLICATION_ADDED: 'application_added',
  COACH_SESSION: 'coach_session',
  LOGIN: 'login',
  WIN_LOGGED: 'win_logged',
  DOCUMENT_UPLOADED: 'document_uploaded',
  CONTACT_ADDED: 'contact_added',
  QUIZ_COMPLETED: 'quiz_completed',
  ONBOARDING_COMPLETE: 'onboarding_complete',
};

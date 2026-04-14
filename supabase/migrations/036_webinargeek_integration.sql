-- WebinarGeek integration: link seminars to WebinarGeek webinars
ALTER TABLE public.seminars ADD COLUMN IF NOT EXISTS webinargeek_webinar_id TEXT;
ALTER TABLE public.seminars ADD COLUMN IF NOT EXISTS webinargeek_url TEXT;

-- Track webinar registrations per user
CREATE TABLE IF NOT EXISTS public.webinar_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  seminar_id UUID REFERENCES public.seminars(id),
  webinargeek_subscription_id TEXT,
  watch_link TEXT,
  broadcast_id TEXT,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.webinar_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see own registrations" ON public.webinar_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage registrations" ON public.webinar_registrations FOR ALL USING (true);

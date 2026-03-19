-- =============================================
-- PHASE 4: Monetarisierung + Community + Email
-- =============================================

-- Subscription & Payment
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan text DEFAULT 'FREE';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'inactive';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_ends_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS purchased_products text[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak_freezes integer DEFAULT 0;

-- Community
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS share_achievements boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS peer_matching_enabled boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS organization_id uuid;

-- Email
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_notifications boolean DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS unsubscribe_token uuid DEFAULT gen_random_uuid();

-- Coach Marketplace
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS marketplace_visible boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialization text[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hourly_rate numeric;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS calendly_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS coach_rating numeric DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS coach_reviews_count integer DEFAULT 0;

-- Changelog
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_changelog_seen timestamptz;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS content_updated_at timestamptz;

-- Stripe Events (Idempotenz)
CREATE TABLE IF NOT EXISTS stripe_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_event_id text UNIQUE NOT NULL,
  type text NOT NULL,
  data jsonb,
  processed_at timestamptz DEFAULT now()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  stripe_session_id text,
  amount integer NOT NULL,
  currency text DEFAULT 'eur',
  product_key text NOT NULL,
  status text DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users see own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  admin_id uuid REFERENCES profiles(id),
  stripe_customer_id text,
  max_seats integer DEFAULT 10,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Members see orgs" ON organizations FOR SELECT USING (
    id IN (SELECT organization_id FROM org_members WHERE user_id = auth.uid())
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS org_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, user_id)
);
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Members see org_members" ON org_members FOR SELECT USING (
    organization_id IN (SELECT om.organization_id FROM org_members om WHERE om.user_id = auth.uid())
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Community: Public Achievements
CREATE TABLE IF NOT EXISTS public_achievements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  achievement_text text NOT NULL,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public_achievements ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone reads achievements" ON public_achievements FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Users create achievements" ON public_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Community: Peer Matching
CREATE TABLE IF NOT EXISTS peer_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user uuid REFERENCES profiles(id),
  to_user uuid REFERENCES profiles(id),
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE(from_user, to_user)
);
ALTER TABLE peer_requests ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users see own peer_requests" ON peer_requests FOR ALL USING (auth.uid() = from_user OR auth.uid() = to_user);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS peer_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid REFERENCES profiles(id),
  receiver_id uuid REFERENCES profiles(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE peer_messages ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users see own peer_messages" ON peer_messages FOR ALL USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Community: Erfolgs-Stories
CREATE TABLE IF NOT EXISTS success_stories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  before_position text,
  before_salary_range text,
  after_position text,
  after_salary_range text,
  tip text,
  timeframe text,
  approved boolean DEFAULT false,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Approved stories visible" ON success_stories FOR SELECT USING (approved = true OR auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Users create stories" ON success_stories FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Coach Reviews
CREATE TABLE IF NOT EXISTS coach_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id uuid REFERENCES profiles(id),
  reviewer_id uuid REFERENCES profiles(id),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(coach_id, reviewer_id)
);
ALTER TABLE coach_reviews ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone reads reviews" ON coach_reviews FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Users create reviews" ON coach_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Email Log
CREATE TABLE IF NOT EXISTS email_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  template text NOT NULL,
  sent_at timestamptz DEFAULT now()
);

-- Changelog
CREATE TABLE IF NOT EXISTS changelog_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  version text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE changelog_entries ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone reads changelog" ON changelog_entries FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

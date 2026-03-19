-- ============================================================
-- 011: Module Restructure — Community, Contacts, Profiles
-- ============================================================

-- ─── Community Posts ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  post_type text DEFAULT 'text' CHECK (post_type IN ('text', 'success', 'question', 'poll', 'milestone')),
  content text NOT NULL,
  course_id uuid REFERENCES courses(id),
  poll_options jsonb,
  poll_votes jsonb DEFAULT '{}',
  badge_type text,
  likes integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Users create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own posts" ON community_posts FOR DELETE USING (auth.uid() = user_id);

-- ─── Community Comments ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES community_comments(id),
  content text NOT NULL,
  is_coach_answer boolean DEFAULT false,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads comments" ON community_comments FOR SELECT USING (true);
CREATE POLICY "Users create comments" ON community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── Community Likes ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES community_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id)
);
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own likes" ON community_likes FOR ALL USING (auth.uid() = user_id);

-- ─── Community Opt-in on Profiles ────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS community_visible boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS community_display_name text;

-- ─── Contacts Table Extensions ───────────────────────────────
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS xing_url text;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS how_met text;

-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_course ON community_posts(course_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON community_comments(post_id, created_at);

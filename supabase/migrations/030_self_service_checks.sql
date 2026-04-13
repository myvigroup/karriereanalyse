-- Self-Service CV Checks (kein Berater erforderlich)
CREATE TABLE IF NOT EXISTS self_service_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fair_id uuid REFERENCES fairs(id),
  name text NOT NULL,
  email text NOT NULL,
  target_position text,
  result_token uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  cv_storage_path text,
  cv_file_name text,
  cv_file_type text,
  overall_rating integer CHECK (overall_rating BETWEEN 1 AND 5),
  summary text,
  ai_analysis jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'uploading', 'analyzing', 'completed', 'error')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS self_service_check_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  check_id uuid REFERENCES self_service_checks(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL CHECK (category IN ('struktur', 'inhalt', 'design', 'wirkung')),
  type text NOT NULL CHECK (type IN ('preset', 'freetext')),
  content text NOT NULL,
  rating integer CHECK (rating BETWEEN 1 AND 5),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_self_checks_fair ON self_service_checks(fair_id);
CREATE INDEX IF NOT EXISTS idx_self_checks_token ON self_service_checks(result_token);
CREATE INDEX IF NOT EXISTS idx_self_check_items_check ON self_service_check_items(check_id);

-- RLS: No auth needed for insert (public), read only by token (checked in API)
ALTER TABLE self_service_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE self_service_check_items ENABLE ROW LEVEL SECURITY;

-- Service role (admin client) bypasses RLS, so all API operations work fine
-- No policies needed for anon/authenticated access since we use admin client in API routes

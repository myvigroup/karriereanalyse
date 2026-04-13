ALTER TABLE self_service_checks
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS registered boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

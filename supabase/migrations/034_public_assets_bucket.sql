-- Public storage bucket for course thumbnails and other public assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to public-assets
CREATE POLICY "Authenticated users can upload public assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'public-assets');

-- Allow authenticated users to update (upsert) public assets
CREATE POLICY "Authenticated users can update public assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'public-assets');

-- Anyone can read public assets
CREATE POLICY "Public assets are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'public-assets');

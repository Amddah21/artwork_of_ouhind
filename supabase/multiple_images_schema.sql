-- Create artwork_images table for multiple images per artwork
CREATE TABLE IF NOT EXISTS artwork_images (
  id SERIAL PRIMARY KEY,
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for artwork_images
ALTER TABLE artwork_images ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view artwork images
CREATE POLICY "Anyone can view artwork images" ON artwork_images
  FOR SELECT USING (true);

-- Policy: Only authenticated users can insert artwork images
CREATE POLICY "Authenticated users can insert artwork images" ON artwork_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update artwork images
CREATE POLICY "Authenticated users can update artwork images" ON artwork_images
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can delete artwork images
CREATE POLICY "Authenticated users can delete artwork images" ON artwork_images
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_artwork_images_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_artwork_images_updated_at 
  BEFORE UPDATE ON artwork_images 
  FOR EACH ROW 
  EXECUTE FUNCTION update_artwork_images_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_artwork_images_artwork_id ON artwork_images(artwork_id);
CREATE INDEX IF NOT EXISTS idx_artwork_images_display_order ON artwork_images(artwork_id, display_order);

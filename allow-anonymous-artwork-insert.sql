-- Allow anonymous users to insert artworks (for personal gallery)
-- This is a simpler solution for your personal artwork gallery

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Admins can insert artworks" ON public.artworks;

-- Create a new policy that allows anyone to insert artworks
CREATE POLICY "Anyone can insert artworks" ON public.artworks FOR INSERT WITH CHECK (true);

-- Also allow anyone to update artworks
DROP POLICY IF EXISTS "Admins can update artworks" ON public.artworks;
CREATE POLICY "Anyone can update artworks" ON public.artworks FOR UPDATE USING (true);

-- Also allow anyone to delete artworks
DROP POLICY IF EXISTS "Admins can delete artworks" ON public.artworks;
CREATE POLICY "Anyone can delete artworks" ON public.artworks FOR DELETE USING (true);

-- Add policies for artwork_images table
ALTER TABLE public.artwork_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view artwork images" ON public.artwork_images FOR SELECT USING (true);
CREATE POLICY "Anyone can insert artwork images" ON public.artwork_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update artwork images" ON public.artwork_images FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete artwork images" ON public.artwork_images FOR DELETE USING (true);

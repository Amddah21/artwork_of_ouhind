-- Fix RLS policies - handle existing policies properly
-- This will allow anyone to insert artworks (for personal gallery)

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Admins can insert artworks" ON public.artworks;
DROP POLICY IF EXISTS "Admins can update artworks" ON public.artworks;
DROP POLICY IF EXISTS "Admins can delete artworks" ON public.artworks;
DROP POLICY IF EXISTS "Authenticated users can insert artworks" ON public.artworks;
DROP POLICY IF EXISTS "Authenticated users can update artworks" ON public.artworks;
DROP POLICY IF EXISTS "Authenticated users can delete artworks" ON public.artworks;

-- Create new policies that allow anyone to manage artworks
CREATE POLICY "Anyone can insert artworks" ON public.artworks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update artworks" ON public.artworks FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete artworks" ON public.artworks FOR DELETE USING (true);

-- Handle artwork_images table policies
DROP POLICY IF EXISTS "Anyone can view artwork images" ON public.artwork_images;
DROP POLICY IF EXISTS "Anyone can insert artwork images" ON public.artwork_images;
DROP POLICY IF EXISTS "Anyone can update artwork images" ON public.artwork_images;
DROP POLICY IF EXISTS "Anyone can delete artwork images" ON public.artwork_images;

-- Enable RLS on artwork_images if not already enabled
ALTER TABLE public.artwork_images ENABLE ROW LEVEL SECURITY;

-- Create new policies for artwork_images
CREATE POLICY "Anyone can view artwork images" ON public.artwork_images FOR SELECT USING (true);
CREATE POLICY "Anyone can insert artwork images" ON public.artwork_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update artwork images" ON public.artwork_images FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete artwork images" ON public.artwork_images FOR DELETE USING (true);

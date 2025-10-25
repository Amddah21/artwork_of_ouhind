-- Fix RLS policy to allow authenticated users to insert artworks
-- This will allow admin dashboard users to add artworks

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Admins can insert artworks" ON public.artworks;

-- Create a new policy that allows authenticated users to insert artworks
CREATE POLICY "Authenticated users can insert artworks" ON public.artworks FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);

-- Also allow authenticated users to update artworks
DROP POLICY IF EXISTS "Admins can update artworks" ON public.artworks;
CREATE POLICY "Authenticated users can update artworks" ON public.artworks FOR UPDATE USING (
  auth.uid() IS NOT NULL
);

-- Also allow authenticated users to delete artworks
DROP POLICY IF EXISTS "Admins can delete artworks" ON public.artworks;
CREATE POLICY "Authenticated users can delete artworks" ON public.artworks FOR DELETE USING (
  auth.uid() IS NOT NULL
);

-- Add similar policies for artwork_images table
ALTER TABLE public.artwork_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view artwork images" ON public.artwork_images FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert artwork images" ON public.artwork_images FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);
CREATE POLICY "Authenticated users can update artwork images" ON public.artwork_images FOR UPDATE USING (
  auth.uid() IS NOT NULL
);
CREATE POLICY "Authenticated users can delete artwork images" ON public.artwork_images FOR DELETE USING (
  auth.uid() IS NOT NULL
);

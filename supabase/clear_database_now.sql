-- Clear all artworks and images from Supabase database
-- Run this in your Supabase SQL Editor

-- Step 1: Delete all artwork images first
DELETE FROM artwork_images;

-- Step 2: Delete all artworks
DELETE FROM artworks;

-- Step 3: Verify the tables are empty
SELECT 'artwork_images' as table_name, COUNT(*) as count FROM artwork_images
UNION ALL
SELECT 'artworks' as table_name, COUNT(*) as count FROM artworks;

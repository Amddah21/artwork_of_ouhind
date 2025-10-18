-- Clear all artworks and images from the database
-- This will remove all existing artworks and start fresh

-- First, delete all artwork images
DELETE FROM artwork_images;

-- Then, delete all artworks
DELETE FROM artworks;

-- Reset the sequences (optional, but good practice)
-- Note: This might not work on all PostgreSQL versions
-- ALTER SEQUENCE artwork_images_id_seq RESTART WITH 1;
-- ALTER SEQUENCE artworks_id_seq RESTART WITH 1;

-- Show confirmation
SELECT 'All artworks and images have been cleared from the database' as message;

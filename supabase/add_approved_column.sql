-- Add approved column to reviews table if it doesn't exist
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;

-- Update existing reviews to be approved by default (optional)
UPDATE public.reviews 
SET approved = true 
WHERE approved IS NULL;

-- Add index for better performance on approved reviews
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(approved);

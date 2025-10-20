-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artworks table
CREATE TABLE public.artworks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  size TEXT NOT NULL,
  year INTEGER NOT NULL,
  available BOOLEAN DEFAULT true NOT NULL,
  description TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  materials TEXT[] DEFAULT '{}',
  technique TEXT,
  artist_name TEXT DEFAULT 'Mamany Art',
  price_mad TEXT,
  price_eur TEXT,
  reference TEXT,
  support TEXT,
  medium TEXT,
  dimensions TEXT,
  story TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  artwork_id UUID REFERENCES public.artworks(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT NOT NULL,
  helpful INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings table (separate from reviews for quick rating without comments)
CREATE TABLE public.ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  artwork_id UUID REFERENCES public.artworks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(artwork_id, user_id)
);

-- Contact messages table
CREATE TABLE public.contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table (for general comments on artworks)
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  artwork_id UUID REFERENCES public.artworks(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  comment TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_artworks_category ON public.artworks(category);
CREATE INDEX idx_artworks_featured ON public.artworks(featured);
CREATE INDEX idx_artworks_available ON public.artworks(available);
CREATE INDEX idx_reviews_artwork_id ON public.reviews(artwork_id);
CREATE INDEX idx_ratings_artwork_id ON public.ratings(artwork_id);
CREATE INDEX idx_ratings_user_id ON public.ratings(user_id);
CREATE INDEX idx_comments_artwork_id ON public.comments(artwork_id);
CREATE INDEX idx_contact_messages_read ON public.contact_messages(read);

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Artworks policies
CREATE POLICY "Anyone can view artworks" ON public.artworks FOR SELECT USING (true);
CREATE POLICY "Admins can insert artworks" ON public.artworks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update artworks" ON public.artworks FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete artworks" ON public.artworks FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update reviews" ON public.reviews FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete reviews" ON public.reviews FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Ratings policies
CREATE POLICY "Anyone can view ratings" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert ratings" ON public.ratings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own ratings" ON public.ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ratings" ON public.ratings FOR DELETE USING (auth.uid() = user_id);

-- Contact messages policies
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update contact messages" ON public.contact_messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Comments policies
CREATE POLICY "Anyone can view approved comments" ON public.comments FOR SELECT USING (approved = true);
CREATE POLICY "Anyone can insert comments" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all comments" ON public.comments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update comments" ON public.comments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete comments" ON public.comments FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_artworks_updated_at BEFORE UPDATE ON public.artworks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON public.ratings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment artwork views
CREATE OR REPLACE FUNCTION increment_views(artwork_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.artworks 
  SET views = views + 1 
  WHERE id = artwork_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get artwork statistics
CREATE OR REPLACE FUNCTION get_artwork_stats(artwork_id UUID)
RETURNS TABLE (
  total_views INTEGER,
  total_ratings INTEGER,
  average_rating NUMERIC,
  total_reviews INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.views as total_views,
    COUNT(r.id)::INTEGER as total_ratings,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(rv.id)::INTEGER as total_reviews
  FROM public.artworks a
  LEFT JOIN public.ratings r ON a.id = r.artwork_id
  LEFT JOIN public.reviews rv ON a.id = rv.artwork_id
  WHERE a.id = artwork_id
  GROUP BY a.id, a.views;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get featured artworks
CREATE OR REPLACE FUNCTION get_featured_artworks()
RETURNS TABLE (
  id UUID,
  title TEXT,
  category TEXT,
  image_url TEXT,
  size TEXT,
  year INTEGER,
  available BOOLEAN,
  description TEXT,
  featured BOOLEAN,
  tags TEXT[],
  materials TEXT[],
  technique TEXT,
  artist_name TEXT,
  price_mad TEXT,
  price_eur TEXT,
  reference TEXT,
  support TEXT,
  medium TEXT,
  dimensions TEXT,
  story TEXT,
  views INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.artworks
  WHERE featured = true AND available = true
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search artworks
CREATE OR REPLACE FUNCTION search_artworks(search_term TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  category TEXT,
  image_url TEXT,
  size TEXT,
  year INTEGER,
  available BOOLEAN,
  description TEXT,
  featured BOOLEAN,
  tags TEXT[],
  materials TEXT[],
  technique TEXT,
  artist_name TEXT,
  price_mad TEXT,
  price_eur TEXT,
  reference TEXT,
  support TEXT,
  medium TEXT,
  dimensions TEXT,
  story TEXT,
  views INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.artworks
  WHERE 
    available = true AND (
      title ILIKE '%' || search_term || '%' OR
      description ILIKE '%' || search_term || '%' OR
      category ILIKE '%' || search_term || '%' OR
      technique ILIKE '%' || search_term || '%' OR
      search_term = ANY(tags) OR
      search_term = ANY(materials)
    )
  ORDER BY 
    CASE WHEN title ILIKE '%' || search_term || '%' THEN 1 ELSE 2 END,
    created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data
INSERT INTO public.artworks (title, category, image_url, size, year, available, description, featured, tags, materials, technique) VALUES
('Rêve Aquarelle', 'Aquarelle', '/artwork1.JPG', '40x60 cm', 2023, true, 'Une œuvre délicate capturant l''essence des rêves à travers des couleurs fluides et éthérées.', true, ARRAY['aquarelle', 'abstrait', 'coloré'], ARRAY['Aquarelle', 'Papier Arches'], 'Aquarelle sur papier'),
('Portrait au Crayon', 'Dessin au Crayon', '/artwork2.JPG', '30x40 cm', 2023, true, 'Un portrait expressif capturant l''émotion et la personnalité du sujet.', false, ARRAY['portrait', 'réaliste'], ARRAY['Graphite', 'Papier Bristol'], 'Crayon graphite'),
('Étude au Fusain', 'Fusain', '/artwork3.JPG', '50x70 cm', 2023, true, 'Une étude atmosphérique jouant avec les lumières et les ombres.', false, ARRAY['fusain', 'monochrome'], ARRAY['Fusain', 'Papier kraft'], 'Fusain sur papier'),
('Racines Silencieuses', 'Abstrait', '/artwork4.JPG', '60x80 cm', 2025, true, 'Une exploration des textures naturelles et du silence intérieur. Une œuvre abstraite capturant l''essence des racines et des formations géologiques.', true, ARRAY['abstrait', 'texture', 'nature', 'racines'], ARRAY['Techniques mixtes', 'Papier'], 'Techniques mixtes sur papier'),
('Expression de l''Âme', 'Abstrait', '/artwork5.JPG', '70x90 cm', 2025, true, 'L''art est l''expression de l''âme à travers la couleur et la forme. Une œuvre qui explore les profondeurs de l''émotion artistique.', true, ARRAY['abstrait', 'couleur', 'forme', 'âme'], ARRAY['Techniques mixtes', 'Toile'], 'Techniques mixtes sur toile'),
('Textures Organiques', 'Abstrait', '/artwork6.JPG', '80x100 cm', 2025, true, 'Une exploration des textures naturelles et des formations géologiques. Cette œuvre abstraite en noir et blanc révèle la complexité des structures organiques.', true, ARRAY['abstrait', 'texture', 'organique', 'géologie'], ARRAY['Techniques mixtes', 'Papier'], 'Techniques mixtes sur papier'),
('Galerie d''Art', 'Photographie', '/slider2.JPG', '60x80 cm', 2025, true, 'Une vue intérieure d''une galerie d''art élégante, capturant l''atmosphère sophistiquée et l''éclairage naturel qui met en valeur les œuvres exposées.', true, ARRAY['galerie', 'architecture', 'éclairage', 'exposition'], ARRAY['Photographie', 'Impression'], 'Photographie numérique');

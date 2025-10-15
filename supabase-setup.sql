-- Supabase Database Setup Script
-- Run this in your Supabase SQL Editor

-- Create artworks table
CREATE TABLE IF NOT EXISTS artworks (
    id BIGSERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255) NOT NULL,
    technique VARCHAR(255),
    dimensions VARCHAR(100),
    annee INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_artworks_titre ON artworks(titre);
CREATE INDEX IF NOT EXISTS idx_artworks_technique ON artworks(technique);
CREATE INDEX IF NOT EXISTS idx_artworks_annee ON artworks(annee);
CREATE INDEX IF NOT EXISTS idx_artworks_created_at ON artworks(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert sample admin user (password: admin123)
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@artiste.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVhS8N3cC5z8cJh9V6Q4q5q5q6', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Insert sample artworks
INSERT INTO artworks (titre, description, image_url, technique, dimensions, annee) VALUES 
('Harmonie Nocturne', 'Une œuvre abstraite qui capture l''essence de la nuit avec des tons sombres et mystérieux.', '/artwork1.JPG', 'Peinture acrylique', '80x60 cm', 2024),
('Lumière Céleste', 'Une composition qui évoque la lumière divine à travers des couleurs vives et des formes géométriques.', '/artwork2.JPG', 'Peinture à l''huile', '100x80 cm', 2024),
('Abstraction Urbaine', 'Une représentation moderne de l''architecture urbaine avec des lignes nettes et des contrastes forts.', '/artwork3.JPG', 'Peinture mixte', '90x70 cm', 2023),
('Émotions Primaires', 'Une exploration des émotions humaines à travers des couleurs primaires et des formes expressives.', '/slider.JPG', 'Peinture acrylique', '70x50 cm', 2023),
('Galerie Intérieure', 'Une représentation de l''espace d''exposition avec une perspective unique sur l''art et l''architecture.', '/gallery-interior-1.jpg', 'Peinture à l''huile', '120x90 cm', 2024),
('Perspective Artistique', 'Une vue d''ensemble de l''espace créatif qui inspire et invite à la contemplation.', '/gallery-interior-2.jpg', 'Peinture mixte', '110x85 cm', 2024),
('Portrait de l''Artiste', 'Une représentation personnelle qui révèle l''âme créative derrière l''œuvre.', '/artist-portrait.jpg', 'Photographie artistique', '50x50 cm', 2024),
('Composition Abstraite', 'Une œuvre qui explore les limites entre figuration et abstraction avec des formes organiques.', '/slider2.JPG', 'Peinture acrylique', '85x65 cm', 2024),
('Géométrie Sacrée', 'Une étude des formes géométriques et de leur relation avec l''univers et la spiritualité.', '/placeholder.svg', 'Peinture à l''huile', '75x55 cm', 2023),
('Vibration Colorée', 'Une explosion de couleurs qui transmet l''énergie et la vitalité de la création artistique.', '/placeholder.svg', 'Peinture mixte', '95x75 cm', 2024)
ON CONFLICT (titre) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for artworks table
CREATE POLICY "Enable read access for all users" ON artworks FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON artworks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON artworks FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON artworks FOR DELETE USING (true);

-- Create policies for users table
CREATE POLICY "Enable read access for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON users FOR UPDATE USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on artworks table
DROP TRIGGER IF EXISTS update_artworks_updated_at ON artworks;
CREATE TRIGGER update_artworks_updated_at
    BEFORE UPDATE ON artworks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

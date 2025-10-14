-- Artworks Table
CREATE TABLE IF NOT EXISTS artworks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    year INTEGER NOT NULL,
    medium TEXT NOT NULL,
    dimensions TEXT NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10,2),
    is_available BOOLEAN DEFAULT true,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    story TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artwork Tags Table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS artwork_tags (
    id SERIAL PRIMARY KEY,
    artwork_id INTEGER NOT NULL,
    tag TEXT NOT NULL,
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE,
    UNIQUE(artwork_id, tag)
);

-- Artwork Images Table (for multiple views)
CREATE TABLE IF NOT EXISTS artwork_images (
    id SERIAL PRIMARY KEY,
    artwork_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    artwork_id INTEGER,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Ratings Table
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    artwork_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    ip_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    phone TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    level TEXT NOT NULL CHECK(level IN ('info', 'warning', 'error', 'success')),
    category TEXT NOT NULL CHECK(category IN ('auth', 'artwork', 'user', 'system', 'security')),
    message TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site Statistics Table
CREATE TABLE IF NOT EXISTS site_statistics (
    id SERIAL PRIMARY KEY,
    metric_name TEXT NOT NULL UNIQUE,
    metric_value INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_artworks_category ON artworks(category);
CREATE INDEX IF NOT EXISTS idx_artworks_available ON artworks(is_available);
CREATE INDEX IF NOT EXISTS idx_reviews_artwork ON reviews(artwork_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_ratings_artwork ON ratings(artwork_id);
CREATE INDEX IF NOT EXISTS idx_tags_artwork ON artwork_tags(artwork_id);
CREATE INDEX IF NOT EXISTS idx_logs_level ON activity_logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_category ON activity_logs(category);
CREATE INDEX IF NOT EXISTS idx_logs_created ON activity_logs(created_at);

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Insert default admin user
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
    ('omhind53@gmail.com', '$2b$10$rQ8K8K8K8K8K8K8K8K8K8O8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'Oum Hind', 'Douirani', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert default statistics
INSERT INTO site_statistics (metric_name, metric_value) VALUES
    ('total_visits', 0),
    ('unique_visitors', 0),
    ('page_views', 0),
    ('artwork_views', 0),
    ('error_count', 0)
ON CONFLICT (metric_name) DO NOTHING;


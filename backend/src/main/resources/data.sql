-- Insert admin user (password: admin123)
INSERT INTO users (username, email, password, role, created_at) VALUES 
('admin', 'admin@artiste.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVhS8N3cC5z8cJh9V6Q4q5q5q6', 'ADMIN', CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- 
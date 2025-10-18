-- Admin User Setup Script
-- Run this in your Supabase SQL Editor after setting up the main schema

-- First, create the admin user in auth.users (if not already exists)
-- Note: This user should be created through Supabase Auth UI or signup flow
-- But we can update their profile to admin role

-- Update the profile to admin role for the specified email
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'omhind53@gmail.com';

-- If the user doesn't exist yet, you can create them manually:
-- 1. Go to Authentication > Users in your Supabase dashboard
-- 2. Click "Add user" 
-- 3. Enter email: omhind53@gmail.com
-- 4. Enter password: admin123
-- 5. The profile will be automatically created with 'user' role
-- 6. Then run the UPDATE query above to make them admin

-- Alternative: Create admin user directly (if needed)
-- This creates both auth user and profile
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'omhind53@gmail.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Then create the profile
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'admin'
FROM auth.users 
WHERE email = 'omhind53@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Verify the admin user was created/updated
SELECT 
  p.id,
  p.email,
  p.role,
  p.created_at
FROM public.profiles p
WHERE p.email = 'omhind53@gmail.com';

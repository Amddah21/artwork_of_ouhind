-- Create admin user in Supabase (Original Project)
-- Run this in your Supabase SQL Editor at https://aogxcbkfggfnvofavohp.supabase.co

-- Method 1: Using Supabase Dashboard (Recommended)
-- Go to Authentication > Users > Add User
-- Email: omhind53@gmail.com
-- Password: admin123
-- Auto Confirm User: ✅

-- Method 2: SQL Script (Alternative)
-- First, create the admin user in auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'omhind53@gmail.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Get the user ID for the admin user and create profile
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'omhind53@gmail.com';
    
    -- Insert into profiles table
    INSERT INTO public.profiles (
        id,
        email,
        role,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        'omhind53@gmail.com',
        'admin',
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        updated_at = NOW();
        
    RAISE NOTICE 'Admin user created with ID: %', admin_user_id;
END $$;

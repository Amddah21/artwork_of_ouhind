# 🚀 Supabase Integration Setup Guide

## 📋 Overview

Your project is now integrated with Supabase as the backend database! This guide will help you set up the database and get everything running.

## 🔧 Setup Steps

### 1. **Database Setup**

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project: `iczgbndbdsycfqanoajv`
3. Go to **SQL Editor**
4. Copy and paste the contents of `supabase-setup.sql` into the editor
5. Click **Run** to execute the script

This will create:

- `artworks` table with sample data
- `users` table with admin user
- Proper indexes and security policies
- Auto-updating timestamps

### 2. **Admin Credentials**

After running the setup script, you'll have:

- **Email**: `admin@artiste.com`
- **Password**: `admin123`
- **Role**: `ADMIN`

### 3. **Project Configuration**

The following files have been created/updated:

#### **New Files:**

- `src/lib/supabase.ts` - Supabase client configuration
- `src/services/supabase-artwork-service.ts` - Artwork CRUD operations
- `src/services/supabase-auth-service.ts` - Authentication service
- `supabase-setup.sql` - Database setup script

#### **Updated Files:**

- `src/contexts/ArtworkContext.tsx` - Now uses Supabase instead of localStorage
- `src/pages/AdminDashboard.tsx` - Updated for async operations

## 🎯 Features

### **Database Operations:**

- ✅ **Create Artworks**: Add new artworks via admin dashboard
- ✅ **Read Artworks**: Display all artworks in gallery
- ✅ **Update Artworks**: Edit existing artworks
- ✅ **Delete Artworks**: Remove artworks
- ✅ **Search Artworks**: Search by title, description, technique
- ✅ **Real-time Updates**: Changes reflect immediately

### **Authentication:**

- ✅ **Admin Login**: Secure authentication system
- ✅ **Session Management**: Persistent login sessions
- ✅ **JWT Tokens**: Secure token-based authentication

### **Data Persistence:**

- ✅ **Cloud Storage**: All data stored in Supabase
- ✅ **Backup & Recovery**: Automatic backups
- ✅ **Scalability**: Handles growth automatically

## 🔄 How It Works

### **Frontend → Supabase Flow:**

1. **Admin Dashboard**: User adds/edits artwork
2. **ArtworkContext**: Manages state and API calls
3. **SupabaseService**: Handles database operations
4. **Supabase Client**: Communicates with cloud database
5. **Real-time Updates**: Changes appear immediately

### **Data Flow:**

```
Admin Dashboard → ArtworkContext → SupabaseService → Supabase Database
     ↑                                                      ↓
     └────────────── Real-time Updates ←────────────────────┘
```

## 🛡️ Security

### **Row Level Security (RLS):**

- All tables have RLS enabled
- Proper policies for read/write access
- Secure authentication required for modifications

### **API Security:**

- JWT token authentication
- Secure API endpoints
- Input validation and sanitization

## 🚀 Getting Started

### **1. Run Database Setup:**

```sql
-- Copy and paste supabase-setup.sql into Supabase SQL Editor
-- This creates tables, sample data, and security policies
```

### **2. Start Your Application:**

```bash
npm run dev
```

### **3. Access Admin Dashboard:**

- Navigate to `/admin`
- Login with: `admin@artiste.com` / `admin123`
- Start adding your artworks!

## 📊 Database Schema

### **artworks Table:**

```sql
- id (BIGSERIAL PRIMARY KEY)
- titre (VARCHAR) - Artwork title
- description (TEXT) - Artwork description
- image_url (VARCHAR) - Image path/URL
- technique (VARCHAR) - Art technique
- dimensions (VARCHAR) - Size dimensions
- annee (INTEGER) - Creation year
- created_at (TIMESTAMP) - Creation date
- updated_at (TIMESTAMP) - Last update date
```

### **users Table:**

```sql
- id (BIGSERIAL PRIMARY KEY)
- username (VARCHAR UNIQUE) - Username
- email (VARCHAR UNIQUE) - Email address
- password (VARCHAR) - Hashed password
- role (VARCHAR) - User role (ADMIN)
- created_at (TIMESTAMP) - Account creation date
```

## 🔧 Troubleshooting

### **Common Issues:**

#### **1. Connection Errors:**

- Check your Supabase URL and keys
- Verify database is running
- Check network connectivity

#### **2. Authentication Issues:**

- Verify admin credentials
- Check JWT token expiration
- Ensure RLS policies are correct

#### **3. Data Not Loading:**

- Run the setup script again
- Check browser console for errors
- Verify table permissions

### **Debug Steps:**

1. Check browser console for errors
2. Verify Supabase dashboard shows data
3. Test API endpoints directly
4. Check network tab for failed requests

## 🎨 Next Steps

1. **Customize Artworks**: Add your own artworks through the admin dashboard
2. **Update Branding**: Modify colors and styling to match your brand
3. **Add Features**: Extend functionality as needed
4. **Deploy**: Deploy to production when ready

Your Supabase integration is now complete! 🎉✨

# ArtSpark Studio Canvas - Backend Setup with Supabase

This project now includes a complete backend implementation using Supabase for authentication, database, and real-time features.

## 🚀 Quick Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key from the project settings

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Run the SQL script to create all tables, functions, and sample data

### 4. Authentication Setup

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure your site URL (e.g., `http://localhost:5173` for development)
3. Enable email authentication
4. Optionally configure OAuth providers

### 5. Install Dependencies

```bash
npm install
```

### 6. Run the Application

```bash
npm run dev
```

## 📊 Database Schema

The database includes the following tables:

- **profiles**: User profiles extending Supabase auth
- **artworks**: Artwork information and metadata
- **reviews**: User reviews for artworks
- **ratings**: Star ratings for artworks
- **contact_messages**: Contact form submissions
- **comments**: General comments on artworks

## 🔐 Authentication

The app now supports:

- **Email/Password Authentication**: Users can sign up and sign in
- **Role-based Access**: Admin and user roles
- **Protected Routes**: Admin-only features
- **Session Management**: Automatic session handling

## 🎨 Features

### For Users:

- Browse artworks
- Rate and review artworks
- Submit contact messages
- View artwork details

### For Admins:

- Manage artworks (CRUD operations)
- View contact messages
- Moderate reviews and comments
- Access admin dashboard

## 🔧 API Functions

The database includes several useful functions:

- `increment_views(artwork_id)`: Increment artwork view count
- `get_artwork_stats(artwork_id)`: Get comprehensive artwork statistics
- `get_featured_artworks()`: Get all featured artworks
- `search_artworks(search_term)`: Search artworks by various criteria

## 🛡️ Security

- Row Level Security (RLS) enabled on all tables
- Proper authentication checks
- Admin-only operations protected
- Input validation and sanitization

## 📱 Real-time Features

Supabase provides real-time subscriptions for:

- New artwork additions
- Review updates
- Rating changes
- Contact message notifications

## 🚀 Deployment

### Frontend Deployment

Deploy your frontend to Vercel, Netlify, or any static hosting service.

### Environment Variables for Production

Make sure to set your production environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Database Migration

The `supabase/schema.sql` file contains all necessary database setup. Run this in your production Supabase project.

## 🔍 Troubleshooting

### Common Issues:

1. **Authentication not working**: Check your Supabase URL and keys
2. **Database errors**: Ensure all tables are created properly
3. **RLS errors**: Check that policies are correctly set up
4. **CORS issues**: Configure your Supabase project settings

### Getting Help:

1. Check the Supabase documentation
2. Review the console for error messages
3. Ensure all environment variables are set correctly

## 📝 Admin Access

To create an admin user:

1. Sign up normally through the app
2. Go to your Supabase dashboard
3. Navigate to Authentication > Users
4. Find your user and update their profile role to 'admin'

Or use the SQL editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

## 🎯 Next Steps

- Set up email notifications for contact messages
- Implement image upload to Supabase Storage
- Add more sophisticated search functionality
- Implement user favorites/bookmarks
- Add artwork categories management
- Set up analytics and reporting

---

**Note**: This backend implementation replaces the previous localStorage-based approach with a full-featured database solution using Supabase.

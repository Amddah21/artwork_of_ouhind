# 🚀 Supabase Setup Guide for ArtSpark Studio Canvas

## ✅ Your Supabase Credentials

I've received your Supabase credentials:

- **URL**: https://iczgbndbdsycfqanoajv.supabase.co
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🔧 Configuration Steps

### Step 1: Create Environment File

Create `server/.env` with the following content:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://iczgbndbdsycfqanoajv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljemdibmRiZHN5Y2ZxYW5vYWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODIxNDEsImV4cCI6MjA3NTk1ODE0MX0.VrWaw2KzSki6oWOnXttq47ZDK5FEABsomL3g8tEg3GY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljemdibmRiZHN5Y2ZxYW5vYWp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDM4MjE0MSwiZXhwIjoyMDc1OTU4MTQxfQ.9wLM6AaITvJhdmyghfXyfDKa_gpUNc9dSanCEDc326Y

# Database Configuration
# You'll need to get your database password from Supabase Dashboard
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@db.iczgbndbdsycfqanoajv.supabase.co:5432/postgres

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=../public/uploads

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# API Configuration
API_PREFIX=/api
```

### Step 2: Get Your Database Password

1. Go to your Supabase Dashboard: https://app.supabase.com/project/iczgbndbdsycfqanoajv
2. Navigate to **Settings** → **Database**
3. Look for **Connection string** or **Database password**
4. Copy the password and replace `YOUR_DB_PASSWORD` in your `.env` file

### Step 3: Install Dependencies

```bash
cd server
npm install
```

### Step 4: Set Up Database Schema

You have two options:

#### Option A: Use the Setup Script (Recommended)

```bash
cd server
node setup-database.js
```

#### Option B: Manual Setup via Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `server/database/schema.sql`
4. Run the SQL script

### Step 5: Start the Server

```bash
cd server
npm start
```

## 🎯 Expected Output

You should see:

```
✅ Supabase PostgreSQL database connection established
✅ Database tables initialized successfully
📝 Inserting sample artworks...
✅ Sample artworks inserted successfully

🎨 =====================================
   ArtSpark Studio Canvas Backend
   =====================================
   ✅ Server running: http://localhost:3001
   📡 API endpoint: http://localhost:3001/api
   🗄️  Database: Supabase PostgreSQL
   📁 Uploads: /path/to/public/uploads
   =====================================
```

## 🔍 Test Your Setup

1. **Health Check:**

   ```
   http://localhost:3001/health
   ```

2. **Get Artworks:**

   ```
   http://localhost:3001/api/artworks
   ```

3. **Admin Dashboard:**
   ```
   http://localhost:5173/admin
   ```

## 🎨 Supabase Features You Can Use

### 1. **Real-time Subscriptions**

```javascript
// Listen for new artworks in real-time
const subscription = supabase
  .channel('artworks')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'artworks' },
    (payload) => console.log('New artwork:', payload.new)
  )
  .subscribe();
```

### 2. **Row Level Security (RLS)**

- Enable RLS on tables for security
- Create policies for user access control

### 3. **Storage for Images**

- Store artwork images in Supabase Storage
- Automatic CDN delivery
- Image transformations

### 4. **Authentication**

- Built-in user authentication
- Social logins (Google, GitHub, etc.)
- JWT tokens

### 5. **Edge Functions**

- Serverless functions for complex operations
- Global edge deployment

## 🔧 Database Schema

Your Supabase database will include these tables:

- `artworks` - Main artwork data
- `artwork_tags` - Tag relationships
- `artwork_images` - Multiple images per artwork
- `reviews` - User reviews with approval
- `ratings` - User ratings and averages
- `contact_messages` - Contact form data
- `activity_logs` - System activity logs
- `site_statistics` - Analytics data

## 🚀 Next Steps

1. **Start both servers:**

   ```bash
   # Terminal 1 - Backend
   cd server && npm start

   # Terminal 2 - Frontend
   npm run dev
   ```

2. **Access your application:**

   - Website: http://localhost:5173/
   - Admin: http://localhost:5173/admin

3. **Add your first artwork:**
   - Go to admin dashboard
   - Click "Ajouter une Œuvre"
   - Upload image and fill details
   - Save!

## 🆘 Troubleshooting

### Connection Issues

- Verify your database password is correct
- Check that SSL is enabled (it should be automatic)
- Ensure your Supabase project is active

### Schema Issues

- Make sure you're using the updated schema with PostgreSQL syntax
- Check the SQL Editor in Supabase Dashboard for any errors

### CORS Issues

- Verify `ALLOWED_ORIGINS` includes your frontend URL
- Check that both servers are running

## 📊 Supabase Dashboard

Access your Supabase Dashboard at:
https://app.supabase.com/project/iczgbndbdsycfqanoajv

From here you can:

- View your database tables
- Run SQL queries
- Monitor usage
- Configure settings
- Manage storage

---

**Your ArtSpark Studio Canvas is now powered by Supabase! 🎨**

Enjoy the benefits of a managed PostgreSQL database with real-time features, authentication, and storage!

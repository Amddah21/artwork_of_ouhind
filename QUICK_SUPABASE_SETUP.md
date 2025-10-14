# ⚡ Quick Supabase Setup

## 🚀 Your Supabase Project

- **URL**: https://iczgbndbdsycfqanoajv.supabase.co
- **Project ID**: `iczgbndbdsycfqanoajv`

## 📝 Quick Setup (3 Steps)

### 1. Create Environment File

Create `server/.env`:

```env
PORT=3001
NODE_ENV=development

SUPABASE_URL=https://iczgbndbdsycfqanoajv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljemdibmRiZHN5Y2ZxYW5vYWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODIxNDEsImV4cCI6MjA3NTk1ODE0MX0.VrWaw2KzSki6oWOnXttq47ZDK5FEABsomL3g8tEg3GY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljemdibmRiZHN5Y2ZxYW5vYWp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDM4MjE0MSwiZXhwIjoyMDc1OTU4MTQxfQ.9wLM6AaITvJhdmyghfXyfDKa_gpUNc9dSanCEDc326Y

# Get this from Supabase Dashboard > Settings > Database
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.iczgbndbdsycfqanoajv.supabase.co:5432/postgres

ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 2. Get Database Password

1. Go to: https://app.supabase.com/project/iczgbndbdsycfqanoajv/settings/database
2. Copy your database password
3. Replace `YOUR_PASSWORD` in the `.env` file

### 3. Run Setup

```bash
cd server
npm install
node setup-database.js
npm start
```

## ✅ Expected Output

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
   =====================================
```

## 🔍 Test It

- **Health**: http://localhost:3001/health
- **API**: http://localhost:3001/api/artworks
- **Admin**: http://localhost:5173/admin

## 🆘 Need Help?

1. **Can't find password**: Dashboard → Settings → Database → Connection string
2. **Connection failed**: Check password and ensure Supabase project is active
3. **Schema errors**: Use `--recreate` flag: `node setup-database.js --recreate`

---

**Ready in 5 minutes! 🎨**

# 🐘 PostgreSQL Setup Guide

## Database Error Fix

The error you encountered was because the schema was written for SQLite, but you're using PostgreSQL. I've fixed the schema and updated the backend to use PostgreSQL.

## ✅ Changes Made

### 1. Updated Schema (`server/database/schema.sql`)

- Changed `INTEGER PRIMARY KEY AUTOINCREMENT` → `SERIAL PRIMARY KEY`
- Changed `DATETIME` → `TIMESTAMP`
- Changed `INTEGER` (for booleans) → `BOOLEAN`
- Changed `REAL` → `DECIMAL(10,2)`

### 2. Updated Database Connection (`server/database/db.js`)

- Replaced SQLite with PostgreSQL (`pg` package)
- Updated connection logic to use connection pool
- Added proper PostgreSQL query syntax

### 3. Updated Initialization (`server/database/init.js`)

- Changed from SQLite syntax to PostgreSQL syntax
- Updated parameter placeholders (`?` → `$1, $2, etc.`)
- Added `RETURNING id` for getting inserted IDs

### 4. Updated Dependencies (`server/package.json`)

- Removed `sqlite` and `sqlite3`
- Added `pg` (PostgreSQL driver)

## 🚀 Setup Instructions

### Step 1: Install PostgreSQL

If you don't have PostgreSQL installed:

**Windows:**

1. Download from https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for the `postgres` user

**macOS:**

```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE artspark_studio;

# Exit psql
\q
```

### Step 3: Update Environment Variables

Create or update `server/.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# PostgreSQL Database Configuration
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/artspark_studio

# Alternative connection parameters (if not using DATABASE_URL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=artspark_studio
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=../public/uploads

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# API Configuration
API_PREFIX=/api
```

**Replace `YOUR_PASSWORD` with your actual PostgreSQL password.**

### Step 4: Install Dependencies

```bash
cd server
npm install
```

### Step 5: Start the Server

```bash
cd server
npm start
```

## 🔧 Troubleshooting

### Connection Issues

**Error: "role 'postgres' does not exist"**

```bash
# Create postgres user
sudo -u postgres createuser --interactive
```

**Error: "database 'artspark_studio' does not exist"**

```bash
# Connect and create database
psql -U postgres
CREATE DATABASE artspark_studio;
\q
```

**Error: "password authentication failed"**

- Check your password in the `.env` file
- Make sure the password matches what you set during PostgreSQL installation

### Permission Issues

**Error: "permission denied for database"**

```bash
# Grant permissions
psql -U postgres
GRANT ALL PRIVILEGES ON DATABASE artspark_studio TO postgres;
\q
```

## 🎯 Quick Test

After setup, test the connection:

```bash
cd server
npm start
```

You should see:

```
✅ PostgreSQL database connection established
✅ Database tables initialized successfully
📝 Inserting sample artworks...
✅ Sample artworks inserted successfully

🎨 =====================================
   ArtSpark Studio Canvas Backend
   =====================================
   ✅ Server running: http://localhost:3001
   📡 API endpoint: http://localhost:3001/api
   🗄️  Database: PostgreSQL (artspark_studio)
   📁 Uploads: /path/to/public/uploads
   =====================================
```

## 📊 Database Structure

The following tables will be created:

1. **artworks** - Main artwork data
2. **artwork_tags** - Tags for artworks
3. **artwork_images** - Multiple images per artwork
4. **reviews** - User reviews
5. **ratings** - User ratings
6. **contact_messages** - Contact form data
7. **activity_logs** - System activity logs
8. **site_statistics** - Analytics data

## 🔍 Verify Setup

Test the API endpoints:

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

## 💡 Benefits of PostgreSQL

- ✅ **ACID Compliance** - Data integrity guarantees
- ✅ **JSON Support** - Store complex data structures
- ✅ **Full-text Search** - Advanced search capabilities
- ✅ **Scalability** - Handle large datasets
- ✅ **Extensions** - Rich ecosystem of plugins
- ✅ **Performance** - Optimized for complex queries

## 🆘 Still Having Issues?

1. **Check PostgreSQL is running:**

   ```bash
   # Windows
   services.msc
   # Look for "postgresql" service

   # macOS/Linux
   sudo systemctl status postgresql
   ```

2. **Test connection manually:**

   ```bash
   psql -U postgres -d artspark_studio
   ```

3. **Check logs:**

   - Server logs in terminal
   - PostgreSQL logs in system logs

4. **Reset everything:**
   ```bash
   # Drop and recreate database
   psql -U postgres
   DROP DATABASE artspark_studio;
   CREATE DATABASE artspark_studio;
   \q
   ```

---

**Your PostgreSQL database is now ready for the ArtSpark Studio Canvas application!** 🎨

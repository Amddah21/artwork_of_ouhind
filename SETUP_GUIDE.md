# 🎨 ArtSpark Studio Canvas - Complete Setup Guide

## Overview

This guide will help you set up the complete full-stack application with database, backend API, and admin dashboard for managing artworks.

## 📋 What's Included

### Backend System

- ✅ **SQLite Database** - Lightweight, file-based database
- ✅ **Express.js API Server** - RESTful API endpoints
- ✅ **File Upload System** - Image upload and management with Multer
- ✅ **Activity Logging** - Comprehensive system activity tracking
- ✅ **Database Models** - Artworks, Reviews, Ratings, Contacts, Logs

### Admin Dashboard Features

- ✅ **Artwork Management** - Create, edit, delete artworks
- ✅ **Image Upload** - Drag & drop or browse to upload artwork images
- ✅ **Activity Monitoring** - View system logs and statistics
- ✅ **Review Management** - Approve/delete user reviews
- ✅ **Contact Messages** - Manage visitor inquiries
- ✅ **Statistics Dashboard** - Track visits, views, and activity

## 🚀 Quick Start

### Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

This installs:

- express (web framework)
- cors (cross-origin resource sharing)
- dotenv (environment variables)
- sqlite3 (database driver)
- sqlite (promise wrapper)
- multer (file uploads)

### Step 2: Start the Backend Server

```bash
# In the server directory
npm start

# Or for development with auto-reload:
npm run dev
```

You should see:

```
🎨 =====================================
   ArtSpark Studio Canvas Backend
   =====================================
   ✅ Server running: http://localhost:3001
   📡 API endpoint: http://localhost:3001/api
   🗄️  Database: SQLite (artspark.db)
   📁 Uploads: /path/to/public/uploads
   =====================================
```

### Step 3: Start the Frontend

```bash
# In the project root directory
npm run dev
```

The frontend will start on `http://localhost:5173`

### Step 4: Access the Admin Dashboard

Open your browser and navigate to:

```
http://localhost:5173/admin
```

## 📊 Database Structure

### Tables Created Automatically

1. **artworks** - Main artwork information

   - id, title, description, year, medium, dimensions
   - category, price, is_available, image_url
   - thumbnail_url, story, timestamps

2. **artwork_tags** - Tags for artworks (many-to-many)

   - id, artwork_id, tag

3. **artwork_images** - Multiple images per artwork

   - id, artwork_id, image_url, display_order

4. **reviews** - User reviews

   - id, artwork_id, name, email, rating, comment
   - is_approved, created_at

5. **ratings** - User ratings

   - id, artwork_id, rating, ip_address, created_at

6. **contact_messages** - Contact form submissions

   - id, name, email, subject, message, phone
   - is_read, created_at

7. **activity_logs** - System activity

   - id, level, category, message, details
   - ip_address, user_agent, created_at

8. **site_statistics** - Site metrics
   - id, metric_name, metric_value, updated_at

### Sample Data

The database is automatically initialized with 3 sample artworks:

1. Rêve Aquarelle
2. Portrait au Crayon
3. Étude au Fusain

## 🎨 Using the Admin Dashboard

### Adding a New Artwork

1. **Navigate to Admin Dashboard**

   - Go to `/admin` in your browser
   - Click on "Gestion des Œuvres" tab (Artwork Management)

2. **Click "Ajouter une Œuvre"** (Add Artwork)

3. **Fill in the Form**:

   - **Image**: Drag & drop or click to upload (required)
   - **Title**: Name of the artwork (required)
   - **Description**: Brief description (required)
   - **Year**: Creation year
   - **Medium**: e.g., "Oil on canvas", "Watercolor", "Graphite"
   - **Dimensions**: e.g., "60 x 80 cm"
   - **Category**: Select from dropdown (Aquarelle, Huile, Portrait, etc.)
   - **Price**: Price in euros (optional)
   - **Story**: Detailed background story of the artwork
   - **Tags**: Comma-separated tags (e.g., "modern, abstract, colorful")
   - **Available**: Check if artwork is available for sale

4. **Click "Add Artwork"** or "Update Artwork"

5. **The artwork is now saved** to the database and will appear in:
   - Admin dashboard artwork grid
   - Frontend portfolio page
   - API endpoints

### Managing Artworks

**View Artwork Details**:

- Hover over an artwork card
- Click "Voir" (View) button
- See full details, story, and all images

**Edit Artwork**:

- Hover over an artwork card
- Click the edit icon (pencil)
- Modify any field
- Save changes

**Delete Artwork**:

- Hover over an artwork card
- Click the delete icon (trash)
- Confirm deletion

### Activity Logs

**View Logs**:

1. Go to "Journaux d'Activité" tab
2. Use filters:
   - **Search**: Find specific logs
   - **Level**: Filter by error, warning, info, success
   - **Category**: Filter by artwork, user, system, security

**Log Levels**:

- 🔴 **Error**: System errors and failures
- 🟡 **Warning**: Important notices (e.g., deletions)
- 🟢 **Success**: Successful operations
- 🔵 **Info**: General information

## 🔌 API Endpoints Reference

### Artworks

```bash
# Get all artworks
GET http://localhost:3001/api/artworks

# Get artwork by ID
GET http://localhost:3001/api/artworks/:id

# Create artwork (with image upload)
POST http://localhost:3001/api/artworks
Content-Type: multipart/form-data

# Update artwork
PUT http://localhost:3001/api/artworks/:id

# Delete artwork
DELETE http://localhost:3001/api/artworks/:id
```

### Reviews

```bash
# Get all reviews
GET http://localhost:3001/api/reviews?approved=true

# Create review
POST http://localhost:3001/api/reviews

# Approve review
PATCH http://localhost:3001/api/reviews/:id/approve

# Delete review
DELETE http://localhost:3001/api/reviews/:id
```

### Ratings

```bash
# Get artwork rating
GET http://localhost:3001/api/ratings/artwork/:artworkId

# Submit rating
POST http://localhost:3001/api/ratings
```

### Contact

```bash
# Get messages
GET http://localhost:3001/api/contact

# Submit contact message
POST http://localhost:3001/api/contact

# Mark as read
PATCH http://localhost:3001/api/contact/:id/read
```

### Admin

```bash
# Get statistics
GET http://localhost:3001/api/admin/stats

# Get logs
GET http://localhost:3001/api/admin/logs?level=error&limit=50

# Get overview
GET http://localhost:3001/api/admin/overview
```

## 📤 File Upload Details

### Supported Formats

- JPEG / JPG
- PNG
- GIF
- WebP

### Maximum File Size

- 10MB per file

### Upload Location

- Files are saved to: `public/uploads/`
- Served at: `http://localhost:3001/uploads/filename.jpg`
- Automatically named: `artwork-{timestamp}-{random}.{ext}`

### Example Upload with JavaScript

```javascript
const formData = new FormData();
formData.append('title', 'My Beautiful Artwork');
formData.append('description', 'A stunning piece');
formData.append('year', '2024');
formData.append('medium', 'Oil on canvas');
formData.append('dimensions', '60 x 80 cm');
formData.append('category', 'Painting');
formData.append('price', '750');
formData.append('isAvailable', 'true');
formData.append('tags', 'modern,colorful,abstract');
formData.append('story', 'Created during summer...');
formData.append('image', fileInput.files[0]);

const response = await fetch('http://localhost:3001/api/artworks', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
```

## 🔧 Troubleshooting

### Server won't start

**Check if port 3001 is already in use:**

```bash
# Windows
netstat -ano | findstr :3001

# Kill the process if needed
taskkill /PID <process_id> /F
```

**Change the port:**
Edit `server/.env`:

```
PORT=3002
```

### Database errors

**Reset the database:**

```bash
cd server/database
rm artspark.db
cd ..
npm start  # Database will be recreated
```

### Upload errors

**Check uploads directory exists:**

```bash
mkdir public/uploads
```

**Check file permissions:**

- Ensure the `public/uploads/` directory is writable

### CORS errors

**Update allowed origins in `server/.env`:**

```
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 📁 Project Structure

```
artspark-studio-canvas-2/
├── server/                      # Backend
│   ├── database/
│   │   ├── db.js               # Database connection
│   │   ├── init.js             # Initialize tables
│   │   ├── schema.sql          # Database schema
│   │   └── artspark.db         # SQLite database (auto-generated)
│   ├── models/                 # Data models
│   │   ├── artwork.model.js
│   │   ├── review.model.js
│   │   ├── rating.model.js
│   │   ├── contact.model.js
│   │   └── log.model.js
│   ├── routes/                 # API routes
│   │   ├── artwork.routes.js
│   │   ├── review.routes.js
│   │   ├── rating.routes.js
│   │   ├── contact.routes.js
│   │   └── admin.routes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js           # Multer configuration
│   ├── .env                    # Environment variables
│   ├── index.js                # Server entry point
│   ├── package.json
│   └── README.md
├── src/                        # Frontend
│   ├── pages/
│   │   └── AdminDashboard.tsx  # Admin interface
│   ├── services/
│   │   ├── api.ts              # API client
│   │   └── admin-api.ts        # Admin API client
│   └── ...
├── public/
│   ├── uploads/                # Uploaded artwork images
│   ├── artwork1.JPG            # Sample images
│   └── ...
└── package.json                # Frontend dependencies
```

## 🎯 Next Steps

1. **Customize the Admin Dashboard**

   - Add authentication
   - Enhance statistics display
   - Add more filtering options

2. **Extend the API**

   - Add pagination
   - Implement search
   - Add sorting options

3. **Enhance Security**

   - Add JWT authentication
   - Implement rate limiting
   - Add input validation

4. **Deploy**
   - Choose a hosting provider
   - Set up production database
   - Configure environment variables

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Multer Documentation](https://github.com/expressjs/multer)
- [React Documentation](https://react.dev/)

## 🆘 Getting Help

- Check `server/README.md` for backend-specific docs
- Review API responses for error messages
- Check browser console for frontend errors
- Check server terminal for backend errors

---

**Happy Creating! 🎨**

Your ArtSpark Studio Canvas is now ready to manage and showcase beautiful artworks!

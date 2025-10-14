# 🚀 How to Start the ArtSpark Studio Canvas Application

## Complete Startup Guide

### Step 1: Start the Backend Server

Open a **new terminal/command prompt** window:

```bash
# Navigate to the server directory
cd server

# Start the server
npm start
```

You should see output like:

```
🔄 Initializing database...
✅ Database ready
📝 Inserting sample artworks...
✅ Sample artworks inserted successfully

🎨 =====================================
   ArtSpark Studio Canvas Backend
   =====================================
   ✅ Server running: http://localhost:3001
   📡 API endpoint: http://localhost:3001/api
   🗄️  Database: SQLite (artspark.db)
   📁 Uploads: /path/to/public/uploads
   =====================================
```

**✅ Server is now running on http://localhost:3001**

---

### Step 2: Start the Frontend

Open a **second terminal/command prompt** window:

```bash
# Navigate to the project root (if not already there)
cd C:\Users\USER\artspark-studio-canvas-2

# Start the frontend development server
npm run dev
```

You should see:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**✅ Frontend is now running on http://localhost:5173**

---

### Step 3: Access the Application

#### Main Website

Open your browser and go to:

```
http://localhost:5173/
```

#### Admin Dashboard

Open your browser and go to:

```
http://localhost:5173/admin
```

---

## 🎨 Using the Admin Dashboard

### Adding a New Artwork

1. **Go to Admin Dashboard**: `http://localhost:5173/admin`

2. **Click the "Gestion des Œuvres" tab** (first tab)

3. **Click "Ajouter une Œuvre"** button (top right)

4. **Fill in the form**:

   - **Upload Image**:

     - Drag and drop an image file
     - OR click "Choisir un Fichier" to browse
     - Supported formats: JPG, PNG, GIF, WebP
     - Max size: 10MB

   - **Title** (Required): e.g., "Sunset Over Mountains"

   - **Description** (Required): e.g., "A beautiful landscape painting capturing the golden hour"

   - **Year**: e.g., 2024

   - **Medium**: e.g., "Oil on canvas", "Watercolor", "Acrylic"

   - **Dimensions**: e.g., "60 x 80 cm"

   - **Category**: Select from dropdown:

     - Aquarelle
     - Huile
     - Acrylique
     - Moderne
     - Abstrait
     - Nature
     - Portrait
     - Paysage

   - **Price (€)**: e.g., 450 (optional)

   - **Story**: Share the inspiration behind the artwork (optional)

   - **Tags**: e.g., "landscape, sunset, mountains" (comma-separated)

   - **Disponible à la vente**: Check if available for purchase

5. **Click "Add Artwork"** to save

6. **Your artwork is now saved!** It will appear:
   - In the admin dashboard grid
   - On the main portfolio page
   - Available via the API

---

## 📊 View Activity Logs

1. Go to Admin Dashboard
2. Click the **"Journaux d'Activité"** tab
3. See all system activity:
   - Artwork creations
   - Updates and deletions
   - User reviews
   - Contact messages
   - System events

### Filter Logs

- **Search**: Type keywords to find specific logs
- **Niveau** (Level): Filter by error, warning, info, success
- **Catégorie** (Category): Filter by artwork, user, system, security

---

## 📝 Sample Test Artwork Data

If you want to test adding an artwork, use this sample data:

```
Title: Evening Garden
Description: A serene garden scene painted during twilight, capturing the peaceful transition from day to night.
Year: 2024
Medium: Oil on canvas
Dimensions: 50 x 70 cm
Category: Paysage
Price: 580
Story: This piece was inspired by my grandmother's garden in Provence. Every evening, the light would transform the space into something magical. I wanted to capture that fleeting moment when colors shift from warm to cool.
Tags: garden, twilight, peaceful, landscape, nature
Available: Yes (checked)
```

Use any of your existing artwork images from the `public` folder for testing.

---

## 🔍 Verify Everything is Working

### Test 1: Check Backend Health

Open browser and go to:

```
http://localhost:3001/health
```

Should return:

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Test 2: Check API Artworks

```
http://localhost:3001/api/artworks
```

Should return JSON with sample artworks.

### Test 3: Check Frontend

```
http://localhost:5173/
```

Should show your art gallery website.

### Test 4: Check Admin Dashboard

```
http://localhost:5173/admin
```

Should show the admin dashboard with management interface.

---

## 🛑 How to Stop the Servers

### Stop Backend:

In the terminal running the backend server, press:

```
Ctrl + C
```

### Stop Frontend:

In the terminal running the frontend, press:

```
Ctrl + C
```

---

## 🔧 Troubleshooting

### Port 3001 already in use

If you see an error that port 3001 is in use:

**Option 1**: Kill the existing process

```bash
# Find the process
netstat -ano | findstr :3001

# Kill it (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Option 2**: Change the port
Edit `server/.env` and change:

```
PORT=3002
```

Then update the frontend API config in `src/services/admin-api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3002/api';
```

### Port 5173 already in use

The frontend will automatically try the next available port (5174, 5175, etc.)

### Database Reset

To start fresh with a new database:

```bash
cd server/database
rm artspark.db
cd ..
npm start
```

### Image Upload Not Working

1. Check that `public/uploads/` directory exists
2. Check file size is under 10MB
3. Check file format is supported (JPG, PNG, GIF, WebP)
4. Check browser console for errors

---

## 📚 Additional Resources

- **Full Setup Guide**: See `SETUP_GUIDE.md`
- **Backend Documentation**: See `server/README.md`
- **API Documentation**: See API Integration Guide
- **Artistic Design System**: See `ARTISTIC_DESIGN_SYSTEM.md`

---

## ✅ Quick Reference

| What            | URL                          |
| --------------- | ---------------------------- |
| Frontend        | http://localhost:5173/       |
| Admin Dashboard | http://localhost:5173/admin  |
| Backend API     | http://localhost:3001/api    |
| Health Check    | http://localhost:3001/health |

---

**You're all set! Start managing your artwork collection! 🎨**

# 🏗️ ArtSpark Studio Canvas - System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     ARTSPARK STUDIO CANVAS                      │
│                    Full-Stack Art Gallery                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                           │
│                   http://localhost:5173                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Gallery    │  │    Admin     │  │   Contact    │        │
│  │   Website    │  │  Dashboard   │  │     Page     │        │
│  └──────┬───────┘  └───────┬──────┘  └──────┬───────┘        │
│         │                   │                 │                 │
│         └───────────────────┴─────────────────┘                 │
│                             │                                   │
│                   ┌─────────▼──────────┐                       │
│                   │  Admin API Client  │                       │
│                   │  (admin-api.ts)    │                       │
│                   └─────────┬──────────┘                       │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │ HTTP Requests (Fetch API)
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                         API LAYER                               │
│                   http://localhost:3001                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              EXPRESS.JS SERVER (index.js)              │   │
│  │                                                        │   │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│   │
│  │  │  CORS   │  │  Static  │  │  Upload  │  │ Logging││   │
│  │  │         │  │  Files   │  │  Multer  │  │        ││   │
│  │  └─────────┘  └──────────┘  └──────────┘  └────────┘│   │
│  └────────────────────────────────────────────────────────┘   │
│                             │                                   │
│  ┌─────────────────────────▼──────────────────────────────┐   │
│  │                    API ROUTES                          │   │
│  │                                                        │   │
│  │  /api/artworks     ─── artwork.routes.js             │   │
│  │  /api/reviews      ─── review.routes.js              │   │
│  │  /api/ratings      ─── rating.routes.js              │   │
│  │  /api/contact      ─── contact.routes.js             │   │
│  │  /api/admin        ─── admin.routes.js               │   │
│  └────────────────────────┬───────────────────────────────┘   │
│                            │                                   │
│  ┌─────────────────────────▼──────────────────────────────┐   │
│  │                     DATA MODELS                        │   │
│  │                                                        │   │
│  │  artwork.model.js  ─── Artwork CRUD                   │   │
│  │  review.model.js   ─── Review Management             │   │
│  │  rating.model.js   ─── Rating Calculations           │   │
│  │  contact.model.js  ─── Contact Messages              │   │
│  │  log.model.js      ─── Activity Logging              │   │
│  └────────────────────────┬───────────────────────────────┘   │
│                            │ SQL Queries                       │
└────────────────────────────┼───────────────────────────────────┘
                             │
┌────────────────────────────▼───────────────────────────────────┐
│                      DATABASE LAYER                            │
│                  SQLite (artspark.db)                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   artworks   │  │artwork_tags  │  │artwork_images│       │
│  │              │  │              │  │              │       │
│  │ • id         │  │ • id         │  │ • id         │       │
│  │ • title      │  │ • artwork_id │  │ • artwork_id │       │
│  │ • description│  │ • tag        │  │ • image_url  │       │
│  │ • year       │  └──────────────┘  │ • order      │       │
│  │ • medium     │                    └──────────────┘       │
│  │ • dimensions │                                           │
│  │ • category   │  ┌──────────────┐  ┌──────────────┐       │
│  │ • price      │  │   reviews    │  │   ratings    │       │
│  │ • available  │  │              │  │              │       │
│  │ • image_url  │  │ • id         │  │ • id         │       │
│  │ • story      │  │ • artwork_id │  │ • artwork_id │       │
│  │ • created_at │  │ • name       │  │ • rating     │       │
│  │ • updated_at │  │ • email      │  │ • ip_address │       │
│  └──────────────┘  │ • rating     │  │ • created_at │       │
│                    │ • comment    │  └──────────────┘       │
│  ┌──────────────┐  │ • approved   │                         │
│  │   contact_   │  │ • created_at │  ┌──────────────┐       │
│  │   messages   │  └──────────────┘  │ activity_logs│       │
│  │              │                    │              │       │
│  │ • id         │  ┌──────────────┐  │ • id         │       │
│  │ • name       │  │site_stats    │  │ • level      │       │
│  │ • email      │  │              │  │ • category   │       │
│  │ • subject    │  │ • metric_name│  │ • message    │       │
│  │ • message    │  │ • value      │  │ • details    │       │
│  │ • phone      │  │ • updated_at │  │ • ip_address │       │
│  │ • is_read    │  └──────────────┘  │ • user_agent │       │
│  │ • created_at │                    │ • created_at │       │
│  └──────────────┘                    └──────────────┘       │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      FILE STORAGE                            │
│                   public/uploads/                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  artwork-1697531234567-123456789.jpg                        │
│  artwork-1697531234568-987654321.png                        │
│  artwork-1697531234569-456789123.webp                       │
│  ...                                                         │
│                                                              │
│  Served at: http://localhost:3001/uploads/                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

### Creating an Artwork

```
┌──────────────┐
│   User in    │
│    Admin     │
│  Dashboard   │
└──────┬───────┘
       │ 1. Fill form & upload image
       ▼
┌─────────────────────────┐
│   Admin API Client      │
│   (admin-api.ts)        │
│                         │
│ • Create FormData       │
│ • Append artwork data   │
│ • Append image file     │
└──────────┬──────────────┘
           │ 2. POST /api/artworks
           │    (multipart/form-data)
           ▼
┌──────────────────────────────────┐
│  Express.js Server               │
│                                  │
│  • Multer middleware receives    │
│  • Saves image to /uploads/      │
│  • Generates unique filename     │
└──────────┬───────────────────────┘
           │ 3. Route handler
           ▼
┌──────────────────────────────────┐
│  artwork.routes.js               │
│                                  │
│  • Validate data                 │
│  • Parse tags                    │
│  • Get image path                │
└──────────┬───────────────────────┘
           │ 4. Call model
           ▼
┌──────────────────────────────────┐
│  artwork.model.js                │
│                                  │
│  • Insert artwork row            │
│  • Insert tags                   │
│  • Insert additional images      │
│  • Return created artwork        │
└──────────┬───────────────────────┘
           │ 5. Database operations
           ▼
┌──────────────────────────────────┐
│  SQLite Database                 │
│                                  │
│  INSERT INTO artworks...         │
│  INSERT INTO artwork_tags...     │
│                                  │
│  ✅ Data persisted               │
└──────────┬───────────────────────┘
           │ 6. Log activity
           ▼
┌──────────────────────────────────┐
│  log.model.js                    │
│                                  │
│  • Record creation event         │
│  • Update statistics             │
└──────────┬───────────────────────┘
           │ 7. Response
           ▼
┌──────────────────────────────────┐
│  Response to Client              │
│                                  │
│  {                               │
│    success: true,                │
│    data: { artwork details },    │
│    message: "Created..."         │
│  }                               │
└──────────────────────────────────┘
```

## Request/Response Format

### Create Artwork Request

```http
POST /api/artworks HTTP/1.1
Host: localhost:3001
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="title"

Mountain Sunrise
------WebKitFormBoundary
Content-Disposition: form-data; name="description"

A breathtaking mountain sunrise
------WebKitFormBoundary
Content-Disposition: form-data; name="year"

2024
------WebKitFormBoundary
Content-Disposition: form-data; name="medium"

Oil on canvas
------WebKitFormBoundary
Content-Disposition: form-data; name="dimensions"

70 x 100 cm
------WebKitFormBoundary
Content-Disposition: form-data; name="category"

Paysage
------WebKitFormBoundary
Content-Disposition: form-data; name="price"

650
------WebKitFormBoundary
Content-Disposition: form-data; name="isAvailable"

true
------WebKitFormBoundary
Content-Disposition: form-data; name="tags"

landscape,mountains,sunrise
------WebKitFormBoundary
Content-Disposition: form-data; name="image"; filename="sunrise.jpg"
Content-Type: image/jpeg

[Binary image data]
------WebKitFormBoundary--
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 4,
    "title": "Mountain Sunrise",
    "description": "A breathtaking mountain sunrise",
    "year": 2024,
    "medium": "Oil on canvas",
    "dimensions": "70 x 100 cm",
    "category": "Paysage",
    "price": 650,
    "is_available": 1,
    "image_url": "/uploads/artwork-1697531234567-123456789.jpg",
    "thumbnail_url": null,
    "story": null,
    "created_at": "2024-10-14T00:00:00.000Z",
    "updated_at": "2024-10-14T00:00:00.000Z",
    "tags": ["landscape", "mountains", "sunrise"],
    "multipleViews": []
  },
  "message": "Artwork created successfully"
}
```

## Security Architecture

```
┌────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                     │
├────────────────────────────────────────────────────────┤
│                                                        │
│  1. INPUT VALIDATION                                   │
│     ├─ Required field checking                        │
│     ├─ Data type validation                           │
│     ├─ Range validation (ratings 1-5)                 │
│     └─ Enum validation (log levels, categories)       │
│                                                        │
│  2. FILE UPLOAD SECURITY                               │
│     ├─ File type validation (images only)             │
│     ├─ File size limit (10MB)                         │
│     ├─ Unique filename generation                     │
│     └─ Extension whitelist                            │
│                                                        │
│  3. DATABASE SECURITY                                  │
│     ├─ Parameterized queries (SQL injection safe)     │
│     ├─ Foreign key constraints                        │
│     ├─ Data integrity checks                          │
│     └─ Transaction support                            │
│                                                        │
│  4. API SECURITY                                       │
│     ├─ CORS configuration                             │
│     ├─ Error message sanitization                     │
│     ├─ Request logging                                │
│     └─ HTTP method restrictions                       │
│                                                        │
│  5. FUTURE ENHANCEMENTS                                │
│     ├─ JWT authentication                             │
│     ├─ Rate limiting                                  │
│     ├─ Input sanitization                             │
│     ├─ HTTPS enforcement                              │
│     └─ CSRF protection                                │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Technology Stack Details

```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND                           │
├─────────────────────────────────────────────────────┤
│  • React 18                                         │
│  • TypeScript                                       │
│  • Vite (build tool)                                │
│  • Tailwind CSS                                     │
│  • Shadcn UI Components                             │
│  • Lucide React (icons)                             │
│  • React Router (navigation)                        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   BACKEND                           │
├─────────────────────────────────────────────────────┤
│  • Node.js (runtime)                                │
│  • Express.js 4.x (web framework)                   │
│  • ES Modules (import/export)                       │
│  • CORS (cross-origin)                              │
│  • Multer (file uploads)                            │
│  • dotenv (environment variables)                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  DATABASE                           │
├─────────────────────────────────────────────────────┤
│  • SQLite3 (database engine)                        │
│  • sqlite package (promise wrapper)                 │
│  • File-based (artspark.db)                         │
│  • Schema migrations                                │
│  • Automatic initialization                         │
└─────────────────────────────────────────────────────┘
```

## File Organization

```
artspark-studio-canvas-2/
│
├─ server/                       # Backend application
│  ├─ database/                  # Database layer
│  │  ├─ db.js                   # Connection management
│  │  ├─ init.js                 # Schema initialization
│  │  ├─ schema.sql              # Table definitions
│  │  └─ artspark.db             # SQLite database file
│  │
│  ├─ models/                    # Data access layer
│  │  ├─ artwork.model.js        # Artwork operations
│  │  ├─ review.model.js         # Review operations
│  │  ├─ rating.model.js         # Rating operations
│  │  ├─ contact.model.js        # Contact operations
│  │  └─ log.model.js            # Logging operations
│  │
│  ├─ routes/                    # API endpoints
│  │  ├─ artwork.routes.js       # /api/artworks
│  │  ├─ review.routes.js        # /api/reviews
│  │  ├─ rating.routes.js        # /api/ratings
│  │  ├─ contact.routes.js       # /api/contact
│  │  └─ admin.routes.js         # /api/admin
│  │
│  ├─ middleware/                # Request processing
│  │  ├─ upload.js               # File upload handling
│  │  └─ auth.js                 # Authentication (future)
│  │
│  ├─ index.js                   # Server entry point
│  ├─ package.json               # Backend dependencies
│  └─ README.md                  # Backend documentation
│
├─ src/                          # Frontend application
│  ├─ services/                  # API clients
│  │  ├─ api.ts                  # General API client
│  │  └─ admin-api.ts            # Admin API client
│  │
│  ├─ pages/                     # Page components
│  │  └─ AdminDashboard.tsx      # Admin interface
│  │
│  └─ components/                # UI components
│     └─ ...
│
├─ public/                       # Static assets
│  ├─ uploads/                   # Uploaded artwork images
│  └─ ...
│
└─ Documentation Files
   ├─ DATABASE_AND_API_SETUP.md  # Setup documentation
   ├─ START_SERVER.md            # Startup guide
   ├─ SETUP_GUIDE.md             # Complete guide
   ├─ QUICK_START.txt            # Quick reference
   ├─ PROJECT_SUMMARY.md         # Project overview
   └─ ARCHITECTURE.md            # This file
```

## Scalability Considerations

### Current Architecture (Single Server)

```
[Browser] ←→ [Express + SQLite] ←→ [File System]
```

### Production Architecture (Recommended)

```
                    ┌──────────────┐
                    │ Load Balancer│
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
         ┌────▼───┐   ┌────▼───┐   ┌────▼───┐
         │Express │   │Express │   │Express │
         │Server 1│   │Server 2│   │Server 3│
         └────┬───┘   └────┬───┘   └────┬───┘
              │            │            │
              └────────────┼────────────┘
                           │
                    ┌──────▼───────┐
                    │  PostgreSQL  │
                    │   Database   │
                    └──────────────┘
                           │
                    ┌──────▼───────┐
                    │     CDN      │
                    │  (S3/Cloud)  │
                    └──────────────┘
```

---

**Architecture designed for growth and scalability** 🚀

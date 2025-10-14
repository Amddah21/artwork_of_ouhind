# ArtSpark Studio Canvas Backend

Backend API server for the ArtSpark Studio Canvas application built with Express.js and SQLite.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm run dev  # For development with auto-reload
# or
npm start    # For production
```

The server will start on `http://localhost:3001`

## 📁 Project Structure

```
server/
├── database/
│   ├── db.js              # Database connection
│   ├── init.js            # Database initialization
│   ├── schema.sql         # Database schema
│   └── artspark.db        # SQLite database file (auto-generated)
├── middleware/
│   ├── auth.js            # Authentication middleware
│   └── upload.js          # File upload middleware (multer)
├── models/
│   ├── artwork.model.js   # Artwork data model
│   ├── contact.model.js   # Contact message model
│   ├── log.model.js       # Activity log model
│   ├── rating.model.js    # Rating model
│   └── review.model.js    # Review model
├── routes/
│   ├── admin.routes.js    # Admin dashboard routes
│   ├── artwork.routes.js  # Artwork CRUD routes
│   ├── contact.routes.js  # Contact message routes
│   ├── rating.routes.js   # Rating routes
│   └── review.routes.js   # Review routes
├── .env                   # Environment variables
├── .env.example           # Environment variables template
├── index.js               # Server entry point
├── package.json
└── README.md
```

## 🗄️ Database

The application uses SQLite for data storage. The database is automatically created and initialized when you first start the server.

### Tables:

- **artworks**: Main artwork data
- **artwork_tags**: Artwork tags (many-to-many)
- **artwork_images**: Multiple artwork images
- **reviews**: User reviews
- **ratings**: User ratings
- **contact_messages**: Contact form submissions
- **activity_logs**: System activity logs
- **site_statistics**: Site metrics

## 🔌 API Endpoints

### Artworks

- `GET /api/artworks` - Get all artworks
- `GET /api/artworks/:id` - Get artwork by ID
- `POST /api/artworks` - Create new artwork (with image upload)
- `PUT /api/artworks/:id` - Update artwork
- `DELETE /api/artworks/:id` - Delete artwork
- `GET /api/artworks/stats/summary` - Get artwork statistics

### Reviews

- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get review by ID
- `POST /api/reviews` - Submit new review
- `PATCH /api/reviews/:id/approve` - Approve review
- `DELETE /api/reviews/:id` - Delete review

### Ratings

- `GET /api/ratings/artwork/:artworkId` - Get average rating for artwork
- `GET /api/ratings/artwork/:artworkId/all` - Get all ratings for artwork
- `POST /api/ratings` - Submit rating

### Contact

- `GET /api/contact` - Get all contact messages
- `GET /api/contact/:id` - Get contact message by ID
- `POST /api/contact` - Submit contact message
- `PATCH /api/contact/:id/read` - Mark message as read
- `DELETE /api/contact/:id` - Delete message

### Admin

- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/logs` - Get activity logs
- `GET /api/admin/overview` - Get complete overview
- `GET /api/admin/reviews/pending` - Get pending reviews
- `GET /api/admin/messages/unread` - Get unread messages
- `POST /api/admin/logs` - Create log entry

## 📤 File Uploads

Artwork images are uploaded to `public/uploads/` directory. The server serves these files statically at `/uploads`.

**Supported formats**: JPEG, JPG, PNG, GIF, WebP  
**Maximum file size**: 10MB

### Example Upload Request:

```javascript
const formData = new FormData();
formData.append('title', 'My Artwork');
formData.append('description', 'Beautiful painting');
formData.append('year', '2024');
formData.append('medium', 'Oil on canvas');
formData.append('dimensions', '50x70 cm');
formData.append('category', 'Painting');
formData.append('price', '500');
formData.append('isAvailable', 'true');
formData.append('tags', 'modern,abstract,colorful');
formData.append('image', fileInput.files[0]);

fetch('http://localhost:3001/api/artworks', {
  method: 'POST',
  body: formData,
});
```

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=3001
NODE_ENV=development
DATABASE_PATH=./database/artspark.db
MAX_FILE_SIZE=10485760
UPLOAD_PATH=../public/uploads
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
API_PREFIX=/api
```

## 🧪 Testing

Test the API health:

```bash
curl http://localhost:3001/health
```

Expected response:

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## 📝 Logging

The server includes comprehensive activity logging:

- Request logging middleware
- Database operation logs
- Error tracking
- User activity monitoring

Access logs through the admin API:

```bash
GET /api/admin/logs?level=error&category=artwork&limit=50
```

## 🛠️ Development

### Run in development mode with auto-reload:

```bash
npm run dev
```

### Database Management

Reset the database (delete and recreate):

```bash
rm database/artspark.db
npm start  # Will recreate with fresh data
```

## 📊 Sample Data

The database is initialized with 3 sample artworks on first run. You can modify the sample data in `database/init.js`.

## 🤝 Integration with Frontend

The frontend React application should connect to this API. Update the API base URL in your frontend configuration:

```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```

## 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Success responses:

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "message": "Operation successful"
}
```

## 📦 Dependencies

- **express**: Web framework
- **cors**: CORS middleware
- **dotenv**: Environment variables
- **sqlite3**: SQLite database driver
- **sqlite**: Promise-based SQLite wrapper
- **multer**: File upload handling

## 🔄 API Versioning

Current version: v1 (no prefix)

Future versions will use: `/api/v2/...`

## 📞 Support

For issues or questions, check the main project README or create an issue on the repository.

## ⚡ Performance Tips

1. Database indexes are automatically created for common queries
2. Use query parameters for filtering to reduce data transfer
3. Images are served statically for optimal performance
4. Consider pagination for large datasets

---

Built with ❤️ for ArtSpark Studio Canvas

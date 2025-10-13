# ArtSpark Studio Backend API

Backend server for the ArtSpark Studio Canvas application.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values as needed

3. Start the server:

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## API Endpoints

### Artworks
- `GET /api/artworks` - Get all artworks
- `GET /api/artworks/:id` - Get single artwork
- `POST /api/artworks` - Create new artwork
- `PUT /api/artworks/:id` - Update artwork
- `DELETE /api/artworks/:id` - Delete artwork

### Reviews
- `GET /api/reviews/artwork/:artworkId` - Get reviews for an artwork
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Ratings
- `GET /api/ratings/artwork/:artworkId` - Get ratings for an artwork
- `POST /api/ratings` - Submit rating
- `PUT /api/ratings/:id` - Update rating

### Contact
- `POST /api/contact` - Send general contact message
- `POST /api/contact/inquiry` - Send artwork inquiry
- `POST /api/contact/purchase` - Send purchase request

### Admin
- `POST /api/admin/login` - Admin login
- `POST /api/admin/verify` - Verify token
- `POST /api/admin/logout` - Admin logout

## Environment Variables

See `.env.example` for all available configuration options.

## Database Integration

The current implementation uses placeholder data. To integrate with a database:

1. Install your database driver (e.g., `mongoose` for MongoDB, `pg` for PostgreSQL)
2. Create database models/schemas
3. Replace the TODO comments in route files with actual database queries

## Security Notes

⚠️ **Important for Production:**

1. Change default admin credentials
2. Use environment variables for sensitive data
3. Implement proper JWT authentication
4. Add rate limiting
5. Use HTTPS
6. Validate and sanitize all inputs
7. Implement proper error handling
8. Add authentication middleware for protected routes


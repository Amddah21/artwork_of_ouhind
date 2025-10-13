# Backend API Integration Guide

Complete guide for integrating the frontend with the backend API.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies (frontend and backend)
npm run install:all

# Or install separately
npm install                    # Frontend
cd server && npm install      # Backend
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

Create a `.env` file in the `server` directory:

```env
PORT=3001
NODE_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 3. Run the Application

**Option A: Run Both Frontend and Backend Together**
```bash
npm run full-stack
```

**Option B: Run Separately**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

The frontend will run on `http://localhost:5173`  
The backend API will run on `http://localhost:3001`

## 📁 Project Structure

```
artspark-studio-canvas/
├── src/
│   ├── services/
│   │   └── api.ts              # API service layer
│   ├── lib/
│   │   └── api-config.ts       # API configuration
│   └── examples/
│       └── api-usage-example.tsx  # Usage examples
├── server/
│   ├── index.js                # Main server file
│   ├── routes/                 # API route handlers
│   │   ├── artwork.routes.js
│   │   ├── review.routes.js
│   │   ├── rating.routes.js
│   │   ├── contact.routes.js
│   │   └── admin.routes.js
│   └── package.json
└── .env                        # Environment variables
```

## 🔌 API Services

### Available Services

#### 1. Artwork Service
```typescript
import { artworkService } from '@/services/api';

// Get all artworks
const response = await artworkService.getAll();

// Get single artwork
const response = await artworkService.getById('artwork-id');

// Create artwork
const response = await artworkService.create({
  title: 'New Artwork',
  description: 'Description',
  imageUrl: '/path/to/image.jpg',
  price: 1000
});

// Update artwork
const response = await artworkService.update('artwork-id', { title: 'Updated Title' });

// Delete artwork
const response = await artworkService.delete('artwork-id');
```

#### 2. Review Service
```typescript
import { reviewService } from '@/services/api';

// Get reviews for artwork
const response = await reviewService.getByArtwork('artwork-id');

// Create review
const response = await reviewService.create({
  artworkId: 'artwork-id',
  userName: 'John Doe',
  content: 'Great artwork!'
});
```

#### 3. Rating Service
```typescript
import { ratingService } from '@/services/api';

// Get ratings for artwork
const response = await ratingService.getByArtwork('artwork-id');

// Submit rating
const response = await ratingService.submit({
  artworkId: 'artwork-id',
  rating: 5
});
```

#### 4. Contact Service
```typescript
import { contactService } from '@/services/api';

// Send contact message
const response = await contactService.send({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello!'
});

// Send artwork inquiry
const response = await contactService.sendInquiry({
  artworkId: 'artwork-id',
  email: 'john@example.com',
  message: 'Interested in this artwork'
});

// Send purchase request
const response = await contactService.sendPurchaseRequest({
  artworkId: 'artwork-id',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890'
});
```

#### 5. Admin Service
```typescript
import { adminService } from '@/services/api';

// Login
const response = await adminService.login({
  username: 'admin',
  password: 'password'
});

// Verify token
const response = await adminService.verify('token-here');

// Logout
const response = await adminService.logout();
```

## 📝 Response Format

All API responses follow this format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

## 🎯 Using in Components

### Basic Usage

```typescript
import { useState, useEffect } from 'react';
import { artworkService } from '@/services/api';

function ArtworkList() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      const response = await artworkService.getAll();
      
      if (response.success) {
        setArtworks(response.data);
      }
      
      setLoading(false);
    };

    fetchArtworks();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {artworks.map(artwork => (
        <div key={artwork.id}>{artwork.title}</div>
      ))}
    </div>
  );
}
```

### With React Query (Recommended)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { artworkService } from '@/services/api';

function ArtworkList() {
  // Fetch artworks
  const { data: artworks, isLoading } = useQuery({
    queryKey: ['artworks'],
    queryFn: async () => {
      const response = await artworkService.getAll();
      if (!response.success) throw new Error(response.error);
      return response.data;
    }
  });

  // Create artwork mutation
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: (artwork) => artworkService.create(artwork),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => createMutation.mutate({ title: 'New Artwork' })}>
        Add Artwork
      </button>
      {artworks?.map(artwork => (
        <div key={artwork.id}>{artwork.title}</div>
      ))}
    </div>
  );
}
```

## 🔒 Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Change default admin credentials** in production
3. **Use HTTPS** in production
4. **Implement proper authentication** - Add JWT tokens
5. **Validate all inputs** on both frontend and backend
6. **Add rate limiting** to prevent abuse
7. **Sanitize user inputs** to prevent XSS attacks

## 🗄️ Database Integration

The backend currently uses placeholder data. To integrate a database:

### MongoDB Example

```bash
cd server
npm install mongoose
```

```javascript
// server/config/database.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
```

### PostgreSQL Example

```bash
cd server
npm install pg
```

```javascript
// server/config/database.js
import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
```

## 📧 Email Integration

For contact forms, integrate an email service:

### Using Nodemailer

```bash
cd server
npm install nodemailer
```

```javascript
// server/config/email.js
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
```

## 🧪 Testing the API

### Using cURL

```bash
# Get all artworks
curl http://localhost:3001/api/artworks

# Create artwork
curl -X POST http://localhost:3001/api/artworks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Artwork","price":500}'

# Submit review
curl -X POST http://localhost:3001/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"artworkId":"1","userName":"John","content":"Great!"}'
```

### Using the Browser

Navigate to `http://localhost:3001/health` to check if the server is running.

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill
```

### CORS Issues
Make sure the backend has CORS enabled (already configured in `server/index.js`)

### API Not Responding
1. Check if the backend server is running
2. Verify the `VITE_API_BASE_URL` in `.env`
3. Check browser console for errors
4. Verify the API endpoint exists

## 📚 Additional Resources

- See `src/examples/api-usage-example.tsx` for more code examples
- Check `server/README.md` for backend-specific documentation
- Refer to Express.js documentation for advanced routing
- TanStack Query documentation for data fetching patterns

## 🎉 Next Steps

1. ✅ Set up database (MongoDB, PostgreSQL, etc.)
2. ✅ Implement proper authentication with JWT
3. ✅ Add email service for contact forms
4. ✅ Implement file upload for artwork images
5. ✅ Add input validation and sanitization
6. ✅ Set up logging and monitoring
7. ✅ Deploy to production (Vercel, Railway, etc.)


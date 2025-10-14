import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import artworkRoutes from './routes/artwork.routes.js';
import reviewRoutes from './routes/review.routes.js';
import ratingRoutes from './routes/rating.routes.js';
import contactRoutes from './routes/contact.routes.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import { initializeDatabase } from './database/db.js';
import { initializeTables } from './database/init.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/artworks', artworkRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database
    console.log('🔄 Initializing database...');
    await initializeDatabase();
    await initializeTables();
    console.log('✅ Database ready');
    
    // Start server
    app.listen(PORT, () => {
      console.log('');
      console.log('🎨 =====================================');
      console.log('   ArtSpark Studio Canvas Backend');
      console.log('   =====================================');
      console.log(`   ✅ Server running: http://localhost:${PORT}`);
      console.log(`   📡 API endpoint: http://localhost:${PORT}/api`);
      console.log(`   🗄️  Database: SQLite (artspark.db)`);
      console.log(`   📁 Uploads: ${path.join(__dirname, '../public/uploads')}`);
      console.log('   =====================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;


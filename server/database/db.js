import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

let pool = null;

export async function initializeDatabase() {
  if (pool) return pool;

  try {
    // Use local PostgreSQL or fallback to a simple in-memory setup
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/artspark_studio';
    
    pool = new Pool({
      connectionString: connectionString,
      ssl: false // Disable SSL for local development
    });

    // Test the connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    console.log('✅ PostgreSQL database connection established');
    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('💡 Using in-memory database for demo purposes');
    
    // Create a mock database object for demo
    pool = {
      isMock: true,
      query: async (text, params) => {
        console.log('Mock query:', text, params);
        // Return mock data for authentication
        if (text.includes('SELECT * FROM users WHERE email')) {
          return {
            rows: [{
              id: 1,
              email: 'omhind53@gmail.com',
              password_hash: '$2b$10$rQ8K8K8K8K8K8K8K8K8K8O8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K',
              first_name: 'Oum Hind',
              last_name: 'Douirani',
              role: 'admin',
              is_active: true
            }]
          };
        }
        if (text.includes('UPDATE users SET last_login')) {
          return { rows: [] };
        }
        if (text.includes('SELECT * FROM artworks')) {
          return { rows: [] };
        }
        return { rows: [] };
      },
      run: async (text, params) => {
        console.log('Mock run:', text, params);
        return { lastID: Date.now() };
      },
      all: async (text, params) => {
        console.log('Mock all:', text, params);
        return [];
      },
      get: async (text, params) => {
        console.log('Mock get:', text, params);
        return null;
      },
      connect: async () => ({
        query: async (text, params) => pool.query(text, params),
        release: () => {}
      })
    };

    console.log('✅ Mock database ready for demo');
    return pool;
  }
}

export async function getDatabase() {
  if (!pool) {
    pool = await initializeDatabase();
  }
  return pool;
}

export default { initializeDatabase, getDatabase };


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
          return { 
            rows: [
              {
                id: 1,
                title: 'Rêve Aquarelle',
                description: 'Une œuvre délicate capturant l\'essence des rêves à travers des couleurs fluides et éthérées.',
                year: 2023,
                medium: 'Aquarelle sur papier Arches',
                dimensions: '40 x 60 cm',
                category: 'Aquarelle',
                price: 450,
                is_available: 1,
                image_url: '/artwork1.JPG',
                story: 'Cette pièce a été créée pendant une période de réflexion profonde sur les rêves et la réalité. Les couleurs fluides représentent la nature éphémère de nos pensées nocturnes.',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              {
                id: 2,
                title: 'Portrait au Crayon',
                description: 'Un portrait expressif capturant l\'émotion et la personnalité du sujet.',
                year: 2023,
                medium: 'Crayon graphite sur papier Bristol',
                dimensions: '30 x 40 cm',
                category: 'Portrait',
                price: 320,
                is_available: 1,
                image_url: '/artwork2.JPG',
                story: 'Ce portrait est le résultat de plusieurs heures d\'observation minutieuse, cherchant à capturer non seulement les traits physiques mais aussi l\'essence de la personne.',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              {
                id: 3,
                title: 'Étude au Fusain',
                description: 'Une étude atmosphérique jouant avec les lumières et les ombres.',
                year: 2023,
                medium: 'Fusain sur papier kraft',
                dimensions: '50 x 70 cm',
                category: 'Fusain',
                price: 380,
                is_available: 1,
                image_url: '/artwork3.JPG',
                story: 'Le fusain offre une liberté unique dans l\'exploration des contrastes. Cette pièce explore la danse entre lumière et obscurité.',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              {
                id: 4,
                title: 'Harmonie Colorée',
                description: 'Une composition abstraite explorant les relations entre les couleurs et les formes.',
                year: 2024,
                medium: 'Acrylique sur toile',
                dimensions: '60 x 80 cm',
                category: 'Abstrait',
                price: 520,
                is_available: 1,
                image_url: '/artwork4.JPG',
                story: 'Cette œuvre abstraite est née d\'une exploration intuitive des couleurs et de leurs interactions. Chaque coup de pinceau révèle une nouvelle harmonie.',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              {
                id: 5,
                title: 'Expression de l\'Âme',
                description: 'L\'art est l\'expression de l\'âme à travers la couleur et la forme.',
                year: 2025,
                medium: 'Techniques mixtes sur toile',
                dimensions: '70 x 90 cm',
                category: 'Abstrait',
                price: 0,
                is_available: 1,
                image_url: '/artwork5.JPG',
                story: 'Cette œuvre incarne la philosophie artistique : "L\'art est l\'expression de l\'âme à travers la couleur et la forme." Chaque coup de pinceau révèle une émotion.',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              {
                id: 6,
                title: 'Textures Organiques',
                description: 'Une exploration des textures naturelles et des formations géologiques.',
                year: 2025,
                medium: 'Techniques mixtes sur papier',
                dimensions: '80 x 100 cm',
                category: 'Abstrait',
                price: 0,
                is_available: 1,
                image_url: '/artwork6.JPG',
                story: 'Cette œuvre explore les profondeurs des textures naturelles, évoquant les formations géologiques et les processus d\'érosion.',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              {
                id: 7,
                title: 'Galerie d\'Art',
                description: 'Une vue intérieure d\'une galerie d\'art élégante.',
                year: 2025,
                medium: 'Photographie numérique',
                dimensions: '60 x 80 cm',
                category: 'Photographie',
                price: 0,
                is_available: 1,
                image_url: '/slider2.JPG',
                story: 'Cette photographie capture l\'essence d\'un espace d\'exposition professionnel, où la lumière naturelle révèle la beauté des œuvres d\'art.',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ]
          };
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


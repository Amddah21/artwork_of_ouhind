import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabase } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeTables() {
  try {
    const pool = await getDatabase();
    
    // Check if this is a mock database
    if (pool.query && typeof pool.query === 'function' && pool.query.toString().includes('Mock query')) {
      console.log('✅ Mock database tables ready (demo mode)');
      return true;
    }
    
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }
    
    console.log('✅ Database tables initialized successfully');
    
    // Insert sample data if tables are empty
    await insertSampleData(pool);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize database tables:', error);
    console.log('💡 Using mock database for demo purposes');
    return true;
  }
}

async function insertSampleData(pool) {
  try {
    // Check if this is a mock database
    if (pool.query && typeof pool.query === 'function' && pool.query.toString().includes('Mock query')) {
      console.log('✅ Mock sample data ready (demo mode)');
      return;
    }
    
    // Check if we already have data
    const result = await pool.query('SELECT COUNT(*) as count FROM artworks');
    const artworkCount = result.rows[0];
    
    if (parseInt(artworkCount.count) === 0) {
      console.log('📝 Inserting sample artworks...');
      
      // Insert sample artworks
      const sampleArtworks = [
        {
          title: 'Rêve Aquarelle',
          description: 'Une œuvre délicate capturant l\'essence des rêves à travers des couleurs fluides et éthérées.',
          year: 2023,
          medium: 'Aquarelle sur papier Arches',
          dimensions: '40 x 60 cm',
          category: 'Aquarelle',
          price: 450,
          is_available: 1,
          image_url: '/artwork1.JPG',
          story: 'Cette pièce a été créée pendant une période de réflexion profonde sur les rêves et la réalité. Les couleurs fluides représentent la nature éphémère de nos pensées nocturnes.'
        },
        {
          title: 'Portrait au Crayon',
          description: 'Un portrait expressif capturant l\'émotion et la personnalité du sujet.',
          year: 2023,
          medium: 'Crayon graphite sur papier Bristol',
          dimensions: '30 x 40 cm',
          category: 'Portrait',
          price: 320,
          is_available: 1,
          image_url: '/artwork2.JPG',
          story: 'Ce portrait est le résultat de plusieurs heures d\'observation minutieuse, cherchant à capturer non seulement les traits physiques mais aussi l\'essence de la personne.'
        },
        {
          title: 'Étude au Fusain',
          description: 'Une étude atmosphérique jouant avec les lumières et les ombres.',
          year: 2023,
          medium: 'Fusain sur papier kraft',
          dimensions: '50 x 70 cm',
          category: 'Fusain',
          price: 380,
          is_available: 1,
          image_url: '/artwork3.JPG',
          story: 'Le fusain offre une liberté unique dans l\'exploration des contrastes. Cette pièce explore la danse entre lumière et obscurité.'
        }
      ];
      
      for (const artwork of sampleArtworks) {
        const result = await pool.query(
          `INSERT INTO artworks (title, description, year, medium, dimensions, category, price, is_available, image_url, story)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
          [
            artwork.title,
            artwork.description,
            artwork.year,
            artwork.medium,
            artwork.dimensions,
            artwork.category,
            artwork.price,
            artwork.is_available,
            artwork.image_url,
            artwork.story
          ]
        );
        
        // Add tags for each artwork
        const artworkId = result.rows[0].id;
        const tags = artwork.category === 'Aquarelle' 
          ? ['aquarelle', 'abstrait', 'coloré']
          : artwork.category === 'Portrait'
          ? ['portrait', 'réaliste', 'graphite']
          : ['fusain', 'monochrome', 'atmosphérique'];
        
        for (const tag of tags) {
          await pool.query(
            'INSERT INTO artwork_tags (artwork_id, tag) VALUES ($1, $2)',
            [artworkId, tag]
          );
        }
      }
      
      console.log('✅ Sample artworks inserted successfully');
      
      // Log the initialization
      await pool.query(
        `INSERT INTO activity_logs (level, category, message, details)
         VALUES ($1, $2, $3, $4)`,
        ['info', 'system', 'Database initialized with sample data', JSON.stringify({ artworks: sampleArtworks.length })]
      );
    }
  } catch (error) {
    console.error('❌ Failed to insert sample data:', error);
  }
}

export default { initializeTables };


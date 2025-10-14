#!/usr/bin/env node

/**
 * Database Setup Script for ArtSpark Studio Canvas
 * 
 * This script helps you set up the PostgreSQL database
 * Run: node setup-database.js
 */

import { createConnection } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function setupDatabase() {
  console.log('🎨 ArtSpark Studio Canvas - Database Setup');
  console.log('==========================================\n');

  // Get database connection details
  const dbConfig = {
    host: process.env.SUPABASE_DB_HOST || 'db.iczgbndbdsycfqanoajv.supabase.co',
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // Connect to default postgres database first
    user: process.env.DB_USER || 'postgres',
    password: process.env.SUPABASE_DB_PASSWORD || process.env.DB_PASSWORD || prompt('Enter Supabase database password: '),
    ssl: { rejectUnauthorized: false } // Supabase requires SSL
  };

  console.log('📋 Supabase Database Configuration:');
  console.log(`   Host: ${dbConfig.host}`);
  console.log(`   Port: ${dbConfig.port}`);
  console.log(`   User: ${dbConfig.user}`);
  console.log(`   Database: postgres (Supabase managed)\n`);

  try {
    // Step 1: Connect to Supabase PostgreSQL server
    console.log('🔌 Connecting to Supabase PostgreSQL server...');
    const client = createConnection(dbConfig);
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL server\n');

    // Step 2: Check if schema exists (Supabase uses postgres database)
    console.log('🔍 Checking if tables exist...');
    const tableCheckResult = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'artworks'"
    );
    
    if (tableCheckResult.rows.length > 0) {
      console.log('ℹ️  Tables already exist in Supabase database');
      
      // Ask if user wants to recreate
      const recreate = process.argv.includes('--recreate');
      if (recreate) {
        console.log('🗑️  Dropping existing tables...');
        await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
        console.log('✅ Tables dropped\n');
      } else {
        console.log('ℹ️  Using existing tables. Use --recreate to drop and recreate.\n');
      }
    }

    // Step 3: Use the existing connection (Supabase manages the database)
    console.log('🔌 Using Supabase postgres database...');
    const artClient = client;
    console.log('✅ Connected to Supabase postgres database\n');

    // Step 4: Create tables
    console.log('📋 Creating database tables...');
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await artClient.query(statement);
        } catch (error) {
          console.warn(`⚠️  Warning: ${error.message}`);
        }
      }
    }
    
    console.log('✅ Database tables created successfully\n');

    // Step 5: Insert sample data
    console.log('📝 Inserting sample data...');
    
    // Check if we already have data
    const artworkCountResult = await artClient.query('SELECT COUNT(*) as count FROM artworks');
    const artworkCount = parseInt(artworkCountResult.rows[0].count);
    
    if (artworkCount === 0) {
      const sampleArtworks = [
        {
          title: 'Rêve Aquarelle',
          description: 'Une œuvre délicate capturant l\'essence des rêves à travers des couleurs fluides et éthérées.',
          year: 2023,
          medium: 'Aquarelle sur papier Arches',
          dimensions: '40 x 60 cm',
          category: 'Aquarelle',
          price: 450,
          is_available: true,
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
          is_available: true,
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
          is_available: true,
          image_url: '/artwork3.JPG',
          story: 'Le fusain offre une liberté unique dans l\'exploration des contrastes. Cette pièce explore la danse entre lumière et obscurité.'
        }
      ];
      
      for (const artwork of sampleArtworks) {
        const result = await artClient.query(
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
          await artClient.query(
            'INSERT INTO artwork_tags (artwork_id, tag) VALUES ($1, $2)',
            [artworkId, tag]
          );
        }
      }
      
      console.log('✅ Sample artworks inserted successfully\n');
      
      // Log the initialization
      await artClient.query(
        `INSERT INTO activity_logs (level, category, message, details)
         VALUES ($1, $2, $3, $4)`,
        ['info', 'system', 'Database initialized with sample data', JSON.stringify({ artworks: sampleArtworks.length })]
      );
    } else {
      console.log(`ℹ️  Database already contains ${artworkCount} artworks\n`);
    }

    // Step 6: Close connection
    await artClient.end();

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your .env file with database credentials');
    console.log('2. Run: cd server && npm start');
    console.log('3. Visit: http://localhost:3001/health');
    console.log('\n✨ Your ArtSpark Studio Canvas database is ready!');

  } catch (error) {
    console.error('\n❌ Database setup failed:');
    console.error(error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your connection credentials');
    console.log('3. Ensure you have permission to create databases');
    console.log('4. Run with --recreate to drop existing database');
    process.exit(1);
  }
}

// Helper function to prompt for password if not provided
function prompt(question) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Run setup
setupDatabase();


const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://spionvuemjgnvjlesapp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaW9udnVlbWpnbnZqbGVzYXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDE1NTEsImV4cCI6MjA3NjkxNzU1MX0.qdgPAXb3fQPGd9xj_pKJhMtyq1ulDa01wdXFnXtliW4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkArtworks() {
  console.log('🔍 Checking current artworks in database...\n');
  
  try {
    // Check artworks table
    const { data: artworks, error: artworksError } = await supabase
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (artworksError) {
      console.error('❌ Error fetching artworks:', artworksError);
      return;
    }
    
    console.log(`📊 Total artworks in database: ${artworks.length}\n`);
    
    if (artworks.length === 0) {
      console.log('⚠️  No artworks found in database!');
      return;
    }
    
    // Display each artwork
    artworks.forEach((artwork, index) => {
      console.log(`🎨 Artwork ${index + 1}:`);
      console.log(`   ID: ${artwork.id}`);
      console.log(`   Title: ${artwork.title}`);
      console.log(`   Category: ${artwork.category}`);
      console.log(`   Year: ${artwork.year}`);
      console.log(`   Created: ${artwork.created_at}`);
      console.log(`   Views: ${artwork.views}`);
      console.log('');
    });
    
    // Check artwork_images table
    const { data: images, error: imagesError } = await supabase
      .from('artwork_images')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (imagesError) {
      console.error('❌ Error fetching images:', imagesError);
      return;
    }
    
    console.log(`🖼️  Total images in database: ${images.length}\n`);
    
    if (images.length > 0) {
      images.forEach((image, index) => {
        console.log(`   Image ${index + 1}:`);
        console.log(`     Artwork ID: ${image.artwork_id}`);
        console.log(`     Display Order: ${image.display_order}`);
        console.log(`     URL Length: ${image.image_url ? image.image_url.length : 0} characters`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkArtworks();

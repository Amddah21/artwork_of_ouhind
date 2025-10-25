const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://spionvuemjgnvjlesapp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaW9udnVlbWpnbnZqbGVzYXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDE1NTEsImV4cCI6MjA3NjkxNzU1MX0.qdgPAXb3fQPGd9xj_pKJhMtyq1ulDa01wdXFnXtliW4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAddSecondArtwork() {
  console.log('🧪 Testing adding a second artwork...\n');
  
  try {
    // Test artwork data
    const testArtwork = {
      title: 'Test Second Artwork',
      description: 'This is a test artwork to see if we can add a second one',
      category: 'Test',
      technique: 'Digital',
      size: '50x70 cm',
      year: 2025,
      available: true,
      featured: false,
      image_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1 pixel
      tags: ['test', 'second'],
      materials: ['digital'],
      artist_name: 'Test Artist'
    };
    
    console.log('📝 Attempting to insert artwork...');
    
    const { data, error } = await supabase
      .from('artworks')
      .insert([testArtwork])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error inserting artwork:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return;
    }
    
    console.log('✅ Artwork inserted successfully!');
    console.log('📊 New artwork ID:', data.id);
    console.log('📊 New artwork title:', data.title);
    
    // Now check total count
    const { data: artworks, error: countError } = await supabase
      .from('artworks')
      .select('id, title')
      .order('created_at', { ascending: false });
    
    if (countError) {
      console.error('❌ Error counting artworks:', countError);
      return;
    }
    
    console.log(`\n📊 Total artworks now: ${artworks.length}`);
    artworks.forEach((artwork, index) => {
      console.log(`   ${index + 1}. ${artwork.title} (${artwork.id})`);
    });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testAddSecondArtwork();

// Simple Supabase connection test
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://spionvuemjgnvjlesapp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaW9udnVlbWpnbnZqbGVzYXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDE1NTEsImV4cCI6MjA3NjkxNzU1MX0.qdgPAXb3fQPGd9xj_pKJhMtyq1ulDa01wdXFnXtliW4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  console.log('🔍 Testing Supabase database connection...');
  console.log('📡 URL:', supabaseUrl);
  console.log('🔑 Key:', supabaseKey ? '***' + supabaseKey.slice(-4) : 'undefined');
  
  try {
    // Test 1: Try to query the artworks table
    console.log('🎨 Testing artworks table...');
    const { data: artworksData, error: artworksError } = await supabase
      .from('artworks')
      .select('*')
      .limit(1);
    
    console.log('📋 Artworks query result:', { 
      data: artworksData, 
      error: artworksError?.message || null,
      count: artworksData?.length || 0
    });
    
    if (artworksError) {
      console.error('❌ Artworks table error:', artworksError.message);
      
      if (artworksError.message.includes('relation "public.artworks" does not exist')) {
        console.log('💡 The artworks table does not exist!');
        console.log('📝 You need to run the database schema in your Supabase dashboard.');
        console.log('📁 Run the SQL from: supabase/schema.sql');
        return { success: false, error: 'Database tables not created', needsSetup: true };
      }
    }
    
    // Test 2: Try to query the artwork_images table
    console.log('🖼️ Testing artwork_images table...');
    const { data: imagesData, error: imagesError } = await supabase
      .from('artwork_images')
      .select('*')
      .limit(1);
    
    console.log('📸 Images query result:', { 
      data: imagesData, 
      error: imagesError?.message || null,
      count: imagesData?.length || 0
    });
    
    if (imagesError) {
      console.error('❌ Artwork_images table error:', imagesError.message);
      
      if (imagesError.message.includes('relation "public.artwork_images" does not exist')) {
        console.log('💡 The artwork_images table does not exist!');
        console.log('📝 You need to run the multiple images schema in your Supabase dashboard.');
        console.log('📁 Run the SQL from: supabase/multiple_images_schema.sql');
        return { success: false, error: 'Images table not created', needsSetup: true };
      }
    }
    
    console.log('✅ Database connection successful!');
    console.log('📊 Found', artworksData?.length || 0, 'artworks and', imagesData?.length || 0, 'images');
    return { success: true, artworks: artworksData?.length || 0, images: imagesData?.length || 0 };
    
  } catch (error) {
    console.error('💥 Database test failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Run the test
testDatabaseConnection().then(result => {
  console.log('🏁 Final result:', result);
  process.exit(result.success ? 0 : 1);
});

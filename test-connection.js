// Quick Supabase connection test
const testConnection = async () => {
  const supabaseUrl = 'https://aogxcbkfggfnvofavohp.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZ3hjYmtmZ2dmbnZvZmF2b2hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MTMxNDUsImV4cCI6MjA3NjI4OTE0NX0.nDKVGgjXIYJfAAkniUPkx4ckdDJJz21ogiC4A2IYVEc';
  
  console.log('Testing Supabase connection...');
  
  try {
    // Test basic connection
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    console.log('Connection test result:', response.status);
    
    // Test auth endpoint
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'omhind53@gmail.com',
        password: 'admin123'
      })
    });
    
    const authResult = await authResponse.json();
    console.log('Auth test result:', authResult);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testConnection();

// Quick Supabase connection test
const testConnection = async () => {
  const supabaseUrl = 'https://spionvuemjgnvjlesapp.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaW9udnVlbWpnbnZqbGVzYXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDE1NTEsImV4cCI6MjA3NjkxNzU1MX0.qdgPAXb3fQPGd9xj_pKJhMtyq1ulDa01wdXFnXtliW4';
  
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

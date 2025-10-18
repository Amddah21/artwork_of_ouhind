import React from 'react';

const DebugEnv = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '10px', 
      border: '1px solid #ccc',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <h4>Environment Debug:</h4>
      <p><strong>URL:</strong> {supabaseUrl ? '✅ Set' : '❌ Missing'}</p>
      <p><strong>Key:</strong> {supabaseKey ? '✅ Set' : '❌ Missing'}</p>
      <p><strong>URL Value:</strong> {supabaseUrl}</p>
    </div>
  );
};

export default DebugEnv;

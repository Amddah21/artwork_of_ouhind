// Test Supabase Connection
// Ce script teste si Supabase est correctement configuré

import { supabase } from './src/lib/supabase'

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  // Vérifier les variables d'environnement
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  console.log('📋 Environment variables:')
  console.log('  VITE_SUPABASE_URL:', supabaseUrl)
  console.log('  VITE_SUPABASE_ANON_KEY:', supabaseKey ? '***' + supabaseKey.slice(-4) : 'undefined')
  
  // Vérifier si les valeurs sont les valeurs par défaut
  if (supabaseUrl === 'https://your-project.supabase.co' || supabaseKey === 'your-anon-key') {
    console.log('❌ Supabase is using default values - localStorage will be used')
    console.log('📝 To fix: Create .env file with your real Supabase keys')
    return false
  }
  
  try {
    // Tester la connexion
    const { data, error } = await supabase.from('artworks').select('count').limit(1)
    
    if (error) {
      console.log('❌ Supabase connection failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    console.log('🎨 Artworks will be stored in database and visible on all devices')
    return true
    
  } catch (err) {
    console.log('❌ Supabase connection error:', err)
    return false
  }
}

// Exporter pour utilisation dans le navigateur
if (typeof window !== 'undefined') {
  window.testSupabaseConnection = testSupabaseConnection
}

export { testSupabaseConnection }

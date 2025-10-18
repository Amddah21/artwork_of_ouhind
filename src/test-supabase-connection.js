// Test Supabase connection and admin user
import { supabase } from '@/lib/api';

export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test 1: Check if Supabase is connected
    const { data, error } = await supabase.auth.getSession();
    console.log('📡 Supabase connection test:', { data, error });
    
    // Test 2: Try to sign in with admin credentials
    console.log('🔐 Testing admin login...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'omhind53@gmail.com',
      password: 'admin123'
    });
    
    console.log('🔑 Admin login result:', { signInData, signInError });
    
    if (signInError) {
      console.error('❌ Login failed:', signInError.message);
      return { success: false, error: signInError.message };
    }
    
    // Test 3: Check user profile
    if (signInData.user) {
      console.log('👤 User data:', signInData.user);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signInData.user.id)
        .single();
        
      console.log('📋 Profile data:', { profileData, profileError });
      
      if (profileError) {
        console.error('❌ Profile fetch failed:', profileError.message);
        return { success: false, error: `Profile error: ${profileError.message}` };
      }
      
      console.log('✅ Admin user test successful!');
      return { success: true, user: signInData.user, profile: profileData };
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error);
    return { success: false, error: error.message };
  }
  
  return { success: false, error: 'Unknown error' };
};

// Auto-run test when imported
testSupabaseConnection();

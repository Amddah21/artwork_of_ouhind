import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create mock client for development
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
    signUp: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
    signOut: () => Promise.resolve({ error: null })
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
    insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
    update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }),
    delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
    upsert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) })
  }),
  rpc: () => Promise.resolve({ error: null })
});

// Export the appropriate client
export const supabase = (!supabaseUrl || !supabaseAnonKey) 
  ? createMockClient() as any
  : createClient(supabaseUrl, supabaseAnonKey);

// Log warning if Supabase is not configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase not configured. Using mock client for development.');
}
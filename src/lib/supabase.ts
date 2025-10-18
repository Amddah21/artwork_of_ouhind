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

// Log warning if using mock client
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set. Using mock client for development.');
}

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      artworks: {
        Row: {
          id: string
          title: string
          category: string
          image_url: string
          size: string
          year: number
          available: boolean
          description: string
          featured: boolean
          tags: string[]
          materials: string[]
          technique: string | null
          artist_name: string | null
          price_mad: string | null
          price_eur: string | null
          reference: string | null
          support: string | null
          medium: string | null
          dimensions: string | null
          story: string | null
          views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          category: string
          image_url: string
          size: string
          year: number
          available?: boolean
          description: string
          featured?: boolean
          tags?: string[]
          materials?: string[]
          technique?: string | null
          artist_name?: string | null
          price_mad?: string | null
          price_eur?: string | null
          reference?: string | null
          support?: string | null
          medium?: string | null
          dimensions?: string | null
          story?: string | null
          views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string
          image_url?: string
          size?: string
          year?: number
          available?: boolean
          description?: string
          featured?: boolean
          tags?: string[]
          materials?: string[]
          technique?: string | null
          artist_name?: string | null
          price_mad?: string | null
          price_eur?: string | null
          reference?: string | null
          support?: string | null
          medium?: string | null
          dimensions?: string | null
          story?: string | null
          views?: number
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          artwork_id: string
          user_name: string
          user_email: string
          rating: number
          comment: string
          helpful: number
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          artwork_id: string
          user_name: string
          user_email: string
          rating: number
          comment: string
          helpful?: number
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          artwork_id?: string
          user_name?: string
          user_email?: string
          rating?: number
          comment?: string
          helpful?: number
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          artwork_id: string
          user_id: string
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          artwork_id: string
          user_id: string
          rating: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          artwork_id?: string
          user_id?: string
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          read?: boolean
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          artwork_id: string
          user_name: string
          user_email: string
          comment: string
          approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          artwork_id: string
          user_name: string
          user_email: string
          comment: string
          approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          artwork_id?: string
          user_name?: string
          user_email?: string
          comment?: string
          approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

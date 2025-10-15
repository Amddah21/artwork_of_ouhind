import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iczgbndbdsycfqanoajv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljemdibmRiZHN5Y2ZxYW5vYWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODIxNDEsImV4cCI6MjA3NTk1ODE0MX0.VrWaw2KzSki6oWOnXttq47ZDK5FEABsomL3g8tEg3GY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Artwork {
  id: number
  titre: string
  description: string
  image_url: string
  technique?: string
  dimensions?: string
  annee?: number
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  username: string
  email: string
  password: string
  role: string
  created_at: string
}

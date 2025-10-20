// 🔧 API CONFIGURATION
// Configuration pour Supabase Backend

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔧 Supabase API Config:', { 
  url: supabaseUrl, 
  keyExists: !!supabaseKey,
  keyLength: supabaseKey?.length 
});

// Create mock client for development if env vars are missing
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
    signUp: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null })
  },
  from: () => ({
    select: () => ({ 
      eq: () => ({ 
        single: () => Promise.resolve({ data: null, error: null }),
        order: () => Promise.resolve({ data: null, error: null }),
        limit: () => Promise.resolve({ data: null, error: null })
      }),
      order: () => Promise.resolve({ data: null, error: null }),
      limit: () => Promise.resolve({ data: null, error: null })
    }),
    insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
    update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }),
    delete: () => ({ eq: () => Promise.resolve({ error: null }), neq: () => Promise.resolve({ error: null }) }),
    upsert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) })
  }),
  rpc: () => Promise.resolve({ error: null })
});

// Export the appropriate client
export const supabase = (!supabaseUrl || !supabaseKey) 
  ? createMockClient() as any
  : createClient(supabaseUrl, supabaseKey);

// Types pour les données
export interface User {
  id: string
  email: string
  username?: string
  role?: 'admin' | 'user'
  created_at?: string
}

export interface Artwork {
  id: string
  title: string
  description: string
  category: string
  image_url: string
  images?: ArtworkImage[]
  size: string
  year: number
  available: boolean
  featured: boolean
  tags: string[]
  materials: string[]
  technique?: string
  artist_name?: string
  price_mad?: string
  price_eur?: string
  reference?: string
  support?: string
  medium?: string
  dimensions?: string
  created_at?: string
  updated_at?: string
}

export interface ArtworkImage {
  id: number
  artwork_id: string
  image_url: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  artwork_id: string
  user_name: string
  user_email: string
  rating: number
  comment: string
  helpful_count: number
  approved: boolean
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  responded: boolean
  created_at: string
  updated_at: string
}

// Services API
export class ApiService {
  // Authentification
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  // Œuvres d'art
  static async getArtworks() {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }

  static async getArtworkById(id: string) {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  static async createArtwork(artwork: Partial<Artwork>) {
    const { data, error } = await supabase
      .from('artworks')
      .insert([artwork])
      .select()
      .single()
    if (error) throw error
    return data
  }

  static async updateArtwork(id: string, updates: Partial<Artwork>) {
    const { data, error } = await supabase
      .from('artworks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  static async deleteArtwork(id: string) {
    const { error } = await supabase
      .from('artworks')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  // Images d'œuvres
  static async getArtworkImages(artworkId: string) {
    const { data, error } = await supabase
      .from('artwork_images')
      .select('*')
      .eq('artwork_id', artworkId)
      .order('display_order')
    if (error) throw error
    return data
  }

  static async uploadArtworkImage(artworkId: string, imageUrl: string, displayOrder: number = 0) {
    const { data, error } = await supabase
      .from('artwork_images')
      .insert([{
        artwork_id: artworkId,
        image_url: imageUrl,
        display_order: displayOrder
      }])
      .select()
      .single()
    if (error) throw error
    return data
  }

  // Commentaires/Avis
  static async getReviews(artworkId?: string) {
    let query = supabase.from('reviews').select('*')
    
    if (artworkId) {
      query = query.eq('artwork_id', artworkId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return data
  }

  static async createReview(review: Partial<Review>) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([review])
      .select()
      .single()
    if (error) throw error
    return data
  }

  static async approveReview(id: string) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ approved: true })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  static async deleteReview(id: string) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  // Messages de contact
  static async getContactMessages() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }

  static async createContactMessage(message: Partial<ContactMessage>) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([message])
      .select()
      .single()
    if (error) throw error
    return data
  }

  static async markContactAsRead(id: string) {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  static async markContactAsResponded(id: string) {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ responded: true })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  static async deleteContactMessage(id: string) {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  // Gallery functions
  static async getCategories() {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('category')
        .order('category')
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Get unique categories and count artworks for each
      const categoryMap = new Map<string, number>()
      data.forEach(artwork => {
        if (artwork.category) {
          const count = categoryMap.get(artwork.category) || 0
          categoryMap.set(artwork.category, count + 1)
        }
      })
      
      const categories = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count
      }))
      
      console.log('📊 [ApiService] Loaded categories:', categories);
      return categories;
    } catch (error) {
      console.error('Error in getCategories:', error);
      throw error;
    }
  }

  static async getArtworksByCategory(category: string) {
    try {
      if (!category) {
        console.warn('No category provided to getArtworksByCategory');
        return [];
      }

      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching artworks by category:', error);
        throw error;
      }
      
      console.log(`📊 [ApiService] Loaded ${data?.length || 0} artworks for category: ${category}`);
      return data || [];
    } catch (error) {
      console.error('Error in getArtworksByCategory:', error);
      throw error;
    }
  }

  static async getGalleryData(category: string) {
    try {
      if (!category) {
        console.warn('No category provided to getGalleryData');
        return null;
      }

      // Get the first artwork as featured image
      const { data: featuredData, error: featuredError } = await supabase
        .from('artworks')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
        .limit(1)
      
      if (featuredError) {
        console.error('Error fetching featured artwork:', featuredError);
        throw featuredError;
      }
      
      if (!featuredData || featuredData.length === 0) {
        console.log(`No artworks found for category: ${category}`);
        return null;
      }
      
      const featuredArtwork = featuredData[0];
      
      // Get total count for this category
      const { count, error: countError } = await supabase
        .from('artworks')
        .select('*', { count: 'exact', head: true })
        .eq('category', category);
      
      if (countError) {
        console.error('Error fetching artwork count:', countError);
        // Fallback to counting featured data
        const allArtworks = await this.getArtworksByCategory(category);
        var artworkCount = allArtworks.length;
      } else {
        var artworkCount = count || 0;
      }
      
      const galleryData = {
        id: category.toLowerCase().replace(/\s+/g, '-'),
        name: category,
        slug: category.toLowerCase().replace(/\s+/g, '-'),
        featuredImage: featuredArtwork.image_url || '/placeholder.jpg',
        description: this.generateGalleryDescription(category),
        artworkCount,
        year: featuredArtwork.year || new Date().getFullYear(),
        category: featuredArtwork.category
      };
      
      console.log('📊 [ApiService] Generated gallery data:', galleryData);
      return galleryData;
    } catch (error) {
      console.error('Error in getGalleryData:', error);
      throw error;
    }
  }

  static generateGalleryDescription(category: string): string {
    const descriptions: { [key: string]: string } = {
      'Portrait': 'Portraits expressifs capturant l\'émotion et la personnalité',
      'Abstrait': 'Collection d\'œuvres abstraites explorant les textures et les formes organiques',
      'Aquarelle': 'Œuvres délicates à l\'aquarelle explorant la fluidité des couleurs',
      'Photographie': 'Photographies artistiques capturant l\'essence des espaces',
      'Fusain': 'Études atmosphériques au fusain jouant avec les lumières et ombres',
      'Huile': 'Peintures à l\'huile riches en texture et en profondeur',
      'Mixte': 'Techniques mixtes combinant différents médiums artistiques',
      'Digital': 'Art numérique contemporain explorant les nouvelles technologies',
      'Sculpture': 'Sculptures tridimensionnelles exprimant le mouvement et la forme',
      'Dessin': 'Dessins au crayon et à l\'encre révélant la maîtrise du trait'
    };
    
    return descriptions[category] || `Collection d'œuvres ${category.toLowerCase()} explorant les différentes techniques et styles`;
  }
}
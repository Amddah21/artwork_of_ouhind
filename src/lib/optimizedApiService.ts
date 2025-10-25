import { supabase, withRetry, createOptimizedQuery } from './optimizedSupabase';

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

// Optimized API Service with connection pooling and caching
export class OptimizedApiService {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  // Request deduplication and rate limiting
  private static pendingRequests = new Map<string, Promise<any>>();
  private static lastRequestTime = new Map<string, number>();
  private static MIN_REQUEST_INTERVAL = 100; // Minimum 100ms between requests

  // Cache management
  private static getCachedData(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private static setCachedData(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private static clearCache(pattern?: string) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // Request deduplication and rate limiting
  private static async throttledRequest<T>(
    requestKey: string, 
    requestFn: () => Promise<T>
  ): Promise<T> {
    // Check if there's already a pending request for this key
    if (this.pendingRequests.has(requestKey)) {
      console.log(`🔄 [OptimizedApiService] Deduplicating request: ${requestKey}`);
      return this.pendingRequests.get(requestKey)!;
    }

    // Rate limiting - ensure minimum interval between requests
    const lastTime = this.lastRequestTime.get(requestKey) || 0;
    const timeSinceLastRequest = Date.now() - lastTime;
    
    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      const delay = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      console.log(`⏱️ [OptimizedApiService] Rate limiting: waiting ${delay}ms for ${requestKey}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Create and store the request promise
    const requestPromise = requestFn().finally(() => {
      // Clean up after request completes
      this.pendingRequests.delete(requestKey);
      this.lastRequestTime.set(requestKey, Date.now());
    });

    this.pendingRequests.set(requestKey, requestPromise);
    return requestPromise;
  }

  // Authentication
  static async signIn(email: string, password: string) {
    return withRetry(() => 
      supabase.auth.signInWithPassword({ email, password })
    );
  }

  static async signOut() {
    return withRetry(() => supabase.auth.signOut());
  }

  static async getCurrentUser() {
    return withRetry(() => supabase.auth.getUser());
  }

  // Optimized Artworks with caching and deduplication
  static async getArtworks() {
    const cacheKey = 'artworks_all';
    const requestKey = 'getArtworks';
    
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      console.log('📦 [OptimizedApiService] Returning cached artworks');
      return cached;
    }

    return this.throttledRequest(requestKey, async () => {
      console.log('🌐 [OptimizedApiService] Fetching artworks from Supabase...');
      
      const { data, error } = await withRetry(async () => {
        const result = await supabase
          .from('artworks')
          .select(`
            *,
            artwork_images (
              id,
              image_url,
              display_order
            )
          `)
          .order('created_at', { ascending: false });
        return result;
      });

      if (error) {
        console.error('❌ [OptimizedApiService] Error fetching artworks:', error);
        throw error;
      }

      const result = data || [];
      this.setCachedData(cacheKey, result);
      console.log(`✅ [OptimizedApiService] Fetched ${result.length} artworks`);
      return result;
    });
  }

  static async getArtworkById(id: string) {
    const cacheKey = `artwork_${id}`;
    const requestKey = `getArtworkById_${id}`;
    
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      console.log(`📦 [OptimizedApiService] Returning cached artwork: ${id}`);
      return cached;
    }

    return this.throttledRequest(requestKey, async () => {
      console.log(`🌐 [OptimizedApiService] Fetching artwork: ${id}`);
      
      const { data, error } = await withRetry(async () => {
        const result = await supabase
          .from('artworks')
          .select(`
            *,
            artwork_images (
              id,
              image_url,
              display_order
            )
          `)
          .eq('id', id)
          .single();
        return result;
      });

      if (error) {
        console.error(`❌ [OptimizedApiService] Error fetching artwork ${id}:`, error);
        throw error;
      }

      this.setCachedData(cacheKey, data);
      console.log(`✅ [OptimizedApiService] Fetched artwork: ${id}`);
      return data;
    });
  }

  static async createArtwork(artwork: Partial<Artwork>) {
    const { data, error } = await withRetry(async () => {
      const result = await supabase
        .from('artworks')
        .insert([artwork])
        .select()
        .single();
      return result;
    });

    if (error) {
      console.error('Error creating artwork:', error);
      throw error;
    }

    // Clear cache after creation
    this.clearCache('artworks');
    return data;
  }

  static async updateArtwork(id: string, updates: Partial<Artwork>) {
    const data = await withRetry(() => 
      supabase
        .from('artworks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    );

    // Clear cache after update
    this.clearCache('artworks');
    this.clearCache(`artwork_${id}`);
    return data;
  }

  static async deleteArtwork(id: string) {
    await withRetry(() => 
      supabase
        .from('artworks')
        .delete()
        .eq('id', id)
    );

    // Clear cache after deletion
    this.clearCache('artworks');
    this.clearCache(`artwork_${id}`);
  }

  // Optimized category queries
  static async getArtworksByCategory(category: string) {
    const cacheKey = `artworks_category_${category}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    const data = await withRetry(() => 
      supabase
        .from('artworks')
        .select(`
          *,
          artwork_images (
            id,
            image_url,
            display_order
          )
        `)
        .eq('category', category)
        .order('created_at', { ascending: false })
    );

    this.setCachedData(cacheKey, data);
    return data;
  }

  static async getCategories() {
    const cacheKey = 'categories';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    const data = await withRetry(async () => {
      const result = await supabase
        .from('artworks')
        .select('category')
        .order('category');
      return result;
    });

    if (!data || data.length === 0) {
      return [];
    }

    // Process categories
    const categoryMap = new Map<string, number>();
    data.forEach(artwork => {
      if (artwork.category) {
        const count = categoryMap.get(artwork.category) || 0;
        categoryMap.set(artwork.category, count + 1);
      }
    });

    const categories = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count
    }));

    this.setCachedData(cacheKey, categories);
    return categories;
  }

  static async getGalleryData(category: string) {
    const requestKey = `getGalleryData_${category}`;
    
    return this.throttledRequest(requestKey, async () => {
      console.log(`🌐 [OptimizedApiService] Fetching gallery data for: ${category}`);
      
      if (!category) {
        console.warn('No category provided to getGalleryData');
        return null;
      }

      // Get the first artwork as featured image
      const { data: featuredData, error: featuredError } = await withRetry(async () => {
        const result = await supabase
          .from('artworks')
          .select('*')
          .eq('category', category)
          .order('created_at', { ascending: false })
          .limit(1);
        return result;
      });
      
      if (featuredError) {
        console.error('Error fetching featured artwork:', featuredError);
        return null;
      }
      
      if (!featuredData || featuredData.length === 0) {
        console.log(`No artworks found for category: ${category}`);
        return null;
      }
      
      const featuredArtwork = featuredData[0];
      
      // Get total count for this category
      const { count, error: countError } = await withRetry(async () => {
        const result = await supabase
          .from('artworks')
          .select('*', { count: 'exact', head: true })
          .eq('category', category);
        return result;
      });
      
      let artworkCount: number;
      if (countError) {
        console.error('Error fetching artwork count:', countError);
        artworkCount = 1;
      } else {
        artworkCount = count || 0;
      }
      
      return {
        id: category.toLowerCase().replace(/\s+/g, '-'),
        name: category,
        slug: category.toLowerCase().replace(/\s+/g, '-'),
        featuredImage: featuredArtwork.image_url || '/placeholder.svg',
        description: `Collection d'œuvres ${category.toLowerCase()}`,
        artworkCount,
        year: new Date().getFullYear(),
        category,
        artworks: []
      };
    });
  }

  // Image management
  static async uploadArtworkImage(artworkId: string, imageUrl: string, displayOrder: number = 0) {
    const data = await withRetry(() => 
      supabase
        .from('artwork_images')
        .insert([{
          artwork_id: artworkId,
          image_url: imageUrl,
          display_order: displayOrder
        }])
        .select()
        .single()
    );

    // Clear related caches
    this.clearCache(`artwork_${artworkId}`);
    this.clearCache('artworks');
    return data;
  }

  // Reviews
  static async getReviews(artworkId?: string) {
    const cacheKey = artworkId ? `reviews_${artworkId}` : 'reviews_all';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    let query = supabase.from('reviews').select('*');
    
    if (artworkId) {
      query = query.eq('artwork_id', artworkId);
    }
    
    const data = await withRetry(() => 
      query.order('created_at', { ascending: false })
    );

    this.setCachedData(cacheKey, data);
    return data;
  }

  static async createReview(review: Partial<Review>) {
    const data = await withRetry(() => 
      supabase
        .from('reviews')
        .insert([review])
        .select()
        .single()
    );

    // Clear reviews cache
    this.clearCache('reviews');
    return data;
  }

  // Contact messages
  static async getContactMessages() {
    const cacheKey = 'contact_messages';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    const data = await withRetry(() => 
      supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
    );

    this.setCachedData(cacheKey, data);
    return data;
  }

  static async createContactMessage(message: Partial<ContactMessage>) {
    const data = await withRetry(() => 
      supabase
        .from('contact_messages')
        .insert([message])
        .select()
        .single()
    );

    // Clear contact messages cache
    this.clearCache('contact_messages');
    return data;
  }

  // Utility methods
  static async incrementViews(artworkId: string) {
    try {
      await withRetry(() => 
        supabase.rpc('increment_views', { artwork_id: artworkId })
      );
    } catch (error) {
      // Fallback to direct update
      await withRetry(() => 
        supabase
          .from('artworks')
          .update({ views: supabase.raw('views + 1') })
          .eq('id', artworkId)
      );
    }

    // Clear cache for this artwork
    this.clearCache(`artwork_${artworkId}`);
  }

  // Batch operations for better performance
  static async batchCreateArtworks(artworks: Partial<Artwork>[]) {
    const data = await withRetry(() => 
      supabase
        .from('artworks')
        .insert(artworks)
        .select()
    );

    // Clear artworks cache
    this.clearCache('artworks');
    return data;
  }

  // Health check
  static async healthCheck() {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('id')
        .limit(1);
      
      return { healthy: !error, error };
    } catch (error) {
      return { healthy: false, error };
    }
  }
}

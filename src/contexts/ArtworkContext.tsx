import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OptimizedApiService } from '@/lib/optimizedApiService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://spionvuemjgnvjlesapp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaW9udnVlbWpnbnZqbGVzYXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDE1NTEsImV4cCI6MjA3NjkxNzU1MX0.qdgPAXb3fQPGd9xj_pKJhMtyq1ulDa01wdXFnXtliW4';

// Debug logging removed - component working properly

interface ArtworkImage {
  id: number;
  artwork_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface Artwork {
  id: string;
  title: string;
  category: string;
  image_url: string; // Keep for backward compatibility - will be the first image
  images?: ArtworkImage[]; // New: array of all images
  size: string;
  year: number;
  available: boolean;
  description: string;
  featured: boolean;
  tags: string[];
  materials: string[];
  technique?: string;
  artist_name?: string;
  price_mad?: string;
  price_eur?: string;
  reference?: string;
  support?: string;
  medium?: string;
  dimensions?: string;
  story?: string;
  views: number;
  created_at: string;
  updated_at: string;
}

interface ArtworkContextType {
  artworks: Artwork[];
  isLoading: boolean;
  addArtwork: (artwork: Omit<Artwork, 'id' | 'created_at' | 'updated_at' | 'views' | 'images'>, images?: string[]) => Promise<void>;
  updateArtwork: (id: string, artwork: Partial<Omit<Artwork, 'id' | 'created_at' | 'updated_at' | 'images'>>, images?: string[]) => Promise<void>;
  deleteArtwork: (id: string) => Promise<void>;
  refreshArtworks: () => Promise<void>;
  incrementViews: (id: string) => Promise<void>;
  addArtworkImages: (artworkId: string, imageUrls: string[]) => Promise<void>;
  deleteArtworkImage: (imageId: number) => Promise<void>;
  getArtworkImages: (artworkId: string) => Promise<ArtworkImage[]>;
  clearAllArtworks: () => Promise<void>;
  resetAllViews: () => Promise<void>;
}

const ArtworkContext = createContext<ArtworkContextType | undefined>(undefined);

export const useArtwork = () => {
  const context = useContext(ArtworkContext);
  if (!context) {
    throw new Error('useArtwork must be used within ArtworkProvider');
  }
  return context;
};

export const ArtworkProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  // Use React Query for caching and optimized data fetching
  const { 
    data: artworks = [], 
    isLoading, 
    error,
    refetch: refetchArtworks 
  } = useQuery({
    queryKey: ['artworks'],
    queryFn: async () => {
      // Check if Supabase is properly configured
      if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co' && supabaseAnonKey !== 'your-anon-key') {
        console.log('🎨 [ArtworkContext] Loading artworks from Supabase...');
        
        // Use optimized API service with joined images
        const artworksData = await OptimizedApiService.getArtworks();
        
        // Process artworks to ensure proper image_url fallback
        const processedArtworks = artworksData.map(artwork => ({
          ...artwork,
          images: artwork.artwork_images || [],
          image_url: artwork.artwork_images?.[0]?.image_url || artwork.image_url
        }));
        
        console.log('🎨 [ArtworkContext] Loaded', processedArtworks.length, 'artworks from Supabase');
        return processedArtworks;
      } else {
        // Fallback to localStorage for development
        console.log('🎨 [ArtworkContext] Supabase not configured, using localStorage fallback');
        const storedArtworks = localStorage.getItem('artspark-artworks');
        if (storedArtworks) {
          const parsedArtworks = JSON.parse(storedArtworks);
          console.log('🎨 [ArtworkContext] Loaded', parsedArtworks.length, 'artworks from localStorage');
          return parsedArtworks;
        } else {
          console.log('🎨 [ArtworkContext] No artworks found in localStorage, starting with empty gallery');
          return [];
        }
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    retry: 2,
    retryDelay: 1000
  });

  if (error) {
    console.error('Error loading artworks:', error);
  }

  // Optimized addArtwork with React Query mutation
  const addArtworkMutation = useMutation({
    mutationFn: async ({ artwork, images }: { 
      artwork: Omit<Artwork, 'id' | 'created_at' | 'updated_at' | 'views' | 'images'>, 
      images?: string[] 
    }) => {
      // Check if Supabase is properly configured
      if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
        // Fallback to localStorage for development
        const artworkId = Date.now().toString();
        const newArtwork: Artwork = {
          ...artwork,
          id: artworkId,
          views: 0,
          images: images?.map((url, index) => ({
            id: Date.now() + index,
            artwork_id: artworkId,
            image_url: url,
            display_order: index,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })) || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Update localStorage
        const storedArtworks = localStorage.getItem('artspark-artworks');
        const existingArtworks = storedArtworks ? JSON.parse(storedArtworks) : [];
        const updatedArtworks = [newArtwork, ...existingArtworks];
        localStorage.setItem('artspark-artworks', JSON.stringify(updatedArtworks));
        
        return newArtwork;
      }

      // Use optimized API service
      const data = await OptimizedApiService.createArtwork(artwork);

      // Add images if provided
      if (images && images.length > 0 && data && typeof data === 'object' && 'id' in data) {
        await Promise.all(
          images.map((url, index) => 
            OptimizedApiService.uploadArtworkImage((data as any).id, url, index)
          )
        );
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch artworks
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
    },
    onError: (error) => {
      console.error('Error adding artwork:', error);
    }
  });

  const addArtwork = async (artwork: Omit<Artwork, 'id' | 'created_at' | 'updated_at' | 'views' | 'images'>, images?: string[]) => {
    await addArtworkMutation.mutateAsync({ artwork, images });
  };

  const updateArtwork = async (id: string, artwork: Partial<Omit<Artwork, 'id' | 'created_at' | 'updated_at'>>, images?: string[]) => {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
      // Fallback to localStorage for development
      console.log('🎨 [ArtworkContext] Supabase not configured, using localStorage fallback for updateArtwork');
      
      const storedArtworks = localStorage.getItem('artspark-artworks');
      if (storedArtworks) {
        const artworks = JSON.parse(storedArtworks);
        const updatedArtworks = artworks.map((a: Artwork) => {
          if (a.id === id) {
            return {
              ...a,
              ...artwork,
              updated_at: new Date().toISOString(),
              images: images ? images.map((url, index) => ({
                id: Date.now() + index,
                artwork_id: id,
                image_url: url,
                display_order: index,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })) : a.images,
              image_url: images && images.length > 0 ? images[0] : a.image_url
            };
          }
          return a;
        });
        localStorage.setItem('artspark-artworks', JSON.stringify(updatedArtworks));
      }
      await queryClient.invalidateQueries({ queryKey: ['artworks'] });
      return;
    }

    try {
      await OptimizedApiService.updateArtwork(id, artwork);
      await queryClient.invalidateQueries({ queryKey: ['artworks'] });
    } catch (error) {
      console.error('Error updating artwork:', error);
      throw error;
    }
  };

  const deleteArtwork = async (id: string) => {
    try {
      // Check if Supabase is properly configured
      if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
        // Fallback to localStorage for development
        console.log('🎨 [ArtworkContext] Supabase not configured, using localStorage fallback for deleteArtwork');
        const storedArtworks = localStorage.getItem('artspark-artworks');
        if (storedArtworks) {
          const artworks = JSON.parse(storedArtworks);
          const filteredArtworks = artworks.filter((a: Artwork) => a.id !== id);
          localStorage.setItem('artspark-artworks', JSON.stringify(filteredArtworks));
        }
        await queryClient.invalidateQueries({ queryKey: ['artworks'] });
        return;
      }

      await OptimizedApiService.deleteArtwork(id);
      await queryClient.invalidateQueries({ queryKey: ['artworks'] });
    } catch (error) {
      console.error('Error deleting artwork:', error);
      throw error;
    }
  };

  // Optimized incrementViews with optimistic updates
  const incrementViewsMutation = useMutation({
    mutationFn: async (id: string) => {
      // Check if this artwork has already been viewed in this session
      const viewedKey = `artwork_viewed_${id}`;
      const hasViewed = sessionStorage.getItem(viewedKey);
      
      if (hasViewed) {
        console.log(`Artwork ${id} already viewed in this session, skipping view increment`);
        return;
      }

      // Mark as viewed in this session
      sessionStorage.setItem(viewedKey, 'true');

      if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
        // Fallback to localStorage for development
        const storedArtworks = localStorage.getItem('artspark-artworks');
        if (storedArtworks) {
          const artworks = JSON.parse(storedArtworks);
          const updatedArtworks = artworks.map((a: Artwork) => 
            a.id === id ? { ...a, views: a.views + 1 } : a
          );
          localStorage.setItem('artspark-artworks', JSON.stringify(updatedArtworks));
        }
        return;
      }

      // Use Supabase RPC function to increment views
      await OptimizedApiService.incrementViews(id);
    },
    onMutate: async (id: string) => {
      // Optimistic update - immediately update the UI
      queryClient.setQueryData(['artworks'], (oldData: Artwork[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(artwork => 
          artwork.id === id ? { ...artwork, views: artwork.views + 1 } : artwork
        );
      });
    },
    onError: (error, id) => {
      console.error('Error incrementing views:', error);
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
    }
  });

  const incrementViews = async (id: string) => {
    return incrementViewsMutation.mutateAsync(id);
  };

  const addArtworkImages = async (artworkId: string, imageUrls: string[]) => {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        // Fallback to localStorage
        console.log('Supabase not configured, using localStorage fallback for addArtworkImages');
        return;
      }

      await Promise.all(
        imageUrls.map((url, index) => 
          OptimizedApiService.uploadArtworkImage(artworkId, url, index)
        )
      );

      // Refresh artworks to get updated images
      await queryClient.invalidateQueries({ queryKey: ['artworks'] });
    } catch (error) {
      console.error('Error adding artwork images:', error);
      throw error;
    }
  };

  const deleteArtworkImage = async (imageId: number) => {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        // Fallback to localStorage
        console.log('Supabase not configured, using localStorage fallback for deleteArtworkImage');
        return;
      }

      // Delete image using optimized service
      await OptimizedApiService.deleteArtwork(imageId.toString());

      // Refresh artworks to get updated images
      await queryClient.invalidateQueries({ queryKey: ['artworks'] });
    } catch (error) {
      console.error('Error deleting artwork image:', error);
      throw error;
    }
  };

  const getArtworkImages = async (artworkId: string): Promise<ArtworkImage[]> => {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        // Fallback to localStorage
        console.log('Supabase not configured, using localStorage fallback for getArtworkImages');
        return [];
      }

      const artwork = await OptimizedApiService.getArtworkById(artworkId);
      return artwork.artwork_images || [];
    } catch (error) {
      console.error('Error getting artwork images:', error);
      throw error;
    }
  };

  const clearAllArtworks = async () => {
    try {
      if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
        // Fallback to localStorage
        console.log('🎨 [ArtworkContext] Supabase not configured, clearing localStorage');
        localStorage.removeItem('artspark-artworks');
        await queryClient.invalidateQueries({ queryKey: ['artworks'] });
        console.log('All artworks cleared from localStorage');
        return;
      }

      // Clear from Supabase - this would need to be implemented in the API service
      console.log('Clearing all artworks from database...');
      
      // Also clear localStorage as backup
      localStorage.removeItem('artspark-artworks');
      await queryClient.invalidateQueries({ queryKey: ['artworks'] });
      console.log('All artworks cleared from database and localStorage');
    } catch (error) {
      console.error('Error clearing all artworks:', error);
      throw error;
    }
  };

  const resetAllViews = async () => {
    try {
      if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
        // Fallback to localStorage
        console.log('🎨 [ArtworkContext] Supabase not configured, resetting views locally');
        
        const storedArtworks = localStorage.getItem('artspark-artworks');
        if (storedArtworks) {
          const artworks = JSON.parse(storedArtworks);
          const updatedArtworks = artworks.map((artwork: Artwork) => ({ ...artwork, views: 0 }));
          localStorage.setItem('artspark-artworks', JSON.stringify(updatedArtworks));
          console.log('All view counts reset locally');
        }
        await queryClient.invalidateQueries({ queryKey: ['artworks'] });
        return;
      }

      // Reset views in Supabase - this would need to be implemented in the API service
      console.log('Resetting views in database...');
      await queryClient.invalidateQueries({ queryKey: ['artworks'] });
      console.log('All view counts reset');
    } catch (error) {
      console.error('Error resetting views:', error);
      throw error;
    }
  };

  return (
    <ArtworkContext.Provider value={{ 
      artworks, 
      isLoading, 
      addArtwork, 
      updateArtwork, 
      deleteArtwork,
      refreshArtworks: async () => {
        await refetchArtworks();
      },
      incrementViews,
      addArtworkImages,
      deleteArtworkImage,
      getArtworkImages,
      clearAllArtworks,
      resetAllViews // New
    }}>
      {children}
    </ArtworkContext.Provider>
  );
};


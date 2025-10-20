import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { supabase } from '@/lib/api';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load artworks from Supabase on mount
  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    try {
      setIsLoading(true);
      
      // Check if Supabase is properly configured
      if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co' && supabaseAnonKey !== 'your-anon-key') {
        console.log('🎨 [ArtworkContext] Loading artworks from Supabase...');
        const { data: artworksData, error: artworksError } = await supabase
          .from('artworks')
          .select('*')
          .order('created_at', { ascending: false });

        if (artworksError) {
          console.error('Error loading artworks:', artworksError);
          throw artworksError;
        }

        // Fetch images for each artwork
        const artworksWithImages = await Promise.all(
          (artworksData || []).map(async (artwork) => {
            const { data: imagesData, error: imagesError } = await supabase
              .from('artwork_images')
              .select('*')
              .eq('artwork_id', artwork.id)
              .order('display_order', { ascending: true });

            if (imagesError) {
              console.error('Error loading images for artwork:', artwork.id, imagesError);
            }

            return {
              ...artwork,
              images: imagesData || [],
              image_url: imagesData?.[0]?.image_url || artwork.image_url // First image as primary
            };
          })
        );

        setArtworks(artworksWithImages);
        console.log('🎨 [ArtworkContext] Loaded', artworksWithImages.length, 'artworks from Supabase');
      } else {
        // Fallback to localStorage for development
        console.log('🎨 [ArtworkContext] Supabase not configured, using localStorage fallback');
        const storedArtworks = localStorage.getItem('artspark-artworks');
        if (storedArtworks) {
          const parsedArtworks = JSON.parse(storedArtworks);
          setArtworks(parsedArtworks);
          console.log('🎨 [ArtworkContext] Loaded', parsedArtworks.length, 'artworks from localStorage');
        } else {
          // Start with empty gallery - user will add artworks through dashboard
          setArtworks([]);
          console.log('🎨 [ArtworkContext] No artworks found in localStorage, starting with empty gallery');
        }
      }
    } catch (error) {
      console.error('Error loading artworks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addArtwork = async (artwork: Omit<Artwork, 'id' | 'created_at' | 'updated_at' | 'views' | 'images'>, images?: string[]) => {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
      // Fallback to localStorage for development
      console.log('🎨 [ArtworkContext] Supabase not configured, using localStorage fallback for addArtwork');
      console.log('🎨 [ArtworkContext] Artwork data:', artwork);
      console.log('🎨 [ArtworkContext] Images:', images);
      
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
      
      console.log('🎨 [ArtworkContext] Created new artwork:', newArtwork);
      
      const updatedArtworks = [newArtwork, ...artworks];
      setArtworks(updatedArtworks);
      localStorage.setItem('artspark-artworks', JSON.stringify(updatedArtworks));
      console.log('🎨 [ArtworkContext] Artwork saved to localStorage successfully, total artworks:', updatedArtworks.length);
      return; // Exit early - no error thrown
    }

    // Supabase code only runs if supabaseUrl and supabaseAnonKey are configured
    try {
      const { data, error } = await supabase
        .from('artworks')
        .insert([{
          ...artwork,
          views: 0
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Add images if provided
      if (images && images.length > 0) {
        const imageInserts = images.map((url, index) => ({
          artwork_id: data.id,
          image_url: url,
          display_order: index
        }));

        const { error: imagesError } = await supabase
          .from('artwork_images')
          .insert(imageInserts);

        if (imagesError) {
          console.error('Error adding images:', imagesError);
        }
      }

      // Reload artworks to get the images
      await loadArtworks();
      console.log('Artwork added to Supabase successfully, artworks reloaded');
    } catch (error) {
      console.error('Error adding artwork:', error);
      throw error;
    }
  };

  const updateArtwork = async (id: string, artwork: Partial<Omit<Artwork, 'id' | 'created_at' | 'updated_at'>>, images?: string[]) => {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
      // Fallback to localStorage for development
      console.log('🎨 [ArtworkContext] Supabase not configured, using localStorage fallback for updateArtwork');
      
      const updatedArtworks = artworks.map(a => {
        if (a.id === id) {
          const updatedArtwork = {
            ...a,
            ...artwork,
            updated_at: new Date().toISOString(),
            // Update images if provided
            images: images ? images.map((url, index) => ({
              id: Date.now() + index,
              artwork_id: id,
              image_url: url,
              display_order: index,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })) : a.images,
            // Update primary image_url if images are provided
            image_url: images && images.length > 0 ? images[0] : a.image_url
          };
          return updatedArtwork;
        }
        return a;
      });
      
      setArtworks(updatedArtworks);
      localStorage.setItem('artspark-artworks', JSON.stringify(updatedArtworks));
      console.log('🎨 [ArtworkContext] Artwork updated in localStorage successfully');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('artworks')
        .update(artwork)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating artwork:', error);
        throw error;
      }

      setArtworks(prev => prev.map(a => a.id === id ? data : a));
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
          setArtworks(filteredArtworks);
        }
        return;
      }

      const { error } = await supabase
        .from('artworks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting artwork:', error);
        throw error;
      }

      setArtworks(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting artwork:', error);
      throw error;
    }
  };

  const incrementViews = async (id: string) => {
    try {
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
        console.log('🎨 [ArtworkContext] Supabase not configured, incrementing views locally');
        
        // Update state and localStorage in one go
        setArtworks(prev => {
          const updatedArtworks = prev.map(a => 
            a.id === id ? { ...a, views: a.views + 1 } : a
          );
          localStorage.setItem('artspark-artworks', JSON.stringify(updatedArtworks));
          console.log(`View incremented locally for artwork ${id}`);
          return updatedArtworks;
        });
        return;
      }

      // Use Supabase RPC function to increment views
      const { error } = await supabase.rpc('increment_views', { artwork_id: id });
      
      if (error) {
        console.error('Error incrementing views with RPC, trying direct update:', error);
        
        // Fallback: try direct update
        const { error: updateError } = await supabase
          .from('artworks')
          .update({ views: supabase.raw('views + 1') })
          .eq('id', id);
          
        if (updateError) {
          console.error('Error with direct update, falling back to local:', updateError);
          // Final fallback: update locally
          setArtworks(prev => prev.map(a => 
            a.id === id ? { ...a, views: a.views + 1 } : a
          ));
          console.log(`View incremented locally (fallback) for artwork ${id}`);
        } else {
          // Update local state immediately for better UX
          setArtworks(prev => prev.map(a => 
            a.id === id ? { ...a, views: a.views + 1 } : a
          ));
          console.log(`View incremented in database (direct update) for artwork ${id}`);
        }
      } else {
        // Update local state immediately for better UX
        setArtworks(prev => prev.map(a => 
          a.id === id ? { ...a, views: a.views + 1 } : a
        ));
        console.log(`View incremented in database (RPC) for artwork ${id}`);
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
      // Fallback: update locally
      setArtworks(prev => prev.map(a => 
        a.id === id ? { ...a, views: a.views + 1 } : a
      ));
      console.log(`View incremented locally (error fallback) for artwork ${id}`);
    }
  };

  const refreshArtworks = async () => {
    await loadArtworks();
  };

  const addArtworkImages = async (artworkId: string, imageUrls: string[]) => {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        // Fallback to localStorage
        console.log('Supabase not configured, using localStorage fallback for addArtworkImages');
        return;
      }

      const imageInserts = imageUrls.map((url, index) => ({
        artwork_id: artworkId,
        image_url: url,
        display_order: index
      }));

      const { error } = await supabase
        .from('artwork_images')
        .insert(imageInserts);

      if (error) {
        console.error('Error adding artwork images:', error);
        throw error;
      }

      // Refresh artworks to get updated images
      await loadArtworks();
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

      const { error } = await supabase
        .from('artwork_images')
        .delete()
        .eq('id', imageId);

      if (error) {
        console.error('Error deleting artwork image:', error);
        throw error;
      }

      // Refresh artworks to get updated images
      await loadArtworks();
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

      const { data, error } = await supabase
        .from('artwork_images')
        .select('*')
        .eq('artwork_id', artworkId)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error getting artwork images:', error);
        throw error;
      }

      return data || [];
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
        setArtworks([]);
        console.log('All artworks cleared from localStorage');
        return;
      }

      // Clear from Supabase
      const { error: imagesError } = await supabase
        .from('artwork_images')
        .delete()
        .neq('id', 0); // Delete all images

      if (imagesError) {
        console.error('Error clearing artwork images:', imagesError);
      }

      const { error: artworksError } = await supabase
        .from('artworks')
        .delete()
        .neq('id', ''); // Delete all artworks

      if (artworksError) {
        console.error('Error clearing artworks:', artworksError);
        throw artworksError;
      }

      // Also clear localStorage as backup
      localStorage.removeItem('artspark-artworks');
      setArtworks([]);
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
        
        // Update state first
        setArtworks(prev => {
          const updatedArtworks = prev.map(artwork => ({ ...artwork, views: 0 }));
          // Update localStorage with the updated artworks
          localStorage.setItem('artspark-artworks', JSON.stringify(updatedArtworks));
          console.log('All view counts reset locally');
          return updatedArtworks;
        });
        return;
      }

      // Reset views in Supabase
      const { error } = await supabase
        .from('artworks')
        .update({ views: 0 })
        .neq('id', ''); // Update all artworks

      if (error) {
        console.error('Error resetting views in database:', error);
        // Don't throw error, just log it and continue with local update
        console.log('Continuing with local view reset...');
      } else {
        console.log('All view counts reset in database');
      }

      // Update local state regardless of database success
      setArtworks(prev => prev.map(artwork => ({ ...artwork, views: 0 })));
      console.log('All view counts reset locally');
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
      refreshArtworks,
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


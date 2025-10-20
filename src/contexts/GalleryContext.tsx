import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ApiService } from '@/lib/api';

interface Gallery {
  id: string;
  name: string;
  slug: string;
  featuredImage: string;
  description: string;
  artworkCount: number;
  year: number;
  category: string;
  artworks: any[];
}

interface Category {
  category: string;
  count: number;
}

interface GalleryState {
  galleries: Gallery[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
}

type GalleryAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_GALLERIES'; payload: Gallery[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'ADD_GALLERY'; payload: Gallery }
  | { type: 'UPDATE_GALLERY'; payload: Gallery }
  | { type: 'DELETE_GALLERY'; payload: string }
  | { type: 'UPDATE_ARTWORK_COUNT'; payload: { category: string; count: number } }
  | { type: 'SET_LAST_UPDATED'; payload: number };

const initialState: GalleryState = {
  galleries: [],
  categories: [],
  isLoading: false,
  error: null,
  lastUpdated: 0
};

const galleryReducer = (state: GalleryState, action: GalleryAction): GalleryState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_GALLERIES':
      return { 
        ...state, 
        galleries: action.payload, 
        isLoading: false, 
        error: null,
        lastUpdated: Date.now()
      };
    case 'SET_CATEGORIES':
      return { 
        ...state, 
        categories: action.payload, 
        isLoading: false, 
        error: null 
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'ADD_GALLERY':
      return { 
        ...state, 
        galleries: [...state.galleries, action.payload],
        lastUpdated: Date.now()
      };
    case 'UPDATE_GALLERY':
      return {
        ...state,
        galleries: state.galleries.map(gallery =>
          gallery.id === action.payload.id ? action.payload : gallery
        ),
        lastUpdated: Date.now()
      };
    case 'DELETE_GALLERY':
      return {
        ...state,
        galleries: state.galleries.filter(gallery => gallery.id !== action.payload),
        lastUpdated: Date.now()
      };
    case 'UPDATE_ARTWORK_COUNT':
      return {
        ...state,
        galleries: state.galleries.map(gallery =>
          gallery.category === action.payload.category
            ? { ...gallery, artworkCount: action.payload.count }
            : gallery
        ),
        categories: state.categories.map(cat =>
          cat.category === action.payload.category
            ? { ...cat, count: action.payload.count }
            : cat
        )
      };
    case 'SET_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload };
    default:
      return state;
  }
};

interface GalleryContextType {
  state: GalleryState;
  loadGalleries: () => Promise<void>;
  loadCategories: () => Promise<void>;
  getGalleryBySlug: (slug: string) => Gallery | undefined;
  getGalleryByCategory: (category: string) => Gallery | undefined;
  refreshGalleries: () => Promise<void>;
  updateGalleryData: () => Promise<void>;
  isDataStale: () => boolean;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};

interface GalleryProviderProps {
  children: ReactNode;
}

export const GalleryProvider: React.FC<GalleryProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(galleryReducer, initialState);

  // Check if data is stale (older than 5 minutes)
  const isDataStale = () => {
    return Date.now() - state.lastUpdated > 5 * 60 * 1000;
  };

  const loadGalleries = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: '' });
      
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
        // Enhanced localStorage fallback
        console.log('🎨 [GalleryContext] Using localStorage fallback for galleries');
        await loadFromLocalStorage();
        return;
      }

      // Load from Supabase
      await loadFromSupabase();
      
    } catch (error) {
      console.error('Error loading galleries:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement des galeries' });
      
      // Try localStorage fallback on error
      try {
        await loadFromLocalStorage();
      } catch (fallbackError) {
        console.error('Fallback loading failed:', fallbackError);
        dispatch({ type: 'SET_ERROR', payload: 'Impossible de charger les galeries' });
      }
    }
  };

  const loadFromLocalStorage = async () => {
    const storedArtworks = localStorage.getItem('artspark-artworks');
    if (!storedArtworks) {
      dispatch({ type: 'SET_GALLERIES', payload: [] });
      dispatch({ type: 'SET_CATEGORIES', payload: [] });
      return;
    }

    const artworks = JSON.parse(storedArtworks);
    
    // Group artworks by category
    const categoryMap = new Map<string, any[]>();
    artworks.forEach((artwork: any) => {
      if (!artwork.category) return;
      const category = artwork.category;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(artwork);
    });
    
    // Create galleries from categories
    const galleries: Gallery[] = Array.from(categoryMap.entries()).map(([category, artworks]) => {
      const featuredArtwork = artworks[0];
      return {
        id: category.toLowerCase().replace(/\s+/g, '-'),
        name: category,
        slug: category.toLowerCase().replace(/\s+/g, '-'),
        featuredImage: featuredArtwork.image_url || '/placeholder.jpg',
        description: generateGalleryDescription(category),
        artworkCount: artworks.length,
        year: featuredArtwork.year || new Date().getFullYear(),
        category: category,
        artworks: artworks
      };
    });
    
    // Create categories
    const categories: Category[] = Array.from(categoryMap.entries()).map(([category, artworks]) => ({
      category,
      count: artworks.length
    }));
    
    dispatch({ type: 'SET_GALLERIES', payload: galleries });
    dispatch({ type: 'SET_CATEGORIES', payload: categories });
  };

  const loadFromSupabase = async () => {
    // Load categories first
    const categories = await ApiService.getCategories();
    dispatch({ type: 'SET_CATEGORIES', payload: categories });
    
    // Load gallery data for each category
    const galleries: Gallery[] = [];
    for (const { category } of categories) {
      try {
        const galleryData = await ApiService.getGalleryData(category);
        if (galleryData) {
          const artworks = await ApiService.getArtworksByCategory(category);
          galleries.push({
            ...galleryData,
            artworks: artworks || []
          });
        }
      } catch (error) {
        console.error(`Error loading gallery for category ${category}:`, error);
        // Continue with other galleries
      }
    }
    
    dispatch({ type: 'SET_GALLERIES', payload: galleries });
  };

  const generateGalleryDescription = (category: string): string => {
    const descriptions: { [key: string]: string } = {
      'Portrait': 'Portraits expressifs capturant l\'émotion et la personnalité',
      'Abstrait': 'Collection d\'œuvres abstraites explorant les textures et les formes organiques',
      'Aquarelle': 'Œuvres délicates à l\'aquarelle explorant la fluidité des couleurs',
      'Photographie': 'Photographies artistiques capturant l\'essence des espaces',
      'Fusain': 'Études atmosphériques au fusain jouant avec les lumières et ombres',
      'Huile': 'Peintures à l\'huile riches en texture et en profondeur',
      'Mixte': 'Techniques mixtes combinant différents médiums artistiques'
    };
    
    return descriptions[category] || `Collection d'œuvres ${category.toLowerCase()} explorant les différentes techniques et styles`;
  };

  const loadCategories = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
        // Use localStorage fallback
        await loadFromLocalStorage();
        return;
      }

      const categories = await ApiService.getCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    } catch (error) {
      console.error('Error loading categories:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement des catégories' });
    }
  };

  const getGalleryBySlug = (slug: string): Gallery | undefined => {
    return state.galleries.find(gallery => gallery.slug === slug);
  };

  const getGalleryByCategory = (category: string): Gallery | undefined => {
    return state.galleries.find(gallery => gallery.category === category);
  };

  const refreshGalleries = async () => {
    dispatch({ type: 'SET_LAST_UPDATED', payload: 0 }); // Force refresh
    await loadGalleries();
  };

  const updateGalleryData = async () => {
    // Update gallery data without full reload
    if (isDataStale()) {
      await refreshGalleries();
    }
  };

  // Load galleries on mount
  useEffect(() => {
    loadGalleries();
  }, []);

  // Auto-refresh every 5 minutes if data is stale
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDataStale()) {
        console.log('🎨 [GalleryContext] Auto-refreshing stale data');
        loadGalleries();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [state.lastUpdated]);

  const value: GalleryContextType = {
    state,
    loadGalleries,
    loadCategories,
    getGalleryBySlug,
    getGalleryByCategory,
    refreshGalleries,
    updateGalleryData,
    isDataStale
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};
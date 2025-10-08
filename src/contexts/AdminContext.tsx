import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

export interface Artwork {
  id: number;
  title: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number;
  size: string;
  year: string;
  available: boolean;
  description: string;
  offer?: {
    type: 'percentage' | 'fixed';
    value: number;
    startDate?: string;
    endDate?: string;
    active: boolean;
  };
  featured?: boolean;
  tags?: string[];
  materials?: string[];
  technique?: string;
}

interface AdminState {
  artworks: Artwork[];
  loading: boolean;
  error: string | null;
}

type AdminAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ARTWORKS'; payload: Artwork[] }
  | { type: 'ADD_ARTWORK'; payload: Artwork }
  | { type: 'UPDATE_ARTWORK'; payload: Artwork }
  | { type: 'DELETE_ARTWORK'; payload: number }
  | { type: 'TOGGLE_AVAILABILITY'; payload: number }
  | { type: 'TOGGLE_FEATURED'; payload: number };

const AdminContext = createContext<{
  state: AdminState;
  dispatch: React.Dispatch<AdminAction>;
  addArtwork: (artwork: Omit<Artwork, 'id'>) => void;
  updateArtwork: (id: number, updates: Partial<Artwork>) => void;
  deleteArtwork: (id: number) => void;
  toggleAvailability: (id: number) => void;
  toggleFeatured: (id: number) => void;
  resetAllToAvailable: () => void;
  resetAllToUnavailable: () => void;
} | null>(null);

const adminReducer = (state: AdminState, action: AdminAction): AdminState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_ARTWORKS':
      return { ...state, artworks: action.payload };
    
    case 'ADD_ARTWORK':
      return { ...state, artworks: [...state.artworks, action.payload] };
    
    case 'UPDATE_ARTWORK':
      return {
        ...state,
        artworks: state.artworks.map(artwork =>
          artwork.id === action.payload.id ? action.payload : artwork
        )
      };
    
    case 'DELETE_ARTWORK':
      return {
        ...state,
        artworks: state.artworks.filter(artwork => artwork.id !== action.payload)
      };
    
    case 'TOGGLE_AVAILABILITY':
      return {
        ...state,
        artworks: state.artworks.map(artwork =>
          artwork.id === action.payload
            ? { ...artwork, available: !artwork.available }
            : artwork
        )
      };
    
    case 'TOGGLE_FEATURED':
      return {
        ...state,
        artworks: state.artworks.map(artwork =>
          artwork.id === action.payload
            ? { ...artwork, featured: !artwork.featured }
            : artwork
        )
      };
    
    default:
      return state;
  }
};

// Load artworks from localStorage or use default
const loadArtworksFromStorage = (): Artwork[] => {
  try {
    const stored = localStorage.getItem('artworks');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading artworks from localStorage:', error);
  }
  return [];
};

// Save artworks to localStorage
const saveArtworksToStorage = (artworks: Artwork[]) => {
  try {
    localStorage.setItem('artworks', JSON.stringify(artworks));
  } catch (error) {
    console.error('Error saving artworks to localStorage:', error);
  }
};

// Initial artworks data
const defaultArtworks: Artwork[] = [
  {
    id: 1,
    title: "Flux Abstrait",
    category: "Aquarelle",
    image: "/src/assets/artwork-1.jpg",
    price: 450,
    size: "40x60 cm",
    year: "2023",
    available: true,
    description: "Une exploration abstraite des flux naturels à travers l'aquarelle",
    featured: true,
    tags: ["abstrait", "nature", "aquarelle"],
    materials: ["Aquarelle", "Papier"],
    technique: "Aquarelle sur papier"
  },
  {
    id: 2,
    title: "Étude de Portrait",
    category: "Dessin au Crayon",
    image: "/src/assets/artwork-2.jpg",
    price: 320,
    size: "30x40 cm",
    year: "2023",
    available: true,
    description: "Portrait détaillé au crayon graphite",
    featured: false,
    tags: ["portrait", "réalisme", "crayon"],
    materials: ["Crayon graphite", "Papier"],
    technique: "Dessin au crayon"
  },
  {
    id: 3,
    title: "Vue Montagneuse",
    category: "Fusain",
    image: "/src/assets/artwork-3.jpg",
    price: 380,
    size: "50x70 cm",
    year: "2022",
    available: true,
    description: "Paysage montagneux en fusain sur papier",
    featured: false,
    tags: ["paysage", "montagne", "fusain"],
    materials: ["Fusain", "Papier"],
    technique: "Fusain sur papier"
  },
  {
    id: 4,
    title: "Symphonie de Couleurs",
    category: "Techniques Mixtes",
    image: "/src/assets/artwork-4.jpg",
    price: 650,
    originalPrice: 750,
    size: "60x80 cm",
    year: "2023",
    available: true,
    description: "Composition abstraite utilisant diverses techniques",
    offer: {
      type: 'fixed',
      value: 100,
      active: true
    },
    featured: true,
    tags: ["abstrait", "couleurs", "techniques mixtes"],
    materials: ["Acrylique", "Huile", "Toile"],
    technique: "Techniques mixtes sur toile"
  },
  {
    id: 5,
    title: "Rêves Botaniques",
    category: "Illustration",
    image: "/src/assets/artwork-5.jpg",
    price: 280,
    size: "25x35 cm",
    year: "2023",
    available: true,
    description: "Illustration botanique détaillée",
    featured: false,
    tags: ["botanique", "illustration", "nature"],
    materials: ["Encre", "Papier"],
    technique: "Illustration à l'encre"
  },
  {
    id: 6,
    title: "Expression Audacieuse",
    category: "Encre",
    image: "/src/assets/artwork-6.jpg",
    price: 420,
    size: "45x65 cm",
    year: "2022",
    available: true,
    description: "Expression artistique audacieuse à l'encre",
    featured: false,
    tags: ["expression", "encre", "audace"],
    materials: ["Encre", "Papier"],
    technique: "Encre sur papier"
  }
];

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(adminReducer, {
    artworks: loadArtworksFromStorage().length > 0 ? loadArtworksFromStorage() : defaultArtworks,
    loading: false,
    error: null
  });

  // Save to localStorage whenever artworks change
  useEffect(() => {
    saveArtworksToStorage(state.artworks);
  }, [state.artworks]);

  const addArtwork = (artworkData: Omit<Artwork, 'id'>) => {
    const newId = Math.max(...state.artworks.map(a => a.id), 0) + 1;
    const newArtwork: Artwork = { ...artworkData, id: newId };
    dispatch({ type: 'ADD_ARTWORK', payload: newArtwork });
  };

  const updateArtwork = (id: number, updates: Partial<Artwork>) => {
    const artwork = state.artworks.find(a => a.id === id);
    if (artwork) {
      const updatedArtwork = { ...artwork, ...updates };
      dispatch({ type: 'UPDATE_ARTWORK', payload: updatedArtwork });
    }
  };

  const deleteArtwork = (id: number) => {
    dispatch({ type: 'DELETE_ARTWORK', payload: id });
  };

  const toggleAvailability = (id: number) => {
    dispatch({ type: 'TOGGLE_AVAILABILITY', payload: id });
  };

  const toggleFeatured = (id: number) => {
    dispatch({ type: 'TOGGLE_FEATURED', payload: id });
  };

  const resetAllToAvailable = () => {
    const updatedArtworks = state.artworks.map(artwork => ({
      ...artwork,
      available: true
    }));
    dispatch({ type: 'SET_ARTWORKS', payload: updatedArtworks });
  };

  const resetAllToUnavailable = () => {
    const updatedArtworks = state.artworks.map(artwork => ({
      ...artwork,
      available: false
    }));
    dispatch({ type: 'SET_ARTWORKS', payload: updatedArtworks });
  };

  return (
    <AdminContext.Provider value={{
      state,
      dispatch,
      addArtwork,
      updateArtwork,
      deleteArtwork,
      toggleAvailability,
      toggleFeatured,
      resetAllToAvailable,
      resetAllToUnavailable
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

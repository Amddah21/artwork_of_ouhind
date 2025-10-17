import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { SpringArtworkService, Artwork as SpringArtwork } from '@/services/spring-artwork-service';

interface Artwork {
  id: number;
  title: string;
  category: string;
  image: string;
  size: string;
  year: string;
  available: boolean;
  description: string;
  featured?: boolean;
  tags?: string[];
  materials?: string[];
  technique?: string;
}

interface ArtworkContextType {
  artworks: Artwork[];
  isLoading: boolean;
  addArtwork: (artwork: Omit<Artwork, 'id'>) => Promise<void>;
  updateArtwork: (id: number, artwork: Omit<Artwork, 'id'>) => Promise<void>;
  deleteArtwork: (id: number) => Promise<void>;
  refreshArtworks: () => Promise<void>;
}

const ArtworkContext = createContext<ArtworkContextType | undefined>(undefined);

export const useArtwork = () => {
  const context = useContext(ArtworkContext);
  if (!context) {
    throw new Error('useArtwork must be used within ArtworkProvider');
  }
  return context;
};

const defaultArtworks: Artwork[] = [
  {
    id: 1,
    title: "Rêve Aquarelle",
    category: "Aquarelle",
    image: "/artwork1.JPG",
    size: "40x60 cm",
    year: "2023",
    available: true,
    description: "Une œuvre délicate capturant l'essence des rêves à travers des couleurs fluides et éthérées.",
    featured: true,
    tags: ["aquarelle", "abstrait", "coloré"],
    materials: ["Aquarelle", "Papier Arches"],
    technique: "Aquarelle sur papier"
  },
  {
    id: 2,
    title: "Portrait au Crayon",
    category: "Dessin au Crayon",
    image: "/artwork2.JPG",
    size: "30x40 cm",
    year: "2023",
    available: true,
    description: "Un portrait expressif capturant l'émotion et la personnalité du sujet.",
    tags: ["portrait", "réaliste"],
    materials: ["Graphite", "Papier Bristol"],
    technique: "Crayon graphite"
  },
  {
    id: 3,
    title: "Étude au Fusain",
    category: "Fusain",
    image: "/artwork3.JPG",
    size: "50x70 cm",
    year: "2023",
    available: true,
    description: "Une étude atmosphérique jouant avec les lumières et les ombres.",
    featured: false,
    tags: ["fusain", "monochrome"],
    materials: ["Fusain", "Papier kraft"],
    technique: "Fusain sur papier"
  },
  {
    id: 4,
    title: "Composition Mixte",
    category: "Techniques Mixtes",
    image: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&h=800&fit=crop",
    size: "60x80 cm",
    year: "2023",
    available: true,
    description: "Une exploration créative mêlant différentes techniques et matériaux.",
    tags: ["mixte", "moderne"],
    materials: ["Acrylique", "Encre", "Collage"],
    technique: "Techniques mixtes"
  },
  {
    id: 5,
    title: "Illustration Botanique",
    category: "Illustration",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=800&fit=crop",
    size: "20x30 cm",
    year: "2023",
    available: true,
    description: "Une illustration détaillée inspirée de la nature.",
    tags: ["botanique", "nature"],
    materials: ["Encre", "Aquarelle"],
    technique: "Illustration à l'encre et aquarelle"
  },
  {
    id: 6,
    title: "Calligraphie à l'Encre",
    category: "Encre",
    image: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=800&h=800&fit=crop",
    size: "40x50 cm",
    year: "2023",
    available: true,
    description: "Une œuvre d'encre expressionniste combinant calligraphie et art abstrait.",
    featured: true,
    tags: ["encre", "calligraphie"],
    materials: ["Encre", "Papier"],
    technique: "Encre sur papier"
  },
  {
    id: 7,
    title: "Racines Silencieuses",
    category: "Abstrait",
    image: "/artwork4.JPG",
    size: "60x80 cm",
    year: "2025",
    available: true,
    description: "Une exploration des textures naturelles et du silence intérieur. Une œuvre abstraite capturant l'essence des racines et des formations géologiques.",
    featured: true,
    tags: ["abstrait", "texture", "nature", "racines"],
    materials: ["Techniques mixtes", "Papier"],
    technique: "Techniques mixtes sur papier"
  },
  {
    id: 8,
    title: "Expression de l'Âme",
    category: "Abstrait",
    image: "/artwork5.JPG",
    size: "70x90 cm",
    year: "2025",
    available: true,
    description: "L'art est l'expression de l'âme à travers la couleur et la forme. Une œuvre qui explore les profondeurs de l'émotion artistique.",
    featured: true,
    tags: ["abstrait", "couleur", "forme", "âme"],
    materials: ["Techniques mixtes", "Toile"],
    technique: "Techniques mixtes sur toile"
  },
  {
    id: 9,
    title: "Textures Organiques",
    category: "Abstrait",
    image: "/artwork6.JPG",
    size: "80x100 cm",
    year: "2025",
    available: true,
    description: "Une exploration des textures naturelles et des formations géologiques. Cette œuvre abstraite en noir et blanc révèle la complexité des structures organiques.",
    featured: true,
    tags: ["abstrait", "texture", "organique", "géologie"],
    materials: ["Techniques mixtes", "Papier"],
    technique: "Techniques mixtes sur papier"
  },
  {
    id: 10,
    title: "Galerie d'Art",
    category: "Photographie",
    image: "/slider2.JPG",
    size: "60x80 cm",
    year: "2025",
    available: true,
    description: "Une vue intérieure d'une galerie d'art élégante, capturant l'atmosphère sophistiquée et l'éclairage naturel qui met en valeur les œuvres exposées.",
    featured: true,
    tags: ["galerie", "architecture", "éclairage", "exposition"],
    materials: ["Photographie", "Impression"],
    technique: "Photographie numérique"
  }
];

const STORAGE_KEY = 'artspark-artworks';

// Helper function to convert Spring Boot artwork to local artwork format
const convertSpringArtwork = (springArtwork: SpringArtwork): Artwork => ({
  id: springArtwork.id,
  title: springArtwork.titre,
  category: springArtwork.technique || 'Mixte',
  image: springArtwork.imageUrl,
  size: springArtwork.dimensions || '',
  year: springArtwork.annee?.toString() || new Date().getFullYear().toString(),
  available: true,
  description: springArtwork.description || '',
  featured: false,
  tags: [],
  materials: [],
  technique: springArtwork.technique || ''
});

// Helper function to convert local artwork to Spring Boot format
const convertToSpringArtwork = (artwork: Omit<Artwork, 'id'>) => ({
  titre: artwork.title,
  description: artwork.description,
  technique: artwork.technique || artwork.category,
  dimensions: artwork.size,
  annee: parseInt(artwork.year) || new Date().getFullYear(),
  imageUrl: artwork.image
});

export const ArtworkProvider = ({ children }: { children: ReactNode }) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load artworks from Spring Boot on mount
  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    try {
      setIsLoading(true);
      console.log('🎨 [ArtworkContext] Loading artworks from Spring Boot backend...');
      const springArtworks = await SpringArtworkService.getAllArtworks();
      console.log('🎨 [ArtworkContext] Received artworks from backend:', springArtworks);
      const convertedArtworks = springArtworks.map(convertSpringArtwork);
      setArtworks(convertedArtworks);
      console.log('🎨 [ArtworkContext] Converted artworks:', convertedArtworks);
    } catch (error) {
      console.error('❌ [ArtworkContext] Error loading artworks from Spring Boot:', error);
      // Don't use fallback - show empty state instead
      setArtworks([]);
      console.log('🎨 [ArtworkContext] Set artworks to empty array - backend not available');
    } finally {
      setIsLoading(false);
    }
  };

  const addArtwork = async (artwork: Omit<Artwork, 'id'>) => {
    try {
      console.log('🎨 [ArtworkContext] Adding artwork:', artwork);
      const springArtwork = convertToSpringArtwork(artwork);
      console.log('🎨 [ArtworkContext] Converted to Spring format:', springArtwork);
      const createdArtwork = await SpringArtworkService.createArtwork(springArtwork);
      console.log('🎨 [ArtworkContext] Created artwork from backend:', createdArtwork);
      const convertedArtwork = convertSpringArtwork(createdArtwork);
      console.log('🎨 [ArtworkContext] Converted back to local format:', convertedArtwork);
      setArtworks(prev => [...prev, convertedArtwork]);
      console.log('🎨 [ArtworkContext] Updated local state with new artwork');
    } catch (error) {
      console.error('❌ [ArtworkContext] Error adding artwork:', error);
      throw error;
    }
  };

  const updateArtwork = async (id: number, artwork: Omit<Artwork, 'id'>) => {
    try {
      console.log(`🎨 [ArtworkContext] Updating artwork ${id}:`, artwork);
      const springArtwork = convertToSpringArtwork(artwork);
      console.log(`🎨 [ArtworkContext] Converted to Spring format:`, springArtwork);
      const updatedArtwork = await SpringArtworkService.updateArtwork(id, springArtwork);
      console.log(`🎨 [ArtworkContext] Updated artwork from backend:`, updatedArtwork);
      const convertedArtwork = convertSpringArtwork(updatedArtwork);
      console.log(`🎨 [ArtworkContext] Converted back to local format:`, convertedArtwork);
      setArtworks(prev => prev.map(a => 
        a.id === id ? convertedArtwork : a
      ));
      console.log(`🎨 [ArtworkContext] Updated local state for artwork ${id}`);
    } catch (error) {
      console.error(`❌ [ArtworkContext] Error updating artwork ${id}:`, error);
      throw error;
    }
  };

  const deleteArtwork = async (id: number) => {
    try {
      console.log(`🎨 [ArtworkContext] Deleting artwork ${id}...`);
      await SpringArtworkService.deleteArtwork(id);
      console.log(`🎨 [ArtworkContext] Successfully deleted artwork ${id} from backend`);
      setArtworks(prev => prev.filter(a => a.id !== id));
      console.log(`🎨 [ArtworkContext] Removed artwork ${id} from local state`);
    } catch (error) {
      console.error(`❌ [ArtworkContext] Error deleting artwork ${id}:`, error);
      throw error;
    }
  };

  const refreshArtworks = async () => {
    await loadArtworks();
  };

  return (
    <ArtworkContext.Provider value={{ 
      artworks, 
      isLoading, 
      addArtwork, 
      updateArtwork, 
      deleteArtwork,
      refreshArtworks
    }}>
      {children}
    </ArtworkContext.Provider>
  );
};


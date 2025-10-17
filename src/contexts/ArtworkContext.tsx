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
  title: springArtwork.title,
  category: springArtwork.category || 'Mixte',
  image: springArtwork.imageUrl,
  size: springArtwork.dimensions || '',
  year: springArtwork.year?.toString() || new Date().getFullYear().toString(),
  available: springArtwork.available ?? true,
  description: springArtwork.description || '',
  featured: springArtwork.featured ?? false,
  tags: springArtwork.tags || [],
  materials: springArtwork.materials || [],
  technique: springArtwork.technique || ''
});

// Helper function to convert local artwork to Spring Boot format
const convertToSpringArtwork = (artwork: Omit<Artwork, 'id'>) => ({
  title: artwork.title,
  description: artwork.description,
  category: artwork.category,
  price: 0, // Default price, should be set by admin
  imageUrl: artwork.image,
  technique: artwork.technique,
  dimensions: artwork.size,
  year: parseInt(artwork.year) || new Date().getFullYear(),
  available: artwork.available,
  featured: artwork.featured,
  tags: artwork.tags,
  materials: artwork.materials
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
      const springArtworks = await SpringArtworkService.getAllArtworks();
      const convertedArtworks = springArtworks.map(convertSpringArtwork);
      setArtworks(convertedArtworks);
    } catch (error) {
      console.error('Error loading artworks from Spring Boot:', error);
      // Fallback to default artworks if Spring Boot fails
      setArtworks(defaultArtworks);
    } finally {
      setIsLoading(false);
    }
  };

  const addArtwork = async (artwork: Omit<Artwork, 'id'>) => {
    try {
      const springArtwork = convertToSpringArtwork(artwork);
      const createdArtwork = await SpringArtworkService.createArtwork(springArtwork);
      const convertedArtwork = convertSpringArtwork(createdArtwork);
      setArtworks(prev => [...prev, convertedArtwork]);
    } catch (error) {
      console.error('Error adding artwork:', error);
      throw error;
    }
  };

  const updateArtwork = async (id: number, artwork: Omit<Artwork, 'id'>) => {
    try {
      const springArtwork = convertToSpringArtwork(artwork);
      const updatedArtwork = await SpringArtworkService.updateArtwork(id, springArtwork);
      const convertedArtwork = convertSpringArtwork(updatedArtwork);
      setArtworks(prev => prev.map(a => 
        a.id === id ? convertedArtwork : a
      ));
    } catch (error) {
      console.error('Error updating artwork:', error);
      throw error;
    }
  };

  const deleteArtwork = async (id: number) => {
    try {
      await SpringArtworkService.deleteArtwork(id);
      setArtworks(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting artwork:', error);
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


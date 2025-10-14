import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { API_CONFIG, API_ENDPOINTS } from '@/lib/api-config';

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

export const ArtworkProvider = ({ children }: { children: ReactNode }) => {
  const [artworks, setArtworks] = useState<Artwork[]>(defaultArtworks);
  const [isLoading, setIsLoading] = useState(false);

  const refreshArtworks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.artworks.getAll}`);
      if (response.ok) {
        const data = await response.json();
        // Transform API data to match our interface
        const transformedArtworks = data.artworks?.map((artwork: any) => ({
          id: artwork.id,
          title: artwork.title,
          category: artwork.category,
          image: artwork.imageUrl || artwork.thumbnailUrl,
          size: artwork.dimensions,
          year: artwork.year.toString(),
          available: artwork.isAvailable,
          description: artwork.description,
          featured: false,
          tags: artwork.tags || [],
          materials: [artwork.medium],
          technique: artwork.medium
        })) || [];
        setArtworks(transformedArtworks);
      }
    } catch (error) {
      console.error('Error loading artworks:', error);
      // Keep default artworks if API fails
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshArtworks();
  }, []);

  return (
    <ArtworkContext.Provider value={{ artworks, isLoading, refreshArtworks }}>
      {children}
    </ArtworkContext.Provider>
  );
};


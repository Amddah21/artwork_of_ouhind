import { createContext, useContext, ReactNode } from 'react';

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
  }
];

export const ArtworkProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ArtworkContext.Provider value={{ artworks: defaultArtworks }}>
      {children}
    </ArtworkContext.Provider>
  );
};


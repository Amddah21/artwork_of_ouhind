import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Calendar, Palette, Tag, Share2, MessageCircle, Star, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import StarRating from '@/components/StarRating';
import ProtectedImage from '@/components/ProtectedImage';
import { useArtwork } from '@/contexts/ArtworkContext';

interface Gallery {
  id: string;
  name: string;
  slug: string;
  featuredImage: string;
  description: string;
  artworkCount: number;
  year: number;
  category: string;
}

interface Artwork {
  id: number;
  title: string;
  image: string;
  year: number;
  medium: string;
  dimensions: string;
  category: string;
  description: string;
  rating: number;
  ratingCount: number;
  isAvailable: boolean;
  artist: string;
}

const GalleryDetail: React.FC = () => {
  const { galleryId } = useParams<{ galleryId: string }>();
  const navigate = useNavigate();
  const { artworks } = useArtwork();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Sample gallery data - in a real app, this would come from your API
  const getGalleryData = (slug: string): Gallery => {
    const galleries: { [key: string]: Gallery } = {
      'abstrait': {
        id: '1',
        name: 'Abstrait',
        slug: 'abstrait',
        featuredImage: '/artwork4.JPG',
        description: 'Collection d\'œuvres abstraites explorant les textures et les formes organiques',
        artworkCount: 5,
        year: 2023,
        category: 'Abstrait'
      },
      'portrait': {
        id: '2',
        name: 'Portraits',
        slug: 'portrait',
        featuredImage: '/artwork2.JPG',
        description: 'Portraits expressifs capturant l\'émotion et la personnalité',
        artworkCount: 3,
        year: 2023,
        category: 'Portrait'
      },
      'aquarelle': {
        id: '3',
        name: 'Aquarelles',
        slug: 'aquarelle',
        featuredImage: '/artwork1.JPG',
        description: 'Œuvres délicates à l\'aquarelle explorant la fluidité des couleurs',
        artworkCount: 4,
        year: 2023,
        category: 'Aquarelle'
      },
      'photographie': {
        id: '4',
        name: 'Photographie',
        slug: 'photographie',
        featuredImage: '/slider2.JPG',
        description: 'Photographies artistiques capturant l\'essence des espaces',
        artworkCount: 2,
        year: 2025,
        category: 'Photographie'
      },
      'fusain': {
        id: '5',
        name: 'Fusain',
        slug: 'fusain',
        featuredImage: '/artwork3.JPG',
        description: 'Études atmosphériques au fusain jouant avec les lumières et ombres',
        artworkCount: 3,
        year: 2023,
        category: 'Fusain'
      }
    };
    
    return galleries[slug] || galleries['abstrait'];
  };

  // Get all galleries except the current one
  const getAllGalleries = (): Gallery[] => {
    const galleries: Gallery[] = [
      {
        id: '1',
        name: 'Abstrait',
        slug: 'abstrait',
        featuredImage: '/artwork4.JPG',
        description: 'Collection d\'œuvres abstraites explorant les textures et les formes organiques',
        artworkCount: 5,
        year: 2023,
        category: 'Abstrait'
      },
      {
        id: '2',
        name: 'Portraits',
        slug: 'portrait',
        featuredImage: '/artwork2.JPG',
        description: 'Portraits expressifs capturant l\'émotion et la personnalité',
        artworkCount: 3,
        year: 2023,
        category: 'Portrait'
      },
      {
        id: '3',
        name: 'Aquarelles',
        slug: 'aquarelle',
        featuredImage: '/artwork1.JPG',
        description: 'Œuvres délicates à l\'aquarelle explorant la fluidité des couleurs',
        artworkCount: 4,
        year: 2023,
        category: 'Aquarelle'
      },
      {
        id: '4',
        name: 'Photographie',
        slug: 'photographie',
        featuredImage: '/slider2.JPG',
        description: 'Photographies artistiques capturant l\'essence des espaces',
        artworkCount: 2,
        year: 2025,
        category: 'Photographie'
      },
      {
        id: '5',
        name: 'Fusain',
        slug: 'fusain',
        featuredImage: '/artwork3.JPG',
        description: 'Études atmosphériques au fusain jouant avec les lumières et ombres',
        artworkCount: 3,
        year: 2023,
        category: 'Fusain'
      }
    ];
    
    return galleries.filter(gallery => gallery.slug !== galleryId);
  };

  const currentGallery = getGalleryData(galleryId || 'abstrait');
  const otherGalleries = getAllGalleries();

  const handleGalleryClick = (gallerySlug: string) => {
    navigate(`/gallery/${gallerySlug}`);
  };

  const handleWhatsAppContact = () => {
    const message = `Bonjour ! Je suis intéressé(e) par la galerie "${currentGallery.name}". Pourriez-vous me donner plus d'informations sur cette collection ?`;
    const whatsappUrl = `https://wa.me/212666672756?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailContact = () => {
    const subject = `Demande d'information - Galerie ${currentGallery.name}`;
    const body = `Bonjour,\n\nJe suis intéressé(e) par la galerie "${currentGallery.name}".\n\nPourriez-vous me donner plus d'informations sur cette collection et discuter de sa valeur artistique ?\n\nCordialement,`;
    const mailtoUrl = `mailto:omhind53@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  return (
    <div className="min-h-screen watercolor-bg canvas-texture">
      {/* Header */}
      <div className="container mx-auto px-6 pt-8 pb-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover-painterly-lift"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Button>
      </div>

      {/* Main Gallery Content */}
      <div className="container mx-auto px-6 pb-20">
        {/* Featured Gallery Image */}
        <div className={`mb-16 transition-all duration-1000 ${
          isLoaded ? 'animate-fade-in-scroll' : 'opacity-0 translate-y-8'
        }`}>
          <Card className="painterly-card overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden">
              <ProtectedImage
                src={currentGallery.featuredImage}
                alt={currentGallery.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              
              {/* Gallery Info Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="painterly-card" style={{
                      backgroundColor: 'rgba(251, 191, 36, 0.1)',
                      color: 'hsl(38, 95%, 60%)'
                    }}>
                      {currentGallery.category}
                    </Badge>
                    <Badge variant="outline" className="text-white border-white/30">
                      {currentGallery.artworkCount} œuvres
                    </Badge>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-2">
                    {currentGallery.name}
                  </h1>
                  <p className="text-lg text-white/90 font-body mb-4">
                    {currentGallery.description}
                  </p>
                  <div className="flex items-center gap-4 text-white/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{currentGallery.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      <span className="text-sm">{currentGallery.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Section */}
        <div className={`mb-16 transition-all duration-1000 ${
          isLoaded ? 'animate-fade-in-scroll' : 'opacity-0 translate-y-8'
        }`} style={{ animationDelay: '0.2s' }}>
          <Card className="painterly-card p-8">
            <CardContent className="p-0">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-display mb-2" style={{ color: 'hsl(240, 10%, 15%)' }}>
                  Intéressé par cette galerie ?
                </h2>
                <p className="text-lg font-body" style={{ color: 'hsl(240, 10%, 35%)' }}>
                  Contactez-moi pour discuter de cette collection et de sa valeur artistique
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="hover-painterly-lift"
                  style={{
                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                    color: 'white'
                  }}
                  onClick={handleWhatsAppContact}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="hover-ink-flow painterly-card"
                  style={{ 
                    borderColor: 'hsl(330, 20%, 88%)',
                    color: 'hsl(240, 10%, 15%)'
                  }}
                  onClick={handleEmailContact}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Explore Other Galleries Section */}
        <div className={`transition-all duration-1000 ${
          isLoaded ? 'animate-fade-in-scroll' : 'opacity-0 translate-y-8'
        }`} style={{ animationDelay: '0.4s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-gradient">
              Découvrir d'autres galeries
            </h2>
            <p className="text-lg font-body" style={{ color: 'hsl(240, 10%, 35%)' }}>
              Explorez nos autres collections d'œuvres d'art
            </p>
          </div>

          {/* Other Galleries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherGalleries.map((gallery, index) => (
              <Card
                key={gallery.id}
                className={`painterly-card overflow-hidden hover-painterly-lift cursor-pointer transition-all duration-1000 ${
                  isLoaded ? 'animate-fade-in-scroll' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                onClick={() => handleGalleryClick(gallery.slug)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ProtectedImage
                    src={gallery.featuredImage}
                    alt={gallery.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-all duration-500">
                    <div className="absolute bottom-4 left-4 right-4">
                      <Button 
                        size="sm"
                        className="w-full hover-watercolor-blend"
                        style={{
                          backgroundColor: 'hsl(38, 95%, 60%)',
                          color: 'hsl(45, 100%, 97%)'
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir la galerie
                      </Button>
                    </div>
                  </div>

                  {/* Gallery Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="painterly-card" style={{
                      backgroundColor: 'rgba(251, 191, 36, 0.1)',
                      color: 'hsl(38, 95%, 60%)'
                    }}>
                      {gallery.category}
                    </Badge>
                  </div>

                  {/* Artwork Count */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white/90 text-black border-white">
                      {gallery.artworkCount} œuvres
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold font-display mb-1" style={{ color: 'hsl(240, 10%, 15%)' }}>
                        {gallery.name}
                      </h3>
                      <p className="text-sm font-body" style={{ color: 'hsl(240, 10%, 35%)' }}>
                        {gallery.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{ color: 'hsl(38, 95%, 60%)' }} />
                        <span style={{ color: 'hsl(240, 10%, 35%)' }}>{gallery.year}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4" style={{ color: 'hsl(38, 95%, 60%)' }} />
                        <span style={{ color: 'hsl(240, 10%, 35%)' }}>{gallery.category}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryDetail;

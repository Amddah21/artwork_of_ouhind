import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Calendar, Palette, Tag, Share2, MessageCircle, Star, Phone, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import StarRating from '@/components/StarRating';
import ProtectedImage from '@/components/ProtectedImage';
import { useArtwork } from '@/contexts/ArtworkContext';
import { useGallery } from '@/contexts/GalleryContext';
import { useReview } from '@/contexts/ReviewContext';

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

interface Artwork {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  images?: any[];
  size: string;
  year: number;
  available: boolean;
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
  created_at?: string;
  updated_at?: string;
  rating: number;
  ratingCount: number;
  isAvailable: boolean;
  artist: string;
}

const GalleryDetail: React.FC = () => {
  const { galleryId } = useParams<{ galleryId: string }>();
  const navigate = useNavigate();
  const { artworks } = useArtwork();
  const { getArtworkRating } = useReview();
  const { state, getGalleryBySlug, refreshGalleries } = useGallery();
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [galleryData, setGalleryData] = useState<Gallery | null>(null);
  const [categoryArtworks, setCategoryArtworks] = useState<Artwork[]>([]);
  const [otherGalleries, setOtherGalleries] = useState<Gallery[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (galleryId) {
      loadGalleryData();
    }
  }, [galleryId, state.galleries]);

  const loadGalleryData = async () => {
    if (!galleryId) return;

    try {
      setIsRefreshing(true);
      
      // Get gallery data from context
      const gallery = getGalleryBySlug(galleryId);
      if (gallery) {
        setGalleryData(gallery);
        
        // Process artworks for this category
        const processedArtworks = processArtworks(gallery.artworks);
        setCategoryArtworks(processedArtworks);
        
        // Load other galleries (exclude current one)
        const allGalleries = state.galleries.filter(g => g.slug !== galleryId);
        setOtherGalleries(allGalleries);
      } else {
        // Gallery not found, try to refresh and reload
        console.log('Gallery not found, refreshing...');
        await refreshGalleries();
        
        // Try again after refresh
        const refreshedGallery = getGalleryBySlug(galleryId);
        if (refreshedGallery) {
          setGalleryData(refreshedGallery);
          const processedArtworks = processArtworks(refreshedGallery.artworks);
          setCategoryArtworks(processedArtworks);
          const allGalleries = state.galleries.filter(g => g.slug !== galleryId);
          setOtherGalleries(allGalleries);
        } else {
          console.error('Gallery still not found after refresh');
        }
      }
    } catch (error) {
      console.error('Error loading gallery data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const processArtworks = (artworks: any[]): Artwork[] => {
    return artworks.map(artwork => ({
      ...artwork,
      rating: getArtworkRating(artwork.id).average || 0,
      ratingCount: getArtworkRating(artwork.id).count || 0,
      isAvailable: artwork.available,
      artist: artwork.artist_name || 'Mamany-Art'
    }));
  };

  // Handle contact actions
  const handleWhatsAppContact = () => {
    if (!galleryData) return;
    const message = `Bonjour ! Je suis intéressé(e) par la galerie "${galleryData.name}". Pourriez-vous me donner plus d'informations sur cette collection ?`;
    const whatsappUrl = `https://wa.me/212666672756?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailContact = () => {
    if (!galleryData) return;
    const subject = `Demande d'information - Galerie ${galleryData.name}`;
    const body = `Bonjour,\n\nJe suis intéressé(e) par la galerie "${galleryData.name}".\n\nPourriez-vous me donner plus d'informations sur cette collection et discuter de sa valeur artistique ?\n\nCordialement,`;
    const mailtoUrl = `mailto:omhind53@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const handleGalleryClick = (gallerySlug: string) => {
    navigate(`/gallery/${gallerySlug}`);
  };

  const handleArtworkClick = (artworkId: string) => {
    navigate(`/artwork/${artworkId}`);
  };

  // Show loading state
  if (state.isLoading || isRefreshing) {
    return (
      <div className="min-h-screen watercolor-bg canvas-texture flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Chargement de la galerie...</h2>
          <p className="text-slate-600">Veuillez patienter pendant que nous chargeons les œuvres</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (state.error) {
    return (
      <div className="min-h-screen watercolor-bg canvas-texture flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Erreur de chargement</h1>
          <p className="text-slate-600 mb-6">{state.error}</p>
          <div className="space-x-4">
            <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              Réessayer
            </Button>
            <Button onClick={() => navigate('/portfolio')} variant="outline">
              Retour au Portfolio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!galleryData && !state.isLoading) {
    return (
      <div className="min-h-screen watercolor-bg canvas-texture flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Galerie non trouvée</h1>
          <p className="text-slate-600 mb-6">Cette galerie n'existe pas ou a été supprimée.</p>
          <div className="space-x-4">
            <Button onClick={() => navigate('/portfolio')} className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              Retour au Portfolio
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              Actualiser
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!galleryData) return null;

  return (
    <div className="min-h-screen watercolor-bg canvas-texture">
      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 pt-4 sm:pt-8 pb-2 sm:pb-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/portfolio')}
          className="mb-4 sm:mb-6 hover-painterly-lift text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Retour au Portfolio</span>
          <span className="sm:hidden">Retour</span>
        </Button>
      </div>

      {/* Main Gallery Content */}
      <div className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
        {/* Featured Gallery Image */}
        <div className={`mb-8 sm:mb-16 transition-all duration-1000 ${
          isLoaded ? 'animate-fade-in-scroll' : 'opacity-0 translate-y-8'
        }`}>
          <Card className="painterly-card overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="relative aspect-[4/3] overflow-hidden">
              <ProtectedImage
                src={galleryData.featuredImage}
                alt={galleryData.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              
              {/* Gallery Info Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <Badge className="painterly-card text-xs sm:text-sm" style={{
                      backgroundColor: 'rgba(251, 191, 36, 0.1)',
                      color: 'hsl(38, 95%, 60%)'
                    }}>
                      {galleryData.category}
                    </Badge>
                    <Badge variant="outline" className="text-white border-white/30 text-xs sm:text-sm">
                      {galleryData.artworkCount} œuvres
                    </Badge>
                  </div>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold font-display text-white mb-1 sm:mb-2 leading-tight">
                    {galleryData.name}
                  </h1>
                  <p className="text-sm sm:text-lg text-white/90 font-body mb-2 sm:mb-4 leading-relaxed">
                    {galleryData.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-white/80">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">{galleryData.year}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">{galleryData.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Section */}
        <div className={`mb-8 sm:mb-16 transition-all duration-1000 ${
          isLoaded ? 'animate-fade-in-scroll' : 'opacity-0 translate-y-8'
        }`} style={{ animationDelay: '0.2s' }}>
          <Card className="painterly-card p-4 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold font-display mb-2" style={{ color: 'hsl(240, 10%, 15%)' }}>
              Intéressé par cette galerie ?
            </h2>
            <p className="text-slate-600 mb-4 sm:mb-6 font-body text-sm sm:text-base">
              Contactez-moi pour discuter de cette collection et de sa valeur artistique
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                onClick={handleWhatsAppContact}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base py-2 sm:py-3"
              >
                <Phone className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button 
                onClick={handleEmailContact}
                variant="outline"
                className="border-2 hover:bg-slate-50 transition-all duration-300 text-sm sm:text-base py-2 sm:py-3"
                style={{ 
                  borderColor: 'hsl(38, 95%, 60%)',
                  color: 'hsl(240, 10%, 15%)'
                }}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </Card>
        </div>

        {/* Gallery Artworks */}
        {categoryArtworks.length > 0 && (
          <div className={`mb-8 sm:mb-16 transition-all duration-1000 ${
            isLoaded ? 'animate-fade-in-scroll' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl sm:text-3xl font-bold font-display mb-6 sm:mb-8 text-center" style={{ color: 'hsl(240, 10%, 15%)' }}>
              Œuvres de cette galerie
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categoryArtworks.slice(0, 6).map((artwork, index) => (
                <Card 
                  key={artwork.id}
                  className="painterly-card overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer group"
                  onClick={() => handleArtworkClick(artwork.id)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <ProtectedImage
                      src={artwork.image_url}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <Button 
                          size="sm"
                          className="w-full bg-white/90 text-slate-800 hover:bg-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold font-display mb-1" style={{ color: 'hsl(240, 10%, 15%)' }}>
                      {artwork.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">{artwork.year}</p>
                    <div className="flex items-center justify-between">
                      <StarRating rating={artwork.rating} size="sm" />
                      <Badge variant="outline" className="text-xs">
                        {artwork.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {categoryArtworks.length > 6 && (
              <div className="text-center mt-8">
                <Button 
                  onClick={() => navigate('/portfolio')}
                  variant="outline"
                  className="border-2"
                  style={{ borderColor: 'hsl(38, 95%, 60%)' }}
                >
                  Voir toutes les œuvres
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Other Galleries */}
        {otherGalleries.length > 0 && (
          <div className={`transition-all duration-1000 ${
            isLoaded ? 'animate-fade-in-scroll' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: '0.6s' }}>
            <h2 className="text-2xl font-bold font-display mb-6 text-center" style={{ color: 'hsl(240, 10%, 15%)' }}>
              Découvrir d'autres galeries
            </h2>
            <p className="text-slate-600 text-center mb-8 font-body">
              Explorez nos autres collections d'œuvres d'art
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherGalleries.slice(0, 3).map((gallery, index) => (
                <Card 
                  key={gallery.id}
                  className="painterly-card overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer group"
                  onClick={() => handleGalleryClick(gallery.slug)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ProtectedImage
                      src={gallery.featuredImage}
                      alt={gallery.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge className="mb-2" style={{
                          backgroundColor: 'rgba(251, 191, 36, 0.1)',
                          color: 'hsl(38, 95%, 60%)'
                        }}>
                          {gallery.name}
                        </Badge>
                        <p className="text-white text-sm">
                          {gallery.artworkCount} œuvres
                        </p>
                      </div>
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
        )}
      </div>
    </div>
  );
};

export default GalleryDetail;
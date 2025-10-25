import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Eye, ShoppingCart, MessageCircle, Flag, Palette, Calendar, Tag, Star, Phone, Mail, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import StarRating from '@/components/StarRating';
import ReviewSection from '@/components/ReviewSection';
import { useRating } from '@/contexts/RatingContext';
import { useArtwork } from '@/contexts/ArtworkContext';
import '../styles/luxury-retour-button.css';

interface Artwork {
  id: string;
  title: string;
  category: string;
  image_url: string;
  images?: Array<{
    id: number;
    artwork_id: string;
    image_url: string;
    display_order: number;
    created_at: string;
    updated_at: string;
  }>;
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

const ArtworkDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addRating, getAverageRating, getRatingCount, getUserRating } = useRating();
  const { artworks, incrementViews, isLoading: artworksLoading } = useArtwork();

  // Find the artwork by ID from the context
  useEffect(() => {
    if (id) {
      // Wait for artworks to finish loading
      if (!artworksLoading) {
        const foundArtwork = artworks.find(art => art.id === id);
        if (foundArtwork) {
          setArtwork(foundArtwork);
          // Increment views when viewing artwork
          incrementViews(id);
        }
        setIsLoading(false);
      }
    }
  }, [id, artworks, artworksLoading, navigate, incrementViews]);

  // Add keyboard shortcut for back button (Escape key) - MOVED UP TO FIX HOOKS ORDER
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleBack();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleBack = () => {
    try {
      console.log('🔄 [Navigation] Starting back navigation...');
      console.log('📊 [Navigation] History length:', window.history.length);
      console.log('📍 [Navigation] Current path:', window.location.pathname);
      
      // Check if we have a referrer or can go back
      if (document.referrer && document.referrer !== window.location.href) {
        console.log('🔙 [Navigation] Using browser back navigation');
        navigate(-1);
      } else if (window.history.length > 1) {
        console.log('🔙 [Navigation] Using history back navigation');
        navigate(-1);
      } else {
        console.log('🏠 [Navigation] No history available, navigating to home');
        navigate('/');
      }
    } catch (error) {
      console.error('❌ [Navigation] Error occurred:', error);
      console.log('🏠 [Navigation] Fallback: Navigating to home');
      navigate('/');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen watercolor-bg canvas-texture flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600">Chargement de l'œuvre...</p>
        </div>
      </div>
    );
  }

  // Show error if artwork not found
  if (!artwork) {
    return (
      <div className="min-h-screen watercolor-bg canvas-texture flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Œuvre non trouvée</h1>
          <Button onClick={() => navigate('/')} className="hover-painterly-lift">
            Retour à la galerie
          </Button>
        </div>
      </div>
    );
  }

  // Get multiple views from artwork images
  const getMultipleViews = () => {
    if (artwork.images && artwork.images.length > 0) {
      return artwork.images.map((img, index) => ({
        url: img.image_url,
        alt: `${artwork.title} - Vue ${index + 1}`
      }));
    }
    // Fallback to single image
    return [{ url: artwork.image_url, alt: artwork.title }];
  };

  const multipleViews = getMultipleViews();

  const handleShare = async () => {
    const shareData = {
      title: artwork.title,
      text: `Découvrez "${artwork.title}" par ${artwork.artist_name || 'Omhind'}`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        
        // Show a temporary success message
        const button = document.querySelector('[data-share-button]') as HTMLElement;
        if (button) {
          const originalText = button.textContent;
          button.textContent = 'Lien copié !';
          button.style.backgroundColor = '#10b981';
          setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Lien copié dans le presse-papiers !');
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        alert('Impossible de partager. Veuillez copier manuellement l\'URL.');
      }
    }
  };

  const handleRating = (rating: number) => {
    addRating(artwork.id, rating);
  };


  const handleWhatsAppContact = () => {
    const message = `Bonjour ! Je suis intéressé(e) par l'œuvre "${artwork.title}" de ${artwork.artist_name || 'Omhind'}. Pourriez-vous me donner plus d'informations sur cette pièce et discuter de sa valeur artistique ?`;
    const whatsappUrl = `https://wa.me/212666672756?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailContact = () => {
    const subject = `Demande d'information - ${artwork.title}`;
    const body = `Bonjour,\n\nJe suis intéressé(e) par l'œuvre "${artwork.title}" de ${artwork.artist_name || 'Omhind'}.\n\nDimensions: ${artwork.dimensions || artwork.size}\nAnnée: ${artwork.year}\nMédium: ${artwork.medium || artwork.technique}\n\nPourriez-vous me donner plus d'informations sur cette pièce et discuter de sa valeur artistique et des modalités d'acquisition ?\n\nCordialement,`;
    const mailtoUrl = `mailto:omhind53@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  return (
    <div className="min-h-screen luxury-bg-admin">
      {/* Header */}
      <div className="luxury-nav backdrop-blur-md shadow-lg" style={{ borderBottom: '1px solid rgba(224, 168, 93, 0.2)' }}>
        <div className="luxury-container py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎨 Retour button clicked - Navigating back...');
                handleBack();
              }}
              className="luxury-retour-button group relative overflow-hidden"
              type="button"
            >
              {/* Luxury Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-xl transition-all duration-300 group-hover:from-amber-100 group-hover:via-orange-100 group-hover:to-yellow-100" />
              
              {/* Golden Border */}
              <div className="absolute inset-0 rounded-xl border-2 border-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Inner Glow */}
              <div className="absolute inset-1 rounded-lg bg-gradient-to-r from-amber-200/20 via-orange-200/20 to-yellow-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="relative flex items-center justify-center px-6 py-3 space-x-3">
                {/* Luxury Arrow Icon */}
                <div className="relative">
                  <ArrowLeft className="w-5 h-5 text-amber-700 transition-all duration-300 group-hover:text-amber-800 group-hover:scale-110" />
                  {/* Icon Glow Effect */}
                  <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Text */}
                <span className="font-luxury-display text-lg font-semibold text-amber-800 tracking-wide transition-all duration-300 group-hover:text-amber-900 group-hover:tracking-wider">
                  RETOUR
                </span>
                
                {/* Decorative Elements */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse" style={{ animationDelay: '0.2s' }} />
              </div>
              
              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Luxury Shadow */}
              <div className="absolute inset-0 rounded-xl shadow-lg shadow-amber-200/50 opacity-0 group-hover:opacity-100 group-hover:shadow-xl group-hover:shadow-amber-300/60 transition-all duration-300" />
            </button>
            <div className="flex items-center gap-4">
              <Badge 
                className="painterly-card" 
                style={{
                  backgroundColor: 'rgba(251, 191, 36, 0.1)', 
                  color: 'hsl(38, 95%, 60%)',
                  borderColor: 'rgba(251, 191, 36, 0.3)'
                }}
              >
                <Eye className="w-4 h-4 mr-1" />
                {artwork.views.toLocaleString()} vues
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Left Side - Artwork Image */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative group">
              <Card className="comfort-card overflow-hidden aspect-[4/3]">
                <img
                  src={multipleViews[currentImageIndex]?.url || artwork.image_url}
                  alt={artwork.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />

                {/* High Resolution Badge */}
                <Badge className="absolute top-4 left-4 comfort-card" style={{backgroundColor: 'rgba(248, 248, 248, 0.9)', color: '#7A6B5A'}}>
                  Haute Résolution
                </Badge>
              </Card>

              {/* Thumbnail Navigation */}
              {multipleViews.length > 1 && (
                <div className="flex gap-3 mt-4">
                  {multipleViews.map((view, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index 
                          ? 'border-[#7A6B5A] shadow-lg' 
                          : 'border-transparent hover:border-[#7A6B5A]/50'
                      }`}
                    >
                      <img
                        src={view.url}
                        alt={view.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Artwork Details */}
          <div className="space-y-8">
            
            {/* Title and Artist */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold comfort-text mb-2">
                {artwork.title}
              </h1>
              <p className="text-xl comfort-text-muted font-body">
                par <span className="font-semibold" style={{color: '#7A6B5A'}}>{artwork.artist_name || 'Omhind'}</span>
              </p>
            </div>

            {/* Artwork Details Grid */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="comfort-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(122, 107, 90, 0.1)'}}>
                    <Palette className="w-5 h-5" style={{color: '#7A6B5A'}} />
                  </div>
                  <div>
                    <p className="text-sm comfort-text-muted font-body">Technique</p>
                    <p className="font-semibold comfort-text">{artwork.technique || artwork.medium || 'Non spécifié'}</p>
                  </div>
                </div>
              </Card>

              <Card className="comfort-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(122, 107, 90, 0.1)'}}>
                    <Tag className="w-5 h-5" style={{color: '#7A6B5A'}} />
                  </div>
                  <div>
                    <p className="text-sm comfort-text-muted font-body">Dimensions</p>
                    <p className="font-semibold comfort-text">{artwork.dimensions || artwork.size || 'Non spécifié'}</p>
                  </div>
                </div>
              </Card>

              <Card className="comfort-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(122, 107, 90, 0.1)'}}>
                    <Calendar className="w-5 h-5" style={{color: '#7A6B5A'}} />
                  </div>
                  <div>
                    <p className="text-sm comfort-text-muted font-body">Année</p>
                    <p className="font-semibold comfort-text">{artwork.year}</p>
                  </div>
                </div>
              </Card>

              <Card className="comfort-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(122, 107, 90, 0.1)'}}>
                    <Tag className="w-5 h-5" style={{color: '#7A6B5A'}} />
                  </div>
                  <div>
                    <p className="text-sm comfort-text-muted font-body">Référence</p>
                    <p className="font-semibold comfort-text">{artwork.reference || 'Non spécifié'}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Story Behind the Piece */}
            {artwork.story && (
              <Card className="comfort-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-1 h-20 rounded-full" style={{backgroundColor: '#7A6B5A'}}></div>
                  <div>
                    <h3 className="text-lg font-semibold comfort-text mb-3">Histoire de cette œuvre</h3>
                    <p className="comfort-text-muted font-body leading-relaxed italic">
                      {artwork.story}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Description */}
            <Card className="comfort-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-1 h-20 rounded-full" style={{backgroundColor: '#7A6B5A'}}></div>
                <div>
                  <h3 className="text-lg font-semibold comfort-text mb-3">Description</h3>
                  <p className="comfort-text-muted font-body leading-relaxed">
                    {artwork.description}
                  </p>
                </div>
              </div>
            </Card>

            {/* Tags */}
            {artwork.tags && artwork.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold comfort-text mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="comfort-card">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <Card className="comfort-card p-6">
              <div className="text-center space-y-4">
                {/* Availability Status */}
                <Badge 
                  className={`px-4 py-2 ${
                    artwork.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {artwork.available ? 'Disponible' : 'Vendu'}
                </Badge>

                {/* Contact Information Display */}
                <div className="space-y-3 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="w-5 h-5" style={{ color: 'hsl(38, 95%, 60%)' }} />
                    <span className="font-semibold comfort-text">WhatsApp: +212 666 67 27 56</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="w-5 h-5" style={{ color: 'hsl(38, 95%, 60%)' }} />
                    <span className="font-semibold comfort-text">Email: omhind53@gmail.com</span>
                  </div>
                </div>

                {/* Art Value Display */}
                <div className="flex items-center space-x-2 py-4 border-t border-gray-200">
                  <Palette className="w-6 h-6" style={{ color: 'hsl(38, 95%, 60%)' }} />
                  <span className="text-lg font-semibold text-gradient font-display">
                    Valeur Artistique Inestimable
                  </span>
                </div>

                {/* Direct Contact Buttons */}
                <div className="space-y-3 pt-4">
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 hover-painterly-lift"
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
                      className="flex-1 hover-painterly-lift"
                      style={{
                        background: 'linear-gradient(135deg, hsl(38, 95%, 60%) 0%, hsl(38, 95%, 55%) 100%)',
                        color: 'hsl(45, 100%, 97%)'
                      }}
                      onClick={handleEmailContact}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="hover-ink-flow painterly-card"
                      style={{ 
                        borderColor: 'hsl(330, 20%, 88%)',
                        color: 'hsl(240, 10%, 15%)'
                      }}
                      onClick={handleShare}
                      data-share-button
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </Button>
                  </div>
                </div>

                {/* Acquisition Information */}
                <div className="mt-4 p-4 painterly-card rounded-lg">
                  <h4 className="font-semibold mb-2 font-body" style={{ color: 'hsl(240, 10%, 15%)' }}>
                    Modalités d'Acquisition
                  </h4>
                  <ul className="text-sm space-y-1 font-body" style={{ color: 'hsl(240, 10%, 35%)' }}>
                    <li>• Valeur artistique à discuter en privé</li>
                    <li>• Paiement en espèces uniquement</li>
                    <li>• Certificat d'authenticité inclus</li>
                    <li>• Livraison ou retrait à l'atelier</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Rating Section */}
            <Card className="comfort-card p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold comfort-text">Évaluation</h3>
                
                {/* Current Rating Display */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StarRating
                      rating={getAverageRating(artwork.id) || 4.5}
                      size="lg"
                      showCount={true}
                      count={getRatingCount(artwork.id) || 0}
                    />
                  </div>
                  <span className="text-sm comfort-text-muted">
                    Votre note: {getUserRating(artwork.id) > 0 ? getUserRating(artwork.id) : 'Non noté'}
                  </span>
                </div>

                {/* Interactive Rating */}
                <div className="pt-4 border-t border-charcoal-200">
                  <p className="text-sm comfort-text-muted mb-3">Donnez votre avis :</p>
                  <StarRating
                    rating={getUserRating(artwork.id)}
                    interactive={true}
                    onRatingChange={handleRating}
                    size="lg"
                  />
                  {getUserRating(artwork.id) > 0 && (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ Merci pour votre évaluation !
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <ReviewSection
            artworkId={artwork.id}
            artworkTitle={artwork.title}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
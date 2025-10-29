import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Eye, ShoppingCart, MessageCircle, Flag, Palette, Calendar, Tag, Star, Phone, Mail, Euro, Home, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import StarRating from '@/components/StarRating';
import ReviewSection from '@/components/ReviewSection';
import RoomPreview from '@/components/RoomPreview';
import { useRating } from '@/contexts/RatingContext';
import { useArtwork } from '@/contexts/ArtworkContext';
import '../styles/luxury-retour-button.css';
import '../styles/luxury-detail-cards.css';
import '../styles/artwork-detail-responsive.css';

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
  const [showRoomPreview, setShowRoomPreview] = useState(false);
  
  
  const { addRating, getAverageRating, getRatingCount, getUserRating } = useRating();
  const { artworks, incrementViews, isLoading: artworksLoading } = useArtwork();

  // Find the artwork by ID from the context
  useEffect(() => {
    if (id && !artworksLoading) {
      const foundArtwork = artworks.find(art => art.id === id);
      if (foundArtwork) {
        setArtwork(foundArtwork);
        setIsLoading(false);
      }
    }
  }, [id, artworks, artworksLoading]);

  // Separate effect for incrementing views to prevent infinite loop
  useEffect(() => {
    if (artwork?.id) {
      incrementViews(artwork.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artwork?.id]);

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
      
      // Simple navigation - always go to home for now
      console.log('🏠 [Navigation] Navigating to home');
      navigate('/');
    } catch (error) {
      console.error('❌ [Navigation] Error occurred:', error);
      console.log('🏠 [Navigation] Fallback: Navigating to home');
      navigate('/');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9F8F3' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ 
            borderTopColor: '#873F31',
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent'
          }}></div>
          <p className="text-lg" style={{ 
            fontFamily: "'Proza Libre', sans-serif",
            color: '#717871' /* SAGE */
          }}>
            Chargement de l'œuvre...
          </p>
        </div>
      </div>
    );
  }

  // Show error if artwork not found
  if (!artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9F8F3' }}>
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4" style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            color: '#4B4A46' /* CHARCOAL TAUPE */
          }}>
            Œuvre non trouvée
          </h1>
          <Button 
            onClick={() => navigate('/')} 
            className="transition-all duration-300 hover:shadow-xl"
            style={{
              backgroundColor: '#873F31',
              color: '#F9F8F3',
              fontFamily: "'Proza Libre', sans-serif"
            }}
          >
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
      // Check if Web Share API is supported and available
      if (navigator.share && 'canShare' in navigator) {
        // Verify if we can share the data
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }
      
      // Fallback: Try to copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        
        // Show success feedback
        const button = document.querySelector('[data-share-button]') as HTMLElement;
        if (button) {
          const originalText = button.textContent;
          const originalBg = button.style.backgroundColor;
          button.textContent = 'Lien copié !';
          button.style.backgroundColor = '#10b981';
          button.style.color = '#ffffff';
          setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = originalBg;
            button.style.color = '';
          }, 2000);
          return;
        }
      }
      
      // Last resort: Show URL in a prompt for manual copying
      prompt('Copiez ce lien:', window.location.href);
      
    } catch (error) {
      console.error('Error sharing:', error);
      
      // If sharing failed, try to copy to clipboard
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(window.location.href);
          alert('Lien copié dans le presse-papiers !');
        } else {
          // Show prompt for manual copying
          prompt('Copiez ce lien:', window.location.href);
        }
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        // Show prompt as last resort
        prompt('Copiez ce lien:', window.location.href);
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
    <div className="min-h-screen" style={{ backgroundColor: '#F9F8F3' }}> {/* FROSTY WHITE */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid lg:grid-cols-[55%_45%] gap-6 lg:gap-8">
          
          {/* Left Side - Artwork Image with Luxury Frame */}
          <div className="space-y-4 sm:space-y-6 self-start">
            {/* Main Image with Luxury Gallery Frame */}
            <div className="relative group">
              {/* Outer Frame - Gallery Style with Elegant Double Border */}
              <div 
                className="rounded-lg overflow-visible shadow-xl relative transition-all duration-500 hover:shadow-2xl p-1.5 sm:p-2 lg:p-2.5"
                style={{ 
                  backgroundColor: '#F9F8F3', /* FROSTY WHITE outer frame */
                  border: '1.5px solid rgba(122, 119, 113, 0.25)', /* SAGE outer border - reduced from 2px */
                  boxShadow: '0 12px 40px rgba(67, 76, 70, 0.15), 0 6px 20px rgba(122, 119, 113, 0.1)' /* Elegant layered shadows */
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(67, 76, 70, 0.2), 0 8px 24px rgba(122, 119, 113, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(122, 119, 113, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(67, 76, 70, 0.15), 0 6px 20px rgba(122, 119, 113, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(122, 119, 113, 0.25)';
                }}
              >
                {/* Middle Frame Layer - SAGE accent */}
                <div 
                  className="relative rounded-sm p-1 sm:p-1.5 lg:p-2"
                  style={{
                    backgroundColor: '#F9F8F3', /* FROSTY WHITE */
                    border: '1px solid rgba(122, 119, 113, 0.2)', /* SAGE accent */
                    boxShadow: 'inset 0 0 0 0.5px rgba(122, 119, 113, 0.1)'
                  }}
                >
                  {/* Inner Matting - Double Border Effect */}
                  <div 
                    className="relative rounded-sm overflow-hidden p-1 sm:p-1.5 lg:p-2"
                    style={{
                      backgroundColor: '#EBE2D1', /* PEACH CREAM matting */
                      border: '1px solid rgba(122, 119, 113, 0.15)', /* SAGE inner border */
                      boxShadow: 'inset 0 0 0 1px rgba(249, 248, 243, 0.5)' /* Inner highlight */
                    }}
                  >
                    {/* Artwork Image Container */}
                    <div 
                      className="relative w-full rounded-sm overflow-hidden transition-transform duration-700 group-hover:scale-[1.01]"
                      style={{
                        backgroundColor: 'transparent', /* Transparent - no white background */
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 0 /* Remove line-height spacing */
                      }}
                    >
                      <img
                        src={multipleViews[currentImageIndex]?.url || artwork.image_url}
                        alt={artwork.title}
                        className="w-full h-auto object-contain transition-opacity duration-500"
                        style={{ 
                          maxHeight: '85vh',
                          maxWidth: '100%',
                          display: 'block',
                          verticalAlign: 'bottom' /* Remove bottom spacing */
                        }}
                      />
                    </div>

                    {/* High Resolution Badge - Positioned on image */}
                    <Badge 
                      className="absolute top-1 right-1 sm:top-2 sm:right-2 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded border" 
                      style={{
                        backgroundColor: 'rgba(67, 76, 70, 0.92)', 
                        color: '#F9F8F3',
                        borderColor: 'rgba(122, 119, 113, 0.4)',
                        fontFamily: "'Proza Libre', sans-serif",
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                        zIndex: 10,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      Haute Résolution
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Thumbnail Navigation - Larger */}
              {multipleViews.length > 1 && (
                <div className="flex gap-3 sm:gap-4 mt-4 overflow-x-auto pb-2">
                  {multipleViews.map((view, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`border-2 rounded-lg overflow-hidden transition-all flex-shrink-0 ${
                        currentImageIndex === index 
                          ? 'ring-2 ring-offset-2 ring-[#873F31]' 
                          : ''
                      }`}
                      style={{ 
                        width: '80px', 
                        height: '80px',
                        borderColor: currentImageIndex === index ? '#873F31' : 'rgba(122, 119, 113, 0.3)'
                      }}
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

          {/* Right Side - Artwork Details - Responsive */}
          <div className="space-y-6 sm:space-y-8">
            
            {/* Title and Artist - Responsive */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-3 sm:mb-4" style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                color: '#4B4A46' /* CHARCOAL TAUPE */
              }}>
                {artwork.title}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl" style={{ 
                fontFamily: "'Proza Libre', sans-serif",
                color: '#717871' /* SAGE */
              }}>
                par <span className="font-medium" style={{ color: '#873F31' }}>{artwork.artist_name || 'Omhind'}</span>
              </p>
            </div>

            {/* 1. Description - First */}
            <Card className="p-4 sm:p-6 rounded-lg border shadow-sm" style={{ 
              backgroundColor: '#F9F8F3',
              borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */
            }}>
              <div>
                <h3 className="text-base sm:text-lg font-medium mb-3 uppercase tracking-wider" style={{ 
                  fontFamily: "'Proza Libre', sans-serif",
                  color: '#717871' /* SAGE */
                }}>
                  Description
                </h3>
                <p className="leading-relaxed" style={{ 
                  fontFamily: "'Proza Libre', sans-serif",
                  color: '#4B4A46' /* CHARCOAL TAUPE */
                }}>
                  {artwork.description}
                </p>
              </div>
            </Card>

            {/* 2-5. Artwork Details Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* 2. Technique */}
              <Card className="p-4 rounded-lg border shadow-sm" style={{ 
                backgroundColor: '#F9F8F3',
                borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(122, 119, 113, 0.08)' }}>
                    <Palette className="w-6 h-6" style={{ color: '#873F31' }} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#717871' /* SAGE */
                    }}>
                      Technique
                    </p>
                    <p className="font-medium" style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#4B4A46' /* CHARCOAL TAUPE */
                    }}>
                      {artwork.technique || artwork.medium || 'Non spécifié'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* 3. Dimensions */}
              <Card className="p-4 rounded-lg border shadow-sm" style={{ 
                backgroundColor: '#F9F8F3',
                borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(122, 119, 113, 0.08)' }}>
                    <Tag className="w-6 h-6" style={{ color: '#873F31' }} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#717871' /* SAGE */
                    }}>
                      Dimensions
                    </p>
                    <p className="font-medium" style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#4B4A46' /* CHARCOAL TAUPE */
                    }}>
                      {artwork.dimensions || artwork.size || 'Non spécifié'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* 4. Année */}
              <Card className="p-4 rounded-lg border shadow-sm" style={{ 
                backgroundColor: '#F9F8F3',
                borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(122, 119, 113, 0.08)' }}>
                    <Calendar className="w-6 h-6" style={{ color: '#873F31' }} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#717871' /* SAGE */
                    }}>
                      Année
                    </p>
                    <p className="font-medium" style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#4B4A46' /* CHARCOAL TAUPE */
                    }}>
                      {artwork.year}
                    </p>
                  </div>
                </div>
              </Card>

              {/* 5. Référence */}
              <Card className="p-4 rounded-lg border shadow-sm" style={{ 
                backgroundColor: '#F9F8F3',
                borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(122, 119, 113, 0.08)' }}>
                    <Tag className="w-6 h-6" style={{ color: '#873F31' }} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#717871' /* SAGE */
                    }}>
                      Référence
                    </p>
                    <p className="font-medium" style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#4B4A46' /* CHARCOAL TAUPE */
                    }}>
                      {artwork.reference || 'Non spécifié'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Story Behind the Piece */}
            {artwork.story && (
              <Card className="p-6 rounded-lg border shadow-sm" style={{ 
                backgroundColor: '#F9F8F3',
                borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */
              }}>
                <div className="flex items-start gap-4">
                  <div className="w-1 h-20 rounded-full" style={{backgroundColor: '#873F31'}}></div>
                  <div>
                    <h3 className="text-lg font-medium mb-3" style={{ 
                      fontFamily: "'Cormorant Garamond', serif",
                      color: '#4B4A46' /* CHARCOAL TAUPE */
                    }}>
                      Histoire de cette œuvre
                    </h3>
                    <p className="leading-relaxed italic" style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#717871' /* SAGE */
                    }}>
                      {artwork.story}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Tags */}
            {artwork.tags && artwork.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3" style={{ 
                  fontFamily: "'Proza Libre', sans-serif",
                  color: '#717871' /* SAGE */
                }}>
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1 rounded-lg border" style={{
                      backgroundColor: 'rgba(122, 119, 113, 0.08)',
                      color: '#717871',
                      borderColor: 'rgba(122, 119, 113, 0.3)',
                      fontFamily: "'Proza Libre', sans-serif"
                    }}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <Card className="p-6 rounded-lg border shadow-sm" style={{ 
              backgroundColor: '#F9F8F3',
              borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */
            }}>
              <div className="text-center space-y-4">
                {/* Availability Status */}
                <Badge 
                  className="px-4 py-2 rounded-lg border"
                  style={{
                    backgroundColor: artwork.available ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                    color: artwork.available ? '#22c55e' : '#717871',
                    borderColor: artwork.available ? '#22c55e' : 'rgba(122, 119, 113, 0.3)',
                    fontFamily: "'Proza Libre', sans-serif",
                    fontWeight: 600
                  }}
                >
                  {artwork.available ? 'Disponible' : 'Vendu'}
                </Badge>

                {/* Contact Information Display */}
                <div className="space-y-3 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="w-5 h-5" style={{ color: '#873F31' }} />
                    <span className="font-medium" style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#4B4A46' /* CHARCOAL TAUPE */
                    }}>
                      WhatsApp: +212 666 67 27 56
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="w-5 h-5" style={{ color: '#873F31' }} />
                    <span className="font-medium" style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#4B4A46' /* CHARCOAL TAUPE */
                    }}>
                      Email: omhind53@gmail.com
                    </span>
                  </div>
                </div>

                {/* Art Value Display */}
                <div className="flex items-center justify-center space-x-2 py-4 border-t" style={{ borderColor: 'rgba(122, 119, 113, 0.2)' }}>
                  <Palette className="w-6 h-6" style={{ color: '#873F31' }} />
                  <span className="text-lg font-medium" style={{ 
                    fontFamily: "'Cormorant Garamond', serif",
                    color: '#4B4A46' /* CHARCOAL TAUPE */
                  }}>
                    Valeur Artistique Inestimable
                  </span>
                </div>

                {/* Direct Contact Buttons */}
                <div className="space-y-3 pt-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="flex-1 transition-all duration-300 hover:shadow-xl"
                      style={{
                        backgroundColor: '#25D366',
                        color: '#F9F8F3',
                        fontFamily: "'Proza Libre', sans-serif"
                      }}
                      onClick={handleWhatsAppContact}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button 
                      className="flex-1 transition-all duration-300 hover:shadow-xl"
                      style={{
                        backgroundColor: '#873F31', /* PIPE */
                        color: '#F9F8F3',
                        fontFamily: "'Proza Libre', sans-serif"
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
                      className="w-full transition-all duration-300"
                      style={{ 
                        borderColor: 'rgba(122, 119, 113, 0.3)',
                        color: '#717871',
                        backgroundColor: 'transparent',
                        fontFamily: "'Proza Libre', sans-serif"
                      }}
                      onClick={() => setShowRoomPreview(true)}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Voir en situation
                    </Button>
                  </div>
                </div>

                {/* Acquisition Information */}
                <div className="mt-4 p-4 rounded-lg border" style={{ 
                  backgroundColor: 'rgba(122, 119, 113, 0.04)',
                  borderColor: 'rgba(122, 119, 113, 0.2)'
                }}>
                  <h4 className="font-medium mb-2" style={{ 
                    fontFamily: "'Proza Libre', sans-serif",
                    color: '#4B4A46' /* CHARCOAL TAUPE */
                  }}>
                    Modalités d'Acquisition
                  </h4>
                  <ul className="text-sm space-y-1" style={{ 
                    fontFamily: "'Proza Libre', sans-serif",
                    color: '#717871' /* SAGE */
                  }}>
                    <li>• Valeur artistique à discuter en privé</li>
                    <li>• Paiement en espèces uniquement</li>
                    <li>• Certificat d'authenticité inclus</li>
                    <li>• Livraison ou retrait à l'atelier</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Rating Section */}
            <Card className="p-6 rounded-lg border shadow-sm" style={{ 
              backgroundColor: '#F9F8F3',
              borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */
            }}>
              <div className="space-y-4">
                <h3 className="text-lg font-medium" style={{ 
                  fontFamily: "'Cormorant Garamond', serif",
                  color: '#4B4A46' /* CHARCOAL TAUPE */
                }}>
                  Évaluation
                </h3>
                
                {/* Current Rating Display */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <StarRating
                      rating={getAverageRating(artwork.id) || 4.5}
                      size="lg"
                      showCount={true}
                      count={getRatingCount(artwork.id) || 0}
                    />
                  </div>
                  <span className="text-sm" style={{ 
                    fontFamily: "'Proza Libre', sans-serif",
                    color: '#717871' /* SAGE */
                  }}>
                    Votre note: {getUserRating(artwork.id) > 0 ? getUserRating(artwork.id) : 'Non noté'}
                  </span>
                </div>

                {/* Interactive Rating */}
                <div className="pt-4 border-t" style={{ borderColor: 'rgba(122, 119, 113, 0.2)' }}>
                  <p className="text-sm mb-3" style={{ 
                    fontFamily: "'Proza Libre', sans-serif",
                    color: '#717871' /* SAGE */
                  }}>
                    Donnez votre avis :
                  </p>
                  <StarRating
                    rating={getUserRating(artwork.id)}
                    interactive={true}
                    onRatingChange={handleRating}
                    size="lg"
                  />
                  {getUserRating(artwork.id) > 0 && (
                    <p className="text-xs mt-2" style={{ color: '#22c55e' }}>
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
      
      {/* Room Preview Modal */}
      {showRoomPreview && (
        <RoomPreview
          artwork={artwork}
          onClose={() => setShowRoomPreview(false)}
        />
      )}
    </div>
  );
};

export default ArtworkDetail;
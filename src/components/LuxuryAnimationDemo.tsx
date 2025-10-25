import React, { useState, useEffect } from 'react';
import { Star, Eye, Share2, Sparkles, Zap, Crown } from 'lucide-react';
import LuxuryArtworkCarousel from './LuxuryArtworkCarousel';

interface Artwork {
  id: string;
  title: string;
  image_url: string;
  year: number;
  category: string;
  description: string;
  rating: number;
  ratingCount: number;
}

const LuxuryAnimationDemo: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<'carousel' | 'gallery' | 'modal'>('carousel');

  // Sample artwork data for demonstration
  const sampleArtworks: Artwork[] = [
    {
      id: '1',
      title: 'Harmonie Dorée',
      image_url: '/artwork1.JPG',
      year: 2024,
      category: 'Peinture',
      description: 'Une œuvre captivante qui explore les nuances de l\'or et de la lumière.',
      rating: 4.8,
      ratingCount: 127
    },
    {
      id: '2',
      title: 'Rêves Aquatiques',
      image_url: '/artwork2.JPG',
      year: 2024,
      category: 'Aquarelle',
      description: 'Une composition fluide inspirée par les mouvements de l\'eau.',
      rating: 4.9,
      ratingCount: 89
    },
    {
      id: '3',
      title: 'Éclats de Vie',
      image_url: '/artwork3.JPG',
      year: 2024,
      category: 'Mixte',
      description: 'Une explosion de couleurs qui célèbre la vitalité de l\'existence.',
      rating: 4.7,
      ratingCount: 156
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen luxury-bg-secondary py-12">
      <div className="luxury-container">
        
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center space-x-3 mb-8 px-8 py-4 rounded-full" style={{ 
            backgroundColor: 'rgba(224, 168, 93, 0.1)', 
            border: '1px solid rgba(224, 168, 93, 0.2)' 
          }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--luxury-gold)' }}>
              <Crown className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-luxury-body font-medium luxury-text-secondary uppercase tracking-wider">
              Animations Luxueuses
            </span>
          </div>
          
          <h1 className="text-6xl font-luxury-display luxury-text-primary mb-6">
            GALERIE D'ART PREMIUM
          </h1>
          
          <p className="text-xl max-w-4xl mx-auto leading-relaxed font-luxury-body luxury-text-secondary">
            Découvrez les animations les plus sophistiquées et luxueuses pour une expérience artistique inoubliable.
          </p>
        </div>

        {/* Demo Selection */}
        <div className={`flex justify-center mb-12 transition-all duration-1000 ${
          isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
        }`} style={{ animationDelay: '0.2s' }}>
          <div className="flex space-x-4 bg-white/50 backdrop-blur-sm rounded-full p-2">
            <button
              onClick={() => setSelectedDemo('carousel')}
              className={`px-6 py-3 rounded-full transition-all duration-300 luxury-magnetic-hover ${
                selectedDemo === 'carousel' 
                  ? 'luxury-btn-primary' 
                  : 'luxury-text-secondary hover:luxury-text-gold'
              }`}
            >
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Carousel Luxueux
            </button>
            <button
              onClick={() => setSelectedDemo('gallery')}
              className={`px-6 py-3 rounded-full transition-all duration-300 luxury-magnetic-hover ${
                selectedDemo === 'gallery' 
                  ? 'luxury-btn-primary' 
                  : 'luxury-text-secondary hover:luxury-text-gold'
              }`}
            >
              <Zap className="w-4 h-4 mr-2 inline" />
              Grille Animée
            </button>
            <button
              onClick={() => setSelectedDemo('modal')}
              className={`px-6 py-3 rounded-full transition-all duration-300 luxury-magnetic-hover ${
                selectedDemo === 'modal' 
                  ? 'luxury-btn-primary' 
                  : 'luxury-text-secondary hover:luxury-text-gold'
              }`}
            >
              <Eye className="w-4 h-4 mr-2 inline" />
              Modal Premium
            </button>
          </div>
        </div>

        {/* Demo Content */}
        <div className={`transition-all duration-1000 ${
          isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
        }`} style={{ animationDelay: '0.4s' }}>
          
          {selectedDemo === 'carousel' && (
            <div className="mb-12">
              <h2 className="text-3xl font-luxury-display luxury-text-primary text-center mb-8">
                Carousel d'Artwork Luxueux
              </h2>
              <LuxuryArtworkCarousel artworks={sampleArtworks} />
            </div>
          )}

          {selectedDemo === 'gallery' && (
            <div className="mb-12">
              <h2 className="text-3xl font-luxury-display luxury-text-primary text-center mb-8">
                Grille d'Artworks avec Animations
              </h2>
              <div className="luxury-grid luxury-grid-3 gap-8">
                {sampleArtworks.map((artwork, index) => (
                  <div
                    key={artwork.id}
                    className={`luxury-gallery-item luxury-artwork-hover luxury-golden-glow luxury-sparkle-effect cursor-pointer ${
                      isLoaded ? 'luxury-artwork-entrance' : 'opacity-0 scale-95'
                    }`}
                    style={{ animationDelay: `${0.6 + index * 0.15}s` }}
                  >
                    <div className="luxury-card-premium overflow-hidden">
                      <div className="relative aspect-square overflow-hidden luxury-image-reveal">
                        <img
                          src={artwork.image_url}
                          alt={artwork.title}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="luxury-gallery-overlay" />
                        
                        {/* Floating Elements */}
                        <div className="absolute top-4 left-4 w-8 h-8 luxury-floating-elements" style={{ animationDelay: `${index * 0.2}s` }}>
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 opacity-20 animate-pulse"></div>
                        </div>
                        <div className="absolute bottom-4 right-4 w-6 h-6 luxury-floating-elements" style={{ animationDelay: `${index * 0.3}s` }}>
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-pink-400 opacity-20 animate-pulse"></div>
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        <h3 className="text-xl font-luxury-accent luxury-text-primary">
                          {artwork.title}
                        </h3>
                        <p className="text-sm font-luxury-body luxury-text-secondary uppercase tracking-wider">
                          {artwork.category} • {artwork.year}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm luxury-text-secondary">
                            {artwork.rating} ({artwork.ratingCount})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedDemo === 'modal' && (
            <div className="mb-12">
              <h2 className="text-3xl font-luxury-display luxury-text-primary text-center mb-8">
                Modal d'Artwork Premium
              </h2>
              <div className="max-w-2xl mx-auto">
                <div className="luxury-card-premium p-8 text-center">
                  <div className="mb-6">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center luxury-floating-elements">
                      <Eye className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-luxury-display luxury-text-primary mb-2">
                      Modal Luxueux
                    </h3>
                    <p className="luxury-text-secondary">
                      Cliquez sur une œuvre pour voir le modal avec animations premium
                    </p>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    {sampleArtworks.map((artwork, index) => (
                      <div
                        key={artwork.id}
                        className="w-20 h-20 rounded-lg overflow-hidden luxury-magnetic-hover cursor-pointer"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <img
                          src={artwork.image_url}
                          alt={artwork.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Showcase */}
        <div className={`mt-20 transition-all duration-1000 ${
          isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
        }`} style={{ animationDelay: '0.8s' }}>
          <h2 className="text-4xl font-luxury-display luxury-text-primary text-center mb-12">
            Fonctionnalités Luxueuses
          </h2>
          
          <div className="luxury-grid luxury-grid-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'Animations Dorées',
                description: 'Effets de brillance et d\'éclat avec des tons dorés sophistiqués'
              },
              {
                icon: Zap,
                title: 'Transitions Fluides',
                description: 'Animations smooth avec des courbes de Bézier optimisées'
              },
              {
                icon: Crown,
                title: 'Expérience Premium',
                description: 'Interface luxueuse digne des plus grandes galeries d\'art'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`luxury-card text-center p-8 luxury-artwork-hover ${
                  isLoaded ? 'luxury-artwork-entrance' : 'opacity-0 scale-95'
                }`}
                style={{ animationDelay: `${1.0 + index * 0.15}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--luxury-gold)' }}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-luxury-accent luxury-text-primary mb-4">
                  {feature.title}
                </h3>
                <p className="luxury-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuxuryAnimationDemo;

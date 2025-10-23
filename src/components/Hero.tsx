import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { ArrowRight, Palette, Award, Users, Globe, Brush, Sparkles } from 'lucide-react';
import Logo from './Logo';
import { useArtwork } from '@/contexts/ArtworkContext';
import ProtectedImage from './ProtectedImage';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const { artworks } = useArtwork();
  
  // Get featured artworks for the carousel
  const featuredArtworks = artworks.slice(0, 6); // Get first 6 artworks
  
  // Get the artist name from the first artwork or use default
  const artistName = artworks.length > 0 && artworks[0].artist_name 
    ? artworks[0].artist_name 
    : 'Omhind';

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Auto-rotate artwork every 10 seconds
  useEffect(() => {
    if (featuredArtworks.length > 0) {
      const interval = setInterval(() => {
        setCurrentArtworkIndex((prev) => (prev + 1) % featuredArtworks.length);
      }, 10000); // 10 seconds

      return () => clearInterval(interval);
    }
  }, [featuredArtworks.length]);

  const handleScrollDown = () => {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  const handleExploreGallery = () => {
    setTimeout(() => {
      const portfolioSection = document.getElementById('portfolio');
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleViewWorks = () => {
    setTimeout(() => {
      const portfolioSection = document.getElementById('portfolio');
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section 
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden luxury-bg-admin"
    >
      {/* Luxury art gallery background */}
      <div className="absolute inset-0">
        {/* Sophisticated gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(254, 252, 232, 0.9) 50%, rgba(255, 247, 237, 0.95) 100%)'
          }}
        />
        
        {/* Elegant gold accents */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-2xl" />
        </div>
        
        {/* Subtle texture overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E0A85D' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="luxury-container relative z-10">
        <div className="text-center space-y-12">
          
          {/* Elegant Title */}
          <div className={`transition-all duration-1000 ${
            isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
          }`}>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--luxury-gold)' }}>
                  <Logo size="md" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-luxury-display luxury-text-primary tracking-wide leading-tight mb-4 sm:mb-6 px-4">
                {artistName.toUpperCase()}
              </h1>
              <div className="w-24 sm:w-32 h-px mx-auto mb-4 sm:mb-6" style={{ background: 'linear-gradient(90deg, transparent 0%, var(--luxury-gold) 50%, transparent 100%)' }} />
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-luxury-accent luxury-text-secondary max-w-3xl mx-auto leading-relaxed px-4">
                NEW SERIES OF ARTWORKS
              </p>
            </div>
          </div>

          {/* Main Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4 transition-all duration-1000 ${
            isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: '0.3s' }}>
            <button 
              onClick={handleExploreGallery}
              className="luxury-btn-gradient px-8 sm:px-16 py-3 sm:py-5 text-base sm:text-lg font-semibold rounded-full shadow-2xl w-full sm:w-auto"
            >
              ORIGINALS
            </button>
            <button 
              onClick={handleViewWorks}
              className="luxury-btn-secondary px-8 sm:px-16 py-3 sm:py-5 text-base sm:text-lg font-semibold rounded-full w-full sm:w-auto"
            >
              PRINTS
            </button>
          </div>

          {/* Subtle Description */}
          <div className={`max-w-4xl mx-auto px-4 transition-all duration-1000 ${
            isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: '0.6s' }}>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-luxury-body luxury-text-secondary leading-relaxed text-center">
              Artiste peintre passionnée, je crée des œuvres qui capturent l'essence de la beauté naturelle à travers des techniques mixtes et une palette de couleurs inspirées de la nature.
            </p>
          </div>

          {/* Luxury Artwork Carousel - 20cm x 20cm frame */}
          {featuredArtworks.length > 0 && (
            <div className={`transition-all duration-1000 ${
              isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '0.9s' }}>
              <div className="flex justify-center">
                <div 
                  className="luxury-card-premium overflow-hidden relative shadow-2xl mx-4"
                  style={{
                    width: '100%',
                    maxWidth: '800px',
                    aspectRatio: '1/1'
                  }}
                >
                  {/* Fade transition effect */}
                  <div className="relative w-full h-full">
                    {featuredArtworks.map((artwork, index) => (
                      <div
                        key={artwork.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                          index === currentArtworkIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <ProtectedImage
                          src={artwork.image_url}
                          alt={artwork.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    
                    {/* Gold decorative frame overlay */}
                    <div className="absolute inset-0 border-4 opacity-40" style={{ borderColor: 'var(--luxury-gold)' }} />
                    
                    {/* Artwork title overlay */}
                    {featuredArtworks[currentArtworkIndex] && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-8">
                        <h3 className="text-white font-luxury-accent text-xl font-bold text-center mb-2">
                          {featuredArtworks[currentArtworkIndex].title}
                        </h3>
                        <p className="text-white/80 text-sm font-luxury-body text-center">
                          {featuredArtworks[currentArtworkIndex].year} • {featuredArtworks[currentArtworkIndex].category}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced indicator dots */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
                    {featuredArtworks.map((_, index) => (
                      <div
                        key={index}
                        className={`transition-all duration-300 ${
                          index === currentArtworkIndex 
                            ? 'w-3 h-3 bg-white shadow-lg' 
                            : 'w-2 h-2 bg-white/40'
                        } rounded-full`}
                      />
                    ))}
                  </div>

                  {/* Gold corner accents */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: 'var(--luxury-gold)' }} />
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: 'var(--luxury-gold)' }} />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: 'var(--luxury-gold)' }} />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: 'var(--luxury-gold)' }} />
                </div>
              </div>
            </div>
          )}

          {/* Elegant Stats */}
          <div className={`luxury-grid luxury-grid-3 gap-4 sm:gap-6 lg:gap-8 pt-8 sm:pt-12 px-4 transition-all duration-1000 ${
            isLoaded ? 'luxury-animate-fade-in' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: '1.2s' }}>
            {[
              { number: "40+", label: "Années d'Expérience" },
              { number: "200+", label: "Œuvres Créées" },
              { number: "50+", label: "Expositions" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="luxury-card-premium p-4 sm:p-6 lg:p-8 text-center hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-luxury-display luxury-text-gradient mb-2 sm:mb-4">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm font-luxury-body luxury-text-secondary uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Elegant Scroll Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10 cursor-pointer"
        onClick={handleScrollDown}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleScrollDown();
          }
        }}
        aria-label="Scroll down to portfolio section"
      >
        <div className="w-10 h-14 border-2 rounded-full flex justify-center shadow-lg" style={{ 
          borderColor: 'var(--luxury-gold)', 
          backgroundColor: 'rgba(250, 248, 245, 0.9)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="w-2 h-4 rounded-full mt-2 animate-pulse" style={{ backgroundColor: 'var(--luxury-gold)' }} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useArtwork } from '@/contexts/ArtworkContext';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { artworks } = useArtwork();
  const navigate = useNavigate();
  
  const artistName = artworks.length > 0 && artworks[0].artist_name 
    ? artworks[0].artist_name 
    : 'Omhind';
  
  const featuredArtwork = artworks.length > 0 ? artworks[0] : null;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleScrollDown = () => {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreGallery = () => {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewArtwork = () => {
    if (featuredArtwork) {
      navigate(`/artwork/${featuredArtwork.id}`);
    }
  };

  return (
    <section 
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center"
      style={{ 
        backgroundColor: '#F9F8F3', /* FROSTY WHITE exact from brand */
        backgroundImage: 'radial-gradient(ellipse 800px 600px at 50% 50%, rgba(122, 7%, 50%, 0.02) 0%, transparent 100%)' /* Very subtle SAGE for depth */
      }}
    >

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Brand & Content */}
          <div className={`space-y-6 sm:space-y-8 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          
            {/* Artist Name & Tagline */}
            <div>
              <div 
                className="text-xs sm:text-sm uppercase tracking-widest mb-4"
                style={{ fontFamily: "'Proza Libre', sans-serif", color: 'hsl(122, 7%, 50%)' }}
              >
                Collection Exclusive
              </div>
              <h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium mb-3 sm:mb-4 leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: 'hsl(43, 77%, 13%)' }}
              >
                {artistName}
              </h1>
              <p 
                className="text-base sm:text-lg md:text-xl mb-6"
                style={{ fontFamily: "'Proza Libre', sans-serif", color: 'hsl(122, 7%, 50%)' }}
              >
                Artiste Plasticienne • Art Contemporain
              </p>
              <div className="w-16 sm:w-24 h-0.5 mb-8" style={{ backgroundColor: 'hsl(122, 7%, 50%, 0.3)' }} />
            </div>

            {/* Artist Description */}
            <div className="space-y-4">
              <p 
                className="text-base sm:text-lg leading-relaxed"
                style={{ fontFamily: "'Proza Libre', sans-serif", color: 'hsl(43, 77%, 13%, 0.8)' }}
              >
                Artiste plasticienne renommée, je façonne des œuvres singulières qui transcendent l'ordinaire, 
                mêlant matériaux précieux et couleurs sublimes pour créer des compositions d'une élégance rare.
              </p>
            </div>

            {/* Action Buttons - Luxury Art Style */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={handleExploreGallery}
                className="px-8 py-4 text-base font-medium rounded-lg transition-all duration-500 w-full sm:w-auto relative overflow-hidden group luxury-btn-primary-custom"
                style={{ 
                  backgroundColor: 'hsl(15, 85%, 18%)',
                  color: 'hsl(52, 15%, 97%)',
                  fontFamily: "'Proza Libre', sans-serif",
                  boxShadow: '0 4px 20px hsla(15, 85%, 18%, 0.3), 0 2px 8px hsla(15, 85%, 18%, 0.2)',
                  border: '1px solid hsla(15, 85%, 22%, 0.3)'
                }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 shimmer-sweep" />
                <span className="relative z-10 tracking-wide font-medium">Découvrir la Collection</span>
              </button>
              {featuredArtwork && (
                <button 
                  onClick={handleViewArtwork}
                  className="px-8 py-4 text-base font-medium rounded-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all duration-500 w-full sm:w-auto relative overflow-hidden group"
                  style={{ 
                    backgroundColor: 'hsl(52, 15%, 97%)',
                    color: 'hsl(15, 85%, 18%)',
                    border: '2px solid hsl(15, 85%, 18%)',
                    fontFamily: "'Proza Libre', sans-serif",
                    boxShadow: '0 2px 12px hsla(122, 7%, 50%, 0.1), 0 0 0 1px hsla(122, 7%, 50%, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 6px 24px hsla(15, 85%, 18%, 0.2), 0 2px 8px hsla(122, 7%, 50%, 0.15)';
                    e.currentTarget.style.borderColor = 'hsl(15, 85%, 22%)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 12px hsla(122, 7%, 50%, 0.1), 0 0 0 1px hsla(122, 7%, 50%, 0.05)';
                    e.currentTarget.style.borderColor = 'hsl(15, 85%, 18%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Hover background fill */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[calc(0.5rem-2px)]"
                    style={{ 
                      background: 'linear-gradient(135deg, hsla(15, 85%, 18%, 0.06) 0%, hsla(15, 85%, 22%, 0.04) 100%)'
                    }}
                  />
                  <span className="relative z-10 tracking-wide font-medium">Dernière Œuvre</span>
                  <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-500" style={{ color: 'hsl(15, 85%, 18%)', strokeWidth: 2 }} />
                </button>
              )}
            </div>

            {/* Statistics */}
            <div className={`grid grid-cols-3 gap-4 pt-8 transition-all duration-1000 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`} style={{ animationDelay: '0.5s' }}>
              {[
                { number: "40+", label: "Années" },
                { number: "200+", label: "Œuvres" },
                { number: "50+", label: "Expos" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="text-center p-4 rounded-lg border hover:shadow-md transition-all duration-300"
                  style={{ 
                    borderColor: 'hsl(122, 7%, 50%, 0.2)',
                    backgroundColor: 'hsl(52, 15%, 97%)'
                  }}
                >
                  <div 
                    className="text-2xl sm:text-3xl lg:text-4xl font-medium mb-1"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: 'hsl(15, 85%, 18%)' }}
                  >
                    {stat.number}
                  </div>
                  <div 
                    className="text-xs sm:text-sm uppercase tracking-wide"
                    style={{ fontFamily: "'Proza Libre', sans-serif", color: 'hsl(122, 7%, 50%)' }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Featured Artwork with Luxury Frame */}
          {featuredArtwork && (
            <div className={`relative transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`} style={{ animationDelay: '0.3s' }}>
              {/* Luxury Gallery Frame - Elegant and Refined */}
              <div 
                className="relative cursor-pointer group transition-all duration-500 hover:shadow-2xl rounded-lg overflow-visible p-1.5 sm:p-2 lg:p-2.5"
                onClick={handleViewArtwork}
                style={{ 
                  backgroundColor: '#F9F8F3' /* FROSTY WHITE outer frame */,
                  border: '1.5px solid rgba(122, 119, 113, 0.25)' /* SAGE outer border */,
                  boxShadow: '0 12px 40px rgba(67, 76, 70, 0.15), 0 6px 20px rgba(122, 119, 113, 0.1)' /* Elegant layered shadows */
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(67, 76, 70, 0.2), 0 8px 24px rgba(122, 119, 113, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(122, 119, 113, 0.35)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(67, 76, 70, 0.15), 0 6px 20px rgba(122, 119, 113, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(122, 119, 113, 0.25)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Middle Frame Layer - SAGE accent */}
                <div 
                  className="relative rounded-sm p-1 sm:p-1.5 lg:p-2"
                  style={{
                    backgroundColor: '#F9F8F3' /* FROSTY WHITE */,
                    border: '1px solid rgba(122, 119, 113, 0.2)' /* SAGE accent */
                  }}
                >
                  {/* Inner Matting - PEACH CREAM */}
                  <div 
                    className="relative rounded-sm overflow-hidden p-1 sm:p-1.5 lg:p-2"
                    style={{
                      backgroundColor: '#EBE2D1' /* PEACH CREAM matting */,
                      border: '1px solid rgba(122, 119, 113, 0.15)' /* SAGE inner border */
                    }}
                  >
                    {/* Artwork Image Container */}
                    <div 
                      className="relative w-full aspect-square rounded-sm overflow-hidden transition-transform duration-700 group-hover:scale-[1.01]"
                      style={{
                        backgroundColor: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 0
                      }}
                    >
                      <img
                        src={featuredArtwork.image_url}
                        alt={featuredArtwork.title}
                        className="w-full h-full object-contain transition-opacity duration-500"
                        style={{ 
                          display: 'block',
                          verticalAlign: 'bottom'
                        }}
                      />
                      
                      {/* Hover overlay - Elegant */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-start p-4 sm:p-6 pointer-events-none">
                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          <div 
                            className="text-lg sm:text-xl lg:text-2xl font-medium mb-1 text-white drop-shadow-lg"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                          >
                            {featuredArtwork.title}
                          </div>
                          <div 
                            className="text-xs sm:text-sm text-white/90 drop-shadow-md"
                            style={{ fontFamily: "'Proza Libre', sans-serif" }}
                          >
                            Voir l'œuvre
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer animate-bounce"
        onClick={handleScrollDown}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleScrollDown();
          }
        }}
        aria-label="Scroll down"
      >
        <div className="w-8 h-10 sm:w-10 sm:h-14 border-2 rounded-full flex justify-center shadow-lg" style={{ 
          borderColor: 'hsl(122, 7%, 50%)',
          backgroundColor: 'hsl(52, 15%, 97%, 0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="w-1.5 h-3 sm:w-2 sm:h-4 rounded-full mt-2 animate-pulse" style={{ backgroundColor: 'hsl(122, 7%, 50%)' }} />
        </div>
      </div>
    </section>
  );
};

export default Hero;

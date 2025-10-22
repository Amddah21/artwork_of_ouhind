import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { ArrowRight, Palette, Award, Users, Globe, Brush, Sparkles } from 'lucide-react';
import Logo from './Logo';
import { useArtwork } from '@/contexts/ArtworkContext';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { artworks } = useArtwork();
  
  // Get the artist name from the first artwork or use default
  const artistName = artworks.length > 0 && artworks[0].artist_name 
    ? artworks[0].artist_name 
    : 'Omhind';

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleScrollDown = () => {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: scroll down by viewport height
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  const handleExploreGallery = () => {
    // Add a small delay for visual feedback
    setTimeout(() => {
      const portfolioSection = document.getElementById('portfolio');
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback: scroll down by viewport height
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleViewWorks = () => {
    // Add a small delay for visual feedback
    setTimeout(() => {
      const portfolioSection = document.getElementById('portfolio');
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback: scroll down by viewport height
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section 
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden watercolor-bg canvas-texture"
    >
      {/* Animated Background with flowing watercolor gradients */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 animate-watercolor-flow" 
          style={{ 
            background: 'linear-gradient(135deg, hsl(48, 100%, 97%) 0%, hsl(45, 100%, 95%) 25%, hsl(200, 30%, 94%) 50%, hsl(280, 20%, 95%) 75%, hsl(48, 100%, 97%) 100%)',
            backgroundSize: '400% 400%' 
          }} 
        />
        <div 
          className="absolute inset-0 animate-watercolor-flow" 
          style={{ 
            background: 'linear-gradient(45deg, hsl(330, 20%, 96%) 0%, hsl(330, 20%, 96%, 0.8) 40%, hsl(45, 100%, 95%, 0.9) 100%)',
            backgroundSize: '300% 300%', 
            animationDelay: '1s' 
          }} 
        />
      </div>

      {/* Floating brush strokes decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 opacity-20 animate-floatingBrush">
          <Brush className="w-full h-full" style={{ color: 'hsl(38, 95%, 60%)' }} />
        </div>
        <div className="absolute top-40 right-20 w-12 h-12 opacity-15 animate-floatingBrush" style={{ animationDelay: '2s' }}>
          <Sparkles className="w-full h-full" style={{ color: 'hsl(330, 20%, 60%)' }} />
        </div>
        <div className="absolute bottom-32 left-1/4 w-14 h-14 opacity-25 animate-floatingBrush" style={{ animationDelay: '4s' }}>
          <Palette className="w-full h-full" style={{ color: 'hsl(38, 95%, 60%)' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-20 relative z-10">
        <div className="grid lg:grid-cols-5 gap-6 sm:gap-12 items-center">
          {/* Left Side - 60% (3 columns) */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-8">
            {/* Artist Badge with ink reveal */}
            <div className={`inline-flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full painterly-card transition-all duration-1000 ${
              isLoaded ? 'animate-fade-in-scroll' : 'opacity-0 translate-y-8'
            }`}>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-yellow-400 to-pink-400 flex items-center justify-center">
                <Palette className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-medium font-body" style={{ color: 'hsl(240, 10%, 15%)' }}>
                Artiste Peintre Professionnelle
              </span>
            </div>

            {/* Main Heading with ink reveal animation */}
            <div className={`space-y-3 sm:space-y-6 transition-all duration-1200 ${
              isLoaded ? 'animate-fade-in-scroll' : 'opacity-0 translate-y-12'
            }`} style={{ animationDelay: '0.3s' }}>
              <div className="ink-reveal">
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-tight text-gradient">
                  {artistName}
                </h1>
              </div>
              <p className="text-base sm:text-xl leading-relaxed max-w-2xl font-body" style={{ color: 'hsl(240, 10%, 35%)' }}>
                Artiste peintre passionnée, je crée des œuvres qui capturent l'essence de la beauté et de l'émotion à travers des techniques mixtes et une palette de couleurs vibrantes.
              </p>
            </div>

            {/* CTA Buttons with enhanced styling */}
            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-6 transition-all duration-1000 ${
              isLoaded ? 'animate-fade-in-scroll' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '0.6s' }}>
              <Button 
                size="lg" 
                onClick={handleExploreGallery}
                className="group relative overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-2xl border-2 border-transparent hover:border-yellow-400/30"
                style={{ 
                  background: 'linear-gradient(135deg, hsl(38, 95%, 65%) 0%, hsl(38, 95%, 55%) 50%, hsl(38, 95%, 60%) 100%)',
                  color: 'hsl(45, 100%, 97%)',
                  boxShadow: '0 12px 40px hsl(38, 95%, 60%, 0.4), 0 4px 16px hsl(38, 95%, 60%, 0.2)',
                  fontWeight: '600'
                }}
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10 font-body font-semibold text-sm sm:text-base flex items-center justify-center">
                  Explorer la Galerie
                  <ArrowRight className="ml-2 w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                </span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleViewWorks}
                className="group relative overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 hover:shadow-xl w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-2xl border-2"
                style={{ 
                  borderColor: 'hsl(38, 95%, 70%)',
                  color: 'hsl(240, 10%, 15%)',
                  backgroundColor: 'hsla(45, 100%, 97%, 0.8)',
                  backdropFilter: 'blur(12px)',
                  fontWeight: '600',
                  boxShadow: '0 8px 32px hsla(38, 95%, 60%, 0.15)'
                }}
              >
                {/* Subtle hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-orange-400/5 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 font-body font-semibold text-sm sm:text-base flex items-center justify-center">
                  Voir les Œuvres
                </span>
              </Button>
            </div>

            {/* Stats with staggered animation */}
            <div className={`grid grid-cols-3 gap-2 sm:gap-6 pt-4 sm:pt-8 transition-all duration-1000 ${
              isLoaded ? 'animate-fade-in-scroll' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '0.9s' }}>
              {[
                { number: "40+", label: "Années d'Expérience", icon: Award },
                { number: "200+", label: "Œuvres Créées", icon: Palette },
                { number: "50+", label: "Expositions", icon: Globe }
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div 
                    key={index}
                    className="text-center painterly-card p-2 sm:p-6 hover-watercolor-blend"
                    style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                  >
                    <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-1 sm:mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-pink-400 flex items-center justify-center">
                      <IconComponent className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-gradient font-display">
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm font-body leading-tight" style={{ color: 'hsl(240, 10%, 35%)' }}>
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side - 40% (2 columns) */}
          <div className={`lg:col-span-2 relative transition-all duration-1200 ${
            isLoaded ? 'animate-fade-in-scroll' : 'opacity-0 translate-x-12'
          }`} style={{ animationDelay: '0.6s' }}>
            <div className="relative">
              {/* Main artwork image with artistic frame */}
              <div className="relative rounded-3xl overflow-hidden painterly-shadow">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-pink-400/10 to-transparent rounded-3xl" />
                <img
                  src="/sedibatr.JPG"
                  alt="Artwork by Omhind"
                  className="w-full h-64 sm:h-96 object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                
                {/* Artistic corner decorations */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-yellow-400 rounded-tr-lg opacity-60" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-yellow-400 rounded-bl-lg opacity-60" />
              </div>

              {/* Floating quote card with watercolor effect */}
              <div className="absolute -bottom-8 -left-8 painterly-card p-6 max-w-xs watercolor-bg">
                <div className="relative">
                  <blockquote className="text-lg italic font-accent leading-relaxed" style={{ color: 'hsl(240, 10%, 15%)' }}>
                    "L'art est l'expression de l'âme à travers la couleur et la forme."
                  </blockquote>
                  <div className="mt-3 text-sm font-medium font-body" style={{ color: 'hsl(38, 95%, 60%)' }}>
                    - {artistName}
                  </div>
                  
                  {/* Decorative brush stroke */}
                  <div className="absolute -top-2 -left-2 w-12 h-1 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full opacity-60" />
                </div>
              </div>

              {/* Floating signature */}
              <div className="absolute -top-4 -right-4 painterly-card p-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-pink-400 flex items-center justify-center">
                  <Logo size="sm" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator with artistic animation - Enhanced for mobile */}
      <div 
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10 mobile-scroll-indicator cursor-pointer"
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
        <div className="w-8 h-12 sm:w-6 sm:h-10 border-3 sm:border-2 rounded-full flex justify-center bg-white/30 backdrop-blur-sm shadow-xl transition-all duration-300 hover:bg-white/40 hover:scale-105" style={{ borderColor: 'hsl(38, 95%, 60%)' }}>
          <div className="w-2 h-4 sm:w-1 sm:h-3 rounded-full mt-2 animate-pulse shadow-sm" style={{ backgroundColor: 'hsl(38, 95%, 60%)' }} />
        </div>
        {/* Additional visual cue for mobile */}
        <div className="mt-2 text-center">
          <span className="text-xs sm:text-sm font-medium opacity-90 drop-shadow-sm" style={{ color: 'hsl(38, 95%, 60%)' }}>
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
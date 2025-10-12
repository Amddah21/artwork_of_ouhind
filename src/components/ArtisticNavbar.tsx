import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, Palette, Home, Grid3X3, User, Mail, Settings, Calendar, Heart, Brush, Sparkles } from 'lucide-react';
import Logo from './Logo';

const ArtisticNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { id: 'accueil', label: 'Accueil', icon: Home, href: '#hero' },
    { id: 'galerie', label: 'Galerie', icon: Grid3X3, href: '#portfolio' },
    { id: 'about', label: 'À Propos', icon: User, href: '#about' },
    { id: 'exhibitions', label: 'Expositions', icon: Calendar, href: '#exhibitions' },
    { id: 'favorites', label: 'Favoris', icon: Heart, href: '/favorites' },
    { id: 'contact', label: 'Contact', icon: Mail, href: '#contact' }
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href.startsWith('#')) {
      return location.pathname === '/';
    }
    return location.pathname === href;
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-watercolor border-b border-gray-200' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className={`transition-all duration-500 ${
                isScrolled ? 'scale-90' : 'scale-100'
              }`}>
                <Logo size="sm" />
              </div>
              <div className="hidden lg:block">
                <h1 className="text-lg font-display font-semibold text-gradient">
                  Oum Hind F. Douirani
                </h1>
                <p className="text-xs text-gray-600 font-body">
                  Artiste Peintre
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => handleNavClick(item.href)}
                    className={`group relative hover-painterly-lift transition-all duration-300 ${
                      isActive(item.href)
                        ? 'text-yellow-600 bg-yellow-50'
                        : 'text-gray-700 hover:text-yellow-600 hover:bg-yellow-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                    <span className="font-body font-medium">{item.label}</span>
                  </Button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden painterly-card"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Floating decorative elements */}
        {!isScrolled && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2 right-20 animate-floatingBrush">
              <Brush className="w-4 h-4 text-yellow-400 opacity-30" />
            </div>
            <div className="absolute top-3 right-32 animate-floatingBrush" style={{ animationDelay: '2s' }}>
              <Sparkles className="w-3 h-3 text-pink-400 opacity-25" />
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-16 right-4 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-ink-spread border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-pink-400 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-gray-900">
                    Navigation
                  </h2>
                  <p className="text-xs text-gray-600 font-body">
                    Explorez mon univers artistique
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => handleNavClick(item.href)}
                      className={`w-full justify-start hover-watercolor-blend transition-all duration-300 ${
                        isActive(item.href)
                          ? 'bg-yellow-50 text-yellow-700 border-l-4 border-yellow-400'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mr-3" />
                      <span className="font-body font-medium">{item.label}</span>
                    </Button>
                  );
                })}
              </nav>

              {/* Mobile Menu Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-body mb-3">
                    Suivez mon travail artistique
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" size="sm" className="painterly-card">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="painterly-card">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="painterly-card">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default ArtisticNavbar;

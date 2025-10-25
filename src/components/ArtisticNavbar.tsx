import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, Palette, Home, Grid3X3, User, Mail, Settings, Calendar, Brush, Sparkles, LogIn, LogOut, Sun, Moon } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from './LoginForm';
import { useArtwork } from '@/contexts/ArtworkContext';
import { useTheme } from '@/contexts/ThemeContext';

const ArtisticNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated, signOut } = useAuth();
  const { artworks } = useArtwork();
  const { state, setMode, toggleTheme, isDark, isLight, isAuto } = useTheme();
  
  // Get the artist name from the first artwork or use default
  const artistName = artworks.length > 0 && artworks[0].artist_name 
    ? artworks[0].artist_name 
    : 'Omhind';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { id: 'accueil', label: 'Accueil', icon: Home, href: 'hero' },
    { id: 'galerie', label: 'Galerie', icon: Grid3X3, href: 'portfolio' },
    { id: 'about', label: 'À Propos', icon: User, href: 'about' },
    { id: 'exhibitions', label: 'Expositions', icon: Calendar, href: 'exhibitions' },
    { id: 'contact', label: 'Contact', icon: Mail, href: 'contact' }
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith('/')) {
      // Use React Router navigation for routes
      navigate(href);
    } else if (href.startsWith('#')) {
      // Hash link - scroll to element
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Section ID - scroll to element or navigate to home first
      if (location.pathname !== '/') {
        // If not on home page, navigate to home first
        navigate('/');
        // Wait a bit for navigation to complete, then scroll
        setTimeout(() => {
          const element = document.getElementById(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          } else if (href === 'hero' || href === 'accueil') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      } else {
        // Already on home page, just scroll
        const element = document.getElementById(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (href === 'hero' || href === 'accueil') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
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
          ? 'luxury-nav backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="luxury-container">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className={`transition-all duration-500 ${
                isScrolled ? 'scale-90' : 'scale-100'
              }`}>
                <Logo size="sm" />
              </div>
              <div className="hidden lg:block">
                <h1 className={`text-lg font-luxury-display font-semibold transition-all duration-500 ${
                  isScrolled 
                    ? 'luxury-text-primary' 
                    : 'luxury-text-gradient'
                }`}>
                  {artistName}
                </h1>
                <p className={`text-xs font-luxury-body transition-colors duration-500 ${
                  isScrolled ? 'luxury-text-secondary' : 'luxury-text-muted'
                }`}>
                  Artiste Peintre
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActiveItem = isActive(item.href);
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => handleNavClick(item.href)}
                    className={`group relative transition-all duration-300 px-3 py-2 rounded-lg luxury-magnetic-hover luxury-sparkle-effect ${
                      isActiveItem
                        ? 'luxury-btn-primary text-white shadow-xl'
                        : 'luxury-btn-secondary hover:luxury-btn-primary hover:text-white'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 mr-2 transition-transform group-hover:scale-110 ${
                      isActiveItem ? 'text-gray-800' : 'text-current'
                    }`} />
                    <span className="font-body font-medium">{item.label}</span>
                  </Button>
                );
              })}
              
              {/* Theme Toggle Button */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMode('light')}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                    isLight ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title="Mode clair"
                >
                  <Sun className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMode('dark')}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                    isDark ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title="Mode sombre"
                >
                  <Moon className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMode('auto')}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                    isAuto ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title="Mode automatique"
                >
                  <Palette className="w-3 h-3" />
                </Button>
              </div>
              
              {/* Login/Logout Button */}
              {!isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLoginForm(true)}
                  className="ml-2 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:from-yellow-100 hover:to-orange-100 hover:border-yellow-300 text-yellow-700 hover:text-orange-800 transition-all duration-300 font-medium"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Connexion
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isAdmin ? () => navigate('/admin') : signOut}
                  className={`ml-2 transition-all duration-300 font-medium ${
                    isAdmin 
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 text-blue-700 hover:text-indigo-800"
                      : "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 hover:from-orange-100 hover:to-red-100 hover:border-orange-300 text-orange-700 hover:text-red-800"
                  }`}
                >
                  {isAdmin ? (
                    <>
                      <Settings className="w-4 h-4 mr-2" />
                      Dashboard Admin
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="lg:hidden bg-white/80 backdrop-blur-sm border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 p-2 touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            >
              {isMenuOpen ? (
                <X className="w-4 h-4 text-gray-700" />
              ) : (
                <Menu className="w-4 h-4 text-gray-700" />
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
          <div className="absolute top-16 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in slide-in-from-top-2 duration-300">
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
                  const isActiveItem = isActive(item.href);
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNavClick(item.href);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNavClick(item.href);
                      }}
                      className={`w-full justify-start transition-all duration-300 rounded-lg px-4 py-3 touch-manipulation luxury-magnetic-hover ${
                        isActiveItem
                          ? 'luxury-btn-primary text-white shadow-xl'
                          : 'luxury-btn-secondary hover:luxury-btn-primary hover:text-white'
                      }`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <IconComponent className={`w-5 h-5 mr-3 ${
                        isActiveItem ? 'text-gray-800' : 'text-current'
                      }`} />
                      <span className="font-body font-medium">{item.label}</span>
                    </Button>
                  );
                })}
                
                {/* Theme Toggle for Mobile */}
                <div className="mt-4 mb-4">
                  <div className="text-xs text-gray-600 font-body mb-2 px-1">Thème:</div>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMode('light')}
                      className={`flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all ${
                        isLight ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Sun className="w-3 h-3 mr-1" />
                      Clair
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMode('dark')}
                      className={`flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all ${
                        isDark ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Moon className="w-3 h-3 mr-1" />
                      Sombre
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMode('auto')}
                      className={`flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all ${
                        isAuto ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Palette className="w-3 h-3 mr-1" />
                      Auto
                    </Button>
                  </div>
                </div>
                
                {/* Login/Logout Button for Mobile */}
                {!isAuthenticated ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowLoginForm(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:from-yellow-100 hover:to-orange-100 hover:border-yellow-300 text-yellow-700 hover:text-orange-800 transition-all duration-300 rounded-lg px-4 py-3 font-medium"
                  >
                    <LogIn className="w-5 h-5 mr-3" />
                    <span className="font-body font-medium">Connexion</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (isAdmin) {
                        navigate('/admin');
                      } else {
                        signOut();
                      }
                      setIsMenuOpen(false);
                    }}
                    className={`w-full justify-start transition-all duration-300 rounded-lg px-4 py-3 font-medium ${
                      isAdmin 
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 text-blue-700 hover:text-indigo-800"
                        : "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 hover:from-orange-100 hover:to-red-100 hover:border-orange-300 text-orange-700 hover:text-red-800"
                    }`}
                  >
                    {isAdmin ? (
                      <>
                        <Settings className="w-5 h-5 mr-3" />
                        <span className="font-body font-medium">Dashboard Admin</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="font-body font-medium">Déconnexion</span>
                      </>
                    )}
                  </Button>
                )}
                
              </nav>

              {/* Mobile Menu Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-body mb-3">
                    Suivez mon travail artistique
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Form Modal */}
      {showLoginForm && (
        <LoginForm
          onClose={() => setShowLoginForm(false)}
          onSuccess={() => setShowLoginForm(false)}
        />
      )}
    </>
  );
};

export default ArtisticNavbar;

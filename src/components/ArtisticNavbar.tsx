import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, Palette, Home, Grid3X3, User, Mail, Settings, Calendar, Brush, Sparkles, LogIn, LogOut, Sun, Moon } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from './LoginForm';
import { useArtwork } from '@/contexts/ArtworkContext';

const ArtisticNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated, signOut } = useAuth();
  const { artworks } = useArtwork();
  
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
            {/* Logo and Brand - Clickable to Home */}
            <button
              onClick={() => {
                if (location.pathname !== '/') {
                  navigate('/');
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center space-x-3 transition-all duration-300 hover:opacity-80 group cursor-pointer"
              style={{ 
                backgroundColor: 'transparent',
                border: 'none',
                padding: '0.25rem',
                margin: '-0.25rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(135, 63, 49, 0.05)';
                e.currentTarget.style.borderRadius = '0.5rem';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div className={`transition-all duration-500 ${
                isScrolled ? 'scale-90' : 'scale-100'
              } group-hover:scale-105`}>
                <Logo size="sm" />
              </div>
              <div className="hidden lg:block">
                <h1 className={`text-lg font-luxury-display font-semibold transition-all duration-500 ${
                  isScrolled 
                    ? 'luxury-text-primary' 
                    : 'luxury-text-gradient'
                } group-hover:scale-105`}>
                  {artistName}
                </h1>
                <p className={`text-xs font-luxury-body transition-colors duration-500 ${
                  isScrolled ? 'luxury-text-secondary' : 'luxury-text-muted'
                }`}>
                  Artiste Peintre
                </p>
              </div>
            </button>

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
              
              {/* Theme toggle removed per request */}
              
              {/* Login/Logout Button */}
              {!isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLoginForm(true)}
                  className="ml-2 transition-all duration-300 font-medium hover:shadow-lg p-2"
                  style={{
                    fontFamily: "'Proza Libre', sans-serif",
                    backgroundColor: '#F9F8F3' /* FROSTY WHITE */,
                    color: '#873F31' /* PIPE */,
                    borderColor: 'rgba(135, 63, 49, 0.3)' /* PIPE */,
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#873F31';
                    e.currentTarget.style.color = '#F9F8F3';
                    e.currentTarget.style.borderColor = '#873F31';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(135, 63, 49, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F9F8F3';
                    e.currentTarget.style.color = '#873F31';
                    e.currentTarget.style.borderColor = 'rgba(135, 63, 49, 0.3)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  aria-label="Connexion"
                >
                  <LogIn className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isAdmin ? () => navigate('/admin') : signOut}
                  className="ml-2 transition-all duration-300 font-medium hover:shadow-lg"
                  style={{
                    fontFamily: "'Proza Libre', sans-serif",
                    ...(isAdmin ? {
                      backgroundColor: '#873F31' /* PIPE */,
                      color: '#F9F8F3' /* FROSTY WHITE */,
                      borderColor: '#873F31' /* PIPE */,
                      borderWidth: '1px'
                    } : {
                      backgroundColor: 'transparent',
                      color: '#717871' /* SAGE */,
                      borderColor: 'rgba(122, 119, 113, 0.3)' /* SAGE */
                    })
                  }}
                  onMouseEnter={(e) => {
                    if (isAdmin) {
                      e.currentTarget.style.backgroundColor = '#9B4F3F';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(135, 63, 49, 0.3)';
                    } else {
                      e.currentTarget.style.backgroundColor = 'rgba(122, 119, 113, 0.1)';
                      e.currentTarget.style.color = '#873F31';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isAdmin) {
                      e.currentTarget.style.backgroundColor = '#873F31';
                      e.currentTarget.style.boxShadow = 'none';
                    } else {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#717871';
                    }
                  }}
                >
                  {isAdmin ? (
                    <>
                      <Settings className="w-4 h-4 mr-2" style={{ color: '#F9F8F3' }} />
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
              className="lg:hidden backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 p-2 touch-manipulation"
              style={{ 
                touchAction: 'manipulation',
                backgroundColor: '#F9F8F3' /* FROSTY WHITE */,
                borderColor: 'rgba(122, 119, 113, 0.3)' /* SAGE */,
                borderWidth: '1px'
              }}
            >
              {isMenuOpen ? (
                <X className="w-4 h-4" style={{ color: '#873F31' /* PIPE */ }} />
              ) : (
                <Menu className="w-4 h-4" style={{ color: '#873F31' /* PIPE */ }} />
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
          <div className="absolute top-16 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-top-2 duration-300"
            style={{
              backgroundColor: '#F9F8F3' /* FROSTY WHITE */,
              border: '1px solid rgba(122, 119, 113, 0.2)' /* SAGE */
            }}
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#873F31' /* PIPE */ }}
                >
                  <Palette className="w-5 h-5" style={{ color: '#F9F8F3' /* FROSTY WHITE */ }} />
                </div>
                <div>
                  <h2 
                    className="font-display font-semibold"
                    style={{ 
                      fontFamily: "'Cormorant Garamond', serif",
                      color: '#4B4A46' /* CHARCOAL TAUPE */
                    }}
                  >
                    Navigation
                  </h2>
                  <p 
                    className="text-xs font-body"
                    style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#717871' /* SAGE */
                    }}
                  >
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
                      className="w-full justify-start transition-all duration-300 rounded-lg px-4 py-3 touch-manipulation hover:shadow-lg"
                      style={{ 
                        touchAction: 'manipulation',
                        fontFamily: "'Proza Libre', sans-serif",
                        ...(isActiveItem ? {
                          backgroundColor: '#873F31' /* PIPE */,
                          color: '#F9F8F3' /* FROSTY WHITE */,
                          borderColor: '#873F31',
                          borderWidth: '1px',
                          boxShadow: '0 4px 12px rgba(135, 63, 49, 0.3)'
                        } : {
                          backgroundColor: 'transparent',
                          color: '#4B4A46' /* CHARCOAL TAUPE */,
                          borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */,
                          borderWidth: '1px'
                        })
                      }}
                      onMouseEnter={(e) => {
                        if (!isActiveItem) {
                          e.currentTarget.style.backgroundColor = 'rgba(135, 63, 49, 0.1)';
                          e.currentTarget.style.color = '#873F31';
                          e.currentTarget.style.borderColor = 'rgba(135, 63, 49, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActiveItem) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#4B4A46';
                          e.currentTarget.style.borderColor = 'rgba(122, 119, 113, 0.2)';
                        }
                      }}
                    >
                      <IconComponent 
                        className="w-5 h-5 mr-3" 
                        style={{ 
                          color: isActiveItem ? '#F9F8F3' : '#873F31' /* PIPE */
                        }} 
                      />
                      <span className="font-body font-medium">{item.label}</span>
                    </Button>
                  );
                })}
                
                {/* Theme toggle removed for mobile per request */}
                
                {/* Login/Logout Button for Mobile */}
                {!isAuthenticated ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowLoginForm(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-center transition-all duration-300 rounded-lg py-3 font-medium hover:shadow-lg"
                    style={{
                      fontFamily: "'Proza Libre', sans-serif",
                      backgroundColor: '#F9F8F3' /* FROSTY WHITE */,
                      color: '#873F31' /* PIPE */,
                      borderColor: 'rgba(135, 63, 49, 0.3)' /* PIPE */
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#873F31';
                      e.currentTarget.style.color = '#F9F8F3';
                      e.currentTarget.style.borderColor = '#873F31';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(135, 63, 49, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F9F8F3';
                      e.currentTarget.style.color = '#873F31';
                      e.currentTarget.style.borderColor = 'rgba(135, 63, 49, 0.3)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    aria-label="Connexion"
                  >
                    <LogIn className="w-5 h-5" />
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
                    className="w-full justify-start transition-all duration-300 rounded-lg px-4 py-3 font-medium hover:shadow-lg"
                    style={{
                      fontFamily: "'Proza Libre', sans-serif",
                      ...(isAdmin ? {
                        backgroundColor: '#873F31' /* PIPE */,
                        color: '#F9F8F3' /* FROSTY WHITE */,
                        borderColor: '#873F31' /* PIPE */,
                        borderWidth: '1px'
                      } : {
                        backgroundColor: 'transparent',
                        color: '#717871' /* SAGE */,
                        borderColor: 'rgba(122, 119, 113, 0.3)' /* SAGE */
                      })
                    }}
                    onMouseEnter={(e) => {
                      if (isAdmin) {
                        e.currentTarget.style.backgroundColor = '#9B4F3F';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(135, 63, 49, 0.3)';
                      } else {
                        e.currentTarget.style.backgroundColor = 'rgba(122, 119, 113, 0.1)';
                        e.currentTarget.style.color = '#873F31';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isAdmin) {
                        e.currentTarget.style.backgroundColor = '#873F31';
                        e.currentTarget.style.boxShadow = 'none';
                      } else {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#717871';
                      }
                    }}
                  >
                    {isAdmin ? (
                      <>
                        <Settings className="w-5 h-5 mr-3" style={{ color: '#F9F8F3' }} />
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
              <div 
                className="mt-6 pt-6"
                style={{ borderTop: '1px solid rgba(122, 119, 113, 0.2)' /* SAGE */ }}
              >
                <div className="text-center">
                  <p 
                    className="text-xs font-body mb-3"
                    style={{ 
                      fontFamily: "'Proza Libre', sans-serif",
                      color: '#717871' /* SAGE */
                    }}
                  >
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

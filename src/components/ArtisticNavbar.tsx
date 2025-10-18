import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, Palette, Home, Grid3X3, User, Mail, Settings, Calendar, Brush, Sparkles, LogIn, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from './LoginForm';

const ArtisticNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated, signOut } = useAuth();

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
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
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
                <h1 className={`text-lg font-display font-semibold transition-all duration-500 ${
                  isScrolled 
                    ? 'text-slate-800' 
                    : 'bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent'
                }`}>
                  Oum Hind F. Douirani
                </h1>
                <p className={`text-xs font-body transition-colors duration-500 ${
                  isScrolled ? 'text-gray-600' : 'text-gray-500'
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
                    className={`group relative transition-all duration-300 px-3 py-2 rounded-lg ${
                      isActiveItem
                        ? 'text-gray-800 bg-gradient-to-r from-gray-200 to-gray-300 shadow-lg hover:from-gray-300 hover:to-gray-400'
                        : 'text-gray-700 hover:text-gray-800 hover:bg-gray-100 hover:shadow-md'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 mr-2 transition-transform group-hover:scale-110 ${
                      isActiveItem ? 'text-gray-800' : 'text-current'
                    }`} />
                    <span className="font-body font-medium">{item.label}</span>
                  </Button>
                );
              })}
              
              {/* LOGGING Button - Only for Admin Users */}
              {isAdmin && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate('/admin')}
                  className="ml-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 font-semibold"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              )}
              
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
                  onClick={signOut}
                  className="ml-2 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 hover:from-orange-100 hover:to-red-100 hover:border-orange-300 text-orange-700 hover:text-red-800 transition-all duration-300 font-medium"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden bg-white/80 backdrop-blur-sm border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
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
                      onClick={() => handleNavClick(item.href)}
                      className={`w-full justify-start transition-all duration-300 rounded-lg px-4 py-3 ${
                        isActiveItem
                          ? 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 mr-3 ${
                        isActiveItem ? 'text-gray-800' : 'text-current'
                      }`} />
                      <span className="font-body font-medium">{item.label}</span>
                    </Button>
                  );
                })}
                
                {/* LOGGING Button for Mobile - Only for Admin Users */}
                {isAdmin && (
                  <Button
                    variant="default"
                    onClick={() => {
                      navigate('/admin');
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg px-4 py-3 font-semibold"
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    <span className="font-body font-medium">Dashboard</span>
                  </Button>
                )}
                
              </nav>

              {/* Mobile Menu Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-body mb-3">
                    Suivez mon travail artistique
                  </p>
                  <div className="flex justify-center space-x-4">
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

import React from 'react';
import { Button } from './ui/button';
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter, Palette, Brush, Sparkles, Award, Globe } from 'lucide-react';
import Logo from './Logo';
import { useArtwork } from '@/contexts/ArtworkContext';

const ArtisticFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { artworks } = useArtwork();
  
  // Get the artist name from the first artwork or use default
  const artistName = artworks.length > 0 && artworks[0].artist_name 
    ? artworks[0].artist_name 
    : 'Omhind';

  const footerLinks = {
    navigation: [
      { label: 'Accueil', href: '#hero' },
      { label: 'Galerie', href: '#portfolio' },
      { label: 'À Propos', href: '#about' },
      { label: 'Expositions', href: '#exhibitions' },
      { label: 'Contact', href: '#contact' }
    ],
    legal: [
      { label: 'Politique de Confidentialité', href: '#' },
      { label: 'Conditions d\'Utilisation', href: '#' },
      { label: 'Mentions Légales', href: '#' },
      { label: 'CGV', href: '#' }
    ],
    social: [
      { label: 'Instagram', href: 'https://instagram.com/fatydouirani', icon: Instagram },
      { label: 'Facebook', href: 'https://facebook.com/faty oumhind douirani', icon: Facebook },
      { label: 'Twitter', href: '#', icon: Twitter }
    ]
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'omhind53@gmail.com',
      href: 'mailto:omhind53@gmail.com'
    },
    {
      icon: Phone,
      label: 'Téléphone',
      value: '+212-666 67 27 56',
      href: 'tel:+212666672756'
    },
    {
      icon: MapPin,
      label: 'Adresse',
      value: 'Localisation exacte',
      href: '#'
    }
  ];

  return (
    <footer className="py-12 sm:py-16 lg:py-20 relative overflow-hidden" style={{ backgroundColor: '#433D38' /* CHARCOAL TAUPE */ }}>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 rounded-full blur-3xl" style={{ backgroundColor: '#873F31' /* PIPE */ }}></div>
        <div className="absolute bottom-0 right-0 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 rounded-full blur-3xl" style={{ backgroundColor: '#CCB999' /* RUSK */ }}></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          
          {/* Artist Brand Section */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#873F31' /* PIPE */ }}>
                <Logo size="sm" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold" style={{ color: '#873F31' /* PIPE */, fontFamily: "'Cormorant Garamond', serif" }}>
                  {artistName}
                </h3>
                <p className="text-xs sm:text-sm" style={{ color: '#EBE2D1' /* PEACH CREAM */, fontFamily: "'Proza Libre', sans-serif" }}>
                  Artiste Peintre
                </p>
              </div>
            </div>
            
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#EBE2D1' /* PEACH CREAM */, fontFamily: "'Proza Libre', sans-serif" }}>
              Artiste peintre passionnée, je crée des œuvres qui capturent l'essence de la beauté 
              et de l'émotion à travers des techniques mixtes et une palette de couleurs vibrantes.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3 sm:space-x-4">
              {footerLinks.social.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    style={{ 
                      backgroundColor: '#873F31' /* PIPE */,
                      color: '#F9F8F3' /* FROSTY WHITE */
                    }}
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <h4 className="text-lg sm:text-xl font-bold" style={{ color: '#873F31' /* PIPE */, fontFamily: "'Cormorant Garamond', serif" }}>
              Navigation
            </h4>
            <nav className="space-y-3 sm:space-y-4">
              {footerLinks.navigation.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm sm:text-base transition-colors duration-300 hover:opacity-80"
                  style={{ 
                    color: '#EBE2D1' /* PEACH CREAM */,
                    fontFamily: "'Proza Libre', sans-serif"
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <h4 className="text-lg sm:text-xl font-bold" style={{ color: '#873F31' /* PIPE */, fontFamily: "'Cormorant Garamond', serif" }}>
              Contact
            </h4>
            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              {contactInfo.map((contact) => {
                const IconComponent = contact.icon;
                // Special handling for address with map button
                if (contact.label === 'Adresse') {
                  return (
                    <div key={contact.label} className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(135, 63, 49, 0.2)' /* PIPE with opacity */ }}>
                        <IconComponent className="w-5 h-5" style={{ color: '#873F31' /* PIPE */ }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm mb-1" style={{ color: '#EBE2D1' /* PEACH CREAM */, fontFamily: "'Proza Libre', sans-serif" }}>{contact.label}</p>
                        <p className="text-sm sm:text-base break-words mb-2" style={{ 
                          color: '#F9F8F3' /* FROSTY WHITE */,
                          fontFamily: "'Proza Libre', sans-serif"
                        }}>
                          {contact.value}
                        </p>
                        <button
                          onClick={() => {
                            // Convert coordinates to decimal: 34°01'15.8"N 6°50'00.9"W = 34.0210556, -6.8335833
                            const googleMapsUrl = `https://www.google.com/maps?q=34.0210556,-6.8335833`;
                            window.open(googleMapsUrl, '_blank');
                          }}
                          className="text-xs sm:text-sm px-3 py-1.5 rounded transition-all duration-300 hover:opacity-80"
                          style={{ 
                            backgroundColor: '#873F31' /* PIPE */,
                            color: '#F9F8F3' /* FROSTY WHITE */,
                            fontFamily: "'Proza Libre', sans-serif",
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          📍 Ouvrir dans Google Maps
                        </button>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={contact.label} className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(135, 63, 49, 0.2)' /* PIPE with opacity */ }}>
                      <IconComponent className="w-5 h-5" style={{ color: '#873F31' /* PIPE */ }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm mb-1" style={{ color: '#EBE2D1' /* PEACH CREAM */, fontFamily: "'Proza Libre', sans-serif" }}>{contact.label}</p>
                      <a
                        href={contact.href}
                        className="text-sm sm:text-base break-words transition-colors duration-300 hover:opacity-80"
                        style={{ 
                          color: '#F9F8F3' /* FROSTY WHITE */,
                          fontFamily: "'Proza Libre', sans-serif"
                        }}
                      >
                        {contact.value}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <h4 className="text-lg sm:text-xl font-bold" style={{ color: '#873F31' /* PIPE */, fontFamily: "'Cormorant Garamond', serif" }}>
              Informations Légales
            </h4>
            <nav className="space-y-3 sm:space-y-4">
              {footerLinks.legal.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-xs sm:text-sm transition-colors duration-300 hover:opacity-80"
                  style={{ 
                    color: '#EBE2D1' /* PEACH CREAM */,
                    fontFamily: "'Proza Libre', sans-serif"
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Awards/Recognition */}
            <div className="pt-4 sm:pt-6 mt-4 sm:mt-6" style={{ borderTop: '1px solid rgba(135, 63, 49, 0.2)' /* PIPE with opacity */ }}>
              <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm mb-2">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: '#873F31' /* PIPE */ }} />
                <span style={{ color: '#EBE2D1' /* PEACH CREAM */, fontFamily: "'Proza Libre', sans-serif" }}>Artiste Reconnue</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: '#873F31' /* PIPE */ }} />
                <span style={{ color: '#EBE2D1' /* PEACH CREAM */, fontFamily: "'Proza Libre', sans-serif" }}>Expositions Internationales</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8" style={{ borderTop: '1px solid rgba(135, 63, 49, 0.2)' /* PIPE with opacity */ }}>
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 gap-4">
            <div className="flex items-center">
              <span className="text-xs sm:text-sm" style={{ color: '#EBE2D1' /* PEACH CREAM */, fontFamily: "'Proza Libre', sans-serif" }}>
                © {currentYear} {artistName}. Tous droits réservés.
              </span>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap justify-center">
              <span className="text-xs sm:text-sm" style={{ color: '#EBE2D1' /* PEACH CREAM */, fontFamily: "'Proza Libre', sans-serif" }}>Fait avec</span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" style={{ color: '#873F31' /* PIPE */ }} />
              <button
                onClick={() => window.open('https://digital-team-8r4yhd9pg-amddah21s-projects.vercel.app/', '_blank', 'noopener,noreferrer')}
                className="text-xs sm:text-sm hover:underline transition-all duration-300 cursor-pointer bg-transparent border-none outline-none focus:outline-none focus:ring-2 focus:ring-[#873F31]/50 rounded px-1 py-0.5"
                style={{ 
                  color: '#EBE2D1' /* PEACH CREAM */, 
                  fontFamily: "'Proza Libre', sans-serif" 
                }}
                aria-label="Visit Digital Teams Portfolio"
              >
                par Digital Teams
              </button>
              <button
                onClick={() => window.open('https://digital-team-8r4yhd9pg-amddah21s-projects.vercel.app/', '_blank', 'noopener,noreferrer')}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-[#9333ea]/50"
                style={{
                  background: 'linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)'
                }}
                aria-label="Visit Digital Teams Portfolio"
              >
                <span className="text-white text-[10px] sm:text-xs font-bold" style={{ fontFamily: 'sans-serif' }}>AB</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ArtisticFooter;

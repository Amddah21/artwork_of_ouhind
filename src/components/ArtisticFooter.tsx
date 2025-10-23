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
      value: 'BP 2595 RABAT CENTRAL/RABAT',
      href: '#'
    }
  ];

  return (
    <footer className="luxury-footer py-20">
      <div className="luxury-container">
        <div className="luxury-grid luxury-grid-4 gap-12">
          
          {/* Artist Brand Section */}
          <div className="lg:col-span-1 space-y-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--luxury-gold)' }}>
                <Logo size="sm" />
              </div>
              <div>
                <h3 className="text-xl font-luxury-accent luxury-text-gold">
                  {artistName}
                </h3>
                <p className="text-sm font-luxury-body luxury-text-light">
                  Artiste Peintre
                </p>
              </div>
            </div>
            
            <p className="font-luxury-body luxury-text-light leading-relaxed">
              Artiste peintre passionnée, je crée des œuvres qui capturent l'essence de la beauté 
              et de l'émotion à travers des techniques mixtes et une palette de couleurs vibrantes.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {footerLinks.social.map((social) => {
                const IconComponent = social.icon;
                return (
                  <button
                    key={social.label}
                    className="luxury-btn-secondary p-3"
                    onClick={() => window.open(social.href, '_blank')}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-8">
            <h4 className="text-xl font-luxury-accent luxury-text-gold">
              Navigation
            </h4>
            <nav className="space-y-4">
              {footerLinks.navigation.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block font-luxury-body luxury-footer-link hover:luxury-text-gold transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <h4 className="text-xl font-luxury-accent luxury-text-gold">
              Contact
            </h4>
            <div className="space-y-6">
              {contactInfo.map((contact) => {
                const IconComponent = contact.icon;
                return (
                  <div key={contact.label} className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: 'rgba(224, 168, 93, 0.2)' }}>
                      <IconComponent className="w-5 h-5 luxury-text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-luxury-body luxury-text-light">{contact.label}</p>
                      <a
                        href={contact.href}
                        className="font-luxury-body luxury-footer-link hover:luxury-text-gold transition-colors duration-300"
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
          <div className="space-y-8">
            <h4 className="text-xl font-luxury-accent luxury-text-gold">
              Informations Légales
            </h4>
            <nav className="space-y-4">
              {footerLinks.legal.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block font-luxury-body luxury-footer-link hover:luxury-text-gold transition-colors duration-300 text-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Awards/Recognition */}
            <div className="pt-6" style={{ borderTop: '1px solid rgba(224, 168, 93, 0.2)' }}>
              <div className="flex items-center space-x-3 text-sm luxury-text-light">
                <Award className="w-5 h-5 luxury-text-gold" />
                <span className="font-luxury-body">Artiste Reconnue</span>
              </div>
              <div className="flex items-center space-x-3 text-sm luxury-text-light mt-2">
                <Globe className="w-5 h-5 luxury-text-gold" />
                <span className="font-luxury-body">Expositions Internationales</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8" style={{ borderTop: '1px solid rgba(224, 168, 93, 0.2)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 luxury-text-light">
              <span className="font-luxury-body">© {currentYear} {artistName}. Tous droits réservés.</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="luxury-text-light font-luxury-body">Fait avec</span>
              <Sparkles className="w-5 h-5 luxury-text-gold animate-pulse" />
              <span className="luxury-text-light font-luxury-body">par Digital Teams</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--luxury-gold)' }}>
                <span className="text-white text-sm font-bold">DT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ArtisticFooter;

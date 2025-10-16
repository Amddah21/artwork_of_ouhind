import React from 'react';
import { Button } from './ui/button';
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter, Palette, Brush, Sparkles, Award, Globe } from 'lucide-react';
import Logo from './Logo';

const ArtisticFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

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
    <footer className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 watercolor-bg canvas-texture">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-yellow-400/10 to-pink-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/10 to-blue-400/10 rounded-full blur-3xl" />
        
        {/* Floating artistic elements */}
        <div className="absolute top-20 left-20 animate-floatingBrush">
          <Palette className="w-8 h-8 text-yellow-400 opacity-20" />
        </div>
        <div className="absolute top-40 right-32 animate-floatingBrush" style={{ animationDelay: '3s' }}>
          <Brush className="w-6 h-6 text-pink-400 opacity-25" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-floatingBrush" style={{ animationDelay: '1.5s' }}>
          <Sparkles className="w-5 h-5 text-purple-400 opacity-20" />
        </div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Artist Brand Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-pink-400 flex items-center justify-center">
                  <Logo size="sm" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-gray-900">
                    Oum Hind F. Douirani
                  </h3>
                  <p className="text-sm text-gray-600 font-body">
                    Artiste Peintre
                  </p>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed font-body">
                Artiste peintre passionnée, je crée des œuvres qui capturent l'essence de la beauté 
                et de l'émotion à travers des techniques mixtes et une palette de couleurs vibrantes.
              </p>

              {/* Social Links */}
              <div className="flex space-x-3">
                {footerLinks.social.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <Button
                      key={social.label}
                      variant="outline"
                      size="sm"
                      className="hover-painterly-lift painterly-card"
                      style={{ 
                        borderColor: 'hsl(330, 20%, 88%)',
                        color: 'hsl(240, 10%, 15%)'
                      }}
                      onClick={() => window.open(social.href, '_blank')}
                    >
                      <IconComponent className="w-4 h-4" />
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-display font-semibold text-gray-900">
                Navigation
              </h4>
              <nav className="space-y-3">
                {footerLinks.navigation.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-gray-700 hover:text-yellow-600 transition-colors duration-300 font-body hover-ink-flow"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h4 className="text-lg font-display font-semibold text-gray-900">
                Contact
              </h4>
              <div className="space-y-4">
                {contactInfo.map((contact) => {
                  const IconComponent = contact.icon;
                  return (
                    <div key={contact.label} className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400/20 to-pink-400/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <IconComponent className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-body">{contact.label}</p>
                        <a
                          href={contact.href}
                          className="text-gray-900 hover:text-yellow-600 transition-colors duration-300 font-body"
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
            <div className="space-y-6">
              <h4 className="text-lg font-display font-semibold text-gray-900">
                Informations Légales
              </h4>
              <nav className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-gray-700 hover:text-yellow-600 transition-colors duration-300 font-body text-sm hover-ink-flow"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              {/* Awards/Recognition */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="font-body">Artiste Reconnue</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="font-body">Expositions Internationales</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-200 bg-gradient-to-r from-yellow-50 to-pink-50">
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                Restez Informé
              </h3>
              <p className="text-gray-700 mb-6 font-body">
                Recevez les dernières nouvelles sur mes expositions et nouvelles créations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent font-body"
                />
                <Button 
                  className="hover-painterly-lift paint-splash"
                  style={{
                    background: 'linear-gradient(135deg, hsl(38, 95%, 60%) 0%, hsl(38, 95%, 55%) 100%)',
                    color: 'hsl(45, 100%, 97%)'
                  }}
                >
                  S'abonner
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="font-body">© {currentYear} Oum Hind F. Douirani. Tous droits réservés.</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-body">Fait avec</span>
                <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                <span className="text-gray-600 font-body">par Digital Teams</span>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">DT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ArtisticFooter;

import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Phone, Mail, MessageCircle, Instagram, Facebook, MapPin, Clock, Euro, Palette } from 'lucide-react';

const CommerceContact: React.FC = () => {
  const handleWhatsAppContact = () => {
    const message = "Bonjour ! Je souhaite obtenir des informations sur vos œuvres d'art disponibles à la vente.";
    const whatsappUrl = `https://wa.me/212666672756?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailContact = () => {
    const subject = "Demande d'information - Œuvres d'art";
    const body = "Bonjour,\n\nJe suis intéressé(e) par vos œuvres d'art. Pourriez-vous me donner plus d'informations sur les pièces disponibles et les modalités d'achat ?\n\nCordialement,";
    const mailtoUrl = `mailto:omhind53@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const handleInstagramContact = () => {
    window.open('https://instagram.com/fatydouirani', '_blank');
  };

  const handleFacebookContact = () => {
    window.open('https://www.facebook.com/fatyomhind', '_blank');
  };

  return (
    <section id="contact" className="py-20 watercolor-bg canvas-texture">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full painterly-card mb-6" style={{ backgroundColor: '#F9F8F3' /* FROSTY WHITE */ }}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-pink-400 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium font-body" style={{ color: 'hsl(240, 10%, 15%)' }}>
              Contact & Achat
            </span>
          </div>
          <h2 className="heading-lg mb-6 text-gradient">Comment Acquérir une Œuvre</h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed font-body" style={{ color: 'hsl(240, 10%, 35%)' }}>
            Intéressé par une œuvre ? Contactez-moi directement pour discuter de sa valeur artistique et des modalités d'acquisition.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <div className="space-y-8">
            <h3 className="text-2xl font-display font-semibold mb-6" style={{ color: 'hsl(240, 10%, 15%)' }}>
              Méthodes de Contact
            </h3>

            {/* WhatsApp */}
            <Card className="painterly-card p-6 hover-painterly-lift" style={{ backgroundColor: '#F9F8F3' /* FROSTY WHITE */ }}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold font-body" style={{ color: 'hsl(240, 10%, 15%)' }}>
                    WhatsApp
                  </h4>
                  <p className="text-sm font-body" style={{ color: 'hsl(240, 10%, 35%)' }}>
                    Réponse rapide garantie
                  </p>
                </div>
                <Button 
                  onClick={handleWhatsAppContact}
                  className="hover-painterly-lift"
                  style={{
                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                    color: 'white'
                  }}
                >
                  Contacter
                </Button>
              </div>
            </Card>

            {/* Email */}
            <Card className="painterly-card p-6 hover-painterly-lift" style={{ backgroundColor: '#F9F8F3' /* FROSTY WHITE */ }}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold font-body" style={{ color: 'hsl(240, 10%, 15%)' }}>
                    Email
                  </h4>
                  <p className="text-sm font-body" style={{ color: 'hsl(240, 10%, 35%)' }}>
                    omhind53@gmail.com
                  </p>
                </div>
                <Button 
                  onClick={handleEmailContact}
                  className="hover-painterly-lift"
                  style={{
                    background: 'linear-gradient(135deg, hsl(38, 95%, 60%) 0%, hsl(38, 95%, 55%) 100%)',
                    color: 'hsl(45, 100%, 97%)'
                  }}
                >
                  Envoyer
                </Button>
              </div>
            </Card>

            {/* Social Media */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="painterly-card p-4 hover-painterly-lift" style={{ backgroundColor: '#F9F8F3' /* FROSTY WHITE */ }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-semibold font-body" style={{ color: 'hsl(240, 10%, 15%)' }}>
                      Instagram
                    </h5>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleInstagramContact}
                      className="mt-1 hover-ink-flow"
                    >
                      Suivre
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="painterly-card p-4 hover-painterly-lift" style={{ backgroundColor: '#F9F8F3' /* FROSTY WHITE */ }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <Facebook className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-semibold font-body" style={{ color: 'hsl(240, 10%, 15%)' }}>
                      Facebook
                    </h5>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleFacebookContact}
                      className="mt-1 hover-ink-flow"
                    >
                      Suivre
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <h3 className="text-2xl font-display font-semibold mb-6" style={{ color: 'hsl(240, 10%, 15%)' }}>
              Informations de Contact
            </h3>

            {/* Contact Details Card */}
            <Card className="painterly-card p-6" style={{ backgroundColor: '#F9F8F3' /* FROSTY WHITE */ }}>
              <div className="space-y-4">
                
                <div 
                  className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg transition-all duration-300"
                  style={{ backgroundColor: '#EBE2D1' /* PEACH CREAM */ }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9F8F3'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EBE2D1'}
                  onClick={() => {
                    const address = "BP 2595 RABAT CENTRAL/RABAT";
                    const encodedAddress = encodeURIComponent(address);
                    
                    // Créer un modal personnalisé pour choisir l'application
                    const modal = document.createElement('div');
                    modal.style.cssText = `
                      position: fixed;
                      top: 0;
                      left: 0;
                      width: 100%;
                      height: 100%;
                      background: rgba(0,0,0,0.5);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      z-index: 9999;
                    `;
                    
                    const modalContent = document.createElement('div');
                    modalContent.style.cssText = `
                      background: white;
                      padding: 30px;
                      border-radius: 12px;
                      text-align: center;
                      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                      max-width: 400px;
                      width: 90%;
                    `;
                    
                    modalContent.innerHTML = `
                      <h3 style="margin-bottom: 20px; color: #333; font-size: 18px;">Choisissez votre application de navigation</h3>
                      <p style="margin-bottom: 25px; color: #666; font-size: 14px;">BP 2595 RABAT CENTRAL/RABAT</p>
                      <div style="display: flex; gap: 15px; justify-content: center;">
                        <button id="googleMapsBtn" style="
                          background: #4285f4;
                          color: white;
                          border: none;
                          padding: 12px 24px;
                          border-radius: 8px;
                          cursor: pointer;
                          font-size: 14px;
                          font-weight: 500;
                        ">Google Maps</button>
                        <button id="wazeBtn" style="
                          background: #33ccff;
                          color: white;
                          border: none;
                          padding: 12px 24px;
                          border-radius: 8px;
                          cursor: pointer;
                          font-size: 14px;
                          font-weight: 500;
                        ">Waze</button>
                      </div>
                    `;
                    
                    modal.appendChild(modalContent);
                    document.body.appendChild(modal);
                    
                    // Google Maps button
                    document.getElementById('googleMapsBtn').onclick = () => {
                      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
                      window.open(googleMapsUrl, '_blank');
                      document.body.removeChild(modal);
                    };
                    
                    // Waze button
                    document.getElementById('wazeBtn').onclick = () => {
                      const wazeUrl = `https://waze.com/ul?q=${encodedAddress}&navigate=yes`;
                      window.open(wazeUrl, '_blank');
                      document.body.removeChild(modal);
                    };
                    
                    // Close modal when clicking outside
                    modal.onclick = (e) => {
                      if (e.target === modal) {
                        document.body.removeChild(modal);
                      }
                    };
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold font-body" style={{ color: 'hsl(240, 10%, 15%)' }}>
                      Adresse
                    </h4>
                    <p className="text-sm font-body hover:text-blue-600 transition-colors" style={{ color: 'hsl(240, 10%, 35%)' }}>
                      BP 2595 RABAT CENTRAL/RABAT
                    </p>
                  </div>
                </div>

                <div 
                  className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg transition-all duration-300"
                  style={{ backgroundColor: '#EBE2D1' /* PEACH CREAM */ }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9F8F3'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EBE2D1'}
                  onClick={() => {
                    window.open('tel:+212666672756', '_self');
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold font-body" style={{ color: 'hsl(240, 10%, 15%)' }}>
                      Téléphone
                    </h4>
                    <p className="text-sm font-body hover:text-green-600 transition-colors" style={{ color: 'hsl(240, 10%, 35%)' }}>
                      +212-666 67 27 56
                    </p>
                  </div>
                </div>

                <div 
                  className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg transition-all duration-300"
                  style={{ backgroundColor: '#EBE2D1' /* PEACH CREAM */ }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9F8F3'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EBE2D1'}
                  onClick={() => {
                    window.open('mailto:omhind53@gmail.com', '_self');
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold font-body" style={{ color: 'hsl(240, 10%, 15%)' }}>
                      Email
                    </h4>
                    <p className="text-sm font-body hover:text-orange-600 transition-colors" style={{ color: 'hsl(240, 10%, 35%)' }}>
                      omhind53@gmail.com
                    </p>
                  </div>
                </div>

                <div 
                  className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg transition-all duration-300"
                  style={{ backgroundColor: '#EBE2D1' /* PEACH CREAM */ }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9F8F3'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EBE2D1'}
                  onClick={handleInstagramContact}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold font-body" style={{ color: 'hsl(240, 10%, 15%)' }}>
                      Instagram
                    </h4>
                    <p className="text-sm font-body hover:text-pink-600 transition-colors" style={{ color: 'hsl(240, 10%, 35%)' }}>
                      @fatydouirani
                    </p>
                  </div>
                </div>

                <div 
                  className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg transition-all duration-300"
                  style={{ backgroundColor: '#EBE2D1' /* PEACH CREAM */ }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9F8F3'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EBE2D1'}
                  onClick={handleFacebookContact}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <Facebook className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold font-body" style={{ color: 'hsl(240, 10%, 15%)' }}>
                      Facebook
                    </h4>
                    <p className="text-sm font-body hover:text-blue-600 transition-colors" style={{ color: 'hsl(240, 10%, 35%)' }}>
                      faty oumhind douirani
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Purchase Information */}
          <div className="space-y-8">
            <h3 className="text-2xl font-display font-semibold mb-6" style={{ color: 'hsl(240, 10%, 15%)' }}>
              Modalités d'Achat
            </h3>

            {/* Art Value Info */}
            <Card className="painterly-card p-6" style={{ backgroundColor: '#F9F8F3' /* FROSTY WHITE */ }}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold font-body" style={{ color: 'hsl(240, 10%, 15%)' }}>
                  Valeur Artistique
                </h4>
              </div>
              <ul className="space-y-2 text-sm font-body" style={{ color: 'hsl(240, 10%, 35%)' }}>
                <li>• Chaque œuvre est unique et inestimable</li>
                <li>• Prix à discuter selon la valeur artistique</li>
                <li>• Paiement uniquement en espèces</li>
                <li>• Certificat d'authenticité inclus</li>
              </ul>
            </Card>

            {/* Delivery Info */}
            <Card className="painterly-card p-6" style={{ backgroundColor: '#F9F8F3' /* FROSTY WHITE */ }}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold font-body" style={{ color: 'hsl(240, 10%, 15%)' }}>
                  Livraison & Retrait
                </h4>
              </div>
              <ul className="space-y-2 text-sm font-body" style={{ color: 'hsl(240, 10%, 35%)' }}>
                <li>• Retrait possible à l'atelier (Rabat)</li>
                <li>• BP 2595 RABAT CENTRAL/RABAT</li>
                <li>• Livraison au Maroc</li>
                <li>• Frais de livraison à discuter</li>
                <li>• Emballage professionnel inclus</li>
              </ul>
            </Card>

            {/* Process Info */}
            <Card className="painterly-card p-6" style={{ backgroundColor: '#F9F8F3' /* FROSTY WHITE */ }}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold font-body" style={{ color: 'hsl(240, 10%, 15%)' }}>
                  Processus d'Achat
                </h4>
              </div>
              <ol className="space-y-2 text-sm font-body list-decimal list-inside" style={{ color: 'hsl(240, 10%, 35%)' }}>
                <li>Contactez-moi via WhatsApp ou Email</li>
                <li>Échange sur la valeur artistique de l'œuvre</li>
                <li>Visite de l'atelier (optionnelle)</li>
                <li>Discussion du prix selon la valeur artistique</li>
                <li>Acquisition en espèces avec certificat</li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommerceContact;

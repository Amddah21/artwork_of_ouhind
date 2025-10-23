import { Palette, Star, Award, Globe, Users, User } from "lucide-react";
import Logo from "./Logo";

const About = () => {
  return (
    <section id="about" className="luxury-section luxury-bg-admin relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full blur-2xl" style={{ backgroundColor: 'var(--luxury-gold)' }}></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: 'var(--luxury-orange)' }}></div>
      </div>
      <div className="luxury-container relative z-10">
        <div className="luxury-grid luxury-grid-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full" style={{ 
                backgroundColor: 'rgba(224, 168, 93, 0.1)', 
                border: '1px solid rgba(224, 168, 93, 0.2)' 
              }}>
                <span className="text-sm font-luxury-body font-medium luxury-text-secondary uppercase tracking-wider">À Propos de l'Artiste</span>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                <Logo size="lg" className="text-gray-800 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-gray-800 leading-tight">
                    Omhind
                  </h2>
                  <p className="text-gray-500 font-serif text-lg">Artiste Plasticienne</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed font-serif">
                <strong className="text-gray-800">Omhind</strong> est une artiste plasticienne au tempérament de femme battante, elle se caractérise par de fortes valeurs 
                et des objectifs clairs. Son travail constitue un processus édificateur de projets riches en 
                expériences et recherches en Arts Plastiques.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed font-serif">
                Sa signature artistique est <strong className="text-gray-800">impressionniste et expressionniste contemporaine</strong>. 
                Elle se manifeste par un modelage de matieres et de pigments mesuré en couches, des éclaboussures de couleurs et des traits 
                pleins de nuances, avec des compositions exécutées avec une grande précision.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="flex items-start gap-4 p-6 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Palette className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-gray-800 mb-2 text-lg">Style Impressionniste & Expressionniste</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Modelage en couches, éclaboussures de couleurs et traits nuancés
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-gray-800 mb-2 text-lg">Dialogue Visuel & Interactif</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Communication situationniste contemplative et réflexive
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-gray-800 mb-2 text-lg">Expositions Internationales</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Maroc, France, Allemagne, Turquie - Partages d'émotions intérieures
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Artist Portrait */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-lg overflow-hidden bg-gray-100 shadow-lg">
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-lg mx-auto mb-4 flex items-center justify-center bg-gray-300">
                        <User className="w-16 h-16 lg:w-20 lg:h-20 text-gray-500" />
                      </div>
                      <p className="text-lg font-serif font-medium text-gray-700">
                        Omhind
                      </p>
                      <p className="text-sm text-gray-500 font-serif">
                        Artiste Plasticienne
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

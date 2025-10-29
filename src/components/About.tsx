import { Palette, Star, Award, Globe, Users, User } from "lucide-react";
import Logo from "./Logo";

const About = () => {
  return (
    <section id="about" className="luxury-section relative overflow-hidden" style={{ backgroundColor: '#F9F8F3' }}> {/* FROSTY WHITE exact */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full blur-2xl" style={{ backgroundColor: '#717871' /* SAGE */ }}></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full blur-3xl" style={{ backgroundColor: '#873F31' /* PIPE */ }}></div>
      </div>
      <div className="luxury-container relative z-10">
        <div className="luxury-grid luxury-grid-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-3 mb-6 sm:mb-8 px-4 sm:px-6 py-2 sm:py-3 rounded-full luxury-floating-elements" style={{ 
                backgroundColor: '#EBE2D1' /* PEACH CREAM */, 
                border: '1px solid rgba(122, 119, 113, 0.15)' /* SAGE */
              }}>
                <span 
                  className="text-xs sm:text-sm font-medium uppercase tracking-wider" 
                  style={{ 
                    fontFamily: "'Proza Libre', sans-serif", 
                    color: '#4B4A46' /* CHARCOAL TAUPE */
                  }}
                >
                  À Propos de l'Artiste
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                <Logo size="lg" className="flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <h2 
                    className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light leading-tight" 
                    style={{ 
                      fontFamily: "'Cormorant Garamond', serif", 
                      color: '#4B4A46' /* CHARCOAL TAUPE */
                    }}
                  >
                    Omhind
                  </h2>
                  <p 
                    className="text-sm sm:text-base lg:text-lg font-medium" 
                    style={{ 
                      fontFamily: "'Proza Libre', sans-serif", 
                      color: '#717871' /* SAGE */
                    }}
                  >
                    Artiste Plasticienne
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6 sm:space-y-8">
              <p 
                className="leading-relaxed text-left sm:text-justify"
                style={{ 
                  fontFamily: "'Proza Libre', sans-serif",
                  fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                  lineHeight: '1.8',
                  color: '#4B4A46' /* CHARCOAL TAUPE */
                }}
              >
                <span 
                  style={{ 
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 600,
                    color: '#873F31', /* PIPE */
                    fontSize: '1.15em'
                  }}
                >
                  Omhind
                </span> est une artiste plasticienne au tempérament de femme battante, elle se caractérise par de fortes valeurs 
                et des objectifs clairs. Son travail constitue un processus édificateur de projets riches en 
                expériences et recherches en Arts Plastiques.
              </p>
              <p 
                className="leading-relaxed text-left sm:text-justify"
                style={{ 
                  fontFamily: "'Proza Libre', sans-serif",
                  fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                  lineHeight: '1.8',
                  color: '#4B4A46' /* CHARCOAL TAUPE */
                }}
              >
                Sa signature artistique est <span 
                  style={{ 
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 600,
                    color: '#873F31', /* PIPE */
                    fontSize: '1.1em'
                  }}
                >
                  impressionniste et expressionniste contemporaine
                </span>. 
                Elle se manifeste par un modelage de matieres et de pigments mesuré en couches, des éclaboussures de couleurs et des traits 
                pleins de nuances, avec des compositions exécutées avec une grande précision.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="flex items-start gap-4 p-4 sm:p-6 rounded-lg hover:shadow-lg transition-all duration-300 border" style={{ backgroundColor: '#F9F8F3' /* FROSTY WHITE */, borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */ }}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(122, 119, 113, 0.1)' /* SAGE */ }}>
                  <Palette className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#873F31' /* PIPE */ }} />
                </div>
                <div>
                  <h3 
                    className="font-medium mb-2 text-base sm:text-lg lg:text-xl" 
                    style={{ 
                      fontFamily: "'Cormorant Garamond', serif", 
                      color: '#4B4A46' /* CHARCOAL TAUPE */
                    }}
                  >
                    Style Impressionniste & Expressionniste
                  </h3>
                  <p 
                    className="leading-relaxed text-sm sm:text-base" 
                    style={{ 
                      fontFamily: "'Proza Libre', sans-serif", 
                      color: '#717871' /* SAGE */
                    }}
                  >
                    Modelage en couches, éclaboussures de couleurs et traits nuancés
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 sm:p-6 rounded-lg hover:shadow-lg transition-all duration-300 border" style={{ backgroundColor: '#F9F8F3' /* FROSTY WHITE */, borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */ }}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(122, 119, 113, 0.1)' /* SAGE */ }}>
                  <Star className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#873F31' /* PIPE */ }} />
                </div>
                <div>
                  <h3 
                    className="font-medium mb-2 text-base sm:text-lg lg:text-xl" 
                    style={{ 
                      fontFamily: "'Cormorant Garamond', serif", 
                      color: '#4B4A46' /* CHARCOAL TAUPE */
                    }}
                  >
                    Dialogue Visuel & Interactif
                  </h3>
                  <p 
                    className="leading-relaxed text-sm sm:text-base" 
                    style={{ 
                      fontFamily: "'Proza Libre', sans-serif", 
                      color: '#717871' /* SAGE */
                    }}
                  >
                    Communication situationniste contemplative et réflexive
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 sm:p-6 rounded-lg hover:shadow-lg transition-all duration-300 border" style={{ backgroundColor: '#F9F8F3' /* FROSTY WHITE */, borderColor: 'rgba(122, 119, 113, 0.2)' /* SAGE */ }}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(122, 119, 113, 0.1)' /* SAGE */ }}>
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#873F31' /* PIPE */ }} />
                </div>
                <div>
                  <h3 
                    className="font-medium mb-2 text-base sm:text-lg lg:text-xl" 
                    style={{ 
                      fontFamily: "'Cormorant Garamond', serif", 
                      color: '#4B4A46' /* CHARCOAL TAUPE */
                    }}
                  >
                    Expositions Internationales
                  </h3>
                  <p 
                    className="leading-relaxed text-sm sm:text-base" 
                    style={{ 
                      fontFamily: "'Proza Libre', sans-serif", 
                      color: '#717871' /* SAGE */
                    }}
                  >
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
                      <p 
                        className="text-lg sm:text-xl font-medium"
                        style={{ 
                          fontFamily: "'Cormorant Garamond', serif",
                          color: '#4B4A46' /* CHARCOAL TAUPE */
                        }}
                      >
                        Omhind
                      </p>
                      <p 
                        className="text-sm sm:text-base"
                        style={{ 
                          fontFamily: "'Proza Libre', sans-serif",
                          color: '#717871' /* SAGE */
                        }}
                      >
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

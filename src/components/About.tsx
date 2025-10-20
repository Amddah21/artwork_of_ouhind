import { Palette, Star, Award, Globe, Users, User } from "lucide-react";
import Logo from "./Logo";

const About = () => {
  return (
    <section id="about" className="py-8 md:py-12 lg:py-16 xl:py-20 2xl:py-12 bg-gradient-subtle relative overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 items-center">
          <div className="animate-fade-in space-y-4 md:space-y-6 lg:space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 md:mb-4 lg:mb-6 px-3 md:px-4 py-2 rounded-full glass-effect border border-accent/20">
                <span className="text-xs md:text-sm font-semibold text-accent uppercase tracking-wider">À Propos de l'Artiste</span>
                <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-accent rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6 lg:mb-8">
                <Logo size="lg" className="text-foreground flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-serif font-bold text-foreground leading-tight">
                    Oum Hind, Fatima
                  </h2>
                  <p className="text-accent font-medium text-sm md:text-base lg:text-lg xl:text-xl">Artiste Plasticienne • Née à Safi en 1957</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 md:space-y-4 lg:space-y-6">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Oum Hind, Fatima</strong>, est née à Safi en 1957. 
                Artiste plasticienne au tempérament de femme battante, elle se caractérise par de fortes valeurs 
                et des objectifs clairs. Son travail constitue un processus édificateur de projets riches en 
                expériences et recherches en Arts Plastiques.
              </p>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-muted-foreground leading-relaxed">
                Sa signature artistique est <strong className="text-foreground">impressionniste et expressionniste contemporaine</strong>. 
                Elle se manifeste par un modelage de matieres et de pigments mesuré en couches, des éclaboussures de couleurs et des traits 
                pleins de nuances, avec des compositions exécutées avec une grande précision.
              </p>
          
            </div>

            <div className="grid gap-2 md:gap-3 lg:gap-4">
              <div className="group flex flex-col sm:flex-row items-start gap-3 md:gap-4 lg:gap-6 p-3 md:p-4 lg:p-6 rounded-2xl hover:bg-card/60 transition-all duration-500 border border-transparent hover:border-accent/20 hover:shadow-elegant">
                <div className="icon-badge group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Palette className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-foreground mb-1 md:mb-2 lg:mb-3 text-sm md:text-base lg:text-lg xl:text-xl">Style Impressionniste & Expressionniste</h3>
                  <p className="text-muted-foreground leading-relaxed text-xs md:text-sm lg:text-base xl:text-lg">
                    Modelage en couches, éclaboussures de couleurs et traits nuancés
                  </p>
                </div>
              </div>
              
              <div className="group flex flex-col sm:flex-row items-start gap-3 md:gap-4 lg:gap-6 p-3 md:p-4 lg:p-6 rounded-2xl hover:bg-card/60 transition-all duration-500 border border-transparent hover:border-accent/20 hover:shadow-elegant">
                <div className="icon-badge group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Star className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-foreground mb-1 md:mb-2 lg:mb-3 text-sm md:text-base lg:text-lg xl:text-xl">Dialogue Visuel & Interactif</h3>
                  <p className="text-muted-foreground leading-relaxed text-xs md:text-sm lg:text-base xl:text-lg">
                    Communication situationniste contemplative et réflexive
                  </p>
                </div>
              </div>
              
              <div className="group flex flex-col sm:flex-row items-start gap-3 md:gap-4 lg:gap-6 p-3 md:p-4 lg:p-6 rounded-2xl hover:bg-card/60 transition-all duration-500 border border-transparent hover:border-accent/20 hover:shadow-elegant">
                <div className="icon-badge group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Globe className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-foreground mb-1 md:mb-2 lg:mb-3 text-sm md:text-base lg:text-lg xl:text-xl">Expositions Internationales</h3>
                  <p className="text-muted-foreground leading-relaxed text-xs md:text-sm lg:text-base xl:text-lg">
                    Maroc, France, Allemagne, Turquie - Partages d'émotions intérieures
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-scale-in space-y-3 md:space-y-4 lg:space-y-6 mt-6 lg:mt-0">
            {/* Artist Portrait */}
            <div className="flex justify-center lg:justify-start mb-8">
              <div className="relative">
                <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden comfort-card shadow-lg border-4" style={{borderColor: '#7A6B5A', backgroundColor: 'rgba(122, 107, 90, 0.1)'}}>
                  <div className="w-full h-full bg-gradient-to-br from-[#F8F8F8] to-[#F5F5F5] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full mx-auto mb-3 flex items-center justify-center" style={{backgroundColor: '#7A6B5A', opacity: 0.8}}>
                        <User className="w-12 h-12 lg:w-14 lg:h-14 text-white" />
                      </div>
                      <p className="text-sm font-accent font-bold comfort-text" style={{color: '#7A6B5A'}}>
                        Oum Hind, Fatima
                      </p>
                      <p className="text-xs comfort-text-muted font-body">
                        Artiste Plasticienne
                      </p>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-pulse" style={{backgroundColor: '#7A6B5A', opacity: 0.6}}></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full animate-pulse" style={{backgroundColor: '#7A6B5A', opacity: 0.4}}></div>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground mb-1 md:mb-2">Réalisations & Impact</h3>
              <p className="text-muted-foreground text-xs md:text-sm lg:text-base">Une carrière dédiée à l'art et à l'humanité</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 md:gap-3 lg:gap-4 xl:gap-6">
              <div className="stat-card group p-3 md:p-4 lg:p-6">
                <div className="stat-number group-hover:scale-110 transition-transform duration-300 text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">40+</div>
                <div className="text-muted-foreground font-semibold text-xs md:text-sm lg:text-base xl:text-lg">Années de Carrière</div>
                <div className="w-full h-1 bg-gradient-to-r from-accent to-primary rounded-full mt-1 md:mt-2 lg:mt-3 opacity-60"></div>
              </div>
              
              <div className="stat-card group p-3 md:p-4 lg:p-6">
                <div className="stat-number group-hover:scale-110 transition-transform duration-300 text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">25+</div>
                <div className="text-muted-foreground font-semibold text-xs md:text-sm lg:text-base xl:text-lg">Expositions</div>
                <div className="w-full h-1 bg-gradient-to-r from-accent to-primary rounded-full mt-1 md:mt-2 lg:mt-3 opacity-60"></div>
              </div>
              
              <div className="stat-card group p-3 md:p-4 lg:p-6">
                <div className="stat-number group-hover:scale-110 transition-transform duration-300 text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">4</div>
                <div className="text-muted-foreground font-semibold text-xs md:text-sm lg:text-base xl:text-lg">Pays</div>
                <div className="w-full h-1 bg-gradient-to-r from-accent to-primary rounded-full mt-1 md:mt-2 lg:mt-3 opacity-60"></div>
              </div>
              
              <div className="stat-card group p-3 md:p-4 lg:p-6">
                <div className="stat-number group-hover:scale-110 transition-transform duration-300 text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">∞</div>
                <div className="text-muted-foreground font-semibold text-xs md:text-sm lg:text-base xl:text-lg">Émotions</div>
                <div className="w-full h-1 bg-gradient-to-r from-accent to-primary rounded-full mt-1 md:mt-2 lg:mt-3 opacity-60"></div>
              </div>
            </div>
            
            <div className="text-center lg:text-left pt-2 md:pt-3 lg:pt-4">
              <div className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-4 lg:px-6 py-2 md:py-3 rounded-full glass-effect border border-accent/30">
                <Star className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-accent" />
                <span className="text-xs md:text-sm font-medium text-foreground">Artiste Reconnue Internationalement</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

import { Palette, Heart, Star } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Omhind Fatima Douirani
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Artiste plasticienne, matériste. Elle a embrassé le domaine de l'art dès son
              bas âge, en manipulant la matière naturelle. Elle a participé à plusieurs expositions
              individuelles et collectives, nationales et internationales, et continue toujours à faire
              des recherches.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Omhind assure des ateliers de formation en art plastique, surtout pour des enfants
              malades et démunis. Son travail explore la texture et la matière, créant des œuvres
              uniques qui évoquent l'émotion et racontent des histoires visuelles captivantes.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Palette className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Art Matériste</h3>
                  <p className="text-muted-foreground">
                    Spécialisation dans la manipulation de matières naturelles
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Ateliers de Formation</h3>
                  <p className="text-muted-foreground">
                    Ateliers d'art plastique pour enfants malades et démunis
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Expositions Internationales</h3>
                  <p className="text-muted-foreground">
                    Turquie, Allemagne, France et à travers le Maroc
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 animate-scale-in">
            <div className="bg-card p-8 rounded-lg shadow-elegant text-center">
              <div className="text-4xl font-bold text-accent mb-2">14+</div>
              <div className="text-muted-foreground">Années d'Expositions</div>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-elegant text-center">
              <div className="text-4xl font-bold text-accent mb-2">30+</div>
              <div className="text-muted-foreground">Expositions</div>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-elegant text-center">
              <div className="text-4xl font-bold text-accent mb-2">5</div>
              <div className="text-muted-foreground">Pays</div>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-elegant text-center">
              <div className="text-4xl font-bold text-accent mb-2">∞</div>
              <div className="text-muted-foreground">Créativité</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

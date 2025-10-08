import { Palette, Heart, Star } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              About the Artist
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              With over a decade of experience in various artistic mediums, I create artwork
              that captures emotion, beauty, and the essence of my subjects. Each piece is
              carefully crafted with attention to detail and a passion for visual storytelling.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              From intricate pencil portraits to vibrant watercolor landscapes, my work
              explores the boundaries between realism and artistic interpretation. I believe
              every artwork should evoke emotion and create a lasting connection with its viewer.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Palette className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Diverse Techniques</h3>
                  <p className="text-muted-foreground">
                    Mastery in watercolor, pencil, charcoal, and mixed media
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Custom Commissions</h3>
                  <p className="text-muted-foreground">
                    Personalized artwork tailored to your vision and space
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Award-Winning</h3>
                  <p className="text-muted-foreground">
                    Recognized in multiple regional and national art exhibitions
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 animate-scale-in">
            <div className="bg-card p-8 rounded-lg shadow-elegant text-center">
              <div className="text-4xl font-bold text-accent mb-2">10+</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-elegant text-center">
              <div className="text-4xl font-bold text-accent mb-2">200+</div>
              <div className="text-muted-foreground">Artworks Created</div>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-elegant text-center">
              <div className="text-4xl font-bold text-accent mb-2">150+</div>
              <div className="text-muted-foreground">Happy Clients</div>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-elegant text-center">
              <div className="text-4xl font-bold text-accent mb-2">8</div>
              <div className="text-muted-foreground">Awards Won</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

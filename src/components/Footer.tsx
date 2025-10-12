import { Instagram, Facebook, Twitter } from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Logo size="lg" className="text-primary-foreground" />
              <div>
                <h3 className="font-serif text-2xl font-bold">Artiste OmHind</h3>
                <p className="text-primary-foreground/70 text-sm">Omhind Fatima Douirani</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Créer des œuvres d'art uniques et donner vie aux visions artistiques à travers la passion et le dévouement.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Suivez-Moi</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="bg-primary-foreground/10 p-2 rounded-lg hover:bg-primary-foreground/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-primary-foreground/10 p-2 rounded-lg hover:bg-primary-foreground/20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-primary-foreground/10 p-2 rounded-lg hover:bg-primary-foreground/20 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()}Artiste OmHind. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

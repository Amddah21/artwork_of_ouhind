import { useState, useEffect } from "react";
import { Menu, X, Grid3X3, User, Mail, LogIn, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import LoginForm from "./LoginForm";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    } else {
      console.warn(`Element with id "${id}" not found`);
    }
  };

  const navigateToSection = (sectionId: string) => {
    if (sectionId.startsWith('#')) {
      scrollToSection(sectionId.substring(1));
    } else if (sectionId === 'hero' || sectionId === 'accueil') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    } else {
      scrollToSection(sectionId);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "glass-effect shadow-elegant" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" className="text-foreground" />
            <h1 className="font-serif text-2xl font-bold text-foreground">Artiste Mamany-Art</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigateToSection("hero")}
              className="flex items-center gap-2 text-foreground hover:text-accent transition-all duration-300 font-medium hover:scale-105 group"
            >
              <Grid3X3 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              Accueil
            </button>
            <button
              onClick={() => navigateToSection("portfolio")}
              className="flex items-center gap-2 text-foreground hover:text-accent transition-all duration-300 font-medium hover:scale-105 group"
            >
              <Grid3X3 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              Galerie
            </button>
            <button
              onClick={() => navigateToSection("about")}
              className="flex items-center gap-2 text-foreground hover:text-accent transition-all duration-300 font-medium hover:scale-105 group"
            >
              <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              À Propos
            </button>
            <button
              onClick={() => navigateToSection("exhibitions")}
              className="flex items-center gap-2 text-foreground hover:text-accent transition-all duration-300 font-medium hover:scale-105 group"
            >
              <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              Expositions
            </button>
            <button
              onClick={() => navigateToSection("contact")}
              className="flex items-center gap-2 text-foreground hover:text-accent transition-all duration-300 font-medium hover:scale-105 group"
            >
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              Contact
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLoginForm(true)}
              className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/30 hover:from-accent/20 hover:to-accent/10 hover:border-accent/50 transition-all duration-300 hover:scale-105 group"
            >
              <LogIn className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform duration-300" />
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigateToSection("hero")}
                className="flex items-center gap-3 text-left text-foreground hover:text-accent transition-all duration-300 py-3 px-2 rounded-lg hover:bg-card/50 group"
              >
                <Grid3X3 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Accueil
              </button>
              <button
                onClick={() => navigateToSection("portfolio")}
                className="flex items-center gap-3 text-left text-foreground hover:text-accent transition-all duration-300 py-3 px-2 rounded-lg hover:bg-card/50 group"
              >
                <Grid3X3 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Galerie
              </button>
              <button
                onClick={() => navigateToSection("about")}
                className="flex items-center gap-3 text-left text-foreground hover:text-accent transition-all duration-300 py-3 px-2 rounded-lg hover:bg-card/50 group"
              >
                <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                À Propos
              </button>
              <button
                onClick={() => navigateToSection("exhibitions")}
                className="flex items-center gap-3 text-left text-foreground hover:text-accent transition-all duration-300 py-3 px-2 rounded-lg hover:bg-card/50 group"
              >
                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Expositions
              </button>
              <button
                onClick={() => navigateToSection("contact")}
                className="flex items-center gap-3 text-left text-foreground hover:text-accent transition-all duration-300 py-3 px-2 rounded-lg hover:bg-card/50 group"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Contact
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLoginForm(true)}
                className="w-full justify-start bg-gradient-to-r from-accent/10 to-accent/5 border-accent/30 hover:from-accent/20 hover:to-accent/10 hover:border-accent/50 transition-all duration-300 group"
              >
                <LogIn className="w-5 h-5 mr-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Login Form Modal */}
      {showLoginForm && (
        <LoginForm
          onClose={() => setShowLoginForm(false)}
          onSuccess={() => {
            setShowLoginForm(false);
            window.location.href = '/admin';
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;

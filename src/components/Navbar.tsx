import { useState, useEffect } from "react";
import { Menu, X, Grid3X3, User, Mail, Settings, Calendar, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <h1 className="font-serif text-2xl font-bold text-foreground">Artiste OmHind</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("portfolio")}
              className="flex items-center gap-2 text-foreground hover:text-accent transition-all duration-300 font-medium hover:scale-105 group"
            >
              <Grid3X3 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              Portfolio
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="flex items-center gap-2 text-foreground hover:text-accent transition-all duration-300 font-medium hover:scale-105 group"
            >
              <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              À Propos
            </button>
            <button
              onClick={() => scrollToSection("exhibitions")}
              className="flex items-center gap-2 text-foreground hover:text-accent transition-all duration-300 font-medium hover:scale-105 group"
            >
              <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              Expositions
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="flex items-center gap-2 text-foreground hover:text-accent transition-all duration-300 font-medium hover:scale-105 group"
            >
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              Contact
            </button>
            <a
              href="/favorites"
              className="flex items-center gap-2 text-foreground hover:text-accent transition-all duration-300 font-medium hover:scale-105 group text-sm"
            >
              <Heart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              Favoris
            </a>
            <a
              href="/admin"
              className="flex items-center gap-2 text-foreground hover:text-accent transition-all duration-300 font-medium hover:scale-105 group text-sm"
            >
              <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              Admin
            </a>
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
                onClick={() => scrollToSection("portfolio")}
                className="flex items-center gap-3 text-left text-foreground hover:text-accent transition-all duration-300 py-3 px-2 rounded-lg hover:bg-card/50 group"
              >
                <Grid3X3 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Portfolio
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="flex items-center gap-3 text-left text-foreground hover:text-accent transition-all duration-300 py-3 px-2 rounded-lg hover:bg-card/50 group"
              >
                <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                À Propos
              </button>
              <button
                onClick={() => scrollToSection("exhibitions")}
                className="flex items-center gap-3 text-left text-foreground hover:text-accent transition-all duration-300 py-3 px-2 rounded-lg hover:bg-card/50 group"
              >
                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Expositions
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="flex items-center gap-3 text-left text-foreground hover:text-accent transition-all duration-300 py-3 px-2 rounded-lg hover:bg-card/50 group"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Contact
              </button>
              <a
                href="/favorites"
                className="flex items-center gap-3 text-left text-foreground hover:text-accent transition-all duration-300 py-3 px-2 rounded-lg hover:bg-card/50 group"
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Favoris
              </a>
              <a
                href="/admin"
                className="flex items-center gap-3 text-left text-foreground hover:text-accent transition-all duration-300 py-3 px-2 rounded-lg hover:bg-card/50 group"
              >
                <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Admin
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

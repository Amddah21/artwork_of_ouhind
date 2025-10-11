import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-elegant" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" className="text-foreground" />
            <h1 className="font-serif text-2xl font-bold text-foreground">Artiste OmHind</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("portfolio")}
              className="text-foreground hover:text-accent transition-colors"
            >
              Portfolio
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-foreground hover:text-accent transition-colors"
            >
              À Propos
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-foreground hover:text-accent transition-colors"
            >
              Contact
            </button>
            <a
              href="/admin"
              className="text-foreground hover:text-accent transition-colors text-sm"
            >
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
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("portfolio")}
                className="text-left text-foreground hover:text-accent transition-colors py-2"
              >
                Portfolio
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-left text-foreground hover:text-accent transition-colors py-2"
              >
                À Propos
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-left text-foreground hover:text-accent transition-colors py-2"
              >
                Contact
              </button>
              <a
                href="/admin"
                className="text-left text-foreground hover:text-accent transition-colors py-2"
              >
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

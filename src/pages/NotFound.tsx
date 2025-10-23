import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center luxury-bg-admin">
      <div className="text-center luxury-card-premium p-12">
        <h1 className="mb-6 text-6xl font-luxury-display luxury-text-gradient">404</h1>
        <p className="mb-8 text-2xl font-luxury-body luxury-text-secondary">Oops! Page non trouvée</p>
        <a 
          href="/" 
          className="luxury-btn-gradient px-8 py-3 text-lg font-semibold"
        >
          Retour à l'Accueil
        </a>
      </div>
    </div>
  );
};

export default NotFound;

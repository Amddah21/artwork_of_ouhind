import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      
      // Check if user is admin after login
      const adminEmails = ['omhind53@gmail.com', 'ahmed1965amddah@gmail.com'];
      const isUserAdmin = adminEmails.includes(email.toLowerCase()) && password === 'admin123';
      
      // Only show success message if login was successful (admin check passed)
      toast({
        title: "Connexion réussie",
        description: isUserAdmin ? "Bienvenue dans l'interface admin!" : "Connexion réussie!",
      });
      
      onSuccess?.();
      onClose();
      
      // Only redirect admin users to dashboard
      if (isUserAdmin) {
        navigate('/admin');
      }
      // Regular users stay on current page
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "Erreur de connexion. Veuillez réessayer.";
      
      // Handle specific error cases
      if (error?.message?.includes('Invalid login credentials')) {
        errorMessage = "Email ou mot de passe incorrect.";
      } else if (error?.message?.includes('Email not confirmed')) {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter.";
      } else if (error?.message?.includes('Too many requests')) {
        errorMessage = "Trop de tentatives. Veuillez attendre quelques minutes.";
      } else if (error?.message?.includes('User not found')) {
        errorMessage = "Aucun compte trouvé avec cet email.";
      } else if (error?.message?.includes('Authentication timeout')) {
        errorMessage = "Timeout de connexion. Vérifiez votre connexion internet.";
      } else if (error?.message?.includes('ERR_INSUFFICIENT_RESOURCES')) {
        errorMessage = "Ressources insuffisantes. Veuillez réessayer dans quelques instants.";
      } else if (error?.message?.includes('Google')) {
        errorMessage = "Problème avec la vérification Google. Essayez de vous déconnecter de votre compte Google et reconnectez-vous.";
      } else if (error?.message?.includes('Access denied: not authorized')) {
        errorMessage = "Accès refusé: vous n'êtes pas autorisé à accéder à cette interface.";
      } else if (error?.message?.includes('Database unavailable')) {
        errorMessage = "Base de données indisponible. Veuillez réessayer plus tard.";
      }
      
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(43, 48, 46, 0.6)' }}>
      <div 
        className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ 
          backgroundColor: '#F9F8F3', /* FROSTY WHITE exact */
          border: '1px solid rgba(122, 119, 113, 0.3)' /* SAGE subtle */
        }}
      >
        {/* Close Button - Luxury Style */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20"
          style={{ color: '#717871' }} /* SAGE */
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="px-8 pt-12 pb-6">
          <h2 
            className="text-3xl font-medium mb-4"
            style={{ 
              fontFamily: "'Cormorant Garamond', serif",
              color: '#4B4A46' /* CHARCOAL TAUPE */
            }}
          >
            Connexion Administrateur
          </h2>
          <p 
            className="text-sm leading-relaxed"
            style={{ 
              fontFamily: "'Proza Libre', sans-serif",
              color: '#717871' /* SAGE */
            }}
          >
            Connectez-vous avec vos identifiants. Les administrateurs seront redirigés vers le panneau d'administration.
          </p>
        </div>

        {/* Form Content */}
        <div className="px-8 pb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="email"
                style={{ 
                  fontFamily: "'Proza Libre', sans-serif",
                  color: '#4B4A46' /* CHARCOAL TAUPE */
                }}
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-2 rounded-lg transition-all duration-300 focus:border-amber-600"
                style={{ 
                  backgroundColor: '#EBE2D1', /* PEACH CREAM */
                  borderColor: 'rgba(122, 119, 113, 0.2)', /* SAGE subtle */
                  fontFamily: "'Proza Libre', sans-serif",
                  color: '#4B4A46'
                }}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="password"
                style={{ 
                  fontFamily: "'Proza Libre', sans-serif",
                  color: '#4B4A46' /* CHARCOAL TAUPE */
                }}
              >
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-12 h-12 border-2 rounded-lg transition-all duration-300 focus:border-amber-600"
                  style={{ 
                    backgroundColor: '#EBE2D1', /* PEACH CREAM */
                    borderColor: 'rgba(122, 119, 113, 0.2)', /* SAGE subtle */
                    fontFamily: "'Proza Libre', sans-serif",
                    color: '#4B4A46'
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: '#717871' }} /* SAGE */
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Submit Button - Luxury Style */}
            <Button 
              type="submit" 
              className="w-full h-12 rounded-lg font-medium text-base transition-all duration-500 hover:shadow-2xl hover:-translate-y-0.5"
              disabled={isLoading}
              style={{ 
                backgroundColor: '#873F31', /* PIPE */
                color: '#F9F8F3', /* FROSTY WHITE */
                fontFamily: "'Proza Libre', sans-serif",
                boxShadow: '0 4px 12px rgba(135, 63, 49, 0.25)',
                border: 'none'
              }}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

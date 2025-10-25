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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 luxury-card-premium">
        <CardHeader className="relative" style={{ borderBottom: '1px solid rgba(224, 168, 93, 0.2)' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 luxury-btn-secondary"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-luxury-display luxury-text-primary">Connexion Administrateur</CardTitle>
          <CardDescription className="font-luxury-body luxury-text-secondary">
            Connectez-vous avec vos identifiants. Les administrateurs seront redirigés vers le panneau d'administration.
            <br />
            <span className="text-sm text-gray-500 mt-2 block">
              💡 Pour les comptes Gmail différents, assurez-vous d'utiliser le bon compte Google.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
            
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;

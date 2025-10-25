import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminAuthService } from '@/lib/adminAuthService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Database, Shield } from 'lucide-react';

interface AdminMiddlewareProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AdminMiddleware: React.FC<AdminMiddlewareProps> = ({ 
  children, 
  fallback 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [adminCheck, setAdminCheck] = useState<{
    isChecking: boolean;
    isAdmin: boolean;
    error?: string;
  }>({
    isChecking: true,
    isAdmin: false
  });

  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (!isAuthenticated || !user?.email) {
        setAdminCheck({
          isChecking: false,
          isAdmin: false,
          error: 'Authentication required'
        });
        return;
      }

      try {
        console.log('🔍 AdminMiddleware: Verifying admin access for:', user.email);
        
        const result = await AdminAuthService.verifyAdminAccess(user.email, user.id);
        
        setAdminCheck({
          isChecking: false,
          isAdmin: result.isAdmin,
          error: result.error
        });

        if (result.isAdmin) {
          console.log('✅ AdminMiddleware: Admin access verified');
        } else {
          console.log('🚫 AdminMiddleware: Admin access denied:', result.error);
        }

      } catch (error: any) {
        console.error('💥 AdminMiddleware: Verification failed:', error);
        setAdminCheck({
          isChecking: false,
          isAdmin: false,
          error: error.message || 'Verification failed'
        });
      }
    };

    if (!isLoading) {
      verifyAdminAccess();
    }
  }, [isAuthenticated, user, isLoading]);

  // Show loading state
  if (isLoading || adminCheck.isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
            <p>Vérification des permissions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">Authentification Requise</h2>
            <p className="text-muted-foreground mb-4">
              Vous devez être connecté pour accéder à cette page.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check admin status
  if (!adminCheck.isAdmin) {
    const errorIcon = adminCheck.error?.includes('Database') ? Database : AlertTriangle;
    const ErrorIcon = errorIcon;

    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <ErrorIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">Accès Refusé</h2>
            <p className="text-muted-foreground mb-4">
              {adminCheck.error === 'Database unavailable' 
                ? 'Base de données indisponible. Veuillez réessayer plus tard.'
                : adminCheck.error === 'Access denied: not authorized'
                ? 'Accès refusé: vous n\'êtes pas autorisé à accéder à cette interface.'
                : 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.'
              }
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Retour à l'accueil
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin access granted - render children or fallback
  return <>{fallback || children}</>;
};

export default AdminMiddleware;

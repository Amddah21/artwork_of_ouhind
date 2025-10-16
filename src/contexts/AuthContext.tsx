import React, { createContext, useContext, useEffect, useState } from 'react';
import { SupabaseAuthService } from '@/services/supabase-auth-service';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const session = await SupabaseAuthService.getSession();
        if (session?.user) {
          // Get user role from user_profiles table
          const { data: userProfile, error } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          // Fallback: if user profile doesn't exist, create it
          if (error && error.code === 'PGRST116') {
            // User profile doesn't exist, create it
            const { data: newProfile } = await supabase
              .from('user_profiles')
              .insert({
                id: session.user.id,
                email: session.user.email || '',
                role: session.user.email === 'admin@artiste.com' ? 'admin' : 'user'
              })
              .select()
              .single();
            
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              role: newProfile?.role || 'user'
            });
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              role: userProfile?.role || 'user'
            });
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Get user role from user_profiles table
        const { data: userProfile, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        // Fallback: if user profile doesn't exist, create it
        if (error && error.code === 'PGRST116') {
          // User profile doesn't exist, create it
          const { data: newProfile } = await supabase
            .from('user_profiles')
            .insert({
              id: session.user.id,
              email: session.user.email || '',
              role: session.user.email === 'admin@artiste.com' ? 'admin' : 'user'
            })
            .select()
            .single();
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: newProfile?.role || 'user'
          });
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: userProfile?.role || 'user'
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await SupabaseAuthService.signIn(email, password);
  };

  const signOut = async () => {
    await SupabaseAuthService.signOut();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

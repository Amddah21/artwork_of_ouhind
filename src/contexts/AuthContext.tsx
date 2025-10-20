import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/api';
import type { User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface Profile {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: Profile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
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
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 AuthContext initializing...', { supabaseUrl, supabaseAnonKey });
    
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      // Fallback to localStorage for development
      console.log('Supabase not configured, using localStorage fallback');
      // Don't auto-load user from localStorage - start fresh each time
      setIsLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          role: data.role || 'user'
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 SignIn attempt:', { email, supabaseUrl, supabaseAnonKey });
      
      // Check if Supabase is properly configured
      if (!supabaseUrl || !supabaseAnonKey) {
        // Fallback to localStorage for development - accept any credentials
        console.log('Supabase not configured, using localStorage fallback');
        
        // Check for admin credentials
        if (email === 'omhind53@gmail.com' && password === 'admin123') {
          const adminUser: Profile = {
            id: '1',
            email: 'omhind53@gmail.com',
            role: 'admin'
          };
          setUser(adminUser);
          localStorage.setItem('artspark-auth', JSON.stringify(adminUser));
          console.log('Admin login successful:', adminUser);
        } else if (email && password) {
          // Accept any other valid email/password as regular user
          const regularUser: Profile = {
            id: Date.now().toString(),
            email: email,
            role: 'user'
          };
          setUser(regularUser);
          localStorage.setItem('artspark-auth', JSON.stringify(regularUser));
          console.log('Regular user login successful:', regularUser);
        } else {
          throw new Error('Login Failed');
        }
        return;
      }

      console.log('🌐 Using Supabase authentication...');
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Supabase login error:', error);
        throw new Error('Login Failed');
      }

      console.log('✅ Supabase login successful, fetching profile...');
      // Fetch profile after successful sign-in
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (supabaseUser) {
        await fetchUserProfile(supabaseUser.id);
      }

    } catch (error) {
      console.error('💥 Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        console.log('Supabase not configured, using localStorage fallback for signUp');
        // For development, just create a local user
        const newUser: Profile = {
          id: Date.now().toString(),
          email: email,
          role: 'user'
        };
        setUser(newUser);
        localStorage.setItem('artspark-auth', JSON.stringify(newUser));
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        console.log('Supabase not configured, clearing localStorage');
        setUser(null);
        localStorage.removeItem('artspark-auth');
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
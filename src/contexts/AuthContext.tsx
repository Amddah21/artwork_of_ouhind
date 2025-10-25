import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/optimizedSupabase';
import { AdminAuthService, AdminCheckResult } from '@/lib/adminAuthService';
import type { User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://spionvuemjgnvjlesapp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaW9udnVlbWpnbnZqbGVzYXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDE1NTEsImV4cCI6MjA3NjkxNzU1MX0.qdgPAXb3fQPGd9xj_pKJhMtyq1ulDa01wdXFnXtliW4';

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
      
      // Try to restore user from localStorage for persistent sessions
      try {
        const storedAuth = localStorage.getItem('artspark-auth');
        if (storedAuth) {
          const parsedAuth = JSON.parse(storedAuth);
          console.log('Restoring user from localStorage:', parsedAuth);
          setUser(parsedAuth);
        }
      } catch (error) {
        console.error('Error parsing stored auth:', error);
        localStorage.removeItem('artspark-auth');
      }
      
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
      // Add timeout to prevent heavy loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      );
      
      const supabasePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([supabasePromise, timeoutPromise]) as any;

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
        // Fallback to localStorage for development - but still check admin status
        console.log('Supabase not configured, using localStorage fallback');
        
        // Check for admin credentials (support multiple admin emails)
        const adminEmails = ['omhind53@gmail.com', 'ahmed1965amddah@gmail.com'];
        const isAdminEmail = adminEmails.includes(email.toLowerCase());
        
        if (isAdminEmail && password === 'admin123') {
          const adminUser: Profile = {
            id: '1',
            email: email.toLowerCase(),
            role: 'admin'
          };
          setUser(adminUser);
          localStorage.setItem('artspark-auth', JSON.stringify(adminUser));
          console.log('Admin login successful (fallback):', adminUser);
        } else if (email && password) {
          // Accept any other valid email/password as regular user
          const regularUser: Profile = {
            id: Date.now().toString(),
            email: email.toLowerCase(),
            role: 'user'
          };
          setUser(regularUser);
          localStorage.setItem('artspark-auth', JSON.stringify(regularUser));
          console.log('Regular user login successful (fallback):', regularUser);
        } else {
          throw new Error('Invalid credentials provided');
        }
        return;
      }

      console.log('🌐 Using Supabase authentication...');
      
      // Add timeout to prevent heavy loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Authentication timeout')), 3000)
      );
      
      const authPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });

      const { error } = await Promise.race([authPromise, timeoutPromise]) as any;

      if (error) {
        console.error('❌ Supabase login error:', error);
        
        // Provide more specific error messages
        if (error.message?.includes('Invalid login credentials')) {
          throw new Error('Invalid login credentials');
        } else if (error.message?.includes('Email not confirmed')) {
          throw new Error('Email not confirmed');
        } else if (error.message?.includes('Too many requests')) {
          throw new Error('Too many requests');
        } else if (error.message?.includes('User not found')) {
          throw new Error('User not found');
        } else if (error.message?.includes('Google')) {
          throw new Error('Google verification issue');
        } else {
          throw new Error(`Authentication failed: ${error.message}`);
        }
      }

      console.log('✅ Supabase login successful, checking admin status...');
      
      // CRITICAL: Check admin status in database before proceeding
      const adminCheck: AdminCheckResult = await AdminAuthService.checkAdminStatus(email);
      
      if (!adminCheck.isAdmin) {
        // User authenticated but not admin - deny access
        console.log('🚫 Access denied - user is not admin:', email);
        
        // Sign out the user since they're not authorized
        await supabase.auth.signOut();
        
        // Throw specific error based on admin check result
        if (adminCheck.error === 'Database unavailable') {
          throw new Error('Database unavailable');
        } else {
          throw new Error('Access denied: not authorized');
        }
      }

      console.log('✅ Admin access confirmed, fetching profile...');
      
      // Fetch profile after successful admin verification
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (supabaseUser) {
        await fetchUserProfile(supabaseUser.id);
      }

    } catch (error) {
      console.error('💥 Sign in error, falling back to localStorage:', error);
      
      // Only fallback to localStorage if it's not an admin authorization error
      if (error.message?.includes('Access denied') || error.message?.includes('Database unavailable')) {
        throw error; // Don't fallback for admin authorization errors
      }
      
      // Fallback to localStorage if Supabase fails
      const adminEmails = ['omhind53@gmail.com', 'ahmed1965amddah@gmail.com'];
      const isAdminEmail = adminEmails.includes(email.toLowerCase());
      
      if (isAdminEmail && password === 'admin123') {
        const adminUser: Profile = {
          id: '1',
          email: email.toLowerCase(),
          role: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem('artspark-auth', JSON.stringify(adminUser));
        console.log('Fallback admin login successful:', adminUser);
        return;
      } else if (email && password) {
        const regularUser: Profile = {
          id: Date.now().toString(),
          email: email.toLowerCase(),
          role: 'user'
        };
        setUser(regularUser);
        localStorage.setItem('artspark-auth', JSON.stringify(regularUser));
        console.log('Fallback regular user login successful:', regularUser);
        return;
      }
      
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
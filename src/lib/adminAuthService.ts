import { supabase } from './optimizedSupabase';

export interface AdminCheckResult {
  isAdmin: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class AdminAuthService {
  /**
   * Check if a user is an admin by verifying their email exists in the database
   * and their role is 'admin'
   */
  static async checkAdminStatus(userEmail: string): Promise<AdminCheckResult> {
    try {
      console.log('🔍 Checking admin status for:', userEmail);

      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise<AdminCheckResult>((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 5000)
      );

      const checkPromise = supabase
        .from('profiles')
        .select('id, email, role')
        .eq('email', userEmail.toLowerCase())
        .eq('role', 'admin')
        .single();

      const { data, error } = await Promise.race([checkPromise, timeoutPromise]) as any;

      if (error) {
        console.error('❌ Database error during admin check:', error);
        
        // Handle specific database errors
        if (error.message?.includes('timeout') || error.message?.includes('connection')) {
          return {
            isAdmin: false,
            error: 'Database unavailable'
          };
        }
        
        if (error.code === 'PGRST116') {
          // No rows returned - user not found or not admin
          return {
            isAdmin: false,
            error: 'Access denied: not authorized'
          };
        }

        return {
          isAdmin: false,
          error: 'Database error during authentication'
        };
      }

      if (data && data.role === 'admin') {
        console.log('✅ Admin access confirmed for:', userEmail);
        return {
          isAdmin: true,
          user: {
            id: data.id,
            email: data.email,
            role: data.role
          }
        };
      }

      // User exists but is not admin
      return {
        isAdmin: false,
        error: 'Access denied: not authorized'
      };

    } catch (error: any) {
      console.error('💥 Admin check failed:', error);
      
      if (error.message?.includes('timeout')) {
        return {
          isAdmin: false,
          error: 'Database unavailable'
        };
      }

      return {
        isAdmin: false,
        error: 'Authentication service unavailable'
      };
    }
  }

  /**
   * Verify admin status with additional security checks
   */
  static async verifyAdminAccess(userEmail: string, userId?: string): Promise<AdminCheckResult> {
    try {
      // First check: Email-based admin verification
      const emailCheck = await this.checkAdminStatus(userEmail);
      
      if (!emailCheck.isAdmin) {
        return emailCheck;
      }

      // Second check: If userId provided, verify it matches the email
      if (userId) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, role')
          .eq('id', userId)
          .eq('email', userEmail.toLowerCase())
          .single();

        if (error || !data) {
          return {
            isAdmin: false,
            error: 'Access denied: user verification failed'
          };
        }
      }

      return emailCheck;

    } catch (error: any) {
      console.error('💥 Admin verification failed:', error);
      return {
        isAdmin: false,
        error: 'Authentication verification failed'
      };
    }
  }

  /**
   * Get all admin users (for debugging/admin management)
   */
  static async getAllAdmins(): Promise<{ admins: any[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, role, created_at')
        .eq('role', 'admin')
        .order('created_at', { ascending: false });

      if (error) {
        return {
          admins: [],
          error: 'Failed to fetch admin users'
        };
      }

      return {
        admins: data || []
      };

    } catch (error: any) {
      console.error('💥 Failed to fetch admins:', error);
      return {
        admins: [],
        error: 'Database unavailable'
      };
    }
  }
}

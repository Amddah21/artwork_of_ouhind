import { AdminAuthService } from './adminAuthService';

export interface AdminMiddlewareOptions {
  requireAdmin?: boolean;
  allowFallback?: boolean;
}

export interface AdminRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  headers: {
    authorization?: string;
  };
}

export interface AdminResponse {
  status: (code: number) => AdminResponse;
  json: (data: any) => void;
  send: (data: any) => void;
}

/**
 * Backend middleware for protecting admin routes
 * This can be used with Express.js or Next.js API routes
 */
export class BackendAdminMiddleware {
  /**
   * Express.js middleware function
   */
  static expressMiddleware(options: AdminMiddlewareOptions = {}) {
    return async (req: AdminRequest, res: AdminResponse, next: Function) => {
      try {
        const { requireAdmin = true, allowFallback = false } = options;

        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({
            error: 'Access denied: not authorized',
            message: 'Authentication token required'
          });
        }

        const token = authHeader.substring(7);

        // Verify token and get user info (this would typically use JWT verification)
        // For now, we'll simulate this process
        const userEmail = await this.extractEmailFromToken(token);
        
        if (!userEmail) {
          return res.status(401).json({
            error: 'Access denied: not authorized',
            message: 'Invalid authentication token'
          });
        }

        // Check admin status in database
        const adminCheck = await AdminAuthService.checkAdminStatus(userEmail);

        if (!adminCheck.isAdmin) {
          if (adminCheck.error === 'Database unavailable') {
            if (allowFallback) {
              // Allow fallback for development
              console.warn('⚠️ Database unavailable, allowing fallback access');
              req.user = { id: 'fallback', email: userEmail, role: 'admin' };
              return next();
            }
            return res.status(503).json({
              error: 'Database unavailable',
              message: 'Database service is currently unavailable'
            });
          }

          return res.status(403).json({
            error: 'Access denied: not authorized',
            message: 'User is not authorized to access admin resources'
          });
        }

        // Admin access granted
        req.user = adminCheck.user;
        next();

      } catch (error: any) {
        console.error('💥 Admin middleware error:', error);
        
        return res.status(500).json({
          error: 'Authentication service unavailable',
          message: 'Internal authentication error'
        });
      }
    };
  }

  /**
   * Next.js API route middleware
   */
  static async nextApiMiddleware(
    req: any, 
    res: any, 
    options: AdminMiddlewareOptions = {}
  ) {
    try {
      const { requireAdmin = true, allowFallback = false } = options;

      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'Access denied: not authorized',
          message: 'Authentication token required'
        });
      }

      const token = authHeader.substring(7);
      const userEmail = await this.extractEmailFromToken(token);
      
      if (!userEmail) {
        return res.status(401).json({
          error: 'Access denied: not authorized',
          message: 'Invalid authentication token'
        });
      }

      // Check admin status
      const adminCheck = await AdminAuthService.checkAdminStatus(userEmail);

      if (!adminCheck.isAdmin) {
        if (adminCheck.error === 'Database unavailable') {
          if (allowFallback) {
            console.warn('⚠️ Database unavailable, allowing fallback access');
            req.user = { id: 'fallback', email: userEmail, role: 'admin' };
            return true; // Continue processing
          }
          return res.status(503).json({
            error: 'Database unavailable',
            message: 'Database service is currently unavailable'
          });
        }

        return res.status(403).json({
          error: 'Access denied: not authorized',
          message: 'User is not authorized to access admin resources'
        });
      }

      // Admin access granted
      req.user = adminCheck.user;
      return true; // Continue processing

    } catch (error: any) {
      console.error('💥 Next.js admin middleware error:', error);
      
      return res.status(500).json({
        error: 'Authentication service unavailable',
        message: 'Internal authentication error'
      });
    }
  }

  /**
   * Extract email from JWT token (placeholder implementation)
   * In a real implementation, this would verify and decode the JWT
   */
  private static async extractEmailFromToken(token: string): Promise<string | null> {
    try {
      // This is a placeholder - in reality you would:
      // 1. Verify the JWT signature
      // 2. Decode the payload
      // 3. Extract the email from the payload
      
      // For now, we'll simulate this process
      // In a real implementation, use a JWT library like jsonwebtoken
      
      console.log('🔍 Extracting email from token:', token.substring(0, 20) + '...');
      
      // Placeholder: return null to simulate token verification failure
      // In production, implement proper JWT verification here
      return null;
      
    } catch (error) {
      console.error('💥 Token extraction failed:', error);
      return null;
    }
  }

  /**
   * Utility function to check if a request is from an admin
   */
  static async isAdminRequest(req: AdminRequest): Promise<boolean> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
      }

      const token = authHeader.substring(7);
      const userEmail = await this.extractEmailFromToken(token);
      
      if (!userEmail) {
        return false;
      }

      const adminCheck = await AdminAuthService.checkAdminStatus(userEmail);
      return adminCheck.isAdmin;

    } catch (error) {
      console.error('💥 Admin request check failed:', error);
      return false;
    }
  }
}

export default BackendAdminMiddleware;

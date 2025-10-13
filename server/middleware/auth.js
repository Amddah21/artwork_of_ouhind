/**
 * Authentication Middleware
 * 
 * Add this middleware to protected routes to verify authentication
 */

export const authenticateAdmin = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    const token = authHeader.split(' ')[1];

    // TODO: Verify JWT token here
    // For now, just check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    // TODO: Decode token and attach user to request
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;

    req.user = { username: 'admin', role: 'admin' }; // Placeholder

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};

/**
 * Example usage in routes:
 * 
 * import { authenticateAdmin } from '../middleware/auth.js';
 * 
 * router.post('/', authenticateAdmin, async (req, res) => {
 *   // This route is now protected
 *   // req.user contains the authenticated user info
 * });
 */


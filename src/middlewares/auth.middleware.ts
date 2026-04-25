import { Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import { verifyAccessToken } from '../utils/token';
import type { AuthRequest } from '../types';

/**
 * Protects routes by verifying JWT access token from:
 *  1. httpOnly cookie ("accessToken")
 *  2. Authorization: Bearer <token> header
 *
 * Attaches decoded user payload to req.user
 */
const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // Extract token from cookie or header
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : undefined);

    if (!token) {
      throw new ApiError(401, 'Authentication required. Please log in.');
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, 'Invalid or expired token. Please log in again.'));
    }
  }
};

export default authMiddleware;

import { Request, Response, NextFunction } from 'express';

/**
 * Wraps async route handlers so thrown errors are
 * automatically forwarded to the global error middleware.
 */
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;

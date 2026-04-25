import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import ApiError from '../utils/ApiError';
import { env } from '../config/env';

/**
 * Global error handler — must be the LAST middleware registered.
 *
 * Handles:
 *  - ApiError (operational errors we threw intentionally)
 *  - ZodError (validation failures)
 *  - Mongoose validation / duplicate key errors
 *  - Everything else (unexpected crashes)
 */
const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // ─── Default values ───
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: unknown[] = [];

  // ─── Known operational errors ───
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }

  // ─── Zod validation errors ───
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  // ─── Mongoose validation error ───
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    // Mongoose validation error shape
    const mongooseErr = err as unknown as Record<string, unknown>;
    if (mongooseErr.errors && typeof mongooseErr.errors === 'object') {
      errors = Object.values(mongooseErr.errors as Record<string, { message: string }>).map(
        (e) => ({ message: e.message })
      );
    }
  }

  // ─── Mongoose duplicate key ───
  else if (err.name === 'MongoServerError' && (err as unknown as Record<string, unknown>).code === 11000) {
    statusCode = 409;
    const keyValue = (err as unknown as Record<string, unknown>).keyValue as Record<string, unknown>;
    const field = Object.keys(keyValue || {})[0] || 'field';
    message = `An account with this ${field} already exists`;
  }

  // ─── JWT errors ───
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // ─── Log in development ───
  if (env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorMiddleware;

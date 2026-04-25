import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import ApiError from '../utils/ApiError';

/**
 * Generic Zod validation middleware.
 * Validates req.body, req.query, and req.params against a Zod schema.
 *
 * Usage:
 *   router.post('/register', validate(registerSchema), controller.register);
 */
const validate = (schema: AnyZodObject) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((e) => ({
          field: e.path.slice(1).join('.'), // Remove 'body'/'query'/'params' prefix
          message: e.message,
        }));
        next(new ApiError(400, 'Validation failed', formattedErrors));
      } else {
        next(error);
      }
    }
  };
};

export default validate;

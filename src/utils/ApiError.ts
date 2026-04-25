/**
 * Custom API Error class.
 * Throw this anywhere in controllers/services and
 * the global error middleware will catch and format it.
 */
class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors: unknown[];

  constructor(
    statusCode: number,
    message: string = 'Something went wrong',
    errors: unknown[] = [],
    stack: string = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;

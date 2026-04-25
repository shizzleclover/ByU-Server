import { Request } from 'express';

// ─── Authenticated user payload attached to req ───
export interface AuthPayload {
  userId: string;
  email: string;
  username: string;
}

// Extend Express Request to include authenticated user
export interface AuthRequest extends Request {
  user?: AuthPayload;
}

// ─── Pagination ───
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

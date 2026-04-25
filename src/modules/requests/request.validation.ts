import { z } from 'zod';

// ─── Create request ───
export const createRequestSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .trim()
      .min(1, 'Title is required')
      .max(100, 'Title cannot exceed 100 characters'),
    description: z
      .string({ required_error: 'Description is required' })
      .trim()
      .min(1, 'Description is required')
      .max(1000, 'Description cannot exceed 1000 characters'),
    skillNeeded: z
      .string({ required_error: 'Skill needed is required' })
      .trim()
      .min(1, 'Skill needed is required'),
    tags: z
      .array(z.string().trim().max(30))
      .max(10, 'Cannot add more than 10 tags')
      .optional(),
    urgency: z.enum(['urgent', 'flexible', 'no_rush']).optional(),
  }),
});

// ─── Update request ───
export const updateRequestSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid request ID'),
  }),
  body: z.object({
    title: z.string().trim().max(100).optional(),
    description: z.string().trim().max(1000).optional(),
    skillNeeded: z.string().trim().optional(),
    tags: z.array(z.string().trim().max(30)).max(10).optional(),
    urgency: z.enum(['urgent', 'flexible', 'no_rush']).optional(),
    status: z.enum(['open', 'fulfilled', 'closed']).optional(),
  }),
});

// ─── Respond to request ───
export const respondToRequestSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid request ID'),
  }),
  body: z.object({
    message: z
      .string({ required_error: 'Response message is required' })
      .trim()
      .min(1, 'Response message is required')
      .max(500, 'Response message cannot exceed 500 characters'),
  }),
});

// ─── Get request by ID ───
export const getRequestByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid request ID'),
  }),
});

// ─── List requests query ───
export const listRequestsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    skillNeeded: z.string().optional(),
    urgency: z.enum(['urgent', 'flexible', 'no_rush']).optional(),
    status: z.enum(['open', 'fulfilled', 'closed']).optional(),
    createdBy: z.string().regex(/^[a-f\d]{24}$/i).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

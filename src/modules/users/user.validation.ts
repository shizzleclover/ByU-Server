import { z } from 'zod';

// ─── Update profile ───
export const updateProfileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, 'Name cannot be empty')
      .max(50, 'Name cannot exceed 50 characters')
      .optional(),
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores')
      .transform((v) => v.toLowerCase())
      .optional(),
    role: z
      .string()
      .trim()
      .max(50, 'Role cannot exceed 50 characters')
      .optional(),
    skills: z
      .array(z.string().trim().max(30))
      .max(15, 'Cannot add more than 15 skills')
      .optional(),
    bio: z
      .string()
      .trim()
      .max(300, 'Bio cannot exceed 300 characters')
      .optional(),
    portfolioLinks: z
      .array(z.string().url('Each portfolio link must be a valid URL'))
      .max(10, 'Cannot add more than 10 portfolio links')
      .optional(),
    contact: z
      .object({
        whatsapp: z.string().max(20).optional(),
        email: z.string().email('Contact email must be valid').optional(),
        instagram: z.string().max(50).optional(),
      })
      .optional(),
    portfolioBlocks: z
      .array(z.object({
        id: z.string(),
        type: z.enum(['writeup', 'quote', 'github', 'video']),
        title: z.string().max(150).optional(),
        content: z.string().max(5000),
        coverUrl: z.string().optional(),
        caption: z.string().max(300).optional(),
        createdAt: z.string(),
      }))
      .max(20)
      .optional(),
    expertise: z
      .array(z.object({
        id: z.string(),
        name: z.string().min(1).max(80),
        level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
        evidence: z.array(z.string().url('Each evidence link must be a valid URL')).max(10),
        yearsExp: z.number().min(0).max(50).optional(),
      }))
      .max(10)
      .optional(),
  }),
});

// ─── Update availability ───
export const updateAvailabilitySchema = z.object({
  body: z.object({
    status: z.enum(['available', 'open_to_offers', 'not_available'], {
      required_error: 'Availability status is required',
      invalid_type_error: 'Status must be one of: available, open_to_offers, not_available',
    }),
  }),
});

// ─── Query params for listing users ───
export const listUsersSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    role: z.string().optional(),
    skill: z.string().optional(),
    availability: z.enum(['available', 'open_to_offers', 'not_available']).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    sort: z.enum(['recent', 'name']).optional(),
  }),
});

// ─── Get user by ID param ───
export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
});

// ─── Submit student email ───
export const submitStudentEmailSchema = z.object({
  body: z.object({
    studentEmail: z
      .string({ required_error: 'Student email is required' })
      .trim()
      .email('Please provide a valid email')
      .refine((v) => v.toLowerCase().endsWith('babcock.edu.ng'), {
        message: 'Must be a valid Babcock University email (e.g. @babcock.edu.ng or @student.babcock.edu.ng)',
      })
      .transform((v) => v.toLowerCase()),
  }),
});

// ─── Verify student email OTP ───
export const verifyStudentEmailOtpSchema = z.object({
  body: z.object({
    otp: z
      .string({ required_error: 'OTP is required' })
      .length(6, 'OTP must be 6 digits')
      .regex(/^\d{6}$/, 'OTP must be numeric'),
  }),
});

import { z } from 'zod';

// ─── Register ───
export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(1, 'Name is required')
      .max(50, 'Name cannot exceed 50 characters'),
    username: z
      .string({ required_error: 'Username is required' })
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores')
      .transform((v) => v.toLowerCase()),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Please provide a valid email')
      .transform((v) => v.toLowerCase()),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters')
      .max(128, 'Password cannot exceed 128 characters'),
  }),
});

// ─── Login ───
export const loginSchema = z.object({
  body: z.object({
    emailOrUsername: z
      .string({ required_error: 'Email or username is required' })
      .trim()
      .min(1, 'Email or username is required')
      .transform((v) => v.toLowerCase()),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
  }),
});

// ─── Verify OTP ───
export const verifyOtpSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Please provide a valid email')
      .transform((v) => v.toLowerCase()),
    otp: z
      .string({ required_error: 'OTP is required' })
      .length(6, 'OTP must be 6 digits')
      .regex(/^\d{6}$/, 'OTP must be numeric'),
  }),
});

// ─── Resend OTP ───
export const resendOtpSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Please provide a valid email')
      .transform((v) => v.toLowerCase()),
  }),
});

// ─── Forgot Password ───
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Please provide a valid email')
      .transform((v) => v.toLowerCase()),
  }),
});

// ─── Reset Password ───
export const resetPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Please provide a valid email')
      .transform((v) => v.toLowerCase()),
    otp: z
      .string({ required_error: 'OTP is required' })
      .length(6, 'OTP must be 6 digits')
      .regex(/^\d{6}$/, 'OTP must be numeric'),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(6, 'Password must be at least 6 characters')
      .max(128, 'Password cannot exceed 128 characters'),
  }),
});

// ─── Change Password (authenticated) ───
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string({ required_error: 'Current password is required' })
      .min(1, 'Current password is required'),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(6, 'New password must be at least 6 characters')
      .max(128, 'New password cannot exceed 128 characters'),
  }),
});

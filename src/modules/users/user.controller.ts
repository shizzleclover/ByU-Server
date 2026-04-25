import { Request, Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import ApiResponse from '../../utils/ApiResponse';
import * as userService from './user.service';
import type { AuthRequest } from '../../types';

/**
 * GET /api/users
 * List / search users (public — only shows verified users)
 */
export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.listUsers(req.query as unknown as Parameters<typeof userService.listUsers>[0]);
  res.status(200).json(new ApiResponse(200, result, 'Users fetched'));
});

/**
 * GET /api/users/:id
 * Get single user profile
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id as string);
  res.status(200).json(new ApiResponse(200, { user }, 'User fetched'));
});

/**
 * PATCH /api/users/me
 * Update own profile
 */
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await userService.updateProfile(req.user!.userId, req.body);
  res.status(200).json(new ApiResponse(200, { user }, 'Profile updated'));
});

/**
 * PATCH /api/users/me/availability
 * Toggle availability status
 */
export const updateAvailability = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await userService.updateAvailability(req.user!.userId, req.body.status);
  res.status(200).json(new ApiResponse(200, { user }, 'Availability updated'));
});

/**
 * POST /api/users/me/avatar
 * Upload profile image
 */
export const uploadAvatar = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json(new ApiResponse(400, null, 'No image file provided'));
    return;
  }
  const user = await userService.uploadAvatar(req.user!.userId, req.file.buffer);
  res.status(200).json(new ApiResponse(200, { user }, 'Avatar uploaded'));
});

/**
 * POST /api/users/me/portfolio
 * Upload portfolio images (multiple)
 */
export const uploadPortfolioImages = asyncHandler(async (req: AuthRequest, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    res.status(400).json(new ApiResponse(400, null, 'No image files provided'));
    return;
  }
  const buffers = files.map((f) => f.buffer);
  const user = await userService.uploadPortfolioImages(req.user!.userId, buffers);
  res.status(200).json(new ApiResponse(200, { user }, 'Portfolio images uploaded'));
});

/**
 * DELETE /api/users/me/portfolio
 * Delete a portfolio image
 */
export const deletePortfolioImage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    res.status(400).json(new ApiResponse(400, null, 'imageUrl is required'));
    return;
  }
  const user = await userService.deletePortfolioImage(req.user!.userId, imageUrl);
  res.status(200).json(new ApiResponse(200, { user }, 'Portfolio image deleted'));
});

/**
 * POST /api/users/me/onboard
 * Mark onboarding as complete
 */
export const completeOnboarding = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await userService.completeOnboarding(req.user!.userId);
  res.status(200).json(new ApiResponse(200, { user }, 'Onboarding completed'));
});

/**
 * DELETE /api/users/me
 * Delete own account
 */
export const deleteAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  await userService.deleteAccount(req.user!.userId);
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json(new ApiResponse(200, null, 'Account deleted successfully'));
});

/**
 * POST /api/users/me/student-email
 * Submit student email for verification
 */
export const submitStudentEmail = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await userService.submitStudentEmail(req.user!.userId, req.body.studentEmail);
  res.status(200).json(new ApiResponse(200, result, 'Verification code sent'));
});

/**
 * POST /api/users/me/student-email/verify
 * Verify student email OTP
 */
export const verifyStudentEmail = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await userService.verifyStudentEmail(req.user!.userId, req.body.otp);
  res.status(200).json(new ApiResponse(200, result, 'Student email verified'));
});

/**
 * POST /api/users/:id/connect
 * Express interest in a talent (Swipe Right)
 */
export const connectToTalent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await userService.connectToTalent(
    req.user!.userId,
    req.params.id as string,
    req.user!.username
  );
  res.status(200).json(new ApiResponse(200, result, 'Connection interest sent'));
});

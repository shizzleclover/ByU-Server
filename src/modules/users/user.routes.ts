import { Router } from 'express';
import * as userController from './user.controller';
import authMiddleware from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate.middleware';
import { upload } from '../../middlewares/upload.middleware';
import {
  updateProfileSchema,
  updateAvailabilitySchema,
  listUsersSchema,
  getUserByIdSchema,
  submitStudentEmailSchema,
  verifyStudentEmailOtpSchema,
} from './user.validation';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List and search talent
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: skill
 *         schema: { type: string }
 *       - in: query
 *         name: role
 *         schema: { type: string }
 */
router.get('/', validate(listUsersSchema), userController.listUsers);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user profile by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 */
router.get('/:id', validate(getUserByIdSchema), userController.getUserById);

/**
 * @openapi
 * /api/users/me:
 *   patch:
 *     tags: [Users]
 *     summary: Update current user profile
 */
router.patch('/me', authMiddleware, validate(updateProfileSchema), userController.updateProfile);

/**
 * @openapi
 * /api/users/me/availability:
 *   patch:
 *     tags: [Users]
 *     summary: Update availability status
 */
router.patch('/me/availability', authMiddleware, validate(updateAvailabilitySchema), userController.updateAvailability);

/**
 * @openapi
 * /api/users/me/avatar:
 *   post:
 *     tags: [Users]
 *     summary: Upload profile avatar
 */
router.post('/me/avatar', authMiddleware, upload.single('avatar'), userController.uploadAvatar);

/**
 * @openapi
 * /api/users/me/portfolio:
 *   post:
 *     tags: [Users]
 *     summary: Upload portfolio images
 */
router.post('/me/portfolio', authMiddleware, upload.array('images', 5), userController.uploadPortfolioImages);

/**
 * @openapi
 * /api/users/me/portfolio:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a portfolio image
 */
router.delete('/me/portfolio', authMiddleware, userController.deletePortfolioImage);

/**
 * @openapi
 * /api/users/me/onboard:
 *   post:
 *     tags: [Users]
 *     summary: Complete onboarding
 */
router.post('/me/onboard', authMiddleware, userController.completeOnboarding);

router.post('/me/student-email', authMiddleware, validate(submitStudentEmailSchema), userController.submitStudentEmail);
router.post('/me/student-email/verify', authMiddleware, validate(verifyStudentEmailOtpSchema), userController.verifyStudentEmail);

/**
 * @openapi
 * /api/users/{id}/connect:
 *   post:
 *     tags: [Users]
 *     summary: Connect to talent
 */
router.post('/:id/connect', authMiddleware, userController.connectToTalent);

/**
 * @openapi
 * /api/users/me:
 *   delete:
 *     tags: [Users]
 *     summary: Delete account
 */
router.delete('/me', authMiddleware, userController.deleteAccount);

export default router;

import { Router } from 'express';
import * as requestController from './request.controller';
import authMiddleware from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate.middleware';
import {
  createRequestSchema,
  updateRequestSchema,
  respondToRequestSchema,
  getRequestByIdSchema,
  listRequestsSchema,
} from './request.validation';

const router = Router();

/**
 * @openapi
 * /api/requests:
 *   get:
 *     tags: [Requests]
 *     summary: List all help requests
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [open, fulfilled, closed] }
 */
router.get('/', validate(listRequestsSchema), requestController.listRequests);

/**
 * @openapi
 * /api/requests/{id}:
 *   get:
 *     tags: [Requests]
 *     summary: Get request details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 */
router.get('/:id', validate(getRequestByIdSchema), requestController.getRequestById);

/**
 * @openapi
 * /api/requests:
 *   post:
 *     tags: [Requests]
 *     summary: Create a new help request
 */
router.post('/', authMiddleware, validate(createRequestSchema), requestController.createRequest);

/**
 * @openapi
 * /api/requests/{id}:
 *   patch:
 *     tags: [Requests]
 *     summary: Update an existing request
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 */
router.patch('/:id', authMiddleware, validate(updateRequestSchema), requestController.updateRequest);

/**
 * @openapi
 * /api/requests/{id}:
 *   delete:
 *     tags: [Requests]
 *     summary: Delete a request
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 */
router.delete('/:id', authMiddleware, validate(getRequestByIdSchema), requestController.deleteRequest);

/**
 * @openapi
 * /api/requests/{id}/respond:
 *   post:
 *     tags: [Requests]
 *     summary: Submit a response to a request
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 */
router.post('/:id/respond', authMiddleware, validate(respondToRequestSchema), requestController.respondToRequest);

export default router;

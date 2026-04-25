import { Request, Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import ApiResponse from '../../utils/ApiResponse';
import * as requestService from './request.service';
import type { AuthRequest } from '../../types';

/**
 * GET /api/requests
 */
export const listRequests = asyncHandler(async (req: Request, res: Response) => {
  const result = await requestService.listRequests(req.query as Record<string, string>);
  res.status(200).json(new ApiResponse(200, result, 'Requests fetched'));
});

/**
 * GET /api/requests/:id
 */
export const getRequestById = asyncHandler(async (req: Request, res: Response) => {
  const request = await requestService.getRequestById(req.params.id as string);
  res.status(200).json(new ApiResponse(200, { request }, 'Request fetched'));
});

/**
 * POST /api/requests
 */
export const createRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const request = await requestService.createRequest(req.user!.userId, req.body);
  res.status(201).json(new ApiResponse(201, { request }, 'Request created'));
});

/**
 * PATCH /api/requests/:id
 */
export const updateRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const request = await requestService.updateRequest(
    req.params.id as string,
    req.user!.userId,
    req.body
  );
  res.status(200).json(new ApiResponse(200, { request }, 'Request updated'));
});

/**
 * DELETE /api/requests/:id
 */
export const deleteRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  await requestService.deleteRequest(req.params.id as string, req.user!.userId);
  res.status(200).json(new ApiResponse(200, null, 'Request deleted'));
});

/**
 * POST /api/requests/:id/respond
 */
export const respondToRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const request = await requestService.respondToRequest(
    req.params.id as string,
    req.user!.userId,
    req.body.message
  );
  res.status(200).json(new ApiResponse(200, { request }, 'Response submitted'));
});

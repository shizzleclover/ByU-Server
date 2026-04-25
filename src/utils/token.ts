import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import type { AuthPayload } from '../types';

/**
 * Generate a short-lived access token (default 15m).
 */
export const generateAccessToken = (payload: AuthPayload): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRY as any,
  };
  return jwt.sign({ ...payload }, env.JWT_ACCESS_SECRET, options);
};

/**
 * Generate a long-lived refresh token (default 7d).
 */
export const generateRefreshToken = (payload: AuthPayload): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRY as any,
  };
  return jwt.sign({ ...payload }, env.JWT_REFRESH_SECRET, options);
};

/**
 * Verify an access token and return the decoded payload.
 */
export const verifyAccessToken = (token: string): AuthPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthPayload;
};

/**
 * Verify a refresh token and return the decoded payload.
 */
export const verifyRefreshToken = (token: string): AuthPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as AuthPayload;
};

/**
 * Generate a 6-digit OTP code.
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

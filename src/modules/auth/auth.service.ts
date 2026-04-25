import bcrypt from 'bcryptjs';
import { db } from '../../config/db';
import { users, type User } from '../../db/schema';
import { eq, or, sql } from 'drizzle-orm';
import ApiError from '../../utils/ApiError';
import {
  generateAccessToken,
  generateRefreshToken,
  generateOTP,
  verifyRefreshToken,
} from '../../utils/token';
import { sendOtpEmail, sendWelcomeEmail, sendPasswordResetEmail } from '../email/email.service';
import type { AuthPayload } from '../../types';

// ─── Helper: build token payload ───
const buildPayload = (user: User): AuthPayload => ({
  userId: user.id,
  email: user.email,
  username: user.username,
});

// ─── Helper: hash OTP ───
const hashOtp = async (otp: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

// ─── Helper: generate and save OTP ───
const generateAndSaveOTP = async (userId: string, name: string): Promise<string> => {
  const otp = generateOTP();
  const hashedOtp = await hashOtp(otp);

  await db.update(users)
    .set({
      otpCode: hashedOtp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    })
    .where(eq(users.id, userId));

  return otp;
};

// ─── REGISTER ───
export const registerUser = async (data: {
  name: string;
  username: string;
  email: string;
  password: string;
}) => {
  // Check existing
  const existing = await db.select()
    .from(users)
    .where(or(eq(users.email, data.email), eq(users.username, data.username)))
    .limit(1);

  if (existing.length > 0) {
    const isEmailMatched = existing[0].email === data.email;
    throw new ApiError(409, isEmailMatched ? 'Email already exists' : 'Username already taken');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // Create user
  const [user] = await db.insert(users)
    .values({
      name: data.name,
      username: data.username,
      email: data.email,
      password: hashedPassword,
    })
    .returning();

  // OTP
  const otp = await generateAndSaveOTP(user.id, user.name);
  await sendOtpEmail(user.email, user.name, otp);

  return {
    message: 'Registration successful. Please verify your email.',
    email: user.email,
  };
};

// ─── VERIFY EMAIL ───
export const verifyEmail = async (data: { email: string; otp: string }) => {
  const [user] = await db.select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.isVerified) {
    throw new ApiError(400, 'Already verified');
  }

  // Check OTP
  if (!user.otpCode || !user.otpExpiresAt || new Date() > user.otpExpiresAt) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  const isValid = await bcrypt.compare(data.otp, user.otpCode);
  if (!isValid) {
    throw new ApiError(400, 'Invalid OTP');
  }

  // Tokens
  const payload = buildPayload(user);
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Update user
  const [updatedUser] = await db.update(users)
    .set({
      isVerified: true,
      otpCode: null,
      otpExpiresAt: null,
      refreshToken: refreshToken,
    })
    .where(eq(users.id, user.id))
    .returning();

  sendWelcomeEmail(user.email, user.name).catch(() => {});

  const { password, otpCode, refreshToken: _, ...userObj } = updatedUser;
  return { user: userObj, accessToken, refreshToken };
};

// ─── LOGIN ───
export const loginUser = async (data: { emailOrUsername: string; password: string }) => {
  const [user] = await db.select()
    .from(users)
    .where(or(eq(users.email, data.emailOrUsername), eq(users.username, data.emailOrUsername)))
    .limit(1);

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if (!user.isVerified) {
    const otp = await generateAndSaveOTP(user.id, user.name);
    await sendOtpEmail(user.email, user.name, otp);
    throw new ApiError(403, 'Email not verified. New code sent.');
  }

  const payload = buildPayload(user);
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const [updatedUser] = await db.update(users)
    .set({ refreshToken })
    .where(eq(users.id, user.id))
    .returning();

  const { password, otpCode, refreshToken: _, ...userObj } = updatedUser;
  return { user: userObj, accessToken, refreshToken };
};

// ─── RESEND OTP ───
export const resendOtp = async (data: { email: string }) => {
  const [user] = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.isVerified) throw new ApiError(400, 'Already verified');

  const otp = await generateAndSaveOTP(user.id, user.name);
  await sendOtpEmail(user.email, user.name, otp);
  return { message: 'New code sent' };
};
export const refreshAccessToken = async (token: string) => {
  if (!token) throw new ApiError(401, 'Token required');

  const decoded = verifyRefreshToken(token);
  const [user] = await db.select()
    .from(users)
    .where(eq(users.id, decoded.userId))
    .limit(1);

  if (!user || user.refreshToken !== token) {
    if (user) await db.update(users).set({ refreshToken: null }).where(eq(users.id, user.id));
    throw new ApiError(401, 'Invalid or revoked refresh token');
  }

  const payload = buildPayload(user);
  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  await db.update(users)
    .set({ refreshToken: newRefreshToken })
    .where(eq(users.id, user.id));

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// ─── LOGOUT ───
export const logoutUser = async (userId: string) => {
  await db.update(users).set({ refreshToken: null }).where(eq(users.id, userId));
  return { message: 'Logged out' };
};

// ─── FORGOT PASSWORD ───
export const forgotPassword = async (data: { email: string }) => {
  const [user] = await db.select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (user) {
    const otp = await generateAndSaveOTP(user.id, user.name);
    await sendPasswordResetEmail(user.email, user.name, otp);
  }

  return { message: 'If an account exists, a reset code was sent.' };
};

// ─── RESET PASSWORD ───
export const resetPassword = async (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  const [user] = await db.select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (!user || !user.otpCode || !user.otpExpiresAt || new Date() > user.otpExpiresAt) {
    throw new ApiError(400, 'Invalid or expired code');
  }

  const isValid = await bcrypt.compare(data.otp, user.otpCode);
  if (!isValid) throw new ApiError(400, 'Invalid code');

  const hashedPassword = await bcrypt.hash(data.newPassword, 12);
  await db.update(users)
    .set({
      password: hashedPassword,
      otpCode: null,
      otpExpiresAt: null,
    })
    .where(eq(users.id, user.id));

  return { message: 'Password reset' };
};

// ─── CHANGE PASSWORD ───
export const changePassword = async (
  userId: string,
  data: { currentPassword: string; newPassword: string }
) => {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new ApiError(404, 'User not found');

  const isMatch = await bcrypt.compare(data.currentPassword, user.password);
  if (!isMatch) throw new ApiError(401, 'Current password incorrect');

  const hashedPassword = await bcrypt.hash(data.newPassword, 12);
  await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));
  return { message: 'Password changed' };
};
export const getCurrentUser = async (userId: string) => {
  const [user] = await db.select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
    
  if (!user) throw new ApiError(404, 'User not found');
  
  const { password, otpCode, refreshToken, ...userObj } = user;
  return userObj;
};

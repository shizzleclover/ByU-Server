import bcrypt from 'bcryptjs';
import { db } from '../../config/db';
import { users, type User } from '../../db/schema';
import { eq, ilike, or, and, sql, desc, asc, ne } from 'drizzle-orm';
import ApiError from '../../utils/ApiError';
import { uploadToCloudinary, deleteFromCloudinary } from '../../middlewares/upload.middleware';
import { sendConnectionInterestEmail, sendOtpEmail } from '../email/email.service';
import { generateOTP } from '../../utils/token';
import type { PaginatedResult } from '../../types';

// ─── Helper: strip sensitive fields ───
const sanitize = (user: User) => {
  const { password, otpCode, refreshToken, studentOtpCode, ...rest } = user;
  return rest;
};

// ─── In-memory cache (60s TTL) ────────────────────────────────────────────────
interface CacheEntry { data: PaginatedResult<any>; expiresAt: number; }
const listUsersCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function cacheGet(key: string): PaginatedResult<any> | null {
  const entry = listUsersCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { listUsersCache.delete(key); return null; }
  return entry.data;
}

function cacheSet(key: string, data: PaginatedResult<any>) {
  listUsersCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

export function invalidateListUsersCache() {
  listUsersCache.clear();
}

// ─── LIST USERS ───
interface ListUsersQuery {
  search?: string;
  role?: string;
  skill?: string;
  availability?: string;
  page?: number;
  limit?: number;
  sort?: 'recent' | 'name';
}

export const listUsers = async (query: ListUsersQuery): Promise<PaginatedResult<any>> => {
  const cacheKey = JSON.stringify(query);
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const page = Math.max(1, query.page || 1);
  // Load up to 200 at once — frontend does client-side filtering so we avoid extra round-trips
  const limit = Math.min(200, Math.max(1, query.limit || 200));
  const offset = (page - 1) * limit;

  const conditions = [eq(users.isVerified, true)];

  if (query.role) conditions.push(ilike(users.role, `%${query.role}%`));
  if (query.skill) conditions.push(sql`${users.skills} @> ARRAY[${query.skill}]::text[]`);
  if (query.availability) conditions.push(eq(users.availabilityStatus, query.availability as any));
  if (query.search) {
    const s = or(
      ilike(users.name, `%${query.search}%`),
      ilike(users.bio, `%${query.search}%`),
      ilike(users.role, `%${query.search}%`)
    );
    if (s) conditions.push(s);
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const order = query.sort === 'name' ? [asc(users.name)] : [desc(users.createdAt)];

  // Single query — no separate COUNT(*); total is derived from returned rows
  const data = await db.select({
    id: users.id,
    name: users.name,
    username: users.username,
    role: users.role,
    skills: users.skills,
    bio: users.bio,
    availabilityStatus: users.availabilityStatus,
    availabilityUpdatedAt: users.availabilityUpdatedAt,
    profileImage: users.profileImage,
    onboarded: users.onboarded,
    isVerified: users.isVerified,
    isStudentVerified: users.isStudentVerified,
    createdAt: users.createdAt,
  })
  .from(users)
  .where(whereClause)
  .orderBy(...order)
  .limit(limit)
  .offset(offset);

  const total = data.length;
  const result: PaginatedResult<any> = {
    data,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };

  cacheSet(cacheKey, result);
  return result;
};

// ─── GET USER ───
export const getUserById = async (userId: string) => {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new ApiError(404, 'User not found');
  return sanitize(user);
};

// ─── UPDATE PROFILE ───
export const updateProfile = async (userId: string, data: any) => {
  const { contact, ...rest } = data;
  const updateData: Record<string, any> = { ...rest, onboarded: true, updatedAt: new Date() };
  if (contact) {
    if (contact.whatsapp !== undefined) updateData.contactWhatsapp = contact.whatsapp;
    if (contact.email !== undefined) updateData.contactEmail = contact.email;
    if (contact.instagram !== undefined) updateData.contactInstagram = contact.instagram;
  }

  const [user] = await db.update(users).set(updateData).where(eq(users.id, userId)).returning();
  if (!user) throw new ApiError(404, 'User not found');
  invalidateListUsersCache();
  return sanitize(user);
};

// ─── UPLOAD AVATAR ───
export const uploadAvatar = async (userId: string, buffer: Buffer) => {
  const user = await getUserById(userId);
  if (user.profileImage) await deleteFromCloudinary(user.profileImage);
  const url = await uploadToCloudinary(buffer, 'byu-connect/avatars');
  const [updated] = await db.update(users).set({ profileImage: url, updatedAt: new Date() }).where(eq(users.id, userId)).returning();
  return sanitize(updated as User);
};

// ─── UPDATE AVAILABILITY ───
export const updateAvailability = async (userId: string, status: any) => {
  const [user] = await db.update(users)
    .set({ availabilityStatus: status, availabilityUpdatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  if (!user) throw new ApiError(404, 'Not found');
  return sanitize(user);
};

// ─── COMPLETE ONBOARDING ───
export const completeOnboarding = async (userId: string) => {
  const [user] = await db.update(users).set({ onboarded: true }).where(eq(users.id, userId)).returning();
  if (!user) throw new ApiError(404, 'Not found');
  invalidateListUsersCache();
  return sanitize(user);
};

// ─── DELETE ACCOUNT ───
export const deleteAccount = async (userId: string) => {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new ApiError(404, 'Not found');
  if (user.profileImage) await deleteFromCloudinary(user.profileImage);
  for (const img of user.portfolioImages || []) await deleteFromCloudinary(img);
  await db.delete(users).where(eq(users.id, userId));
};

// ─── UPLOAD PORTFOLIO ───
export const uploadPortfolioImages = async (userId: string, buffers: Buffer[]) => {
  const urls = await Promise.all(buffers.map(b => uploadToCloudinary(b, 'byu-connect/portfolio')));
  const [updated] = await db.update(users)
    .set({ portfolioImages: sql`array_cat(${users.portfolioImages}, ${urls}::text[])`, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  return sanitize(updated as User);
};

// ─── DELETE PORTFOLIO IMAGE ───
export const deletePortfolioImage = async (userId: string, url: string) => {
  await deleteFromCloudinary(url);
  const [updated] = await db.update(users)
    .set({ portfolioImages: sql`array_remove(${users.portfolioImages}, ${url})`, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  return sanitize(updated as User);
};

// ─── SUBMIT STUDENT EMAIL ───
export const submitStudentEmail = async (userId: string, studentEmail: string) => {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.isStudentVerified) throw new ApiError(400, 'Student email already verified');

  // Ensure no other account uses this student email
  const conflict = await db.select({ id: users.id })
    .from(users)
    .where(and(eq(users.studentEmail, studentEmail), ne(users.id, userId)))
    .limit(1);
  if (conflict.length > 0) throw new ApiError(409, 'This email is already registered to another account');

  const otp = generateOTP();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await db.update(users)
    .set({
      studentEmail,
      studentOtpCode: hashedOtp,
      studentOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    })
    .where(eq(users.id, userId));

  await sendOtpEmail(studentEmail, user.name, otp);
  return { message: 'Verification code sent to student email' };
};

// ─── VERIFY STUDENT EMAIL ───
export const verifyStudentEmail = async (userId: string, otp: string) => {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.isStudentVerified) throw new ApiError(400, 'Already verified');

  if (!user.studentOtpCode || !user.studentOtpExpiresAt || new Date() > user.studentOtpExpiresAt) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  const isValid = await bcrypt.compare(otp, user.studentOtpCode);
  if (!isValid) throw new ApiError(400, 'Invalid OTP');

  const [updated] = await db.update(users)
    .set({ isStudentVerified: true, studentOtpCode: null, studentOtpExpiresAt: null })
    .where(eq(users.id, userId))
    .returning();

  return { user: sanitize(updated as User) };
};

// ─── CONNECT TO TALENT ───
export const connectToTalent = async (userId: string, talentId: string, userName: string) => {
  if (userId === talentId) throw new ApiError(400, 'Cannot connect to self');
  const [talent] = await db.select().from(users).where(eq(users.id, talentId)).limit(1);
  if (!talent) throw new ApiError(404, 'Talent not found');
  sendConnectionInterestEmail(talent.email, talent.name, userName).catch(() => {});
  return { message: 'Connection interest sent' };
};

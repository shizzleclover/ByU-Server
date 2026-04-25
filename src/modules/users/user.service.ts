import { db } from '../../config/db';
import { users, type User } from '../../db/schema';
import { eq, ilike, or, and, sql, desc, asc, ne } from 'drizzle-orm';
import ApiError from '../../utils/ApiError';
import { uploadToCloudinary, deleteFromCloudinary } from '../../middlewares/upload.middleware';
import { sendConnectionInterestEmail } from '../email/email.service';
import type { PaginatedResult } from '../../types';

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
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(50, Math.max(1, query.limit || 20));
  const offset = (page - 1) * limit;

  // Build conditions
  const conditions = [eq(users.isVerified, true)];

  if (query.role) {
    conditions.push(ilike(users.role, `%${query.role}%`));
  }

  if (query.skill) {
    // Check if skill exists in text array
    conditions.push(sql`${users.skills} @> ARRAY[${query.skill}]::text[]`);
  }

  if (query.availability) {
    conditions.push(eq(users.availabilityStatus, query.availability as any));
  }

  if (query.search) {
    const searchCondition = or(
      ilike(users.name, `%${query.search}%`),
      ilike(users.bio, `%${query.search}%`),
      ilike(users.role, `%${query.search}%`)
    );
    if (searchCondition) conditions.push(searchCondition);
  }

  // Final where clause
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Sorting
  const order = query.sort === 'name' ? [asc(users.name)] : [desc(users.createdAt)];

  // Execute
  const [data, counts] = await Promise.all([
    db.select({
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
      createdAt: users.createdAt,
    })
    .from(users)
    .where(whereClause)
    .orderBy(...order)
    .limit(limit)
    .offset(offset),
    
    db.select({ total: sql<number>`count(*)` })
      .from(users)
      .where(whereClause),
  ]);

  const total = counts[0]?.total || 0;

  return {
    data,
    pagination: {
      page,
      limit,
      total: Number(total),
      pages: Math.ceil(Number(total) / limit),
    },
  };
};

// ─── GET USER ───
export const getUserById = async (userId: string) => {
  const [user] = await db.select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) throw new ApiError(404, 'User not found');

  const { password, otpCode, refreshToken, ...userObj } = user;
  return userObj;
};

// ─── UPDATE PROFILE ───
export const updateProfile = async (userId: string, data: any) => {
  const [user] = await db.update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();

  if (!user) throw new ApiError(404, 'User not found');
  
  const { password, otpCode, refreshToken, ...userObj } = user;
  return userObj;
};

// ─── UPLOAD AVATAR ───
export const uploadAvatar = async (userId: string, buffer: Buffer) => {
  const user = await getUserById(userId);
  if (user.profileImage) await deleteFromCloudinary(user.profileImage);

  const url = await uploadToCloudinary(buffer, 'byu-connect/avatars');
  
  const [updated] = await db.update(users)
    .set({ profileImage: url, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();

  const { password, otpCode, refreshToken, ...userObj } = updated as User;
  return userObj;
};

// ─── UPDATE AVAILABILITY ───
export const updateAvailability = async (userId: string, status: any) => {
  const [user] = await db.update(users)
    .set({ availabilityStatus: status, availabilityUpdatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  if (!user) throw new ApiError(404, 'Not found');
  const { password, otpCode, refreshToken, ...userObj } = user;
  return userObj;
};

// ─── COMPLETE ONBOARDING ───
export const completeOnboarding = async (userId: string) => {
  const [user] = await db.update(users)
    .set({ onboarded: true })
    .where(eq(users.id, userId))
    .returning();
  if (!user) throw new ApiError(404, 'Not found');
  const { password, otpCode, refreshToken, ...userObj } = user;
  return userObj;
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
  const user = await getUserById(userId);
  
  const uploadPromises = buffers.map(b => uploadToCloudinary(b, 'byu-connect/portfolio'));
  const urls = await Promise.all(uploadPromises);

  const [updated] = await db.update(users)
    .set({ 
      portfolioImages: sql`array_cat(${users.portfolioImages}, ${urls}::text[])`,
      updatedAt: new Date() 
    })
    .where(eq(users.id, userId))
    .returning();

  const { password, otpCode, refreshToken, ...userObj } = updated as User;
  return userObj;
};

// ─── DELETE PORTFOLIO IMAGE ───
export const deletePortfolioImage = async (userId: string, url: string) => {
  await deleteFromCloudinary(url);

  const [updated] = await db.update(users)
    .set({
      portfolioImages: sql`array_remove(${users.portfolioImages}, ${url})`,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId))
    .returning();

  const { password, otpCode, refreshToken, ...userObj } = updated as User;
  return userObj;
};

// ─── CONNECT TO TALENT (Like/Swipe Right) ───
export const connectToTalent = async (userId: string, talentId: string, userName: string) => {
  if (userId === talentId) throw new ApiError(400, 'Cannot connect to self');

  const [talent] = await db.select().from(users).where(eq(users.id, talentId)).limit(1);
  if (!talent) throw new ApiError(404, 'Talent not found');

  // Trigger email alert
  sendConnectionInterestEmail(talent.email, talent.name, userName).catch(() => {});

  return { message: 'Connection interest sent' };
};

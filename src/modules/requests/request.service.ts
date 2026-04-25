import { db } from '../../config/db';
import { requests, users, responses, type Request } from '../../db/schema';
import { eq, ilike, and, sql, desc, or } from 'drizzle-orm';
import ApiError from '../../utils/ApiError';
import type { PaginatedResult } from '../../types';

// ─── LIST REQUESTS ───
interface ListRequestsQuery {
  search?: string;
  skillNeeded?: string;
  urgency?: string;
  status?: string;
  createdBy?: string;
  page?: number;
  limit?: number;
}

export const listRequests = async (query: ListRequestsQuery): Promise<PaginatedResult<any>> => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(50, Math.max(1, query.limit || 20));
  const offset = (page - 1) * limit;

  const conditions = [];

  if (query.skillNeeded) conditions.push(ilike(requests.skillNeeded, `%${query.skillNeeded}%`));
  if (query.urgency) conditions.push(eq(requests.urgency, query.urgency as any));
  if (query.status) conditions.push(eq(requests.status, query.status as any));
  else conditions.push(eq(requests.status, 'open'));

  if (query.createdBy) conditions.push(eq(requests.createdBy, query.createdBy));

  if (query.search) {
    conditions.push(or(
      ilike(requests.title, `%${query.search}%`),
      ilike(requests.description, `%${query.search}%`)
    ));
  }

  const whereClause = and(...conditions);

  const [data, [{ total }]] = await Promise.all([
    db.query.requests.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: [desc(requests.createdAt)],
      with: {
        creator: {
          columns: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
          }
        },
        responses: {
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                username: true,
                profileImage: true,
              }
            }
          }
        }
      }
    }),
    db.select({ total: sql<number>`count(*)` }).from(requests).where(whereClause),
  ]);

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

// ─── GET REQUEST ───
export const getRequestById = async (requestId: string) => {
  const request = await db.query.requests.findFirst({
    where: eq(requests.id, requestId),
    with: {
      creator: {
        columns: {
          id: true,
          name: true,
          username: true,
          profileImage: true,
          role: true,
          skills: true,
        }
      },
      responses: {
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              username: true,
              profileImage: true,
            }
          }
        }
      }
    }
  });

  if (!request) throw new ApiError(404, 'Request not found');
  return request;
};

// ─── CREATE REQUEST ───
export const createRequest = async (userId: string, data: any) => {
  const [request] = await db.insert(requests)
    .values({ ...data, createdBy: userId })
    .returning();
  return request;
};

// ─── UPDATE ───
export const updateRequest = async (requestId: string, userId: string, data: any) => {
  const [existing] = await db.select().from(requests).where(eq(requests.id, requestId)).limit(1);
  if (!existing) throw new ApiError(404, 'Not found');
  if (existing.createdBy !== userId) throw new ApiError(403, 'Unauthorized');

  const [updated] = await db.update(requests)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(requests.id, requestId))
    .returning();

  return updated;
};

// ─── DELETE ───
export const deleteRequest = async (requestId: string, userId: string) => {
  const [existing] = await db.select().from(requests).where(eq(requests.id, requestId)).limit(1);
  if (!existing) throw new ApiError(404, 'Not found');
  if (existing.createdBy !== userId) throw new ApiError(403, 'Unauthorized');

  await db.delete(requests).where(eq(requests.id, requestId));
};

// ─── RESPOND ───
export const respondToRequest = async (requestId: string, userId: string, message: string) => {
  const [request] = await db.select().from(requests).where(eq(requests.id, requestId)).limit(1);
  if (!request) throw new ApiError(404, 'Not found');
  if (request.status !== 'open') throw new ApiError(400, 'Request closed');
  if (request.createdBy === userId) throw new ApiError(400, 'Cannot respond to self');

  const [res] = await db.insert(responses)
    .values({ requestId, userId, message })
    .returning();
    
  return res;
};

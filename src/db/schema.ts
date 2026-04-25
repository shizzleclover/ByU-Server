import { pgTable, text, timestamp, boolean, uuid, varchar, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── Users Table ───
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  username: varchar('username', { length: 30 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: varchar('role', { length: 50 }).default(''),
  skills: text('skills').array().default([]),
  bio: text('bio').default(''),
  
  // Availability (Flattened)
  availabilityStatus: varchar('availability_status', { 
    enum: ['available', 'busy', 'unavailable'] 
  }).default('available'),
  availabilityUpdatedAt: timestamp('availability_updated_at').defaultNow(),
  
  // Portfolio
  portfolioLinks: text('portfolio_links').array().default([]),
  portfolioImages: text('portfolio_images').array().default([]),
  profileImage: text('profile_image').default(''),
  
  // Contact
  contactWhatsapp: varchar('contact_whatsapp', { length: 20 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactInstagram: varchar('contact_instagram', { length: 50 }),
  
  // Auth state
  isVerified: boolean('is_verified').default(false),
  onboarded: boolean('onboarded').default(false),
  otpCode: text('otp_code'),
  otpExpiresAt: timestamp('otp_expires_at'),
  refreshToken: text('refresh_token'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  requests: many(requests),
  responses: many(responses),
}));

// ─── Requests Table ───
export const requests = pgTable('requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description').notNull(),
  skillNeeded: varchar('skill_needed', { length: 50 }).notNull(),
  tags: text('tags').array().default([]),
  urgency: varchar('urgency', { 
    enum: ['urgent', 'flexible', 'no_rush'] 
  }).default('flexible'),
  status: varchar('status', { 
    enum: ['open', 'fulfilled', 'closed'] 
  }).default('open'),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const requestsRelations = relations(requests, ({ one, many }) => ({
  creator: one(users, {
    fields: [requests.createdBy],
    references: [users.id],
  }),
  responses: many(responses),
}));

// ─── Responses Table (Relational) ───
export const responses = pgTable('responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  requestId: uuid('request_id').references(() => requests.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const responsesRelations = relations(responses, ({ one }) => ({
  request: one(requests, {
    fields: [responses.requestId],
    references: [requests.id],
  }),
  user: one(users, {
    fields: [responses.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Request = typeof requests.$inferSelect;
export type NewRequest = typeof requests.$inferInsert;
export type Response = typeof responses.$inferSelect;
export type NewResponse = typeof responses.$inferInsert;

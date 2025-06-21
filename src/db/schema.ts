import { pgTable, integer, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar('email', { length: 256 }).notNull(),
  password: varchar('password', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const documents = pgTable('documents', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').references(() => users.id),
  title: varchar('title', { length: 256 }).notNull(),
  expiryDate: timestamp('expiry_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').references(() => users.id),
  docId: integer('doc_id').references(() => documents.id),
  message: varchar('message', { length: 512 }),
  createdAt: timestamp('created_at').defaultNow(),
});

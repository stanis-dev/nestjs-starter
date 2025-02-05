import { relations } from 'drizzle-orm';
import { pgTable, uuid, text } from 'drizzle-orm/pg-core';
import { userConsents } from './user-consents';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
});

export const userRelations = relations(users, ({ many }) => ({
  consents: many(userConsents),
}));

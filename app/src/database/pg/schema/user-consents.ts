import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, uuid, serial, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';

export const consentIdEnum = pgEnum('consents', [
  'email_notifications',
  'sms_notifications',
]);

export const userConsents = pgTable('user_consents', {
  id: serial().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  consentId: consentIdEnum('consent_id'),
  enabled: boolean().default(false),
});

export const userConsentsRelations = relations(userConsents, ({ one }) => ({
  user: one(users, { fields: [userConsents.userId], references: [users.id] }),
}));

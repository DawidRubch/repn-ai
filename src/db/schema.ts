import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
});

export type Users = typeof usersTable.$inferSelect;
export type NewUsers = typeof usersTable.$inferInsert;


export const googleCalendarTokensTable = pgTable('google_calendar_tokens', {
    id: serial('id').primaryKey(),
    userId: text('user_id').references(() => usersTable.id).notNull(),
    accessToken: text('access_token').notNull(),
    refreshToken: text('refresh_token').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
});


export type GoogleCalendarTokens = typeof googleCalendarTokensTable.$inferSelect;
export type NewGoogleCalendarTokens = typeof googleCalendarTokensTable.$inferInsert;




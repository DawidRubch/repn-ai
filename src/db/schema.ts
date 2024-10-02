import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
});


export const googleCalendarTokens = pgTable('google_calendar_tokens', {
    id: serial('id').primaryKey(),
    userId: text('user_id').references(() => users.id).notNull(),
    accessToken: text('access_token').notNull(),
    refreshToken: text('refresh_token').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
});



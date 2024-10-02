import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
});


export const googleCalendarTokensTable = pgTable('google_calendar_tokens', {
    id: serial('id').primaryKey(),
    userId: text('user_id').references(() => usersTable.id).notNull(),
    accessToken: text('access_token').notNull(),
    refreshToken: text('refresh_token').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
});



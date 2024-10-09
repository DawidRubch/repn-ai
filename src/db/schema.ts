import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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

export const visibilityEnum = pgEnum('visibility', ['public', 'private']);
const positionEnum = pgEnum('position', ["left", "right", "center"]);



export const agentsTable = pgTable('agents', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => usersTable.id).notNull(),
    displayName: text('display_name').notNull(),
    description: text('description').notNull(),
    greeting: text('greeting').notNull(),
    prompt: text('prompt').notNull(),
    criticalKnowledge: text('critical_knowledge').notNull(),
    visibility: visibilityEnum('visibility').notNull(),
    answerOnlyFromCriticalKnowledge: boolean('answer_only_from_critical_knowledge').notNull(),
    avatarPhotoUrl: text('avatar_photo_url'),
    position: positionEnum('position').notNull().default("right"),
    introMessage: text('intro_message'),
    calendlyUrl: text('calendly_url'),
})

export type Agents = typeof agentsTable.$inferSelect;
export type NewAgents = typeof agentsTable.$inferInsert;


export const criticalKnowledgeFilesTable = pgTable('critical_knowledge_files', {
    id: text('id').primaryKey(),
    agentId: text('agent_id').references(() => agentsTable.id).notNull(),
    name: text('name').notNull(),
    url: text('url').notNull(),
    size: integer('size').notNull(),
    type: text('type').notNull(),
})

export type CriticalKnowledgeFiles = typeof criticalKnowledgeFilesTable.$inferSelect;
export type NewCriticalKnowledgeFiles = typeof criticalKnowledgeFilesTable.$inferInsert;

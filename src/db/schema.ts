import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
});

export type Users = typeof usersTable.$inferSelect;
export type NewUsers = typeof usersTable.$inferInsert;


export const visibilityEnum = pgEnum('visibility', ['public', 'private']);
export const positionEnum = pgEnum('position', ["left", "right", "center"]);

export const agentsTable = pgTable('agents', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => usersTable.id).notNull(),
    displayName: text('display_name').notNull(),
    greeting: text('greeting').notNull(),
    prompt: text('prompt').notNull(),
    criticalKnowledge: text('critical_knowledge').notNull(),
    visibility: visibilityEnum('visibility').notNull(),
    answerOnlyFromCriticalKnowledge: boolean('answer_only_from_critical_knowledge').notNull(),
    avatarPhotoUrl: text('avatar_photo_url'),
    position: positionEnum('position').notNull().default("right"),
    introMessage: text('intro_message '),
    calendlyUrl: text('calendly_url'),
    voice: text('voice').notNull(),
})

export type Agents = typeof agentsTable.$inferSelect;
export type NewAgents = typeof agentsTable.$inferInsert;

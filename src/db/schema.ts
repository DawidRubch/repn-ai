import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Existing tables and enums (unchanged)
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
    introMessage: text('intro_message'),
    calendlyUrl: text('calendly_url'),
    voice: text('voice').notNull(),
    showCalendar: boolean('show_calendar').notNull().default(true),
});

export type Agents = typeof agentsTable.$inferSelect;
export type NewAgents = typeof agentsTable.$inferInsert;

// Updated tables for Stripe integration with minutes-based usage
export const customersTable = pgTable('customers', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => usersTable.id).notNull(),
    stripeCustomerId: text('stripe_customer_id').notNull(),
    email: text('email').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    billingLimit: integer('billing_limit').default(0),
});

export type Customers = typeof customersTable.$inferSelect;
export type NewCustomers = typeof customersTable.$inferInsert;

export const subscriptionStatusEnum = pgEnum('subscription_status', [
    'active',
    'past_due',
    'unpaid',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'trialing',
    'paused'
]);

export const subscriptionsTable = pgTable('subscriptions', {
    id: text('id').primaryKey(),
    customerId: text('customer_id').references(() => customersTable.id).notNull(),
    status: subscriptionStatusEnum('status').notNull(),
    priceId: text('price_id').notNull(),
    currentPeriodStart: timestamp('current_period_start').notNull(),
    currentPeriodEnd: timestamp('current_period_end').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    canceledAt: timestamp('canceled_at'),
    endedAt: timestamp('ended_at'),
});

export type Subscriptions = typeof subscriptionsTable.$inferSelect;
export type NewSubscriptions = typeof subscriptionsTable.$inferInsert;


export const meetingsBookedTable = pgTable('meetings_booked', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').references(() => usersTable.id).notNull(),
    date: timestamp('date').defaultNow(),
});

export type MeetingsBooked = typeof meetingsBookedTable.$inferSelect;
export type NewMeetingsBooked = typeof meetingsBookedTable.$inferInsert;

import { createTRPCRouter } from '../init';
import { agentRouter } from './agent';
import { conversationRouter } from './conversation';
import { dashboardRouter } from './dashboard';
import { s3Router } from './s3';
import { scrapeRouter } from './scrape';
import { stripeRouter } from './stripe';

export const appRouter = createTRPCRouter({
    stripe: stripeRouter,
    s3: s3Router,
    scrape: scrapeRouter,
    agent: agentRouter,
    conversation: conversationRouter,
    dashboard: dashboardRouter
});


// export type definition of API
export type AppRouter = typeof appRouter;
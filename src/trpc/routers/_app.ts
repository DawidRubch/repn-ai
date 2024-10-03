import { createTRPCRouter } from '../init';
import { calendarRouter } from './calendar';
import { s3Router } from './s3';
import { stripeRouter } from './stripe';

export const appRouter = createTRPCRouter({
    stripe: stripeRouter,
    calendar: calendarRouter,
    s3: s3Router
});


// export type definition of API
export type AppRouter = typeof appRouter;
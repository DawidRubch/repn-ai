import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedutre } from '../init';
import { stripeRouter } from './stripe';
import { calendarRouter } from './calendar';

export const appRouter = createTRPCRouter({
    stripe: stripeRouter,
    calendar: calendarRouter
});




// export type definition of API
export type AppRouter = typeof appRouter;
import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedutre } from '../init';
import { stripeRouter } from './stripe';

export const appRouter = createTRPCRouter({
    stripe: stripeRouter
});




// export type definition of API
export type AppRouter = typeof appRouter;
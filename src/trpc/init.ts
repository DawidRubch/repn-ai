import { getAuth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import { NextRequest } from 'next/server';
import { cache } from 'react';
import superjson from 'superjson';
import { db } from '../db';


export const createTRPCContext = cache(async (req?: NextRequest) => {
    if (!req) {
        return {
            auth: null,
        };
    }

    const auth = getAuth(req);

    return {
        auth,
        db: db
    };
});




// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.

const t = initTRPC.context<typeof createTRPCContext>().create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory
export const mergeRouters = t.mergeRouters


const isAuthed = t.middleware((opts) => {
    if (!opts.ctx.auth?.userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
    }
    return opts.next({
        ctx: {
            ...opts.ctx,
            auth: opts.ctx.auth,
        },
    });
});

export const protectedProcedutre = t.procedure.use(isAuthed);
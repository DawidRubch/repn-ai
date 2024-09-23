import { getAuth } from '@clerk/nextjs/server';
import { initTRPC } from '@trpc/server';
import { NextRequest } from 'next/server';
import { cache } from 'react';
import superjson from 'superjson';


export const createTRPCContext = cache(async (req: NextRequest) => {
    const auth = getAuth(req);
    return {
        auth,
    };
});

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.

const t = initTRPC.create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory
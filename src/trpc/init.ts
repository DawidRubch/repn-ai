import { currentUser, getAuth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import { NextRequest } from 'next/server';
import { cache } from 'react';
import superjson from 'superjson';
import { db } from '../db';
import { checkIfCustomerExists, checkIfSubscriptionExists } from '../server/stripe/utils';


export const createTRPCContext = cache(async (req?: NextRequest) => {
    if (!req) {
        return {
            auth: null,
            headers: null
        };
    }

    const auth = getAuth(req);

    return {
        auth,
        db: db,
        headers: req.headers
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


const isAuthed = t.middleware(async (opts) => {
    if (!opts.ctx.auth?.userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
    }

    const user = await currentUser()

    if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
    }


    return opts.next({
        ctx: {
            ...opts.ctx,
            auth: opts.ctx.auth,
            user
        },
    });
});

const isPaywalled = t.middleware(async (opts) => {
    if (!opts.ctx.auth?.userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
    }

    const user = await currentUser()

    if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
    }


    const customer = await checkIfCustomerExists(user.emailAddresses[0].emailAddress)

    if (!customer) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Customer not found' });
    }

    const subscription = await checkIfSubscriptionExists(customer.id)

    if (!subscription) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Subscription not found' });
    }



    return opts.next({
        ctx: {
            ...opts.ctx,
            auth: opts.ctx.auth,
            user,
            customer,
            subscription
        },
    });
})


export const protectedProcedutre = t.procedure.use(isAuthed);


export const paywallProcedure = t.procedure.use(isPaywalled);
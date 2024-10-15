import { currentUser } from '@clerk/nextjs/server';
import { TRPCError } from "@trpc/server";
import { env } from "../../env";
import { stripe } from "../../server/stripe";
import { createTRPCRouter, protectedProcedutre } from "../init";
import { createOrRetrieveCustomer, createSubscription } from '../../server/stripe/utils';
import { z } from 'zod';
import { db } from '../../db';
import { customersTable, usersTable } from '../../db/schema';
import { eq } from 'drizzle-orm';


export const stripeRouter = createTRPCRouter({

    createSetupIntent: protectedProcedutre.mutation(async ({ ctx }) => {

        const userEmail = ctx.user.emailAddresses[0].emailAddress


        const customerID = await createOrRetrieveCustomer(userEmail, ctx.user.id)

        const subscription = await createSubscription(customerID)


        if ("error" in subscription) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: subscription.error
            })
        }

        const setupIntent = subscription.pending_setup_intent

        if (typeof setupIntent === 'string') {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Setup intent not found"
            })
        }

        const url = ctx.headers.get("origin")

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: "setup",
            customer: customerID,
            success_url: `${url}/create-agent`,
            cancel_url: `${url}/create-agent`,
        })


        return {
            url: checkoutSession.url
        }

    }),

    createBillingSession: protectedProcedutre.mutation(async ({ ctx }) => {
        const userEmail = ctx.user.emailAddresses[0].emailAddress


        const existingCustomer = await checkIfCustomerExists(userEmail)

        if (!existingCustomer) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Customer not found"
            })
        }


        const url = ctx.headers.get("origin")

        const billingSession = await stripe.billingPortal.sessions.create({
            return_url: `${url}/billing`,
            customer: existingCustomer.id,
        })

        if (!billingSession) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Billing session not found"
            })
        }

        return {
            url: billingSession.url
        }



    }), getUsageForThisPeriod: protectedProcedutre.query(async ({ ctx }) => {


        const userEmail = ctx.user.emailAddresses[0].emailAddress


        const existingCustomer = await checkIfCustomerExists(userEmail)

        if (!existingCustomer) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Customer not found"
            })
        }

        const subscription = await checkIfSubscriptionExists(existingCustomer.id)

        if (!subscription) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Subscription not found"
            })
        }

        const periodEnd = subscription.current_period_end
        const periodStart = subscription.current_period_start


        const secondsUsage = await stripe.billing.meters.listEventSummaries(env.STRIPE_AGENT_USAGE_SECONDS_METER_ID, {
            customer: existingCustomer.id,
            start_time: periodStart,
            end_time: periodEnd,
        })

        return {
            seconds: secondsUsage.data.length > 0 ? secondsUsage.data[0].aggregated_value : 0
        }
    }),
    activeSubscription: protectedProcedutre.query(async ({ ctx }) => {

        const userEmail = ctx.user.emailAddresses[0].emailAddress


        const existingCustomer = await checkIfCustomerExists(userEmail)

        if (!existingCustomer) {
            return false
        }

        const subscription = await checkIfSubscriptionExists(existingCustomer.id)



        if (!subscription) {
            return false
        }

        return subscription
    }), billingInfo: protectedProcedutre.query(async ({ ctx }) => {
        const userEmail = ctx.user.emailAddresses[0].emailAddress

        const existingCustomer = await checkIfCustomerExists(userEmail)


        if (!existingCustomer) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Customer not found"
            })
        }

        const subscription = await checkIfSubscriptionExists(existingCustomer.id)

        if (!subscription) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Subscription not found"
            })
        }
        const periodStart = subscription.current_period_start
        const periodEnd = subscription.current_period_end

        const secondsUsage = await stripe.billing.meters.listEventSummaries(env.STRIPE_AGENT_USAGE_SECONDS_METER_ID, {
            customer: existingCustomer.id,
            start_time: periodStart,
            end_time: periodEnd,
        })

        const { unit_amount } = await stripe.prices.retrieve(subscription.items.data[0].price.id)


        if (!unit_amount) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Price not found"
            })
        }


        const [{ billingLimit }] = await db.select({
            billingLimit: customersTable.billingLimit
        }).from(customersTable).where(eq(customersTable.id, existingCustomer.id))


        // Convert unit_amount from cents to dollars
        const unitAmountInDollars = unit_amount / 100;

        const totalSecondsUsed = secondsUsage.data.length > 0 ? secondsUsage.data[0].aggregated_value : 0;


        // Calculate budget used in dollars
        const budgetUsed = Number((unitAmountInDollars * totalSecondsUsed).toFixed(2));


        // Ensure billingLimit is a number, defaulting to 0 if null
        const billingLimitInDollars = billingLimit === null ? 0 : billingLimit;

        // Calculate percentage used, avoiding division by zero
        const percentageUsed = billingLimitInDollars > 0
            ? Number(((budgetUsed / billingLimitInDollars) * 100).toFixed(2))
            : 0;

        return {
            budgetUsed,
            billingLimit: billingLimitInDollars,
            percentageUsed
        };



    }), setBillingThreshold: protectedProcedutre.input(z.object({
        billingThreshold: z.number()
    })).mutation(async ({ ctx, input }) => {


        const userEmail = ctx.user.emailAddresses[0].emailAddress


        const existingCustomer = await checkIfCustomerExists(userEmail)

        if (!existingCustomer) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Customer not found"
            })
        }

        const subscription = await checkIfSubscriptionExists(existingCustomer.id)

        if (!subscription) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Subscription not found"
            })
        }



        await db.update(customersTable).set({
            billingLimit: input.billingThreshold
        }).where(eq(customersTable.id, existingCustomer.id))


        return {
            success: true,
            billingLimit: input.billingThreshold
        }


    })
});

const checkIfCustomerExists = async (email: string) => {
    const customer = await stripe.customers.search({
        query: `email:"${email}"`
    });

    return customer.data[0]
}


const checkIfSubscriptionExists = async (customerID: string) => {
    const subscription = await stripe.subscriptions.list({
        customer: customerID,
    });

    return subscription.data[0]
}


import { currentUser } from '@clerk/nextjs/server';
import { TRPCError } from "@trpc/server";
import { env } from "../../env";
import { stripe } from "../../server/stripe";
import { createTRPCRouter, protectedProcedutre } from "../init";
import { createOrRetrieveCustomer, createOrRetrieveSubscription } from '../../server/stripe/utils';
import { z } from 'zod';


export const stripeRouter = createTRPCRouter({

    createSetupIntent: protectedProcedutre.mutation(async ({ ctx }) => {

        const userEmail = ctx.user.emailAddresses[0].emailAddress


        const customerID = await createOrRetrieveCustomer(userEmail, ctx.user.id)

        const subscription = await createOrRetrieveSubscription(customerID)


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

        const clientSecret = setupIntent?.client_secret

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: "setup",
            customer: customerID,
            success_url: "http://localhost:3000/dashboard",
            cancel_url: "http://localhost:3000/dashboard",
        })

        if (!clientSecret) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Client secret not found"
            })
        }

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

        const billingSession = await stripe.billingPortal.sessions.create({
            return_url: "http://localhost:3000/dashboard",
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

        const meetingsUsage = await stripe.billing.meters.listEventSummaries(env.STRIPE_AGENT_USAGE_MEETINGS_METER_ID, {
            customer: existingCustomer.id,
            start_time: periodStart,
            end_time: periodEnd,
        })

        const minutesUsage = await stripe.billing.meters.listEventSummaries(env.STRIPE_AGENT_USAGE_MINUTES_METER_ID, {
            customer: existingCustomer.id,
            start_time: periodStart,
            end_time: periodEnd,
        })

        return {
            meetings: meetingsUsage.data.length > 0 ? meetingsUsage.data[0].aggregated_value : 0,
            minutes: minutesUsage.data.length > 0 ? minutesUsage.data[0].aggregated_value : 0
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

        return subscription.status === "active"
    }), billingThreshold: protectedProcedutre.query(async ({ ctx }) => {
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



        const billingThreshold = subscription.billing_thresholds?.amount_gte || 0

        const periodStart = subscription.current_period_start
        const periodEnd = subscription.current_period_end

        const minutesUsage = await stripe.billing.meters.listEventSummaries(env.STRIPE_AGENT_USAGE_MINUTES_METER_ID, {
            customer: existingCustomer.id,
            start_time: periodStart,
            end_time: periodEnd,
        })


        return {
            minutesUsage: minutesUsage.data.length > 0 ? minutesUsage.data[0].aggregated_value : 0,
            billingThreshold
        }



        //TODO: create custom billing treshold, we can't use the one from stripe as it's for generating invoices.
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

        if (input.billingThreshold === 0) {
            await stripe.subscriptions.update(subscription.id, {
                billing_thresholds: ''
            })
        } else {
            await stripe.subscriptions.update(subscription.id, {
                billing_thresholds: {
                    amount_gte: input.billingThreshold
                }
            })
        }

        return {
            success: true
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
        status: "active"
    });

    return subscription.data[0]
}


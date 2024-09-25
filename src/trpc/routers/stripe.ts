import { TRPCError } from "@trpc/server";
import { stripe } from "../../server/stripe";
import { createTRPCRouter, protectedProcedutre } from "../init";
import { currentUser } from '@clerk/nextjs/server'
import { env } from "../../env";
import { TRPCClientError } from "@trpc/client";


export const stripeRouter = createTRPCRouter({

    createSetupIntent: protectedProcedutre.mutation(async ({ ctx }) => {

        const user = await currentUser()

        if (!user) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "User not found"
            })
        }

        let customerID: string

        const existingCustomer = await checkIfCustomerExists(user.emailAddresses[0].emailAddress)

        if (existingCustomer) {
            customerID = existingCustomer.id
        } else {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress
            });

            customerID = customer.id
        }

        const existingSubscription = await checkIfSubscriptionExists(customerID)

        if (existingSubscription) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Subscription already exists"
            })
        }

        const subscription = await stripe.subscriptions.create({
            customer: customerID,
            items: [
                {
                    price: env.STRIPE_AGENT_MINUTES_PRICE_ID,
                },
                {
                    price: env.STRIPE_AGENT_MEETINGS_PRICE_ID,
                }
            ],
            expand: ['pending_setup_intent'],
        });

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

        const user = await currentUser()

        if (!user) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "User not found"
            })
        }

        const existingCustomer = await checkIfCustomerExists(user.emailAddresses[0].emailAddress)

        if (!existingCustomer) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Customer not found"
            })
        }

        const existingSubscription = await checkIfSubscriptionExists(existingCustomer.id)

        if (existingSubscription) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Subscription already exists"
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


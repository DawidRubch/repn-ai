
import { db } from "../../db";
import { customersTable, NewSubscriptions, subscriptionsTable } from "../../db/schema";
import { env } from "../../env";
import { stripe } from "../../server/stripe";
import { eq } from "drizzle-orm";
import Stripe from 'stripe';

export const createOrRetrieveCustomer = async (email: string, userId: string) => {

    let customerID: string

    const existingCustomer = await checkIfCustomerExists(email)

    if (existingCustomer) {
        customerID = existingCustomer.id
    } else {
        const customer = await stripe.customers.create({ email })


        await db.insert(customersTable).values({
            id: customer.id,
            email,
            stripeCustomerId: customer.id,
            userId
        })

        customerID = customer.id
    }

    return customerID
}


export const createSubscription = async (customerID: string) => {
    const existingSubscription = await checkIfSubscriptionIsActive(customerID)

    if (existingSubscription) {
        return {
            error: "Subscription already exists"
        }
    }

    const subscription = await stripe.subscriptions.create({
        customer: customerID,
        items: [
            {
                price: env.STRIPE_AGENT_MINUTES_PRICE_ID,
            },
        ],
        expand: ['pending_setup_intent'],
    });


    return subscription


}




export const manageSubscriptionStatusChange = async ({
    subscriptionId,
    customerId,
    shouldCopyBillingDetails = false
}: {
    subscriptionId: string;
    customerId: string;
    shouldCopyBillingDetails?: boolean;
}) => {


    const [customer] = await db.select({
        id: customersTable.id,
    }).from(customersTable).where(eq(customersTable.stripeCustomerId, customerId)).limit(1)

    if (!customer) {
        throw new Error("Customer not found")
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['default_payment_method']
    });


    const subscriptionData: NewSubscriptions = {
        id: subscription.id,
        customerId: customer.id,
        priceId: subscription.items.data[0].price.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
        endedAt: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null,
        createdAt: new Date()
    }

    await db.insert(subscriptionsTable).values(subscriptionData).onConflictDoUpdate({
        target: [subscriptionsTable.id],
        set: subscriptionData
    })


    if (shouldCopyBillingDetails && subscription.default_payment_method && customer.id) {
        await copyBillingDetails(customer.id, subscription.default_payment_method as Stripe.PaymentMethod)
    }


}


const copyBillingDetails = async (customerId: string, paymentMethod: Stripe.PaymentMethod) => {
    const customer = paymentMethod.customer as string;

    const { name, phone, address } = paymentMethod.billing_details;


    await stripe.customers.update(customer, {
        name: name || '',
        phone: phone || '',
        address: {
            city: address?.city || '',
            country: address?.country || '',
            line1: address?.line1 || '',
            line2: address?.line2 || '',
            postal_code: address?.postal_code || '',
            state: address?.state || '',
        }
    })
}

const checkIfCustomerExists = async (email: string) => {
    const customer = await stripe.customers.search({
        query: `email:"${email}"`
    });

    return customer.data[0]
}
const checkIfSubscriptionIsActive = async (customerID: string) => {
    const subscription = await stripe.subscriptions.list({
        customer: customerID,
        status: "active"
    });

    return subscription.data[0]
}
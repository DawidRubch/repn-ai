
import { db } from "../../db";
import { customersTable } from "../../db/schema";
import { env } from "../../env";
import { stripe } from "../../server/stripe";


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


export const createOrRetrieveSubscription = async (customerID: string) => {
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

import { stripe } from "../../server/stripe";


export const createOrRetrieveCustomer = async (email: string) => {

    let customerID: string

    const existingCustomer = await checkIfCustomerExists(email)

    if (existingCustomer) {
        customerID = existingCustomer.id
    } else {
        const customer = await stripe.customers.create({ email })
        customerID = customer.id
    }

    return customerID
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
const checkIfSubscriptionExists = async (customerID: string) => {
    const subscription = await stripe.subscriptions.list({
        customer: customerID,
        status: "active"
    });

    return subscription.data[0]
}

import { stripe } from "../../server/stripe";


export const createOrRetrieveCustomer = async (email: string) => {

    let customerID: string




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

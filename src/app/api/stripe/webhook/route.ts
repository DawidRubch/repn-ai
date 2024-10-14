import Stripe from 'stripe';
import { stripe } from '../../../../server/stripe';
import { manageSubscriptionStatusChange } from '../../../../server/stripe/utils';
import { env } from '../../../../env';

const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    "invoice.paid"
]);

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature') as string;
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
        if (!sig || !webhookSecret)
            return new Response('Webhook secret not found.', { status: 400 });
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
        console.log(`🔔  Webhook received: ${event.type}`);
    } catch (err: any) {
        console.log(`❌ Error message: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (relevantEvents.has(event.type)) {
        try {
            switch (event.type) {
                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    const subscription = event.data.object as Stripe.Subscription;
                    await manageSubscriptionStatusChange(
                        {
                            customerId: subscription.customer as string,
                            subscriptionId: subscription.id,
                            shouldCopyBillingDetails: event.type === 'customer.subscription.created'
                        }
                    );
                    break;

                case 'checkout.session.completed':
                    const checkoutSession = event.data.object as Stripe.Checkout.Session;


                    if (checkoutSession.mode === 'subscription') {
                        const subscriptionId = checkoutSession.subscription;
                        await manageSubscriptionStatusChange(
                            {
                                customerId: checkoutSession.customer as string,
                                subscriptionId: subscriptionId as string,
                                shouldCopyBillingDetails: true
                            }
                        );
                    }

                    //Attaching payment method to customer
                    if (checkoutSession.mode === "setup") {
                        const paymentMethodID = checkoutSession.payment_method_configuration_details?.id

                        if (paymentMethodID) {
                            await stripe.paymentMethods.attach(paymentMethodID, {
                                customer: checkoutSession.customer as string,
                            })

                            await stripe.customers.update(checkoutSession.customer as string, {
                                invoice_settings: {
                                    default_payment_method: paymentMethodID
                                }
                            })
                        }
                    }
                    break;
                default:
                    throw new Error('Unhandled relevant event!');
            }
        } catch (error) {
            console.log(error);
            return new Response(
                'Webhook handler failed. View your Next.js function logs.',
                {
                    status: 400
                }
            );
        }
    } else {
        return new Response(`Unsupported event type: ${event.type}`, {
            status: 400
        });
    }
    return new Response(JSON.stringify({ received: true }));
}
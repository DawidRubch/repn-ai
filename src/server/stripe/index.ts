import * as Stripe from "stripe";
import { env } from "../../env";

export const stripe = new Stripe.Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
});
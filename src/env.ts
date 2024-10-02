import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        CLERK_SECRET_KEY: z.string().min(1),
        STRIPE_SECRET_KEY: z.string().min(1),
        STRIPE_AGENT_MINUTES_PRICE_ID: z.string().min(1),
        STRIPE_AGENT_MEETINGS_PRICE_ID: z.string().min(1),
        STRIPE_AGENT_USAGE_MINUTES_EVENT_NAME: z.string().min(1),
        STRIPE_AGENT_USAGE_MEETINGS_EVENT_NAME: z.string().min(1),
        STRIPE_AGENT_USAGE_MINUTES_METER_ID: z.string().min(1),
        STRIPE_AGENT_USAGE_MEETINGS_METER_ID: z.string().min(1),
        GOOGLE_OAUTH_CLIENT_ID: z.string().min(1),
        GOOGLE_OAUTH_CLIENT_SECRET: z.string().min(1),
        GOOGLE_OAUTH_REDIRECT_URI: z.string().min(1),
        DB_PASSWORD: z.string().min(1),
        DB_URL: z.string().min(1),
        PLAY_AI_API_KEY: z.string().min(1),
    },
    client: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
        NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
        NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1),
    },
    // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
    runtimeEnv: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
        NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        STRIPE_AGENT_MINUTES_PRICE_ID: process.env.STRIPE_AGENT_MINUTES_PRICE_ID,
        STRIPE_AGENT_MEETINGS_PRICE_ID: process.env.STRIPE_AGENT_MEETINGS_PRICE_ID,
        STRIPE_AGENT_USAGE_MINUTES_EVENT_NAME: process.env.STRIPE_AGENT_USAGE_MINUTES_EVENT_NAME,
        STRIPE_AGENT_USAGE_MEETINGS_EVENT_NAME: process.env.STRIPE_AGENT_USAGE_MEETINGS_EVENT_NAME,
        STRIPE_AGENT_USAGE_MINUTES_METER_ID: process.env.STRIPE_AGENT_USAGE_MINUTES_METER_ID,
        STRIPE_AGENT_USAGE_MEETINGS_METER_ID: process.env.STRIPE_AGENT_USAGE_MEETINGS_METER_ID,
        GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        GOOGLE_OAUTH_REDIRECT_URI: process.env.GOOGLE_OAUTH_REDIRECT_URI,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_URL: process.env.DB_URL,
        PLAY_AI_API_KEY: process.env.PLAY_AI_API_KEY,
    },
    // For Next.js >= 13.4.4, you only need to destructure client variables:
    // experimental__runtimeEnv: {
    //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
    // }
});
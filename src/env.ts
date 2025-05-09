import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        CLERK_SECRET_KEY: z.string().min(1),
        STRIPE_SECRET_KEY: z.string().min(1),
        DB_PASSWORD: z.string().min(1),
        DB_POOL_URL: z.string().min(1),
        DB_DRIZZLE_URL: z.string().min(1),
        PLAY_AI_API_KEY: z.string().min(1),
        CLERK_WEBHOOK_SECRET: z.string().min(1),
        AWS_ACCESS_KEY_ID: z.string().min(1),
        AWS_SECRET_ACCESS_KEY: z.string().min(1),
        AWS_REGION: z.string().min(1),
        AWS_S3_BUCKET_NAME_AVATARS: z.string().min(1),
        AWS_S3_BUCKET_NAME_FILES: z.string().min(1),
        APIFY_TOKEN: z.string().min(1),
        APIFY_ACT_ID: z.string().min(1),
        APIFY_WEBHOOK_URL: z.string().min(1),
        PLAY_AI_USER_ID: z.string().min(1),
        STRIPE_WEBHOOK_SECRET: z.string().min(1),
        STRIPE_AGENT_SECONDS_PRICE_ID: z.string().min(1),
        STRIPE_AGENT_USAGE_SECONDS_METER_ID: z.string().min(1),
    },
    client: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
        NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
        NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1),
        NEXT_PUBLIC_WIDGET_SCRIPT_URL: z.string().min(1),
    },
    // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
    runtimeEnv: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
        NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
        NEXT_PUBLIC_WIDGET_SCRIPT_URL: process.env.NEXT_PUBLIC_WIDGET_SCRIPT_URL,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_POOL_URL: process.env.DB_POOL_URL,
        DB_DRIZZLE_URL: process.env.DB_DRIZZLE_URL,
        PLAY_AI_API_KEY: process.env.PLAY_AI_API_KEY,
        CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_REGION: process.env.AWS_REGION,
        AWS_S3_BUCKET_NAME_AVATARS: process.env.AWS_S3_BUCKET_NAME_AVATARS,
        AWS_S3_BUCKET_NAME_FILES: process.env.AWS_S3_BUCKET_NAME_FILES,
        APIFY_TOKEN: process.env.APIFY_TOKEN,
        APIFY_ACT_ID: process.env.APIFY_ACT_ID,
        APIFY_WEBHOOK_URL: process.env.APIFY_WEBHOOK_URL,
        PLAY_AI_USER_ID: process.env.PLAY_AI_USER_ID,
        STRIPE_AGENT_SECONDS_PRICE_ID: process.env.STRIPE_AGENT_SECONDS_PRICE_ID,
        STRIPE_AGENT_USAGE_SECONDS_METER_ID: process.env.STRIPE_AGENT_USAGE_SECONDS_METER_ID,
    },
    // For Next.js >= 13.4.4, you only need to destructure client variables:
    // experimental__runtimeEnv: {
    //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
    // }
});

import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv';

config({ path: '.env.local' });


if (!process.env.DB_DRIZZLE_URL) {
    throw new Error('DB_DRIZZLE_URL is not set')
}


export default defineConfig({
    schema: "./src/db/schema.ts",
    dialect: 'postgresql',

    migrations: {
        prefix: 'supabase'
    },
    dbCredentials: {
        url: process.env.DB_DRIZZLE_URL as string
    }
})
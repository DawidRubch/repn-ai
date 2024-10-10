
import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv';
import { env } from './src/env';

config({ path: '.env.local' });


export default defineConfig({
    schema: "./src/db/schema.ts",
    dialect: 'postgresql',

    migrations: {
        prefix: 'supabase'
    },
    dbCredentials: {
        url: env.DB_DRIZZLE_URL as string
    }
})
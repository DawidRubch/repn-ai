import { eq } from "drizzle-orm";
import { google } from "googleapis";
import { z } from "zod";
import { googleCalendarTokensTable } from "../../db/schema";
import { env } from "../../env";
import { createTRPCRouter, protectedProcedutre } from "../init";
const scopes = ['https://www.googleapis.com/auth/calendar'];

const oauth2Client = new google.auth.OAuth2(
    env.GOOGLE_OAUTH_CLIENT_ID,
    env.GOOGLE_OAUTH_CLIENT_SECRET,
    env.GOOGLE_OAUTH_REDIRECT_URI
)

export const calendarRouter = createTRPCRouter({
    oauth: protectedProcedutre.mutation(async ({ ctx }) => {

        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        });
        return { url }
    }),

    insertTokens: protectedProcedutre.input(z.object({
        code: z.string()
    })).mutation(async ({ ctx, input }) => {
        const { code } = input;
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        if (tokens.access_token && tokens.refresh_token && tokens.expiry_date) {

            await ctx.db.insert(googleCalendarTokensTable).values({
                userId: ctx.auth.userId,
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiresAt: new Date(tokens.expiry_date)
            }).onConflictDoUpdate({
                target: googleCalendarTokensTable.userId,
                set: {
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                    expiresAt: new Date(tokens.expiry_date)
                }
            })

            return { success: true }

        }

        return { success: false }

    }), insertNewTokens: protectedProcedutre.query(async ({ ctx }) => {
        const [tokens] = await ctx.db.select().from(googleCalendarTokensTable).where(eq(googleCalendarTokensTable.userId, ctx.auth.userId))

        if (!tokens) {
            return null
        }

        if (tokens.expiresAt < new Date()) {

            oauth2Client.setCredentials({
                refresh_token: tokens.refreshToken
            })

            const { credentials: newTokens } = await oauth2Client.refreshAccessToken();

            if (!newTokens.access_token || !newTokens.refresh_token || !newTokens.expiry_date) {
                return null
            }

            await ctx.db.update(googleCalendarTokensTable).set({
                accessToken: newTokens.access_token,
                refreshToken: newTokens.refresh_token,
                expiresAt: new Date(newTokens.expiry_date),
            }).where(eq(googleCalendarTokensTable.userId, ctx.auth.userId))
        }

        return {
            success: true
        }
    })



})
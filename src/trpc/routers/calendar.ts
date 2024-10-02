import { z } from "zod";
import { env } from "../../env";
import { createTRPCRouter, protectedProcedutre } from "../init";
import { google } from "googleapis"

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

    getAccessToken: protectedProcedutre.input(z.object({
        code: z.string()
    })).mutation(async ({ ctx, input }) => {
        const { code } = input;
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        return { tokens }
    }),



})
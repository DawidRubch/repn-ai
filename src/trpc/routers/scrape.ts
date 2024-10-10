import { z } from "zod";
import { env } from "../../env";
import { client, getApifyInput, getApifyRunStatus } from "../../server/apify";
import { createTRPCRouter, protectedProcedutre } from "../init";
export const scrapeRouter = createTRPCRouter({
    scrapeWebsite: protectedProcedutre.input(z.object({
        urls: z.array(z.string()),
        agentId: z.string(),
    })).mutation(async ({ ctx, input }) => {
        const { urls, agentId } = input;

        const apifyInput = getApifyInput(urls);

        const run = await client.actor(env.APIFY_ACT_ID).call(apifyInput, {
            webhooks: [{
                eventTypes: ["ACTOR.RUN.SUCCEEDED"],
                requestUrl: env.APIFY_WEBHOOK_URL,
                payloadTemplate: `{"agentId": "${agentId}","userId":"${ctx.auth.userId}", "resource":{{resource}}}`
            }],
            waitSecs: 3,
            memory: 4096
        });

        return run.id
    }),
    statusPolling: protectedProcedutre.input(z.object({
        runId: z.string(),
    })).query(async ({ ctx, input }) => {
        const { runId } = input;

        return await getApifyRunStatus(runId)
    })
})








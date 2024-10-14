import { z } from "zod";
import { createTRPCRouter, protectedProcedutre } from "../init";
import { env } from "../../env";
import { getConversationDetailsFromPlay, getConversationsFromPlay } from "../../server/playai/utils";
import { getConversationTranscript } from "../../server/playai/utils";

export const conversationRouter = createTRPCRouter({
    getConversations: protectedProcedutre.input(z.object({
        agentId: z.string(),
    })).query(async ({ ctx, input }) => {

        const { agentId } = input

        return await getConversationsFromPlay(agentId)


    }),
    getConversationTranscript: protectedProcedutre.input(z.object({
        conversationId: z.string(),
        agentId: z.string(),
    })).query(async ({ ctx, input }) => {
        const { conversationId, agentId } = input

        return await getConversationTranscript({ conversationId, agentId })
    }),
    getConversationDetails: protectedProcedutre.input(z.object({
        conversationId: z.string(),
        agentId: z.string(),
    })).query(async ({ ctx, input }) => {
        const { conversationId, agentId } = input

        return await getConversationDetailsFromPlay({ conversationId, agentId })
    }),
})

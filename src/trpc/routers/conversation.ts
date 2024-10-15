import { z } from "zod";
import { getConversationDetailsFromPlay, getConversationsFromPlay, getConversationTranscript } from "../../server/playai/utils";
import { createTRPCRouter, protectedProcedutre } from "../init";

export const conversationRouter = createTRPCRouter({
    getConversations: protectedProcedutre.input(z.object({
        agentId: z.string(),
    })).query(async ({ ctx, input }) => {

        const { agentId } = input

        return await getConversationsFromPlay(agentId, 999999)


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

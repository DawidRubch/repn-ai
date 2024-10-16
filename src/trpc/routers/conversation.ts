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



        const transcript = await getConversationTranscript({ conversationId, agentId })

        if (!transcript) {
            return []
        }

        const sortedTranscript = transcript.sort((a, b) => {
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        })

        // Enforce AI/USER alternating order
        const orderedTranscript: typeof sortedTranscript = []
        let aiMessages = sortedTranscript.filter(msg => msg.role === 'assistant')
        let userMessages = sortedTranscript.filter(msg => msg.role === 'user')

        while (aiMessages.length > 0 || userMessages.length > 0) {
            if (aiMessages.length > 0) {
                orderedTranscript.push(aiMessages.shift()!)
            }
            if (userMessages.length > 0) {
                orderedTranscript.push(userMessages.shift()!)
            }
        }

        return orderedTranscript
    }),
    getConversationDetails: protectedProcedutre.input(z.object({
        conversationId: z.string(),
        agentId: z.string(),
    })).query(async ({ ctx, input }) => {
        const { conversationId, agentId } = input

        return await getConversationDetailsFromPlay({ conversationId, agentId })
    }),
})

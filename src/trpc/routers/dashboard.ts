import { z } from "zod";
import { getConversationsFromPlay } from "../../server/playai/utils";
import { createTRPCRouter, protectedProcedutre } from "../init";

export const dashboardRouter = createTRPCRouter({
    getDashboardData: protectedProcedutre.input(z.object({
        agentId: z.string(),
    })).query(async ({ ctx, input }) => {
        const { agentId } = input

        const totalAgentConversations = await getConversationsFromPlay(agentId)

        const totalAgentConversationsThisMonth = totalAgentConversations.filter((conversation) => {
            const conversationDate = new Date(conversation.startedAt)
            const currentDate = new Date()
            return conversationDate.getMonth() === currentDate.getMonth() && conversationDate.getFullYear() === currentDate.getFullYear()
        })



        return {
            totalAgentConversations,
            totalAgentConversationsThisMonth
        }
    }),
})
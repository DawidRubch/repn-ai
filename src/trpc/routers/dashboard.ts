import { z } from "zod";
import { getAgentStats, getConversationsFromPlay } from "../../server/playai/utils";
import { createTRPCRouter, protectedProcedutre } from "../init";

export const dashboardRouter = createTRPCRouter({
    getDashboardData: protectedProcedutre.input(z.object({
        agentId: z.string(),
    })).query(async ({ ctx, input }) => {
        const { agentId } = input



        const data = await getAgentStats({ agentId })

        if (!data) {
            return null
        }

        const { numberOfConversations, numberOfSecondsTalked } = data


        const conversations = await getConversationsFromPlay(agentId)

        const conversationsThisMonth = conversations.filter((conversation) => {
            const conversationDate = new Date(conversation.startedAt)
            const currentDate = new Date()
            return conversationDate.getMonth() === currentDate.getMonth() && conversationDate.getFullYear() === currentDate.getFullYear()
        })


        const numberOfSecondsTalkedThisMonth = conversationsThisMonth.reduce((acc, conversation) => {
            return acc + conversation.durationInSeconds
        }, 0)







        return {
            numberOfConversations,
            numberOfSecondsTalked,
            conversationsThisMonth,
            numberOfSecondsTalkedThisMonth
        }
    }),
})
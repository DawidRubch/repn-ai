import { z } from "zod";
import { getAgentStats, getConversationsFromPlay } from "../../server/playai/utils";
import { createTRPCRouter, protectedProcedutre } from "../init";
import { meetingsBookedTable } from "../../db/schema";
import { db } from "../../db";
import { eq } from "drizzle-orm";
export const dashboardRouter = createTRPCRouter({
    getDashboardData: protectedProcedutre.input(z.object({
        agentId: z.string(),
    })).query(async ({ ctx, input }) => {
        const { agentId } = input

        const data = await getAgentStats({ agentId })

        if (!data) {
            return null
        }

        const { numberOfConversations } = data


        const conversations = await getConversationsFromPlay(agentId, 9999999)



        const conversationsThisMonth = conversations.filter((conversation) => {
            const conversationDate = new Date(conversation.startedAt)
            const currentDate = new Date()

            return conversationDate.getMonth() === currentDate.getMonth() && conversationDate.getFullYear() === currentDate.getFullYear()
        })


        const meetings = await db.select().from(meetingsBookedTable).where(eq(meetingsBookedTable.userId, ctx.user.id))


        const meetingsThisMonth = meetings.filter((meeting) => {
            const meetingDate = new Date(meeting.date)
            const currentDate = new Date()

            return meetingDate.getMonth() === currentDate.getMonth() && meetingDate.getFullYear() === currentDate.getFullYear()
        })
        return {
            numberOfConversations,
            conversationsThisMonth: conversationsThisMonth.length,
            meetingsBooked: meetings.length,
            meetingsThisMonth: meetingsThisMonth.length
        }
    }),
})
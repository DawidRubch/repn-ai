import { z } from "zod";
import { createTRPCRouter, protectedProcedutre } from "../init";
import { env } from "../../env";

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

type Conversation = {
    id: string;
    source: string;
    callerEmail: string;
    startedAt: string;
    endedAt: string;
    durationInSeconds: number;
};

type ConversationsResponse = Conversation[];



const getConversationsFromPlay = async (agentId: string) => {
    const response = await fetch(`https://api.play.ai/api/v1/agents/${agentId}/conversations`, {
        headers: {
            'Content-Type': 'application/json',
            'AUTHORIZATION': `${env.PLAY_AI_API_KEY}`,
            'X-USER-ID': `${env.PLAY_AI_USER_ID}`,
        }
    })

    if (!response.ok) {
        console.error(await response.json())
        return []
    }

    const data = await response.json() as ConversationsResponse

    // Sort the conversations by startedAt in descending order (newest first)
    const sortedData = data.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())

    return sortedData
}



type ConversationTranscript = {
    id: string,
    role: "assistant" | "user"
    content: string
    timestamp: string
}

type ConversationTranscriptResponse = ConversationTranscript[]

const getConversationTranscript = async ({ conversationId, agentId, pageSize = 50 }: { conversationId: string, agentId: string, pageSize?: number }) => {

    const response = await fetch(`https://api.play.ai/api/v1/agents/${agentId}/conversations/${conversationId}/transcript?pageSize=${pageSize}`, {
        headers: {
            'Content-Type': 'application/json',
            'AUTHORIZATION': `${env.PLAY_AI_API_KEY}`,
            'X-USER-ID': `${env.PLAY_AI_USER_ID}`,
        }
    })

    if (!response.ok) {
        console.error(await response.json())
        return null
    }

    const data = await response.json() as ConversationTranscriptResponse

    return data
}


const getConversationDetailsFromPlay = async ({ conversationId, agentId }: { conversationId: string, agentId: string }) => {
    const response = await fetch(`https://api.play.ai/api/v1/agents/${agentId}/conversations/${conversationId}`, {
        headers: {
            'Content-Type': 'application/json',
            'AUTHORIZATION': `${env.PLAY_AI_API_KEY}`,
            'X-USER-ID': `${env.PLAY_AI_USER_ID}`,
        }
    })

    if (!response.ok) {
        console.error(await response.json())
        return null
    }

    const data = await response.json() as Conversation

    return data
}
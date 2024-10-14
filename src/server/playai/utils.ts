import { TRPCError } from "@trpc/server"
import { playai } from "./index"
import { z } from "zod"
import { env } from "../../env"

type UpdateAgentInput = {
    id: string,
    voice: string,
    displayName: string,
    greeting: string,
    prompt: string,
    criticalKnowledge: string,
    answerOnlyFromCriticalKnowledge: boolean,
}

export const updateAgent = async (agent: UpdateAgentInput): Promise<void> => {
    const response = await fetch(`${playai.baseURL}/agents/${agent.id}`, {
        method: 'PATCH',
        headers: playai.headers,
        body: JSON.stringify({
            voice: agent.voice,
            displayName: agent.displayName,
            greeting: agent.greeting,
            prompt: agent.prompt,
            criticalKnowledge: agent.criticalKnowledge,
            answerOnlyFromCriticalKnowledge: agent.answerOnlyFromCriticalKnowledge,
        })
    })

    if (!response.ok) {
        const res = await response.json()
        console.log(res)
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: res
        })
    }
}

type CreateNewAgentInput = {
    voice: string,
    voiceSpeed: number,
    displayName: string,
    description: string,
    greeting: string,
    prompt: string,
    criticalKnowledge: string,
    answerOnlyFromCriticalKnowledge: boolean,
    visibility: string,
}

const AgentSchema = z.object({
    displayName: z.string(),
    description: z.string(),
    greeting: z.string(),
    prompt: z.string(),
    criticalKnowledge: z.string(),
    answerOnlyFromCriticalKnowledge: z.boolean(),
    avatarPhotoUrl: z.string().optional(),
    position: z.enum(["left", "right", "center"]),
    introMessage: z.string().optional(),
    calendlyUrl: z.string().nullable(),
    voice: z.string(),
})


type AgentWithID = z.infer<typeof AgentSchema> & { id: string }


export const createNewAgent = async (agent: CreateNewAgentInput): Promise<string> => {
    const response = await fetch(`${playai.baseURL}/agents`, {
        method: 'POST',
        headers: playai.headers,
        body: JSON.stringify(agent)
    })

    if (!response.ok) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: await response.json()
        })
    }

    const data = await response.json() as AgentWithID

    return data.id
}


type Conversation = {
    id: string;
    source: string;
    callerEmail: string;
    startedAt: string;
    endedAt: string;
    durationInSeconds: number;
};

type ConversationsResponse = Conversation[];



export const getConversationsFromPlay = async (agentId: string) => {
    const response = await fetch(`${playai.baseURL}/agents/${agentId}/conversations`, {
        headers: playai.headers
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

export const getConversationTranscript = async ({ conversationId, agentId, pageSize = 50 }: { conversationId: string, agentId: string, pageSize?: number }) => {

    const response = await fetch(`${playai.baseURL}/agents/${agentId}/conversations/${conversationId}/transcript?pageSize=${pageSize}`, {
        headers: playai.headers
    })

    if (!response.ok) {
        console.error(await response.json())
        return null
    }

    const data = await response.json() as ConversationTranscriptResponse

    return data
}


export const getConversationDetailsFromPlay = async ({ conversationId, agentId }: { conversationId: string, agentId: string }) => {
    const response = await fetch(`${playai.baseURL}/agents/${agentId}/conversations/${conversationId}`, {
        headers: playai.headers
    })

    if (!response.ok) {
        console.error(await response.json())
        return null
    }

    const data = await response.json() as Conversation

    return data
}
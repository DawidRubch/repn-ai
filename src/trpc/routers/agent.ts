import { z } from "zod"
import { createTRPCRouter, protectedProcedutre } from "../init"
import { env } from "../../env"
import { agentsTable } from "../../db/schema"
import { TRPCError } from "@trpc/server"

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

export const agentRouter = createTRPCRouter({
    createAgent: protectedProcedutre.input(AgentSchema).mutation(async ({ ctx, input }) => {
        try {
            const agentId = await createNewAgent({
                voice: input.voice,
                voiceSpeed: 1.0,
                displayName: input.displayName,
                description: input.description,
                greeting: input.greeting,
                prompt: input.prompt,
                criticalKnowledge: input.criticalKnowledge,
                answerOnlyFromCriticalKnowledge: input.answerOnlyFromCriticalKnowledge,
                visibility: "private",
            })

            await ctx.db.insert(agentsTable).values({
                id: agentId,
                userId: ctx.auth.userId,
                displayName: input.displayName,
                description: input.description,
                greeting: input.greeting,
                prompt: input.prompt,
                criticalKnowledge: input.criticalKnowledge,
                visibility: "private",
                answerOnlyFromCriticalKnowledge: input.answerOnlyFromCriticalKnowledge,
                avatarPhotoUrl: input.avatarPhotoUrl,
                calendlyUrl: input.calendlyUrl,
                position: input.position,
                introMessage: input.introMessage,
            }).returning()

            return agentId
        } catch (error) {
            console.error(error)
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to create agent'
            })
        }
    }),


})

type AgentWithID = z.infer<typeof AgentSchema> & { id: string }



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

const createNewAgent = async (agent: CreateNewAgentInput): Promise<string> => {
    const response = await fetch('https://api.play.ai/api/v1/agents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'AUTHORIZATION': `${env.PLAY_AI_API_KEY}`,
            'X-USER-ID': `${env.PLAY_AI_USER_ID}`,
        },
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

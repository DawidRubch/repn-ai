import { z } from "zod"
import { createTRPCRouter, protectedProcedutre } from "../init"
import { env } from "../../env"
import { agentsTable } from "../../db/schema"

const AgentSchema = z.object({
    displayName: z.string(),
    description: z.string(),
    greeting: z.string(),
    prompt: z.string(),
    criticalKnowledge: z.string(),
    answerOnlyFromCriticalKnowledge: z.boolean(),
    avatarPhotoUrl: z.string().optional(),
})

export const agentRouter = createTRPCRouter({
    createAgent: protectedProcedutre.input(AgentSchema).mutation(async ({ ctx, input }) => {
        const agentId = await createNewAgent(input)

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

        })

        return agentId
    }),
    updateAgent: protectedProcedutre.mutation(async ({ ctx }) => {

    })
})

type AgentWithID = z.infer<typeof AgentSchema> & { id: string }


const createNewAgent = async (agent: z.infer<typeof AgentSchema>): Promise<string> => {
    const response = await fetch('https://api.play.ai/api/v1/agents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.PLAY_AI_API_KEY}`
        },
        body: JSON.stringify(agent)
    })

    if (!response.ok) {
        throw new Error('Failed to create agent')
    }

    const data = await response.json() as AgentWithID

    return data.id
}

import { z } from "zod"
import { createTRPCRouter, protectedProcedutre } from "../init"
import { env } from "../../env"

const AgentSchema = z.object({
    displayName: z.string(),
    description: z.string(),
    greeting: z.string(),
    prompt: z.string(),
    criticalKnowledge: z.string(),
    visiblity: z.enum(["public", "private"]),
    answerOnlyFromCriticalKnowledge: z.boolean(),
    avatarPhotoUrl: z.string().optional(),
    criticalKnowledgeFiles: z.array(z.object({
        id: z.string(),
        name: z.string(),
        url: z.string(),
        size: z.number(),
        type: z.string(),
    }))
})

export const agentRouter = createTRPCRouter({
    createAgent: protectedProcedutre.input(AgentSchema).mutation(async ({ ctx, input }) => {


    }),
    updateAgent: protectedProcedutre.mutation(async ({ ctx }) => { })
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

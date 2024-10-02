import { z } from "zod"
import { createTRPCRouter, protectedProcedutre } from "../init"



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
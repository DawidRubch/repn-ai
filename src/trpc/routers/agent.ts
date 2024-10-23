import { z } from "zod"
import { createTRPCRouter, paywallProcedure, protectedProcedutre } from "../init"
import { env } from "../../env"
import { agentsTable } from "../../db/schema"
import { TRPCError } from "@trpc/server"
import { and, eq } from "drizzle-orm"
import { db } from "../../db"
import { createNewAgent, updateAgent } from "../../server/playai/utils"

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

const AgentSchemaWithID = AgentSchema.extend({
    id: z.string(),
})

export const agentRouter = createTRPCRouter({
    createAgent: paywallProcedure.input(AgentSchema).mutation(async ({ ctx, input }) => {
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
                greeting: input.greeting,
                prompt: input.prompt,
                criticalKnowledge: input.criticalKnowledge,
                visibility: "private",
                answerOnlyFromCriticalKnowledge: input.answerOnlyFromCriticalKnowledge,
                avatarPhotoUrl: input.avatarPhotoUrl,
                calendlyUrl: input.calendlyUrl,
                position: input.position,
                introMessage: input.introMessage,
                voice: input.voice,
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

    getAgent: protectedProcedutre.query(async ({ ctx }) => {

        const userID = ctx.auth.userId

        const [agent] = await db.select().from(agentsTable).where(eq(agentsTable.userId, userID)).limit(1)

        if (!agent) {
            return null
        }

        return {
            id: agent.id,
            name: agent.displayName
        }
    }),
    getIdentity: protectedProcedutre.query(async ({ ctx }) => {
        const userID = ctx.auth.userId

        const [agent] = await db.select({
            voice: agentsTable.voice,
            displayName: agentsTable.displayName,
            avatarPhotoUrl: agentsTable.avatarPhotoUrl,
        }).from(agentsTable).where(eq(agentsTable.userId, userID)).limit(1)

        if (!agent) {
            return null
        }

        return agent

    }),
    getBehaviour: protectedProcedutre.query(async ({ ctx }) => {
        const userID = ctx.auth.userId

        const [agent] = await db.select({
            greeting: agentsTable.greeting,
            instructions: agentsTable.prompt,
        }).from(agentsTable).where(eq(agentsTable.userId, userID)).limit(1)

        if (!agent) {
            return null
        }

        return agent
    }),
    getKnowledge: protectedProcedutre.query(async ({ ctx }) => {
        const userID = ctx.auth.userId

        const [agent] = await db.select({
            criticalKnowledge: agentsTable.criticalKnowledge,
            answerOnlyFromCriticalKnowledge: agentsTable.answerOnlyFromCriticalKnowledge,
        }).from(agentsTable).where(eq(agentsTable.userId, userID)).limit(1)

        if (!agent) {
            return null
        }

        return agent
    }),
    getWidget: protectedProcedutre.query(async ({ ctx }) => {
        const userID = ctx.auth.userId

        const [agent] = await db.select({
            calendlyUrl: agentsTable.calendlyUrl,
            introMessage: agentsTable.introMessage,
            position: agentsTable.position,

        }).from(agentsTable).where(eq(agentsTable.userId, userID)).limit(1)

        if (!agent) {
            return null
        }

        return agent

    }),


    getAgentData: protectedProcedutre.mutation(async ({ ctx }) => {
        const userID = ctx.auth.userId

        const [agent] = await db.select().from(agentsTable).where(eq(agentsTable.userId, userID)).limit(1)

        if (!agent) {
            return null
        }

        return agent
    }),
    updateAgent: paywallProcedure.input(AgentSchemaWithID).mutation(async ({ ctx, input }) => {
        try {
            const userID = ctx.auth.userId

            await updateAgent({
                id: input.id,
                voice: input.voice,
                displayName: input.displayName,
                greeting: input.greeting,
                prompt: input.prompt,
                criticalKnowledge: input.criticalKnowledge,
                answerOnlyFromCriticalKnowledge: input.answerOnlyFromCriticalKnowledge,
            })

            await db.update(agentsTable).set({
                voice: input.voice,
                displayName: input.displayName,
                greeting: input.greeting,
                prompt: input.prompt,
                answerOnlyFromCriticalKnowledge: input.answerOnlyFromCriticalKnowledge,
                criticalKnowledge: input.criticalKnowledge,
                introMessage: input.introMessage,
                position: input.position,
                calendlyUrl: input.calendlyUrl,
                avatarPhotoUrl: input.avatarPhotoUrl,
            }).where(and(eq(agentsTable.userId, userID), eq(agentsTable.id, input.id)))

            return input.id
        } catch (error) {

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to update agent'
            })
        }
    })

})




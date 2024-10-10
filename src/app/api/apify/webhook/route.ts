import { db } from "../../../../db";
import { agentsTable, usersTable } from "../../../../db/schema";
import { getDataFromApify } from "../../../../server/apify";
import { and, eq } from "drizzle-orm";
export const POST = async (req: Request) => {

    const { agentId, userId, resource } = await req.json() as ApifyWebhookPayload

    const data = await getDataFromApify(resource.defaultDatasetId);


    const text = data.map((item) => item.text).join("\n");


    const [{ criticalKnowledge }] = await db.select({
        criticalKnowledge: agentsTable.criticalKnowledge
    }).from(agentsTable).where(and(eq(agentsTable.id, agentId), eq(agentsTable.userId, userId))).limit(1)


    const newKnowledge = criticalKnowledge + "\n" + text


    await db.update(agentsTable).set({
        criticalKnowledge: newKnowledge
    }).where(and(eq(agentsTable.id, agentId), eq(agentsTable.userId, userId)))

    return new Response(JSON.stringify({ success: true }), { status: 200 });


}
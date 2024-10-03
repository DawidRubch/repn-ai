import { getDataFromApify } from "../../../../server/apify";

export const POST = async (req: Request) => {

    const { agentId, resource } = await req.json() as ApifyWebhookPayload


    const data = await getDataFromApify(resource.id);

    console.log(data);







}
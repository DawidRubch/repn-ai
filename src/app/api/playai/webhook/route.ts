export const POST = async (req: Request) => {
    const response = await req.json() as {
        conversationID: string
        meetingTime: string
    }


    const headers = Object.fromEntries(req.headers.entries());
    console.log('All headers:', JSON.stringify(headers, null, 2));

    const conversationID = response.conversationID


    return new Response(JSON.stringify({ success: true }), { status: 200 });
}



const getConversation = async (conversationID: string) => {
    const response = await fetch(`https://api.playai.com/v1/conversations/${conversationID}`, {

    })
}
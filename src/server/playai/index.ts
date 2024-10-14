import { env } from "../../env"

export const playai = {
    baseURL: 'https://api.play.ai/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'AUTHORIZATION': `${env.PLAY_AI_API_KEY}`,
        'X-USER-ID': `${env.PLAY_AI_USER_ID}`,
    },
}


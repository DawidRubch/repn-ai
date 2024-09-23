import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/server/routers";
import { type NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { env } from "process";

type AuthObject = ReturnType<typeof getAuth>;


export const createTRPCContext = async (opts: {
    headers: Headers;
    auth: AuthObject;
}) => {
    return {
        userId: opts.auth.userId,
        ...opts,
    };
};


const createContext = async (req: NextRequest) => {
    return createTRPCContext({
        headers: req.headers,
        auth: getAuth(req),
    });
};


const handler = (req: NextRequest) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext: () => createContext(req),
        onError:
            env.NODE_ENV === "development"
                ? ({ path, error }) => {
                    console.error(
                        `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
                    );
                }
                : undefined,
    });

export { handler as GET, handler as POST };
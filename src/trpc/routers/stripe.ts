import { createTRPCRouter, protectedProcedutre } from "../init";

export const stripeRouter = createTRPCRouter({
    getBilling: protectedProcedutre.query(async ({ ctx }) => {
        return {
            billing: "billing",
        };
    }),
});
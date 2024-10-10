import { DashboardComponent } from "../components/dashboard";
import { HydrateClient, trpc } from "../trpc/server";
import { Suspense } from "react";
export default async function Home() {
  void trpc.agent.getAgent.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardComponent />
      </Suspense>
    </HydrateClient>
  );
}

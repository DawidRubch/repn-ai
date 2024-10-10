"use client";

import { trpc } from "../trpc/client";

export const AgentGlobalPrefetch: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { data } = trpc.agent.getAgent.useQuery();

  if (!data) {
    return (
      <>
        <div>Loading</div>
      </>
    );
  }

  return <>{children}</>;
};

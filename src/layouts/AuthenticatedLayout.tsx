"use client";
import { Loader2 } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { trpc } from "../trpc/client";
import { FullPageLoader } from "../components/FullPageLoader";
import { ProtectAgentProvider } from "./ProtectAgentProvider";

export const AuthenticatedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const data = trpc.agent.getAgent.useQuery();

  if (data.isLoading) {
    return <FullPageLoader />;
  }

  return (
    <main className="flex h-screen bg-black text-white">
      <Sidebar />
      <ProtectAgentProvider>{children}</ProtectAgentProvider>
    </main>
  );
};

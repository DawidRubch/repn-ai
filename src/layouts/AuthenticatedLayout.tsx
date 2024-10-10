"use client";
import { Loader2 } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { trpc } from "../trpc/client";
import { FullPageLoader } from "../components/FullPageLoader";

export const AuthenticatedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const data = trpc.agent.getAgent.useQuery();

  if (data.isLoading) {
    return <FullPageLoader></FullPageLoader>;
  }

  return (
    <main className="flex h-screen bg-black text-white">
      <Sidebar />
      {children}
    </main>
  );
};

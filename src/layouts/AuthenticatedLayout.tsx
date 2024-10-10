"use client";
import { Loader2 } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { trpc } from "../trpc/client";

export const AuthenticatedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const data = trpc.agent.getAgent.useQuery();

  if (data.isLoading) {
    return (
      <main className="flex h-screen bg-black text-white items-center justify-center">
        <Loader2 className="animate-spin" />
      </main>
    );
  }

  return (
    <main className="flex h-screen bg-black text-white">
      <Sidebar />
      {children}
    </main>
  );
};

"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { trpc } from "../trpc/client";

export function DashboardComponent() {
  const { push } = useRouter();

  return (
    <div className="flex-1 flex">
      <div className="flex-1 p-8">
        <>
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-zinc-400 mb-8">
            Welcome to your AI agent dashboard. Here you can manage your agents
            and create new ones.
          </p>
          <Button onClick={() => push("/create-agent")}>
            Create New Agent
          </Button>
        </>
      </div>
    </div>
  );
}

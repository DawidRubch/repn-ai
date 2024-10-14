"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { trpc } from "../trpc/client";
import { MessageSquare, Clock, TrendingUp, CalendarDays } from "lucide-react";

export function DashboardComponent() {
  const { push } = useRouter();

  const { data: agent } = trpc.agent.getAgent.useQuery();

  const { data, isLoading } = trpc.dashboard.getDashboardData.useQuery(
    {
      agentId: agent?.id ?? "",
    },
    {
      enabled: !!agent?.id,
    }
  );

  const formatSeconds = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours === 0 && minutes === 0) {
      return `${seconds}s`;
    }

    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (agent === null) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to AI Agent Dashboard
        </h1>
        <p className="text-muted-foreground mb-8 text-center">
          You don't have an agent yet. Create your first AI agent to get
          started.
        </p>
        <Button onClick={() => push("/create-agent")}>Create New Agent</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Welcome to your AI agent dashboard. Take a look at your stats.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Conversations
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.numberOfConversations ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Talk Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatSeconds(data?.numberOfSecondsTalked ?? 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversations This Month
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.conversationsThisMonth ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Talk Time This Month
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatSeconds(data?.numberOfSecondsTalkedThisMonth ?? 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={() => push("/update-agent")}>Update Agent</Button>
    </div>
  );
}

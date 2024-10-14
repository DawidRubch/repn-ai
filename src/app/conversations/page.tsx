"use client";

import { trpc } from "../../trpc/client";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";

export default function ConversationsPage() {
  const { data: agent } = trpc.agent.getAgent.useQuery();
  const { data, isLoading } = trpc.conversation.getConversations.useQuery(
    {
      agentId: agent?.id ?? "",
    },
    {
      enabled: !!agent?.id,
    }
  );

  if (isLoading || !data) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[72px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="m-4 w-full">
        <CardContent className="pt-6">No conversations found.</CardContent>
      </Card>
    );
  }

  return (
    <Card className="m-4 w-full">
      <h1 className="text-3xl font-bold mb-6">Conversations</h1>
      <ScrollArea className="h-[calc(100vh-150px)]">
        <div className="space-y-4 w-full">
          {data.map((conversation, index) => (
            <Link
              key={conversation.id}
              href={`/conversations/${conversation.id}`}
              className="block w-full"
            >
              <Card className="hover:bg-accent transition-colors w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Conversation #{data.length - index}
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {conversation.durationInSeconds} seconds
                  </div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

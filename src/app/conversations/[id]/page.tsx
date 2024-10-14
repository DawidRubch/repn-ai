"use client";

import { useParams } from "next/navigation";
import { trpc } from "../../../trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

type ConversationTranscriptResponse = {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
};

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const { data: agent } = trpc.agent.getAgent.useQuery();

  const { data: conversation, isLoading } =
    trpc.conversation.getConversationDetails.useQuery(
      {
        conversationId: id,
        agentId: agent?.id ?? "",
      },
      {
        enabled: !!agent?.id,
      }
    );

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[100px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <Card className="m-4">
        <CardContent className="pt-6">Conversation not found.</CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Conversation Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>Conversation ID: {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-4">
              {conversation.map((message: ConversationTranscriptResponse) => (
                <Card
                  key={message.id}
                  className={
                    message.role === "assistant"
                      ? "bg-primary/10"
                      : "bg-secondary/10"
                  }
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {message.role === "assistant" ? "Assistant" : "User"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(new Date(message.timestamp), "PPpp")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

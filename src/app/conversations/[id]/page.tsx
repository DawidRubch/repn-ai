"use client";

import { useParams } from "next/navigation";
import { trpc } from "../../../trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Bot, User, Clock } from "lucide-react";

type ConversationTranscriptResponse = {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
};

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const { data: agent } = trpc.agent.getAgent.useQuery();

  const { data: conversationHistory, isLoading } =
    trpc.conversation.getConversationTranscript.useQuery(
      {
        conversationId: id,
        agentId: agent?.id ?? "",
      },
      {
        enabled: !!agent?.id,
      }
    );

  const { data: conversationDetails, isLoading: isConversationDetailsLoading } =
    trpc.conversation.getConversationDetails.useQuery(
      {
        conversationId: id,
        agentId: agent?.id ?? "",
      },
      {
        enabled: !!agent?.id,
      }
    );

  if (isLoading || isConversationDetailsLoading) {
    return (
      <div className="p-4 space-y-4 h-screen">
        <Skeleton className="h-8 w-[250px]" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[100px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!conversationHistory || !conversationDetails) {
    return (
      <Card className="m-4 h-screen flex items-center justify-center">
        <CardContent className="text-center">
          <h2 className="text-2xl font-bold">Conversation not found.</h2>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col w-screen">
      <Card className="flex-grow overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">Conversation Details</span>
            <div className="flex items-center text-muted-foreground">
              <Clock className="w-5 h-5 mr-2" />
              <span>{conversationDetails.durationInSeconds} seconds</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-full">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-4">
              {conversationHistory.map(
                (message: ConversationTranscriptResponse) => (
                  <Card
                    key={message.id}
                    className={
                      message.role === "assistant"
                        ? "bg-primary/10"
                        : "bg-secondary/10"
                    }
                  >
                    <CardHeader className="pb-2 flex flex-row items-center space-y-0">
                      {message.role === "assistant" ? (
                        <Bot className="w-6 h-6 mr-2 text-primary" />
                      ) : (
                        <User className="w-6 h-6 mr-2 text-primary" />
                      )}
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
                )
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

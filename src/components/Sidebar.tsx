"use client";
import {
  CreditCard,
  Loader2,
  MessageSquare,
  PlusCircle,
  User,
  UserPen,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { trpc } from "../trpc/client";
import { useRouter } from "next/navigation";
import { useAgentFormStore } from "../hooks/useAgentStore";
import Image from "next/image";
export const Sidebar = () => {
  return (
    <div className="w-64 bg-zinc-900 p-4 flex flex-col">
      <div className="mb-8 flex items-center gap-2">
        <Image
          src="/logo.jpg"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full"
        />
        <span className="text-white text-lg font-bold">RepnAI</span>
      </div>
      <nav className="space-y-2 flex-1">
        <AgentComponent />

        <Link href="/conversations" passHref>
          <Button variant="ghost" className="w-full justify-start">
            <MessageSquare className="mr-2 h-4 w-4" />
            Conversations
          </Button>
        </Link>

        <Link href="/billing" passHref>
          <Button variant="ghost" className="w-full justify-start">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </Button>
        </Link>
      </nav>
      <UserButton />
    </div>
  );
};

const AgentComponent = () => {
  const { data, isLoading } = trpc.agent.getAgent.useQuery();
  const { push } = useRouter();
  const { mutateAsync: getAgentData, isPending } =
    trpc.agent.getAgentData.useMutation();
  const store = useAgentFormStore();
  const handleUpdateAgent = async () => {
    const agent = await getAgentData();

    store.setFormValues({
      identity: {
        name: agent?.displayName ?? "",
        avatarURL: agent?.avatarPhotoUrl ?? undefined,
        voice: agent?.voice ?? "",
        avatar: null,
      },
      behaviour: {
        greeting: agent?.greeting ?? "",
        introduction: agent?.prompt ?? "",
      },
      knowledge: {
        criticalKnowledge: agent?.criticalKnowledge ?? "",
        onlyAnwserFromKnowledge:
          agent?.answerOnlyFromCriticalKnowledge ?? false,
      },
      widget: {
        calendlyURL: agent?.calendlyUrl ?? "",
        position: agent?.position as "left" | "right",
        showIntroMessage: Boolean(
          agent?.introMessage && agent?.introMessage.length > 0
        ),
        introMessage: agent?.introMessage ?? "",
      },
    });

    if (agent?.avatarPhotoUrl) {
      store.setAvatarPreview(agent.avatarPhotoUrl);
    }

    store.setAgentFormStep("identity");

    push(`/update-agent`);
  };

  if (isLoading || data === undefined) return <>Loading...</>;

  if (data === null) {
    return (
      <Link href="/create-agent" passHref>
        <Button variant="ghost" className="w-full justify-start">
          <User className="mr-2 h-4 w-4" />
          Create Agent
        </Button>
      </Link>
    );
  }

  return (
    <Button
      onClick={handleUpdateAgent}
      variant="ghost"
      className="w-full justify-start"
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <UserPen className="mr-2 h-4 w-4" />
      )}
      {isPending ? "Redirecting..." : `Update ${shortenTheName(data.name)}`}
    </Button>
  );
};

const shortenTheName = (name: string) => {
  if (name.length > 10) {
    return name.substring(0, 10) + "...";
  }
  return name;
};

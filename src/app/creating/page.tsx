"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Copy, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendlyPopup } from "../../components/CalendlyPopup";
import { useToast } from "../../hooks/use-toast";
import { useAgentFormStore } from "../../hooks/useAgentStore";
import { getScriptCode } from "../../lib/getScriptCode";
import { trpc } from "../../trpc/client";

export default function CreatingPage() {
  const { isWebsiteScraping } = useWebsiteScraping();
  return <CreatingComponent isWebsiteScraping={isWebsiteScraping} />;
}

export const useWebsiteScraping = () => {
  const runId = useAgentFormStore((store) => store.apifyRunId);

  const { data: runStatus } = trpc.scrape.statusPolling.useQuery(
    {
      runId: runId || "",
    },
    {
      enabled: !!runId,
      refetchInterval: (data) => {
        if (!data.state.data) {
          return 1000;
        }

        // Refetch every second if status is not 'completed' or 'failed'
        return data.state.data === "RUNNING" ? 1000 : false;
      },
      refetchIntervalInBackground: true,
      staleTime: Infinity, // Consider the data fresh indefinitely
    }
  );

  if (!runId) {
    return {
      isWebsiteScraping: false,
    };
  }

  return {
    isWebsiteScraping: runStatus === "RUNNING" || runStatus === undefined,
  };
};

type LoadingState = "website" | "success" | "error";

const DeploymentInstructions: React.FC<{ agentId: string }> = ({ agentId }) => {
  const { toast } = useToast();
  const scriptCode = getScriptCode(agentId);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptCode);

    toast({
      title: "Copied to clipboard",
      description: "You can now paste it into your website.",
    });
  };

  return (
    <div className="space-y-4 w-full">
      <h3 className="font-semibold">Integration Steps:</h3>
      <ol className="list-decimal list-inside space-y-2">
        <li>Copy the following script tag:</li>
        <div className="bg-muted p-2 rounded-md flex justify-between items-center">
          <code>{scriptCode}</code>
          <Button variant="ghost" size="icon" onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <li>Paste it into the {"<body>"} tag of your website.</li>
        <li>Save and deploy your changes.</li>
      </ol>
    </div>
  );
};

const CreatingComponent: React.FC<{
  isWebsiteScraping: boolean;
}> = ({ isWebsiteScraping }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>("website");
  const resetStore = useAgentFormStore((store) => store.resetStore);
  const searchParams = useSearchParams();
  const agentId = searchParams.get("id");
  const router = useRouter();
  useEffect(() => {
    if (isWebsiteScraping) {
      setLoadingState("website");
    } else {
      setLoadingState("success");
      resetStore();
    }
  }, [isWebsiteScraping]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="w-full max-w-screen-lg">
        <Card>
          <CardHeader>
            <CardTitle>Agent Setup</CardTitle>
            <CardDescription>Setting up your AI agent</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            {loadingState === "website" && (
              <>
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-center">
                  We are getting data from your website. You can close this page
                  now, this will take couple of minutes. However you can start
                  using your agent now. We'll notify you once the websites are
                  fully scraped.
                </p>
              </>
            )}
            {loadingState === "success" && (
              <>
                <svg
                  className="h-8 w-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-center font-semibold">
                  Your agent is live and you can use it on your website.
                </p>
                <DeploymentInstructions agentId={agentId || ""} />
              </>
            )}
            {loadingState === "error" && (
              <>
                <AlertCircle className="h-8 w-8 text-red-500" />
                <p className="text-center">
                  Something went wrong with the setup.
                </p>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            {loadingState === "success" && (
              <>
                <Button onClick={() => router.push("/")}>
                  Go to Dashboard
                </Button>
                <CalendlyPopup
                  url="https://calendly.com/dawid-niegrebecki/meeting-with-dawid"
                  text="Need help with setup?"
                />
              </>
            )}
            {loadingState === "error" && <Button>Try Again</Button>}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

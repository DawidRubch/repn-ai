"use client";

import { useEffect, useState } from "react";
import { useCreateAgentStore } from "../../hooks/useCreateAgentStore";
import { trpc } from "../../trpc/client";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreatingPage() {
  const formValues = useCreateAgentStore((store) => store.formValues);
  const { isWebsiteScraping } = useWebsiteScraping();
  return <CreatingComponent isWebsiteScraping={isWebsiteScraping} />;
}

export const useWebsiteScraping = () => {
  const runId = useCreateAgentStore((store) => store.apifyRunId);

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

const CreatingComponent: React.FC<{
  isWebsiteScraping: boolean;
}> = ({ isWebsiteScraping }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>("website");

  useEffect(() => {
    if (isWebsiteScraping) {
      setLoadingState("website");
    } else {
      setLoadingState("success");
    }
  }, [isWebsiteScraping]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100">
      <div className="w-full max-w-md">
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
                <p className="text-center">
                  Your agent is live and you can use it on your website.
                </p>
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
          <CardFooter className="flex justify-center">
            {loadingState === "success" && <Button>Go to Dashboard</Button>}
            {loadingState === "error" && <Button>Try Again</Button>}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

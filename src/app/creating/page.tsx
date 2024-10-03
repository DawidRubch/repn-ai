"use client";

import { useEffect, useState } from "react";
import { useCreateAgentStore } from "../../hooks/useCreateAgentStore";
import { useSearchParams } from "next/navigation";
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
  const { isSuccess, isError, isPending } = useInsertTokens();
  const { isWebsiteScraping } = useWebsiteScraping();
  return (
    <CreatingComponent
      isSuccess={isSuccess}
      isError={isError}
      isPending={isPending}
      isWebsiteScraping={isWebsiteScraping}
    />
  );
}

export const useWebsiteScraping = () => {
  const websiteURLS = useCreateAgentStore(
    (store) => store.formValues.knowledge.websites
  );

  const isScraping = websiteURLS.length > 0;

  return {
    isWebsiteScraping: isScraping,
  };
};

const useInsertTokens = () => {
  const queryParams = useSearchParams();
  const code = queryParams.get("code");
  const error = queryParams.get("error");
  const { mutateAsync, isPending } = trpc.calendar.insertTokens.useMutation();
  const [isGoogleIntegrationSuccesfull, setIsGoogleIntegrationSuccesfull] =
    useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (code) {
      mutateAsync({ code: code }).then((data) => {
        setIsGoogleIntegrationSuccesfull(data.success);

        if (!data.success) {
          setIsError(true);
        }
      });
    }
  }, [code]);

  useEffect(() => {
    if (error) {
      console.log(error);
      setIsError(true);
    }
  }, [error]);

  return { isSuccess: isGoogleIntegrationSuccesfull, isError, isPending };
};

type LoadingState = "calendar" | "website" | "success" | "error";

const CreatingComponent: React.FC<{
  isSuccess: boolean;
  isError: boolean;
  isPending: boolean;
  isWebsiteScraping: boolean;
}> = ({ isSuccess, isError, isPending, isWebsiteScraping }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>("calendar");

  useEffect(() => {
    if (isPending) {
      setLoadingState("calendar");
    }

    if (isWebsiteScraping) {
      setLoadingState("website");
    }

    if (isSuccess) {
      setLoadingState("success");
    }

    if (isError) {
      setLoadingState("error");
    }
  }, [isPending, isSuccess, isError, isWebsiteScraping]);

  const handleIntegrate = () => {
    // Handle integration logic here
    setLoadingState("calendar");
  };

  const handleSkip = () => {
    // Handle skip logic here
    setLoadingState("website");
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Agent Setup</CardTitle>
            <CardDescription>Setting up your AI agent</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            {loadingState === "calendar" && (
              <>
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-center">
                  Setting up the Google calendar integration
                </p>
              </>
            )}
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
                  Something went wrong with Google integration.
                </p>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {loadingState === "success" && <Button>Go to Dashboard</Button>}
            {loadingState === "error" && (
              <div className="flex space-x-2">
                <Button onClick={handleIntegrate}>Integrate</Button>
                <Button variant="outline" onClick={handleSkip}>
                  Skip
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

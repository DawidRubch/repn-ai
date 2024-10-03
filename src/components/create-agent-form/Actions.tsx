import { UseFormReturn } from "react-hook-form";
import { ActionsForm } from "../../hooks/useCreateAgentForm";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../../trpc/client";
import { useEffect, useState } from "react";

export const Actions = ({ form }: { form: UseFormReturn<ActionsForm> }) => {
  const router = useRouter();
  const { mutateAsync } = trpc.calendar.oauth.useMutation();
  const { mutateAsync: insertTokens, isPending } =
    trpc.calendar.insertTokens.useMutation();
  const queryParams = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const code = queryParams.get("code");
  const error = queryParams.get("error");

  const handleGoogleOAuth = () => {
    mutateAsync().then((data) => {
      console.log(data);
      router.push(data.url);
    });
  };

  useEffect(() => {
    if (code) {
      insertTokens({ code: code }).then((data) => {
        console.log(data);
        setIsSuccess(true);
      });
    }
  }, [code]);

  useEffect(() => {
    if (error) {
      console.log(error);
      setIsError(true);
    }
  }, [error]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Actions</h2>
      {isError && (
        <div>
          <p>Something went wrong. Please try connecting again.</p>
          <Button onClick={handleGoogleOAuth}>Reconnect Google Calendar</Button>
        </div>
      )}
      {isSuccess && (
        <div>
          <p>Successfully connected!</p>
        </div>
      )}
      {!isError && !isSuccess && (
        <Button onClick={handleGoogleOAuth}>Connect Google Calendar</Button>
      )}
    </div>
  );
};

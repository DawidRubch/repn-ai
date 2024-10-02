import { UseFormReturn } from "react-hook-form";
import { ActionsForm } from "../../hooks/useCreateAgentForm";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../../trpc/client";
import { useEffect } from "react";

export const Actions = ({ form }: { form: UseFormReturn<ActionsForm> }) => {
  const router = useRouter();
  const { mutateAsync } = trpc.calendar.oauth.useMutation();
  const { mutateAsync: insertTokens, isPending } =
    trpc.calendar.insertTokens.useMutation();
  const queryParams = useSearchParams();
  const handleGoogleOAuth = () => {
    mutateAsync().then((data) => {
      console.log(data);
      router.push(data.url);
    });
  };

  const code = queryParams.get("code");

  useEffect(() => {
    if (code) {
      insertTokens({ code: code }).then((data) => {
        console.log(data);

        //TODO: redirect to the next step
      });
    }
  }, [code]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Actions</h2>
      <Button onClick={handleGoogleOAuth}>Connect Google Calendar</Button>
    </div>
  );
};

import { UseFormReturn } from "react-hook-form";
import { ActionsForm } from "../../hooks/useCreateAgentForm";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { trpc } from "../../trpc/client";

export const Actions = ({ form }: { form: UseFormReturn<ActionsForm> }) => {
  const router = useRouter();
  const { mutateAsync } = trpc.calendar.oauth.useMutation();
  const handleGoogleOAuth = () => {
    mutateAsync().then((data) => {
      console.log(data);
      router.push(data.url);
    });
  };

  return (
    <div>
      <h2>Actions</h2>
      <Button onClick={handleGoogleOAuth}>Connect Google Calendar</Button>
    </div>
  );
};

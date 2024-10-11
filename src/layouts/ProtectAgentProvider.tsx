import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { trpc } from "../trpc/client";
import { FullPageLoader } from "../components/FullPageLoader";

export const ProtectAgentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: agent, isLoading } = trpc.agent.getAgent.useQuery();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (agent && pathname.startsWith("/create-agent")) {
        router.push("/");
      } else if (!agent && pathname.startsWith("/update-agent")) {
        router.push("/");
      }
    }
  }, [agent, isLoading, pathname, router]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  return <>{children}</>;
};

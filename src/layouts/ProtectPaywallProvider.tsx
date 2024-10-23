"use client";

import { useEffect } from "react";
import { FullPageLoader } from "../components/FullPageLoader";
import { trpc } from "../trpc/client";
import { useRouter } from "next/navigation";

export const withPaywallProtection = (
  WrappedComponent: React.ComponentType
) => {
  return function ProtectPaywallProvider() {
    const { data: activeSubscription, isLoading } =
      trpc.stripe.activeSubscription.useQuery();

    const router = useRouter();

    useEffect(() => {
      if (activeSubscription === undefined) return;
      if (activeSubscription) return;
      router.push("/billing");
    }, [activeSubscription, router]);

    if (isLoading || activeSubscription === undefined)
      return <FullPageLoader />;

    return <WrappedComponent />;
  };
};

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Calendar, AlertTriangle, Loader2 } from "lucide-react";
import { trpc } from "../../trpc/client";
import { useRouter } from "next/navigation";
import { FullPageLoader } from "../../components/FullPageLoader";

export default function BillingPage() {
  const { data: activeSubscription, isLoading: subscriptionLoading } =
    trpc.stripe.activeSubscription.useQuery();

  if (subscriptionLoading) return <FullPageLoader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Billing</h1>
      {activeSubscription ? <BillingDetails /> : <UpgradePlan />}
    </div>
  );
}

const BillingDetails = () => {
  const { data: usage, isLoading: usageLoading } =
    trpc.stripe.getUsageForThisPeriod.useQuery();
  const router = useRouter();

  const { mutateAsync: createBillingSession } =
    trpc.stripe.createBillingSession.useMutation({
      onSuccess: (data) => {
        if (data.url) {
          router.push(data.url);
        }
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const handleOpenStripePortal = () => {
    createBillingSession();
  };

  if (usageLoading) return <div>Loading...</div>;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Billing Summary</CardTitle>
          <CardDescription>Current billing cycle usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>Minutes used</span>
              </div>
              <span className="font-semibold">{usage?.minutes || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>Meetings booked</span>
              </div>
              <span className="font-semibold">{usage?.meetings || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Manage Subscription</CardTitle>
          <CardDescription>Access your billing portal</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleOpenStripePortal} className="w-full">
            Billing Portal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const UpgradePlan = () => {
  const { mutateAsync: createSetupIntent, isPending } =
    trpc.stripe.createSetupIntent.useMutation();

  const router = useRouter();

  const handleOpenStripePortal = () => {
    createSetupIntent().then((data) => {
      if (data.url) {
        router.push(data.url);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrade Your Plan</CardTitle>
        <CardDescription>Get access to premium features</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <p className="text-sm text-muted-foreground">
            You currently don't have an active subscription
          </p>
        </div>
        <Button
          onClick={handleOpenStripePortal}
          className="w-full"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isPending ? "Loading..." : "Upgrade Now"}
        </Button>
      </CardContent>
    </Card>
  );
};

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Clock,
  Calendar,
  AlertTriangle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { trpc } from "../../trpc/client";
import { useRouter } from "next/navigation";
import { FullPageLoader } from "../../components/FullPageLoader";
import { Progress } from "../../components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { useState } from "react";
import { Input } from "../../components/ui/input";

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

function BillingDetails() {
  const { data: usage, isLoading: usageLoading } =
    trpc.stripe.getUsageForThisPeriod.useQuery();
  const { data: billingThreshold, isLoading: billingThresholdLoading } =
    trpc.stripe.billingThreshold.useQuery();
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

  if (usageLoading || billingThresholdLoading || !usage || !billingThreshold)
    return <div>Loading...</div>;

  const totalUsage = (usage?.minutes || 0) + (usage?.meetings || 0);
  const usagePercentage =
    billingThreshold && billingThreshold?.billingThreshold > 0
      ? (totalUsage / billingThreshold.billingThreshold) * 100
      : 0;

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
      <BillingMaximum
        usagePercentage={usagePercentage}
        totalUsage={totalUsage}
      />
      {billingThreshold && billingThreshold.billingThreshold > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Billing Threshold</CardTitle>
            <CardDescription>Automatic payment trigger</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Threshold amount:</span>
              <span className="font-semibold">
                ${billingThreshold.billingThreshold}
              </span>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

export function BillingMaximum({
  usagePercentage,
  totalUsage,
}: {
  usagePercentage: number;
  totalUsage: number;
}) {
  const { data: billingThreshold, isLoading: billingThresholdLoading } =
    trpc.stripe.billingThreshold.useQuery();

  const [newThreshold, setNewThreshold] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutateAsync: setBillingThreshold } =
    trpc.stripe.setBillingThreshold.useMutation({
      onSuccess: () => {
        setIsDialogOpen(false);
        setNewThreshold("");
      },
    });

  if (billingThresholdLoading) return <div>Loading...</div>;

  const onUpdateBillingThreshold = (value: number) => {
    setBillingThreshold({ billingThreshold: value });
  };

  const handleSetThreshold = () => {
    const value = parseInt(newThreshold, 10);
    if (!isNaN(value) && value > 0) {
      onUpdateBillingThreshold(value);
    }
  };

  const handleRemoveThreshold = () => {
    onUpdateBillingThreshold(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Maximum</CardTitle>
        <CardDescription>
          {billingThreshold && billingThreshold.billingThreshold > 0
            ? `Usage limit: ${billingThreshold.billingThreshold}`
            : "No maximum set"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {billingThreshold && billingThreshold.billingThreshold > 0 ? (
          <>
            <div className="space-y-2">
              <Progress value={usagePercentage} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Current usage: {totalUsage}</span>
                <span>{usagePercentage.toFixed(1)}%</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Upgrade</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upgrade Billing Threshold</DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="New threshold"
                      value={newThreshold}
                      onChange={(e) => setNewThreshold(e.target.value)}
                    />
                    <Button onClick={handleSetThreshold}>Set</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="destructive" onClick={handleRemoveThreshold}>
                Remove
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center text-muted-foreground">
              <AlertCircle className="mr-2 h-5 w-5" />
              <span>Billing maximum is turned off</span>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Set Billing Threshold</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Billing Threshold</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="New threshold"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(e.target.value)}
                  />
                  <Button onClick={handleSetThreshold}>Set</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

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

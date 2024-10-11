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
import { useQueryClient } from "@tanstack/react-query";

interface BillingInfo {
  billingLimit: number;
  percentageUsed: number;
  budgetUsed: number;
}

interface Usage {
  minutes: number;
}

interface BillingThresholdResponse {
  billingLimit: number;
}

export default function BillingPage() {
  const { data: activeSubscription, isLoading: subscriptionLoading } =
    trpc.stripe.activeSubscription.useQuery();
  const { data: usage, isLoading: usageLoading } =
    trpc.stripe.getUsageForThisPeriod.useQuery<Usage>();
  const {
    data: billingInfo,
    isLoading: billingInfoLoading,
    refetch,
    isRefetching: billingInfoRefetching,
  } = trpc.stripe.billingInfo.useQuery<BillingInfo>();

  const setBillingThreshold =
    trpc.stripe.setBillingThreshold.useMutation<BillingThresholdResponse>({
      onSuccess: (data) => {
        refetch();
      },
    });

  const isLoading =
    subscriptionLoading ||
    usageLoading ||
    billingInfoLoading ||
    billingInfoRefetching ||
    setBillingThreshold.isPending;

  if (isLoading) return <FullPageLoader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Billing</h1>
      {activeSubscription ? (
        <BillingDetails
          usage={usage}
          billingInfo={billingInfo}
          setBillingThreshold={setBillingThreshold}
        />
      ) : (
        <UpgradePlan />
      )}
    </div>
  );
}

interface BillingDetailsProps {
  usage: Usage | undefined;
  billingInfo: BillingInfo | undefined;
  setBillingThreshold: ReturnType<
    typeof trpc.stripe.setBillingThreshold.useMutation
  >;
}

function BillingDetails({
  usage,
  billingInfo,
  setBillingThreshold,
}: BillingDetailsProps) {
  const router = useRouter();
  const [newThreshold, setNewThreshold] = useState<number>(
    billingInfo?.billingLimit || 0
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutateAsync } = trpc.stripe.createBillingSession.useMutation();

  const handleOpenStripePortal = () => {
    mutateAsync().then((data) => {
      if (data.url) {
        router.push(data.url);
      }
    });
  };

  const handleSetThreshold = () => {
    if (!isNaN(newThreshold) && newThreshold > 0) {
      setBillingThreshold.mutate(
        { billingThreshold: newThreshold },
        {
          onSuccess: ({ billingLimit }: BillingThresholdResponse) => {
            setIsDialogOpen(false);
            setNewThreshold(billingLimit);
          },
        }
      );
    }
  };

  const handleRemoveThreshold = () => {
    setBillingThreshold.mutate(
      { billingThreshold: 0 },
      {
        onSuccess: ({ billingLimit }: BillingThresholdResponse) => {
          setNewThreshold(billingLimit);
        },
      }
    );
  };

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
        billingInfo={billingInfo}
        newThreshold={newThreshold}
        setNewThreshold={setNewThreshold}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        handleSetThreshold={handleSetThreshold}
        handleRemoveThreshold={handleRemoveThreshold}
      />
    </div>
  );
}

interface BillingMaximumProps {
  billingInfo: BillingInfo | undefined;
  newThreshold: number;
  setNewThreshold: React.Dispatch<React.SetStateAction<number>>;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSetThreshold: () => void;
  handleRemoveThreshold: () => void;
}

function BillingMaximum({
  billingInfo,
  newThreshold,
  setNewThreshold,
  isDialogOpen,
  setIsDialogOpen,
  handleSetThreshold,
  handleRemoveThreshold,
}: BillingMaximumProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Maximum</CardTitle>
        <CardDescription>
          {billingInfo?.billingLimit && billingInfo?.billingLimit > 0
            ? `Usage limit: ${billingInfo.billingLimit}$`
            : "No maximum set"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {billingInfo?.billingLimit && billingInfo?.billingLimit > 0 ? (
          <>
            <div className="space-y-2">
              <Progress value={billingInfo.percentageUsed} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Current usage: ${billingInfo.budgetUsed}</span>
                <span>{billingInfo.percentageUsed.toFixed(1)}%</span>
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
                      min={0}
                      onChange={(e) =>
                        setNewThreshold(parseInt(e.target.value))
                      }
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
                    min={0}
                    onChange={(e) => setNewThreshold(parseInt(e.target.value))}
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

function UpgradePlan() {
  const router = useRouter();

  const { mutateAsync, isPending } =
    trpc.stripe.createSetupIntent.useMutation();

  const handleOpenStripePortal = () => {
    mutateAsync().then((data) => {
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
}

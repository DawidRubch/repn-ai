"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";
import { trpc } from "../trpc/client";

export function BillingPageComponent() {
  const [minutes, setMinutes] = useState(120); // Example value
  const [meetings, setMeetings] = useState(5); // Example value

  const handleOpenStripePortal = async () => {
    // This function would typically make an API call to your backend
    // to create a Stripe Billing Portal session and redirect the user
    console.log("Opening Stripe Billing Portal");
  };

  const openCheckout = () => {
    window.open("https://buy.stripe.com/test_14k5l6g5m5s13g2eU8", "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {" "}
      <h1 className="text-3xl font-bold mb-8">Billing</h1>
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
                <span className="font-semibold">{minutes}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>Meetings booked</span>
                </div>
                <span className="font-semibold">{meetings}</span>
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
            <Button onClick={openCheckout} className="w-full">
              Billing Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

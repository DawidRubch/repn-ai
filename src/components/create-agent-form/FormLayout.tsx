"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  AGENT_STEPS,
  useCreateAgentForm,
} from "../../hooks/useCreateAgentForm";

export const FormLayout: React.FC<{
  children: React.ReactNode;
  onSubmit: () => void;
  onPrevStep: () => void;
}> = ({ children, onSubmit, onPrevStep }) => {
  const { createAgent, nextStep, createAgentStep } = useCreateAgentForm();

  const handlePrevStep = () => {
    onPrevStep();
  };

  const handleNextStep = () => {
    onSubmit();
  };

  return (
    <Card className="w-full mx-auto bg-black text-white border-zinc-800">
      <CardHeader>
        <CardTitle>Create Agent</CardTitle>
        <CardDescription className="text-zinc-400">
          Set up your new AI agent in just a few steps.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            {AGENT_STEPS.map((step, index) => (
              <div
                key={step}
                className={`w-1/4 h-2 rounded-full ${
                  index <= AGENT_STEPS.indexOf(createAgentStep)
                    ? "bg-blue-500"
                    : "bg-zinc-700"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Identity</span>
            <span>Behaviour</span>
            <span>Knowledge</span>
            <span>Actions</span>
          </div>
        </div>
        {children}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevStep}
          disabled={createAgentStep === AGENT_STEPS[0]}
          className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button
          onClick={
            createAgentStep === AGENT_STEPS[3] ? createAgent : handleNextStep
          }
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {createAgentStep === AGENT_STEPS[3] ? "Create Agent" : "Next"}{" "}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

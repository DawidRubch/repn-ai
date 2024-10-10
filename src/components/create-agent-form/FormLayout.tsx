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
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAgentForm } from "../../hooks/useAgentForm";
import { AGENT_STEPS, AgentStep } from "../../hooks/useAgentStore";

export const CreateAgentFormLayout: React.FC<{
  children: React.ReactNode;
  onSubmit: () => void;
  onPrevStep: () => void;
}> = ({ children, onSubmit, onPrevStep }) => {
  const { agentFormStep, isSettingUpAgent } = useAgentForm();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (!pathName.includes(agentFormStep)) {
      router.push(`/create-agent/${agentFormStep}`);
    }
  }, [agentFormStep]);

  const handlePrevStep = () => {
    onPrevStep();
  };

  return (
    <FormLayoutComponent
      currentStep={agentFormStep}
      isSettingUpAgent={isSettingUpAgent}
      onSubmit={onSubmit}
      onPrevStep={handlePrevStep}
    >
      {children}
    </FormLayoutComponent>
  );
};

export const UpdateAgentFormLayout: React.FC<{
  children: React.ReactNode;
  onSubmit: () => void;
  onPrevStep: () => void;
}> = ({ children, onSubmit, onPrevStep }) => {
  const { agentFormStep, isSettingUpAgent } = useAgentForm();
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathName.includes(agentFormStep)) {
      router.push(`/update-agent/${agentFormStep}`);
    }
  }, [agentFormStep]);

  return (
    <FormLayoutComponent
      onSubmit={onSubmit}
      onPrevStep={onPrevStep}
      currentStep={agentFormStep}
      isSettingUpAgent={isSettingUpAgent}
    >
      {children}
    </FormLayoutComponent>
  );
};

const FormLayoutComponent: React.FC<{
  currentStep: AgentStep;
  children: React.ReactNode;
  isSettingUpAgent: boolean;
  onSubmit: () => void;
  onPrevStep: () => void;
}> = ({ currentStep, children, isSettingUpAgent, onSubmit, onPrevStep }) => {
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
                className={`w-1/3 h-2 rounded-full ${
                  index <= AGENT_STEPS.indexOf(currentStep)
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
            <span>Widget</span>
          </div>
        </div>
        {children}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevStep}
          disabled={currentStep === AGENT_STEPS[0]}
          className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button
          onClick={onSubmit}
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={isSettingUpAgent}
        >
          {isSettingUpAgent ? <Loader2 className="w-4 h-4 mr-2" /> : null}
          {currentStep === "widget" ? `Finish` : "Next"}{" "}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

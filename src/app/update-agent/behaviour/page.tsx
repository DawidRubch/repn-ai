"use client";

import { useRouter } from "next/navigation";

import { BehaviourForm, useAgentForm } from "../../../hooks/useAgentForm";
import { UpdateAgentFormLayout } from "../../../components/create-agent-form/FormLayout";
import { Behaviour } from "../../../components/create-agent-form/Behaviour";
import { trpc } from "../../../trpc/client";
import { useEffect } from "react";
import { FullPageLoader } from "../../../components/FullPageLoader";

export default function BehaviourPage() {
  const { behaviourForm, setFormValues, nextStep, prevStep } = useAgentForm();
  const { push } = useRouter();
  const { data, isLoading } = trpc.agent.getBehaviour.useQuery();
  const onSubmit = (data: BehaviourForm) => {
    setFormValues({ behaviour: data });
    nextStep();
    push("/create-agent/knowledge");
  };

  const onPrevStep = () => {
    prevStep();
    push("/create-agent/identity");
  };

  useEffect(() => {
    if (data) {
      behaviourForm.reset({
        greeting: data.greeting,
        introduction: data.instructions,
      });
    }
  }, [data]);

  if (isLoading) return <FullPageLoader />;

  return (
    <UpdateAgentFormLayout
      onSubmit={behaviourForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Behaviour form={behaviourForm} />
    </UpdateAgentFormLayout>
  );
}

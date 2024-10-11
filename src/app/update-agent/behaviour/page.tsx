"use client";

import { useRouter } from "next/navigation";

import { BehaviourForm, useAgentForm } from "../../../hooks/useAgentForm";
import { UpdateAgentFormLayout } from "../../../components/create-agent-form/FormLayout";
import { Behaviour } from "../../../components/create-agent-form/Behaviour";
import { trpc } from "../../../trpc/client";
import { FullPageLoader } from "../../../components/FullPageLoader";

export default function BehaviourPage() {
  const { behaviourForm, setFormValues, nextStep, prevStep } = useAgentForm();
  const { push } = useRouter();
  const onSubmit = (data: BehaviourForm) => {
    setFormValues({ behaviour: data });
    nextStep();
    push("/update-agent/knowledge");
  };

  const onPrevStep = () => {
    prevStep();
    push("/update-agent/identity");
  };

  return (
    <UpdateAgentFormLayout
      onSubmit={behaviourForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Behaviour form={behaviourForm} />
    </UpdateAgentFormLayout>
  );
}

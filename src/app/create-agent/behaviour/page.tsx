"use client";

import { useRouter } from "next/navigation";
import { Behaviour } from "../../../components/create-agent-form/Behaviour";
import { CreateAgentFormLayout } from "../../../components/create-agent-form/FormLayout";
import { BehaviourForm, useAgentForm } from "../../../hooks/useAgentForm";
import { usePreventReload } from "../../../hooks/usePreventReload";

export default function BehaviourPage() {
  usePreventReload();
  const { behaviourForm, setFormValues, nextStep, prevStep } = useAgentForm();
  const { push } = useRouter();

  const onSubmit = (data: BehaviourForm) => {
    setFormValues({ behaviour: data });
    nextStep();
    push("/create-agent/knowledge");
  };

  const onPrevStep = () => {
    prevStep();
    push("/create-agent/identity");
  };

  return (
    <CreateAgentFormLayout
      onSubmit={behaviourForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Behaviour form={behaviourForm} />
    </CreateAgentFormLayout>
  );
}

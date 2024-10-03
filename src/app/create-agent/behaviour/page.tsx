"use client";

import { useRouter } from "next/navigation";
import { Behaviour } from "../../../components/create-agent-form/Behaviour";
import { FormLayout } from "../../../components/create-agent-form/FormLayout";
import {
  BehaviourForm,
  useCreateAgentForm,
} from "../../../hooks/useCreateAgentForm";
import { usePreventReload } from "../../../hooks/usePreventReload";

export default function BehaviourPage() {
  usePreventReload();
  const { behaviourForm, setFormValues, nextStep, prevStep } =
    useCreateAgentForm();
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
    <FormLayout
      onSubmit={behaviourForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Behaviour form={behaviourForm} />
    </FormLayout>
  );
}

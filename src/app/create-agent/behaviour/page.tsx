"use client";

import { useRouter } from "next/navigation";
import { Behaviour } from "../../../components/create-agent-form/Behaviour";
import { FormLayout } from "../../../components/create-agent-form/FormLayout";
import {
  BehaviourForm,
  useCreateAgentForm,
} from "../../../hooks/useCreateAgentForm";

export default function BehaviourPage() {
  const { behaviourForm, setFormValues } = useCreateAgentForm();
  const { push } = useRouter();

  const onSubmit = (data: BehaviourForm) => {
    setFormValues({ behaviour: data });

    push("/create-agent/knowledge");
  };

  const onPrevStep = () => {
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

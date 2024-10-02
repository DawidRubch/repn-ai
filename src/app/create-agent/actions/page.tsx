"use client";

import { useRouter } from "next/navigation";
import { FormLayout } from "../../../components/create-agent-form/FormLayout";
import { Identity } from "../../../components/create-agent-form/Identity";
import {
  ActionsForm,
  IdentityForm,
  KnowledgeForm,
  useCreateAgentForm,
} from "../../../hooks/useCreateAgentForm";
import { Knowledge } from "../../../components/create-agent-form/Knowledge";
import { Actions } from "../../../components/create-agent-form/Actions";

export default function KnowledgePage() {
  const { actionsForm, setFormValues, nextStep, prevStep } =
    useCreateAgentForm();
  const { push } = useRouter();

  const onSubmit = (data: ActionsForm) => {
    setFormValues({ actions: data });

    //TODO: end
  };

  const onPrevStep = () => {
    prevStep();
    push("/create-agent/behaviour");
  };

  return (
    <FormLayout
      onSubmit={actionsForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Actions form={actionsForm} />
    </FormLayout>
  );
}

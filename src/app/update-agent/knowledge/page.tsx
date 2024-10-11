"use client";

import { useRouter } from "next/navigation";
import { UpdateAgentFormLayout } from "../../../components/create-agent-form/FormLayout";
import { Knowledge } from "../../../components/create-agent-form/Knowledge";
import { KnowledgeForm, useAgentForm } from "../../../hooks/useAgentForm";

export default function KnowledgePage() {
  const { knowledgeForm, setFormValues, nextStep, prevStep } = useAgentForm();
  const { push } = useRouter();

  const onSubmit = (data: KnowledgeForm) => {
    setFormValues({ knowledge: data });
    nextStep();

    push("/update-agent/widget");
  };

  const onPrevStep = () => {
    prevStep();
    push("/update-agent/behaviour");
  };

  return (
    <UpdateAgentFormLayout
      onSubmit={knowledgeForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Knowledge form={knowledgeForm} isOnUpdate />
    </UpdateAgentFormLayout>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { FormLayout } from "../../../components/create-agent-form/FormLayout";
import { Identity } from "../../../components/create-agent-form/Identity";
import {
  IdentityForm,
  KnowledgeForm,
  useCreateAgentForm,
} from "../../../hooks/useCreateAgentForm";
import { Knowledge } from "../../../components/create-agent-form/Knowledge";

export default function KnowledgePage() {
  const { knowledgeForm, setFormValues } = useCreateAgentForm();
  const { push } = useRouter();

  const onSubmit = (data: KnowledgeForm) => {
    setFormValues({ knowledge: data });

    push("/create-agent/actions");
  };

  const onPrevStep = () => {
    push("/create-agent/behaviour");
  };

  return (
    <FormLayout
      onSubmit={knowledgeForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Knowledge form={knowledgeForm} />
    </FormLayout>
  );
}

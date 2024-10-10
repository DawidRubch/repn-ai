"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FormLayout } from "../../../components/create-agent-form/FormLayout";
import { Knowledge } from "../../../components/create-agent-form/Knowledge";
import {
  KnowledgeForm,
  useCreateAgentForm,
} from "../../../hooks/useCreateAgentForm";

export default function KnowledgePage() {
  const { knowledgeForm, setFormValues, nextStep, prevStep } =
    useCreateAgentForm();
  const { push } = useRouter();

  const onSubmit = (data: KnowledgeForm) => {
    setFormValues({ knowledge: data });
    nextStep();

    push("/create-agent/widget");
  };

  const onPrevStep = () => {
    prevStep();
    push("/create-agent/behaviour");
  };

  useEffect(() => {
    const subscription = knowledgeForm.watch((data) => {
      setFormValues({ knowledge: data as KnowledgeForm });
    });
    return () => subscription.unsubscribe();
  }, [knowledgeForm, setFormValues]);

  return (
    <FormLayout
      onSubmit={knowledgeForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Knowledge form={knowledgeForm} />
    </FormLayout>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CreateAgentFormLayout } from "../../../components/create-agent-form/FormLayout";
import { Knowledge } from "../../../components/create-agent-form/Knowledge";
import { KnowledgeForm, useAgentForm } from "../../../hooks/useAgentForm";
import { trpc } from "../../../trpc/client";

export default function KnowledgePage() {
  const { knowledgeForm, setFormValues, nextStep, prevStep } = useAgentForm();
  const { push } = useRouter();
  const { data, isLoading } = trpc.agent.getKnowledge.useQuery();

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

  useEffect(() => {
    if (data) {
      knowledgeForm.reset({
        criticalKnowledge: data.criticalKnowledge,
        onlyAnwserFromKnowledge: data.answerOnlyFromCriticalKnowledge,
        websites: (data.websites || []).map((url) => ({ url })),
      });
    }
  }, [data]);

  return (
    <CreateAgentFormLayout
      onSubmit={knowledgeForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Knowledge form={knowledgeForm} />
    </CreateAgentFormLayout>
  );
}

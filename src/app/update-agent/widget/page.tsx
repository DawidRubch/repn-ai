"use client";

import { useRouter } from "next/navigation";
import { UpdateAgentFormLayout } from "../../../components/create-agent-form/FormLayout";
import { Widget } from "../../../components/create-agent-form/Widget";
import { useAgentForm, WidgetForm } from "../../../hooks/useAgentForm";
import { trpc } from "../../../trpc/client";
import { FullPageLoader } from "../../../components/FullPageLoader";
import { useEffect } from "react";

export default function WidgetPage() {
  const { widgetForm, setFormValues, nextStep, prevStep, createAgent } =
    useAgentForm();
  const { push } = useRouter();
  const { data, isLoading } = trpc.agent.getWidget.useQuery();

  const onSubmit = async (data: WidgetForm) => {
    setFormValues({ widget: data });

    createAgent().then((id) => {
      push(`/updating`);
    });
  };

  const onPrevStep = () => {
    prevStep();
    push("/update-agent/knowledge");
  };

  useEffect(() => {
    if (data) {
      const introMessage = data.introMessage || "";
      widgetForm.reset({
        showIntroMessage: introMessage.length > 0,
        introMessage,
        position: data.position as "right" | "left" | undefined,
        calendlyURL: data.calendlyUrl,
      });
    }
  }, [data]);

  if (isLoading) return <FullPageLoader />;

  return (
    <UpdateAgentFormLayout
      onSubmit={widgetForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Widget form={widgetForm} />
    </UpdateAgentFormLayout>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { CreateAgentFormLayout } from "../../../components/create-agent-form/FormLayout";
import { useAgentForm, WidgetForm } from "../../../hooks/useAgentForm";
import { Widget } from "../../../components/create-agent-form/Widget";

export default function WidgetPage() {
  const { widgetForm, setFormValues, nextStep, prevStep, createAgent } =
    useAgentForm();
  const { push } = useRouter();

  const onSubmit = async (data: WidgetForm) => {
    setFormValues({ widget: data });

    createAgent().then((id) => {
      push(`/creating?id=${id}`);
    });
  };

  const onPrevStep = () => {
    prevStep();
    push("/create-agent/knowledge");
  };

  return (
    <CreateAgentFormLayout
      onSubmit={widgetForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Widget form={widgetForm} />
    </CreateAgentFormLayout>
  );
}

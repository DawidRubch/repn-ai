"use client";

import { useRouter } from "next/navigation";
import { FormLayout } from "../../../components/create-agent-form/FormLayout";
import {
  useCreateAgentForm,
  WidgetForm,
} from "../../../hooks/useCreateAgentForm";
import { Widget } from "../../../components/create-agent-form/Widget";

export default function WidgetPage() {
  const { widgetForm, setFormValues, nextStep, prevStep } =
    useCreateAgentForm();
  const { push } = useRouter();

  const onSubmit = (data: WidgetForm) => {
    setFormValues({ widget: data });
    nextStep();
  };

  const onPrevStep = () => {
    prevStep();
    push("/create-agent/knowledge");
  };

  return (
    <FormLayout
      onSubmit={widgetForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Widget form={widgetForm} />
    </FormLayout>
  );
}

"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { UpdateAgentFormLayout } from "../../../components/create-agent-form/FormLayout";
import { Widget } from "../../../components/create-agent-form/Widget";
import { useAgentForm, WidgetForm } from "../../../hooks/useAgentForm";
import { useAgentFormStore } from "../../../hooks/useAgentStore";

export default function WidgetPage() {
  const { widgetForm, setFormValues, prevStep, updateAgent } = useAgentForm();
  const resetStore = useAgentFormStore((state) => state.resetStore);
  const { push } = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: WidgetForm) => {
    setFormValues({ widget: data });

    updateAgent().then(() => {
      toast({
        title: "Widget updated",
        description: "Your widget has been updated successfully",
      });
      resetStore();
      push("/dashboard");
    });
  };

  const onPrevStep = () => {
    prevStep();
    push("/update-agent/knowledge");
  };

  return (
    <UpdateAgentFormLayout
      onSubmit={widgetForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Widget form={widgetForm} />
    </UpdateAgentFormLayout>
  );
}

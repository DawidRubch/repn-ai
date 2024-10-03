"use client";

import { useRouter } from "next/navigation";
import { FormLayout } from "../../../components/create-agent-form/FormLayout";
import { Identity } from "../../../components/create-agent-form/Identity";
import {
  IdentityForm,
  useCreateAgentForm,
} from "../../../hooks/useCreateAgentForm";
import { usePreventReload } from "../../../hooks/usePreventReload";

export default function IdentityPage() {
  usePreventReload();
  const { identityForm, setFormValues, nextStep, prevStep } =
    useCreateAgentForm();
  const { push } = useRouter();

  const onSubmit = (data: IdentityForm) => {
    setFormValues({ identity: data });
    nextStep();

    push("/create-agent/behaviour");
  };

  const onPrevStep = () => {
    prevStep();
    push("/create-agent/knowledge");
  };

  return (
    <FormLayout
      onSubmit={identityForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Identity form={identityForm} />
    </FormLayout>
  );
}

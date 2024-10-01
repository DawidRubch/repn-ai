"use client";

import { useRouter } from "next/navigation";
import { FormLayout } from "../../../components/create-agent-form/FormLayout";
import { Identity } from "../../../components/create-agent-form/Identity";
import {
  IdentityForm,
  useCreateAgentForm,
} from "../../../hooks/useCreateAgentForm";

export default function IdentityPage() {
  const { identityForm, setFormValues } = useCreateAgentForm();
  const { push } = useRouter();

  const onSubmit = (data: IdentityForm) => {
    setFormValues({ identity: data });

    push("/create-agent/behaviour");
  };

  const onPrevStep = () => {
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

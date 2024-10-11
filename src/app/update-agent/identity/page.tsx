"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UpdateAgentFormLayout } from "../../../components/create-agent-form/FormLayout";
import { Identity } from "../../../components/create-agent-form/Identity";
import { IdentityForm, useAgentForm } from "../../../hooks/useAgentForm";
import { useUploadFiles } from "../../../hooks/useUploadFiles";

export default function IdentityPage() {
  const { identityForm, setFormValues, nextStep, prevStep } = useAgentForm();
  const { push } = useRouter();
  const { uploadAvatar } = useUploadFiles();

  const avatar = identityForm.watch("avatar");

  const onSubmit = async (data: IdentityForm) => {
    if (data.avatar && !data.avatarURL) {
      const avatarURL = await uploadAvatar(data.avatar);
      setFormValues({ identity: { ...data, avatarURL } });
    } else {
      setFormValues({ identity: data });
    }
    nextStep();

    push("/update-agent/behaviour");
  };

  const onPrevStep = () => {
    prevStep();
    push("/update-agent/knowledge");
  };

  useEffect(() => {
    if (avatar) {
      identityForm.setValue("avatarURL", undefined);
    }
  }, [avatar]);

  return (
    <UpdateAgentFormLayout
      onSubmit={identityForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Identity form={identityForm} />
    </UpdateAgentFormLayout>
  );
}

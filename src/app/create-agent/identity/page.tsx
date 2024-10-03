"use client";

import { useRouter } from "next/navigation";
import { FormLayout } from "../../../components/create-agent-form/FormLayout";
import { Identity } from "../../../components/create-agent-form/Identity";
import {
  IdentityForm,
  useCreateAgentForm,
} from "../../../hooks/useCreateAgentForm";
import { usePreventReload } from "../../../hooks/usePreventReload";
import { useUploadFiles } from "../../../hooks/useUploadFiles";
import { useEffect } from "react";

export default function IdentityPage() {
  usePreventReload();
  const { identityForm, setFormValues, nextStep, prevStep } =
    useCreateAgentForm();
  const { push } = useRouter();
  const { uploadAvatar } = useUploadFiles();

  const avatar = identityForm.watch("avatar");

  const onSubmit = async (data: IdentityForm) => {
    if (data.avatar && !data.avatarURL) {
      const avatarURL = await uploadAvatar(data.avatar);
      setFormValues({ identity: { ...data, avatarURL } });
    }
    nextStep();

    push("/create-agent/behaviour");
  };

  const onPrevStep = () => {
    prevStep();
    push("/create-agent/knowledge");
  };

  useEffect(() => {
    if (avatar) {
      identityForm.setValue("avatarURL", undefined);
    }
  }, [avatar]);

  return (
    <FormLayout
      onSubmit={identityForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Identity form={identityForm} />
    </FormLayout>
  );
}

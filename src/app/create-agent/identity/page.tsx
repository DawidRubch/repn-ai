"use client";

import { useRouter } from "next/navigation";
import { CreateAgentFormLayout } from "../../../components/create-agent-form/FormLayout";
import { Identity } from "../../../components/create-agent-form/Identity";
import { IdentityForm, useAgentForm } from "../../../hooks/useAgentForm";
import { usePreventReload } from "../../../hooks/usePreventReload";
import { useUploadFiles } from "../../../hooks/useUploadFiles";
import { useEffect } from "react";
import { withPaywallProtection } from "../../../layouts/ProtectPaywallProvider";

function IdentityPage() {
  usePreventReload();
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
    <CreateAgentFormLayout
      onSubmit={identityForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Identity form={identityForm} />
    </CreateAgentFormLayout>
  );
}

export default withPaywallProtection(IdentityPage);

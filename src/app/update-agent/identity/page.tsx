"use client";

import { useRouter } from "next/navigation";
import { CreateAgentFormLayout } from "../../../components/create-agent-form/FormLayout";
import { Identity } from "../../../components/create-agent-form/Identity";
import { IdentityForm, useAgentForm } from "../../../hooks/useAgentForm";
import { usePreventReload } from "../../../hooks/usePreventReload";
import { useUploadFiles } from "../../../hooks/useUploadFiles";
import { useEffect } from "react";
import { trpc } from "../../../trpc/client";
import { FullPageLoader } from "../../../components/FullPageLoader";

export default function IdentityPage() {
  const { identityForm, setFormValues, nextStep, prevStep } = useAgentForm();
  const { push } = useRouter();
  const { uploadAvatar } = useUploadFiles();

  const avatar = identityForm.watch("avatar");

  const { data, isLoading } = trpc.agent.getIdentity.useQuery(undefined);

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

  useEffect(() => {
    if (data) {
      identityForm.setValue("name", data.displayName);
      identityForm.setValue("avatarURL", data.avatarPhotoUrl ?? undefined);
      identityForm.setValue("voice", data.voice);
    }
  }, [data]);

  if (!data || isLoading) {
    return <FullPageLoader />;
  }

  return (
    <CreateAgentFormLayout
      onSubmit={identityForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Identity form={identityForm} />
    </CreateAgentFormLayout>
  );
}

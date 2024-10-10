"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UpdateAgentFormLayout } from "../../../components/create-agent-form/FormLayout";
import { Identity } from "../../../components/create-agent-form/Identity";
import { FullPageLoader } from "../../../components/FullPageLoader";
import { IdentityForm, useAgentForm } from "../../../hooks/useAgentForm";
import { useAgentFormStore } from "../../../hooks/useAgentStore";
import { useUploadFiles } from "../../../hooks/useUploadFiles";
import { trpc } from "../../../trpc/client";

export default function IdentityPage() {
  const { identityForm, setFormValues, nextStep, prevStep } = useAgentForm();
  const setAvatarPreview = useAgentFormStore((state) => state.setAvatarPreview);
  const { push } = useRouter();
  const { uploadAvatar } = useUploadFiles();

  const avatar = identityForm.watch("avatar");

  const { data, isLoading } = trpc.agent.getIdentity.useQuery();

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

  useEffect(() => {
    if (data) {
      console.log("Trigger data update");
      identityForm.reset({
        name: data.displayName,
        avatarURL: data.avatarPhotoUrl ?? undefined,
        voice: data.voice,
        avatar: null,
      });

      setAvatarPreview(data.avatarPhotoUrl);
      setFormValues({
        identity: {
          name: data.displayName,
          avatarURL: data.avatarPhotoUrl ?? undefined,
          voice: data.voice,
          avatar: null,
        },
      });
    }
  }, [data]);

  const voice = identityForm.watch("voice");

  useEffect(() => {
    console.log({ voice });
  }, [voice]);

  if (!data || isLoading) {
    return <FullPageLoader />;
  }

  return (
    <UpdateAgentFormLayout
      onSubmit={identityForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Identity form={identityForm} />
    </UpdateAgentFormLayout>
  );
}

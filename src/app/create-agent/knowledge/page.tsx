"use client";

import { useRouter } from "next/navigation";
import { FormLayout } from "../../../components/create-agent-form/FormLayout";
import { Identity } from "../../../components/create-agent-form/Identity";
import {
  IdentityForm,
  KnowledgeForm,
  useCreateAgentForm,
} from "../../../hooks/useCreateAgentForm";
import { Knowledge } from "../../../components/create-agent-form/Knowledge";
import { useEffect, useState } from "react";
import { usePreventReload } from "../../../hooks/usePreventReload";
import { useUploadFiles } from "../../../hooks/useUploadFiles";
import { CalendarIntegrationModal } from "../../../components/create-agent-form/CalendarIntegrationModal";
import { trpc } from "../../../trpc/client";

export default function KnowledgePage() {
  usePreventReload();
  const { knowledgeForm, setFormValues, nextStep, prevStep } =
    useCreateAgentForm();
  const { push } = useRouter();
  const { uploadFiles } = useUploadFiles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutateAsync: getOauthUrl } = trpc.calendar.oauth.useMutation();
  const router = useRouter();

  const onSubmit = (data: KnowledgeForm) => {
    setFormValues({ knowledge: data });
    setIsModalOpen(true);
  };

  const onPrevStep = () => {
    prevStep();
    push("/create-agent/behaviour");
  };

  useEffect(() => {
    const subscription = knowledgeForm.watch((data) => {
      setFormValues({ knowledge: data as KnowledgeForm });
    });
    return () => subscription.unsubscribe();
  }, [knowledgeForm, setFormValues]);

  const onIntegrateGoogleCal = async () => {
    const files = knowledgeForm.getValues("files");
    const fileUrls = await uploadFiles(files);

    setFormValues({ knowledge: { ...knowledgeForm.getValues(), fileUrls } });

    getOauthUrl().then((data) => {
      router.push(data.url);
    });
  };

  return (
    <FormLayout
      onSubmit={knowledgeForm.handleSubmit(onSubmit)}
      onPrevStep={onPrevStep}
    >
      <Knowledge form={knowledgeForm} />
      <CalendarIntegrationModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSkip={() => setIsModalOpen(false)}
        onIntegrate={onIntegrateGoogleCal}
      />
    </FormLayout>
  );
}

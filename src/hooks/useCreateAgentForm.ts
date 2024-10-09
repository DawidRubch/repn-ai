import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isValidUrl } from "../utils/validateURL";
import { useCreateAgentStore } from "./useCreateAgentStore";

const identityFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  voice: z.string().min(1, "Voice is required"),
  avatar: z.instanceof(File).nullable(),
  avatarURL: z.string().optional(),
});

export type IdentityForm = z.infer<typeof identityFormSchema>;

const behaviourFormSchema = z.object({
  greeting: z.string().min(1, "Greeting is required"),
  introduction: z.string().min(1, "Introduction is required"),
});

export type BehaviourForm = z.infer<typeof behaviourFormSchema>;
const knowledgeFormSchema = z.object({
  files: z.array(z.instanceof(File)),
  websites: z.array(
    z.object({
      url: z
        .string()
        .refine(
          isValidUrl,
          "Invalid URL. Make sure to include http:// or https://"
        ),
    })
  ),
  fileUrls: z.array(z.string()).optional(),
  onlyAnwserFromKnowledge: z.boolean().default(false),
});

export type KnowledgeForm = z.infer<typeof knowledgeFormSchema>;


const widgetFormSchema = z.object({
  calendlyURL: z.string().nullable(),
  introMessage: z.string().optional(),
  showIntroMessage: z.boolean(),
  position: z.enum(["right", "left"]),
});

export type WidgetForm = z.infer<typeof widgetFormSchema>;

const createAgentFormSchema = z.object({
  identity: identityFormSchema,
  behaviour: behaviourFormSchema,
  knowledge: knowledgeFormSchema,
  widget: widgetFormSchema,
});

export type CreateAgentForm = z.infer<typeof createAgentFormSchema>;

export const useCreateAgentForm = () => {
  const { createAgentStep, nextStep, prevStep, setFormValues, formValues } =
    useCreateAgentStore();

  const identityForm = useForm<IdentityForm>({
    resolver: zodResolver(identityFormSchema),
    defaultValues: formValues.identity,
  });

  const behaviourForm = useForm<BehaviourForm>({
    resolver: zodResolver(behaviourFormSchema),
    defaultValues: formValues.behaviour,
  });

  const knowledgeForm = useForm<KnowledgeForm>({
    resolver: zodResolver(knowledgeFormSchema),
    defaultValues: formValues.knowledge,
  });

  const widgetForm = useForm<WidgetForm>({
    resolver: zodResolver(widgetFormSchema),
    defaultValues: formValues.widget,
  });

  const createAgent = () => {
    const identity = identityForm.getValues();
    const behaviour = behaviourForm.getValues();
    const knowledge = knowledgeForm.getValues();
    const widget = widgetForm.getValues();
    const formValues = {
      identity,
      behaviour,
      knowledge,
      widget,
    };

  };

  return {
    createAgentStep,
    nextStep,
    prevStep,
    identityForm,
    behaviourForm,
    knowledgeForm,
    setFormValues,
    formValues,
    createAgent,
    widgetForm,
  };
};

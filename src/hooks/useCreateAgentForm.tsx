import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { create } from "zustand";

const identityFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  voice: z.string().min(1, "Voice is required"),
  avatar: z.string().min(1, "Avatar is required"),
});

export type IdentityForm = z.infer<typeof identityFormSchema>;

const behaviourFormSchema = z.object({
  greeting: z.string().min(1, "Greeting is required"),
  introduction: z.string().min(1, "Introduction is required"),
});

export type BehaviourForm = z.infer<typeof behaviourFormSchema>;

const knowledgeFormSchema = z.object({
  files: z.array(z.instanceof(File)),
  websites: z.array(z.string().url("Invalid URL")),
});

export type KnowledgeForm = z.infer<typeof knowledgeFormSchema>;

const actionsFormSchema = z.object({
  calendar: z.object({
    oauth: z.boolean(),
    calendarId: z.string(),
  }),
});

export type ActionsForm = z.infer<typeof actionsFormSchema>;

const createAgentFormSchema = z.object({
  identity: identityFormSchema,
  behaviour: behaviourFormSchema,
  knowledge: knowledgeFormSchema,
  actions: actionsFormSchema,
});

export type CreateAgentForm = z.infer<typeof createAgentFormSchema>;

type AgentStep = "identity" | "behaviour" | "knowledge" | "actions";

export const AGENT_STEPS: AgentStep[] = [
  "identity",
  "behaviour",
  "knowledge",
  "actions",
] as const;

type CreateAgentStore = {
  createAgentStep: AgentStep;
  setCreateAgentStep: (step: AgentStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  formValues: CreateAgentForm;
  setFormValues: (values: Partial<CreateAgentForm>) => void;
};

const DEFAULT_FORM_VALUES: CreateAgentForm = {
  identity: {
    name: "",
    voice: "",
    avatar: "",
  },
  behaviour: {
    greeting: "",
    introduction: "",
  },
  knowledge: {
    files: [],
    websites: [],
  },
  actions: {
    calendar: {
      oauth: false,
      calendarId: "",
    },
  },
};

const useCreateAgentStore = create<CreateAgentStore>((set) => ({
  createAgentStep: AGENT_STEPS[0],
  setCreateAgentStep: (step) => set({ createAgentStep: step }),
  nextStep: () =>
    set((state) => {
      const currentIndex = AGENT_STEPS.indexOf(state.createAgentStep);
      const nextIndex = (currentIndex + 1) % AGENT_STEPS.length;
      return { createAgentStep: AGENT_STEPS[nextIndex] };
    }),
  prevStep: () =>
    set((state) => {
      const currentIndex = AGENT_STEPS.indexOf(state.createAgentStep);
      const prevIndex =
        (currentIndex - 1 + AGENT_STEPS.length) % AGENT_STEPS.length;
      return { createAgentStep: AGENT_STEPS[prevIndex] };
    }),
  formValues: DEFAULT_FORM_VALUES,
  setFormValues: (values) =>
    set((state) => ({ formValues: { ...state.formValues, ...values } })),
}));

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

  const actionsForm = useForm<ActionsForm>({
    resolver: zodResolver(actionsFormSchema),
    defaultValues: formValues.actions,
  });

  const createAgent = () => {
    const identity = identityForm.getValues();
    const behaviour = behaviourForm.getValues();
    const knowledge = knowledgeForm.getValues();
    const actions = actionsForm.getValues();
    const formValues = {
      identity,
      behaviour,
      knowledge,
      actions,
    };

    console.log(formValues);
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
    actionsForm,
  };
};

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { create } from "zustand";

const identityFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
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

const createAgentFormSchema = z.object({
  identity: identityFormSchema,
  behaviour: behaviourFormSchema,
  knowledge: knowledgeFormSchema,
});

export type CreateAgentForm = z.infer<typeof createAgentFormSchema>;

type AgentStep = "identity" | "behaviour" | "knowledge";

const AGENT_STEPS: AgentStep[] = [
  "identity",
  "behaviour",
  "knowledge",
] as const;

type CreateAgentStore = {
  createAgentStep: AgentStep;
  setCreateAgentStep: (step: AgentStep) => void;
  nextStep: () => void;
  prevStep: () => void;
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
}));

export const useCreateAgentForm = () => {
  const { createAgentStep, nextStep, prevStep } = useCreateAgentStore();

  const identityForm = useForm<IdentityForm>({
    resolver: zodResolver(identityFormSchema),
  });

  const behaviourForm = useForm<BehaviourForm>({
    resolver: zodResolver(behaviourFormSchema),
  });

  const knowledgeForm = useForm<KnowledgeForm>({
    resolver: zodResolver(knowledgeFormSchema),
  });

  const form = useForm<CreateAgentForm>({
    resolver: zodResolver(createAgentFormSchema),
  });

  return {
    createAgentStep,
    nextStep,
    prevStep,
    identityForm,
    behaviourForm,
    knowledgeForm,
    form,
  };
};

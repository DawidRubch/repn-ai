import { create } from "zustand";
import { CreateAgentForm } from "./useCreateAgentForm";
import { createJSONStorage, persist } from "zustand/middleware";

export type AgentStep = "identity" | "behaviour" | "knowledge" | "widget";

export const AGENT_STEPS: AgentStep[] = [
  "identity",
  "behaviour",
  "knowledge",
  "widget"
] as const;

type CreateAgentStore = {
  createAgentStep: AgentStep;
  setCreateAgentStep: (step: AgentStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  formValues: CreateAgentForm;
  setFormValues: (values: Partial<CreateAgentForm>) => void;
  setAvatarPreview: (avatar: string) => void;
  avatarPreview: string | null;
};
const DEFAULT_FORM_VALUES: CreateAgentForm = {
  identity: {
    name: "",
    voice: "",
    avatar: null,
  },
  behaviour: {
    greeting: "",
    introduction: "",
  },
  knowledge: {
    files: [],
    websites: [],
    onlyAnwserFromKnowledge: false,
  },
  widget: {
    calendlyURL: null,
    introMessage: "",
    position: "right",
    showIntroMessage: false,
  },
};

export const useCreateAgentStore = create<CreateAgentStore>()(
  persist(
    (set) => ({
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
      setAvatarPreview: (avatar) => set({ avatarPreview: avatar }),
      avatarPreview: null,
    }),
    {
      name: "create-agent-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

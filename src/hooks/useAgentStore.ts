import { create } from "zustand";
import { AgentForm } from "./useAgentForm";
import { createJSONStorage, persist } from "zustand/middleware";

export type AgentStep = "identity" | "behaviour" | "knowledge" | "widget";

export const AGENT_STEPS: AgentStep[] = [
  "identity",
  "behaviour",
  "knowledge",
  "widget"
] as const;

type AgentFormStore = {
  agentFormStep: AgentStep;
  setAgentFormStep: (step: AgentStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  formValues: AgentForm;
  setFormValues: (values: Partial<AgentForm>) => void;
  setAvatarPreview: (avatar: string | null) => void;
  avatarPreview: string | null;
  agentId: string | null;
  setAgentId: (id: string) => void;
  apifyRunId: string | null;
  setApifyRunId: (id: string) => void;
  resetStore: () => void;
};

const DEFAULT_FORM_VALUES: AgentForm = {
  identity: {
    name: "",
    voice: "",
    avatar: null,
    avatarURL: undefined,
  },
  behaviour: {
    greeting: "",
    introduction: "",
  },
  knowledge: {
    websites: [],
    onlyAnwserFromKnowledge: false,
    criticalKnowledge: "",
  },
  widget: {
    calendlyURL: null,
    introMessage: "",
    position: "right",
    showIntroMessage: true,
  },
};

export const useAgentFormStore = create<AgentFormStore>()(
  persist(
    (set) => ({
      agentFormStep: AGENT_STEPS[0],
      setAgentFormStep: (step) => set({ agentFormStep: step }),
      nextStep: () =>
        set((state) => {
          const currentIndex = AGENT_STEPS.indexOf(state.agentFormStep);
          const nextIndex = (currentIndex + 1) % AGENT_STEPS.length;
          return { agentFormStep: AGENT_STEPS[nextIndex] };
        }),
      prevStep: () =>
        set((state) => {
          const currentIndex = AGENT_STEPS.indexOf(state.agentFormStep);
          const prevIndex =
            (currentIndex - 1 + AGENT_STEPS.length) % AGENT_STEPS.length;
          return { agentFormStep: AGENT_STEPS[prevIndex] };
        }),
      formValues: DEFAULT_FORM_VALUES,
      setFormValues: (values) =>
        set((state) => ({ formValues: { ...state.formValues, ...values } })),
      setAvatarPreview: (avatar) => set({ avatarPreview: avatar }),
      avatarPreview: null,
      agentId: null,
      setAgentId: (id) => set({ agentId: id }),
      apifyRunId: null,
      setApifyRunId: (id) => set({ apifyRunId: id }),
      resetStore: () => set({
        agentFormStep: AGENT_STEPS[0],
        formValues: DEFAULT_FORM_VALUES,
        avatarPreview: null,
        agentId: null,
        apifyRunId: null,
      }),
    }),
    {
      name: "agent-form-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

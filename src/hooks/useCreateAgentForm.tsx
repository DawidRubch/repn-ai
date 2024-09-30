import { useState } from "react";
import { z } from "zod";

const createAgentFormSchema = z.object({
  identity: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    avatar: z.string().min(1),
  }),
  behaviour: z.object({
    greeting: z.string().min(1),
    introduction: z.string().min(1),
  }),
  knowledge: z.object({
    files: z.array(z.instanceof(File)),
    websites: z.array(z.string().url()),
  }),
});

export const useCreateAgentForm = () => {
  const [createAgentStep, setCreateAgentStep] = useState(0);

  return {
    createAgentStep,
    setCreateAgentStep,
  };
};

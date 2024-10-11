import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../trpc/client";
import { isValidUrl } from "../utils/validateURL";
import { useAgentFormStore } from "./useAgentStore";
import { useState } from "react";

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
  criticalKnowledge: z.string().optional(),
  onlyAnwserFromKnowledge: z.boolean().default(false),
});

export type KnowledgeForm = z.infer<typeof knowledgeFormSchema>;


const widgetFormSchema = z.object({
  calendlyURL: z.string().nullable(),
  introMessage: z.string().optional(),
  showIntroMessage: z.boolean().default(true),
  position: z.enum(["right", "left"]).default("right"),
});

export type WidgetForm = z.infer<typeof widgetFormSchema>;

const createAgentFormSchema = z.object({
  identity: identityFormSchema,
  behaviour: behaviourFormSchema,
  knowledge: knowledgeFormSchema,
  widget: widgetFormSchema,
});

export type AgentForm = z.infer<typeof createAgentFormSchema>;

export const useAgentForm = () => {
  const { agentFormStep, nextStep, prevStep, setFormValues, formValues, setAgentId, setApifyRunId } =
    useAgentFormStore();
  const [isCreatingAgent, setIsCreatingAgent] = useState(false)

  const { mutateAsync: createAgentMutation, isPending: isAgentCreating } = trpc.agent.createAgent.useMutation()
  const { mutateAsync: scrapeWebsite, isPending: isScrapingWebsite, } = trpc.scrape.scrapeWebsite.useMutation()
  const { mutateAsync: updateAgentMutation, isPending: isUpdatingAgent } = trpc.agent.updateAgent.useMutation()

  const { data: currentAgent } = trpc.agent.getAgent.useQuery()
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

  const createAgent = async () => {
    setIsCreatingAgent(true)
    try {
      const identity = identityForm.getValues();
      const behaviour = behaviourForm.getValues();
      const knowledge = knowledgeForm.getValues();
      const widget = widgetForm.getValues();

      const agentID = await createAgentMutation({
        voice: identity.voice,
        displayName: identity.name,
        description: identity.name,
        greeting: behaviour.greeting,
        prompt: behaviour.introduction,
        criticalKnowledge: knowledge.criticalKnowledge || "",
        answerOnlyFromCriticalKnowledge: knowledge.onlyAnwserFromKnowledge,
        avatarPhotoUrl: identity.avatarURL,
        position: widget.position,
        introMessage: widget.introMessage,
        calendlyUrl: widget.calendlyURL || null,
      })

      if (knowledge.websites.length > 0) {
        const urls = knowledge.websites.map((website) => website.url);
        const apifyRunId = await scrapeWebsite({ urls, agentId: agentID });
        setApifyRunId(apifyRunId);
      }

      setIsCreatingAgent(false)

      setAgentId(agentID)

      return agentID;
    } catch (error) {
      console.error(error);
      setIsCreatingAgent(false);
    }
  };


  const updateAgent = async () => {
    const identity = identityForm.getValues();
    const behaviour = behaviourForm.getValues();
    const knowledge = knowledgeForm.getValues();
    const widget = widgetForm.getValues();

    if (!currentAgent?.id) return;


    await updateAgentMutation({
      id: currentAgent?.id,
      voice: identity.voice,
      displayName: identity.name,
      description: identity.name,
      greeting: behaviour.greeting,
      prompt: behaviour.introduction,
      position: widget.position,
      criticalKnowledge: knowledge.criticalKnowledge || "",
      answerOnlyFromCriticalKnowledge: knowledge.onlyAnwserFromKnowledge,
      calendlyUrl: widget.calendlyURL || null,
      avatarPhotoUrl: identity.avatarURL,
      introMessage: widget.introMessage,
    })


  }

  return {
    agentFormStep,
    nextStep,
    prevStep,
    identityForm,
    behaviourForm,
    knowledgeForm,
    setFormValues,
    formValues,
    createAgent,
    widgetForm,
    isSettingUpAgent: isCreatingAgent || isAgentCreating || isScrapingWebsite,
  };
};




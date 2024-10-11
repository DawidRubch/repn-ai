import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { KnowledgeForm } from "../../hooks/useAgentForm";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { WebsiteSelector } from "../WebsiteSelector";

const MAX_CHARACTERS = 30000;

type Props = {
  form: UseFormReturn<KnowledgeForm>;
  isOnUpdate?: boolean;
};

export function Knowledge({ form, isOnUpdate }: Props) {
  const [characterCount, setCharacterCount] = useState(0);

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="criticalKnowledge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Critical Knowledge</FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  {...field}
                  maxLength={MAX_CHARACTERS}
                  onChange={(e) => {
                    field.onChange(e);
                    setCharacterCount(e.target.value.length);
                  }}
                />
              </FormControl>
              <FormDescription className="text-right">
                {characterCount}/{MAX_CHARACTERS} characters
              </FormDescription>
            </FormItem>
          )}
        />
        {!isOnUpdate && <WebsiteSelector form={form} />}
        <FormField
          control={form.control}
          name="onlyAnwserFromKnowledge"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 border-zinc-700">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-white">
                  Only answer from knowledge
                </FormLabel>
                <FormDescription className="text-zinc-400">
                  When enabled, the agent will only answer questions based on
                  the provided knowledge.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

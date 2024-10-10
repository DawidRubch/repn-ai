import { useState } from "react";
import clsx from "clsx";
import { X } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { KnowledgeForm } from "../../hooks/useAgentForm";
import { MultiFileUpload } from "../MultiFileUpload";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const MAX_CHARACTERS = 30000;

export function Knowledge({ form }: { form: UseFormReturn<KnowledgeForm> }) {
  const { fields, append, remove } = useFieldArray<KnowledgeForm>({
    control: form.control,
    name: "websites",
  });

  const {
    formState: { errors },
  } = form;

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

        <FormField
          control={form.control}
          name="websites"
          render={() => (
            <FormItem>
              <FormLabel>Website URLs</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id}>
                      <div className="flex items-center space-x-2">
                        <Input
                          {...form.register(`websites.${index}.url`)}
                          placeholder="Enter website URL"
                          className={clsx(
                            "bg-zinc-900 border-zinc-700 text-white",
                            {
                              "border-red-500":
                                errors.websites && errors.websites[index],
                            }
                          )}
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="shrink-0 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {errors.websites && errors.websites[index] && (
                        <p className="text-sm text-red-500">
                          {errors.websites[index].url?.message}
                        </p>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ url: "" })}
                    className="mt-2 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    Add URL
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
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

import {
  KnowledgeForm,
  useCreateAgentForm,
} from "../../hooks/useCreateAgentForm";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { MultiFileUpload } from "../MultiFileUpload";
import clsx from "clsx";
import { Checkbox } from "../ui/checkbox";

export const Knowledge = ({ form }: { form: UseFormReturn<KnowledgeForm> }) => {
  const { fields, append, remove } = useFieldArray<KnowledgeForm>({
    control: form.control,
    name: "websites",
  });

  const {
    formState: { errors },
  } = form;

  return (
    <Form {...form}>
      <form className="space-y-8">
        <MultiFileUpload
          form={form}
          name="files"
          label="Custom Files"
          description="Upload custom files for the agent to use"
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
                    <>
                      <div
                        key={field.id}
                        className="flex items-center space-x-2"
                      >
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
                    </>
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
};

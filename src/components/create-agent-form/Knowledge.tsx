import {
  KnowledgeForm,
  useCreateAgentForm,
} from "../../hooks/useCreateAgentForm";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

export const Knowledge = ({ form }: { form: UseFormReturn<KnowledgeForm> }) => {
  const onSubmit = (data: KnowledgeForm) => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Files</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  className="bg-zinc-900 border-zinc-700 text-white"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.files);
                  }}
                  value={undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="websites"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URLs</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {field.value.map((url, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={url}
                        onChange={(e) => {
                          const newUrls = [...field.value];
                          newUrls[index] = e.target.value;
                          field.onChange(newUrls);
                        }}
                        placeholder="Enter website URL"
                        className="bg-zinc-900 border-zinc-700 text-white"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newUrls = field.value.filter(
                            (_, i) => i !== index
                          );
                          field.onChange(newUrls);
                        }}
                        className="shrink-0 text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      field.onChange([...field.value, ""]);
                    }}
                    className="mt-2 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    Add URL
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

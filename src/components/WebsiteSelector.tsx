import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import clsx from "clsx";
import { KnowledgeForm } from "../hooks/useAgentForm";

export const WebsiteSelector = ({
  form,
}: {
  form: UseFormReturn<KnowledgeForm>;
}) => {
  const { fields, append, remove } = useFieldArray<KnowledgeForm>({
    control: form.control,
    name: "websites",
  });

  const {
    formState: { errors },
  } = form;

  return (
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
  );
};

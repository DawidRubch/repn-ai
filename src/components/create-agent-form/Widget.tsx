import { UseFormReturn } from "react-hook-form";

import { Textarea } from "../ui/textarea";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { WidgetForm } from "../../hooks/useCreateAgentForm";
import { Checkbox } from "../ui/checkbox";

export function Widget({ form }: { form: UseFormReturn<WidgetForm> }) {
  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="showIntroMessage"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Show intro message</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {form.watch("showIntroMessage") && (
          <FormField
            control={form.control}
            name="introMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intro message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the agent's greeting message"
                    className="bg-zinc-900 border-zinc-700 text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Widget Position</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="left" />
                    </FormControl>
                    <FormLabel className="font-normal">Left</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="right" />
                    </FormControl>
                    <FormLabel className="font-normal">Right</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="calendlyURL"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calendly URL</FormLabel>
              <FormControl>
                <div className="flex flex-col space-y-2">
                  <Checkbox
                    checked={field.value !== null}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        field.onChange("");
                      } else {
                        field.onChange(null);
                      }
                    }}
                    id="show-calendar"
                  />
                  <label
                    htmlFor="show-calendar"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show calendar
                  </label>
                  {field.value !== null && (
                    <Input
                      placeholder="Enter your Calendly URL"
                      className="bg-zinc-900 border-zinc-700 text-white"
                      {...field}
                      value={field.value || ""}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

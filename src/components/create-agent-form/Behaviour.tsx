import { UseFormReturn } from "react-hook-form";
import {
  BehaviourForm,
  useCreateAgentForm,
} from "../../hooks/useCreateAgentForm";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

export const Behaviour = ({ form }: { form: UseFormReturn<BehaviourForm> }) => {
  const onSubmit = (data: BehaviourForm) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="greeting"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent Greeting</FormLabel>
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
        <FormField
          control={form.control}
          name="introduction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter instructions for the agent"
                  className="bg-zinc-900 border-zinc-700 text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

"use client";

import { UseFormReturn } from "react-hook-form";
import {
  IdentityForm,
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
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AvatarUploadField } from "../AvatarUpload";
import VoiceSelector from "../VoiceSelector";

export const Identity = ({ form }: { form: UseFormReturn<IdentityForm> }) => {
  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter agent name"
                  className="bg-zinc-900 border-zinc-700 text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <VoiceSelector control={form.control} name="voice" />
        <AvatarUploadField form={form} name="avatar" />
      </form>
    </Form>
  );
};

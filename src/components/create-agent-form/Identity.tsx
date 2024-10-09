"use client";

import { UseFormReturn } from "react-hook-form";
import { IdentityForm } from "../../hooks/useCreateAgentForm";
import { AvatarUploadField } from "../AvatarUpload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
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

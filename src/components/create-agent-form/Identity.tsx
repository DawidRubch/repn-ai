"use client";

import { FormProvider, UseFormReturn } from "react-hook-form";
import { IdentityForm } from "../../hooks/useAgentForm";
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
    <FormProvider {...form}>
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
        <VoiceSelector />
        <AvatarUploadField form={form} name="avatar" />
      </form>
    </FormProvider>
  );
};

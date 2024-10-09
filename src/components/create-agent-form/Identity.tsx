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
        <FormField
          control={form.control}
          name="voice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voice</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <AvatarUploadField form={form} name="avatar" />
      </form>
    </Form>
  );
};

const VOICESLIST = [
  {
    value:
      "s3://voice-cloning-zero-shot/f9bf96ae-19ef-491f-ae69-644448800566/original/manifest.json",
    label: "Adelaide (australian female)",
    audioPreviewURL:
      "https://parrot-samples.s3.amazonaws.com/gargamel/Adelaide.wav",
  },
  {
    value:
      "s3://voice-cloning-zero-shot/bb759cd0-edb0-43d9-8273-f0a7c048fb11/original/manifest.json",
    label: "Lachlan (australian male)",
    audioPreviewURL:
      "https://parrot-samples.s3.amazonaws.com/gargamel/Lachlan.wav",
  },
  {
    value:
      "s3://voice-cloning-zero-shot/34eaa933-62cb-4e32-adb8-c1723ef85097/original/manifest.json",
    label: "Amelia (british female)",
    audioPreviewURL:
      "https://parrot-samples.s3.amazonaws.com/gargamel/Amelia.wav",
  },
  {
    value:
      "s3://voice-cloning-zero-shot/aa753d26-bc20-479f-95af-5c3c1c970d93/original/manifest.json",
    label: "Finley (british male)",
    audioPreviewURL:
      "https://parrot-samples.s3.amazonaws.com/gargamel/Finley.wav",
  },
  {
    value:
      "s3://voice-cloning-zero-shot/743575eb-efdc-4c10-b185-a5018148822f/original/manifest.json",
    label: "Calvin (american male)",
    audioPreviewURL:
      "https://parrot-samples.s3.amazonaws.com/gargamel/Calvin.wav",
  },
  {
    value:
      "s3://voice-cloning-zero-shot/801a663f-efd0-4254-98d0-5c175514c3e8/jennifer/manifest.json",
    label: "Jennifer (american female)",
    audioPreviewURL:
      "https://peregrine-samples.s3.amazonaws.com/parrot-samples/jennifer.wav",
  },
];

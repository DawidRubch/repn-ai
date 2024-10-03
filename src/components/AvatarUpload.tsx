"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import React, { useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { useCreateAgentStore } from "../hooks/useCreateAgentStore";

interface AvatarUploadFieldProps {
  form: UseFormReturn<any>;
  name: string;
}

export function AvatarUploadField({ form, name }: AvatarUploadFieldProps) {
  const setAvatarPreview = useCreateAgentStore(
    (state) => state.setAvatarPreview
  );
  const avatarPreview = useCreateAgentStore((state) => state.avatarPreview);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: { onChange: (file: File) => void }
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      field.onChange(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Avatar</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-2 border-primary">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt="Uploaded avatar" />
                ) : (
                  <AvatarFallback>
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </AvatarFallback>
                )}
              </Avatar>
              <Button
                type="button"
                variant="outline"
                className="w-full h-16 border-dashed"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? "Change Avatar" : "Upload Avatar"}
              </Button>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e, field)}
              />
            </div>
          </FormControl>
          <FormDescription>Upload an avatar image (optional)</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

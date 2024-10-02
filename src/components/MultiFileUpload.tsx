"use client";

import React, { useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface MultiFileUploadProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  description?: string;
}

export function MultiFileUpload({
  form,
  name,
  label,
  description,
}: MultiFileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: { onChange: (files: File[]) => void }
  ) => {
    const files = Array.from(event.target.files || []);
    field.onChange([...(form.getValues(name) || []), ...files]);
  };

  const removeFile = (
    index: number,
    field: { onChange: (files: File[]) => void }
  ) => {
    const currentFiles = form.getValues(name) || [];
    const updatedFiles = [
      ...currentFiles.slice(0, index),
      ...currentFiles.slice(index + 1),
    ];
    field.onChange(updatedFiles);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full h-16 border-dashed"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose files
              </Button>
              <Input
                type="file"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e, field)}
              />
              {field.value && field.value.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {field.value.map((file: File, index: number) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-secondary p-2 rounded-md"
                    >
                      <span className="text-sm truncate text-black mr-2">
                        {file.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index, field)}
                        className="text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

export default function Component() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="avatar">Avatar</Label>
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16 border-2 border-primary">
            {avatar ? (
              <AvatarImage src={avatar} alt="Uploaded avatar" />
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
            onClick={handleButtonClick}
          >
            {avatar ? "Change Avatar" : "Upload Avatar"}
          </Button>
        </div>
      </div>
      <Input
        id="avatar"
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}

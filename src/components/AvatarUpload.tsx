"use client";

import React, { useRef, useState, useCallback } from "react";
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
import { UseFormReturn } from "react-hook-form";
import { useCreateAgentStore } from "../hooks/useAgentStore";
import Cropper, { Area } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

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
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: { onChange: (file: File) => void }
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageToCrop(e.target?.result as string);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }

    event.target.value = "";
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: { width: number; height: number; x: number; y: number }
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return "";
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL("image/jpeg");
  };

  const handleCropSave = useCallback(async () => {
    if (imageToCrop && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(
          imageToCrop,
          croppedAreaPixels
        );
        setAvatarPreview(croppedImage);

        // Create a File object from the base64 string
        const byteString = atob(croppedImage.split(",")[1]);
        const mimeString = croppedImage
          .split(",")[0]
          .split(":")[1]
          .split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });

        form.setValue(name, file);
        setIsCropperOpen(false);
        setZoom(1);
      } catch (e) {
        console.error(e);
      }
    }
  }, [imageToCrop, croppedAreaPixels, setAvatarPreview, form, name]);

  return (
    <>
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
                  onChange={(e) => {
                    handleFileChange(e, field);
                  }}
                />
              </div>
            </FormControl>
            <FormDescription>Upload an avatar image (optional)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Dialog open={isCropperOpen} onOpenChange={setIsCropperOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crop Avatar</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-64">
            <Cropper
              cropShape="round"
              image={imageToCrop || ""}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="flex items-center justify-center mt-4">
            <span className="mr-2 text-sm">Zoom:</span>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value: number[]) => setZoom(value[0])}
              className="w-64 border-white bg-white"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsCropperOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCropSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

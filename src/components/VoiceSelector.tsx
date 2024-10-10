"use client";

import * as React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Control, useFormContext } from "react-hook-form";
import { Pause, Play } from "lucide-react";
import { IdentityForm } from "../hooks/useAgentForm";

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

export default function VoiceSelector() {
  const [currentAudio, setCurrentAudio] =
    React.useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentVoice, setCurrentVoice] = React.useState<string | null>(null);

  const { control } = useFormContext<IdentityForm>();

  const handlePlay = (url: string, voiceLabel: string) => {
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
    }
    const audio = new Audio(url);
    audio.play();
    setCurrentAudio(audio);
    setIsPlaying(true);
    setCurrentVoice(voiceLabel);
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentVoice(null);
    };
  };

  const handleStop = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setCurrentVoice(null);
    }
  };

  return (
    <FormField
      control={control}
      name={"voice"}
      render={({ field }) => {
        return (
          <FormItem className="space-y-1">
            <FormLabel>Voice</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white border-zinc-700">
                {VOICESLIST.map((voice) => (
                  <div
                    key={voice.value}
                    className="flex items-center justify-between cursor-pointer relative"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2 text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isPlaying && currentVoice === voice.label) {
                          handleStop();
                        } else {
                          handlePlay(voice.audioPreviewURL, voice.label);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      {isPlaying && currentVoice === voice.label ? (
                        <Pause />
                      ) : (
                        <Play />
                      )}
                    </Button>
                    <SelectItem
                      value={voice.value}
                      className="flex items-center justify-between cursor-pointer relative"
                    >
                      <span>{voice.label}</span>
                    </SelectItem>
                  </div>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

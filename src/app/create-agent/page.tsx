"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export default function CreateAgentPage() {
  const [createAgentStep, setCreateAgentStep] = useState(1);
  const [urls, setUrls] = useState([""]);

  const handleNextStep = () => {
    setCreateAgentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCreateAgentStep((prev) => Math.max(prev - 1, 1));
  };

  const addUrl = () => {
    setUrls([...urls, ""]);
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const createAgent = () => {
    console.log("Creating agent...");
  };

  return (
    <Card className="w-full mx-auto bg-black text-white border-zinc-800">
      <CardHeader>
        <CardTitle>Create Agent</CardTitle>
        <CardDescription className="text-zinc-400">
          Set up your new AI agent in just a few steps.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-1/4 h-2 rounded-full ${
                  step <= createAgentStep ? "bg-blue-500" : "bg-zinc-700"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Identity</span>
            <span>Behaviour</span>
            <span>Knowledge</span>
            <span>Actions</span>
          </div>
        </div>
        {createAgentStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter agent name"
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voice">Voice</Label>
              <Select>
                <SelectTrigger
                  id="voice"
                  className="bg-zinc-900 border-zinc-700 text-white"
                >
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar</Label>
              <Input
                id="avatar"
                type="file"
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
          </div>
        )}
        {createAgentStep === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="greeting">Agent Greeting</Label>
              <Textarea
                id="greeting"
                placeholder="Enter the agent's greeting message"
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Agent Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Enter instructions for the agent"
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
          </div>
        )}
        {createAgentStep === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="files">Custom Files</Label>
              <Input
                id="files"
                type="file"
                multiple
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Website URLs</Label>
              {urls.map((url, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                    placeholder="Enter website URL"
                    className="bg-zinc-900 border-zinc-700 text-white"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeUrl(index)}
                    className="shrink-0 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addUrl}
                className="mt-2 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                Add URL
              </Button>
            </div>
          </div>
        )}
        {createAgentStep === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Google Calendar Integration</Label>
              <Button className="w-full bg-zinc-800 text-white hover:bg-zinc-700">
                <Calendar className="mr-2 h-4 w-4" />
                Connect Google Calendar
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Custom Action</Label>
              <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                <h3 className="text-lg font-semibold mb-2">
                  Create New Action
                </h3>
                <div className="space-y-2">
                  <Input
                    placeholder="Action name"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                  <Textarea
                    placeholder="Action description"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Endpoint URL"
                      className="bg-zinc-800 border-zinc-700 text-white flex-grow"
                    />
                    <Select>
                      <SelectTrigger className="w-24 bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="GET" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="get">GET</SelectItem>
                        <SelectItem value="post">POST</SelectItem>
                        <SelectItem value="put">PUT</SelectItem>
                        <SelectItem value="delete">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevStep}
          disabled={createAgentStep === 1}
          className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button
          onClick={createAgentStep === 4 ? createAgent : handleNextStep}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {createAgentStep === 4 ? "Create Agent" : "Next"}{" "}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

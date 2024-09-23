"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  PlusCircle,
  Users,
  Zap,
  MessageSquare,
  Building2,
  Code,
  CreditCard,
  Settings,
  Wrench,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
} from "lucide-react";

export function DashboardComponent() {
  const [showCreateAgent, setShowCreateAgent] = useState(false);
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

  return (
    <div className="flex-1 flex">
      <div className="flex-1 p-8">
        {showCreateAgent ? (
          <Card className="w-[600px] mx-auto">
            <CardHeader>
              <CardTitle>Create Agent</CardTitle>
              <CardDescription>
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
                    <Input id="name" placeholder="Enter agent name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="voice">Voice</Label>
                    <Select>
                      <SelectTrigger id="voice">
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar</Label>
                    <Input id="avatar" type="file" />
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructions">Agent Instructions</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Enter instructions for the agent"
                    />
                  </div>
                </div>
              )}
              {createAgentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="files">Custom Files</Label>
                    <Input id="files" type="file" multiple />
                  </div>
                  <div className="space-y-2">
                    <Label>Website URLs</Label>
                    {urls.map((url, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={url}
                          onChange={(e) => updateUrl(index, e.target.value)}
                          placeholder="Enter website URL"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeUrl(index)}
                          className="shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addUrl} className="mt-2">
                      Add URL
                    </Button>
                  </div>
                </div>
              )}
              {createAgentStep === 4 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Google Calendar Integration</Label>
                    <Button className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Connect Google Calendar
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Custom Action</Label>
                    <div className="bg-zinc-800 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">
                        Create New Action
                      </h3>
                      <div className="space-y-2">
                        <Input
                          placeholder="Action name"
                          className="bg-zinc-700"
                        />
                        <Textarea
                          placeholder="Action description"
                          className="bg-zinc-700"
                        />
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Endpoint URL"
                            className="bg-zinc-700 flex-grow"
                          />
                          <Select>
                            <SelectTrigger className="w-24 bg-zinc-700">
                              <SelectValue placeholder="GET" />
                            </SelectTrigger>
                            <SelectContent>
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
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                onClick={
                  createAgentStep === 4
                    ? () => setShowCreateAgent(false)
                    : handleNextStep
                }
              >
                {createAgentStep === 4 ? "Create Agent" : "Next"}{" "}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">New Action</h1>
            <p className="text-zinc-400 mb-8">
              Actions enable agents to interact with external services. Check
              out our{" "}
              <a href="#" className="text-blue-400 hover:underline">
                quickstart guide
              </a>{" "}
              for an example.
            </p>

            <div className="bg-zinc-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Zap className="mr-2" /> Create New Action
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Button variant="outline" className="justify-start">
                  <Code className="mr-2" /> Custom
                </Button>
                <Button variant="outline" className="justify-start">
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M21.56 10.738l-9.04-8c-.72-.64-1.8-.64-2.52 0l-9.04 8C.36 11.3 0 12.12 0 13v6c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2v-6c0-.88-.36-1.7-.96-2.26zM11 18.99h-2v-3h2v3zm3 0h-2v-3h2v3zm3 0h-2v-3h2v3z" />
                  </svg>
                  Google Calendar
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">NAME</label>
                  <Input
                    placeholder="Action name"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    DESCRIPTION
                  </label>
                  <Textarea
                    placeholder="Action description"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      ENDPOINT URL
                    </label>
                    <Input
                      placeholder="Action endpoint url"
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      METHOD
                    </label>
                    <Select>
                      <SelectTrigger className="w-32 bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="GET" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="get">GET</SelectItem>
                        <SelectItem value="post">POST</SelectItem>
                        <SelectItem value="put">PUT</SelectItem>
                        <SelectItem value="delete">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Tabs defaultValue="headers">
                  <TabsList className="bg-zinc-800">
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    <TabsTrigger value="body">Body</TabsTrigger>
                    <TabsTrigger value="query">Query</TabsTrigger>
                    <TabsTrigger value="url">URL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="headers" className="py-4">
                    <Button variant="outline" size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Header
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

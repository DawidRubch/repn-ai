'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, Users, Zap, MessageSquare, Building2, Code, CreditCard, Settings, Wrench } from "lucide-react"

export function DashboardComponent() {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 p-4 flex flex-col">
        <div className="mb-8">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <nav className="space-y-2 flex-1">
          <Button variant="ghost" className="w-full justify-start">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Agent
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            My Agents
          </Button>
          <Button variant="ghost" className="w-full justify-start bg-zinc-800">
            <Zap className="mr-2 h-4 w-4" />
            Actions
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <MessageSquare className="mr-2 h-4 w-4" />
            Conversations
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Building2 className="mr-2 h-4 w-4" />
            For Business
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Code className="mr-2 h-4 w-4" />
            For Developers
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </Button>
        </nav>
        <Separator className="my-4" />
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase">Your Agents</h3>
          <Button variant="ghost" className="w-full justify-start">
            <div className="w-6 h-6 rounded bg-zinc-700 mr-2" />
            Dawid
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <div className="w-6 h-6 rounded bg-zinc-700 mr-2" />
            Dawid
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <div className="w-6 h-6 rounded bg-zinc-700 mr-2" />
            Dawid Niegrebecki
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-4">New Action</h1>
          <p className="text-zinc-400 mb-8">
            Actions enable agents to interact with external services. Check out our{" "}
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
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.56 10.738l-9.04-8c-.72-.64-1.8-.64-2.52 0l-9.04 8C.36 11.3 0 12.12 0 13v6c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2v-6c0-.88-.36-1.7-.96-2.26zM11 18.99h-2v-3h2v3zm3 0h-2v-3h2v3zm3 0h-2v-3h2v3z" />
                </svg>
                Google Calendar
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">NAME</label>
                <Input placeholder="Action name" className="bg-zinc-800 border-zinc-700" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">DESCRIPTION</label>
                <Textarea placeholder="Action description" className="bg-zinc-800 border-zinc-700" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">ENDPOINT URL</label>
                  <Input placeholder="Action endpoint url" className="bg-zinc-800 border-zinc-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">METHOD</label>
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
        </div>

        {/* Right Sidebar */}
        <div className="w-64 bg-zinc-900 p-4 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create agent
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Wrench className="mr-2 h-4 w-4" />
                Integrations
              </Button>
            </div>
          </ScrollArea>
          <Separator className="my-4" />
          <Button variant="ghost" className="justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
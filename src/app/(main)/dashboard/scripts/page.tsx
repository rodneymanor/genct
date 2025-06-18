"use client";

import { useState } from "react";

import {
  ScrollText,
  Plus,
  Search,
  Download,
  FileText,
  Lightbulb,
  PenTool,
  ChevronRight,
  Globe,
  Clock,
  MoreVertical,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const sampleScripts = [
  {
    id: 1,
    title: "5 Morning Habits That Changed My Life",
    status: "completed",
    createdAt: "2024-01-15",
    lastEdited: "2024-01-16",
    words: 342,
    platform: "TikTok",
    research: [
      { title: "Harvard Study on Morning Routines", url: "harvard.edu/study", summary: "Research shows morning routines increase productivity by 40%" },
      { title: "Psychology Today: Habit Formation", url: "psychologytoday.com", summary: "Key insights on building lasting habits" }
    ],
    outline: [
      { id: 1, title: "Hook: The 5AM Club Secret", type: "hook", content: "What if I told you 5 simple habits could transform your entire life?" },
      { id: 2, title: "Problem: Most People's Mornings", type: "problem", content: "Most people wake up and immediately check their phones..." },
      { id: 3, title: "Solution: The 5 Habits", type: "solution", content: "Here are the 5 habits that changed everything..." }
    ],
    script: "What if I told you 5 simple habits could transform your entire life? Most people wake up and immediately check their phones..."
  },
  {
    id: 2,
    title: "The Psychology Behind Viral Content",
    status: "draft",
    createdAt: "2024-01-14",
    lastEdited: "2024-01-14",
    words: 287,
    platform: "Instagram",
    research: [],
    outline: [],
    script: ""
  },
  {
    id: 3,
    title: "3 Editing Tricks for Better Engagement",
    status: "in-progress",
    createdAt: "2024-01-13",
    lastEdited: "2024-01-15",
    words: 195,
    platform: "TikTok",
    research: [
      { title: "Video Editing Best Practices", url: "videoguide.com", summary: "Professional editing techniques for social media" }
    ],
    outline: [
      { id: 1, title: "Hook: Engagement Problem", type: "hook", content: "Your videos are getting ignored because..." }
    ],
    script: "Your videos are getting ignored because you're making these 3 critical editing mistakes..."
  }
];

const statusConfig = {
  draft: { label: "Draft", variant: "secondary" as const, color: "bg-gray-500" },
  "in-progress": { label: "In Progress", variant: "default" as const, color: "bg-yellow-500" },
  completed: { label: "Completed", variant: "outline" as const, color: "bg-green-500" },
};

const toneOptions = [
  "Professional",
  "Casual",
  "Energetic",
  "Educational",
  "Humorous",
  "Inspirational",
  "Conversational"
];

export default function ScriptsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScript, setSelectedScript] = useState<typeof sampleScripts[0] | null>(sampleScripts[0]);
  const [activeTab, setActiveTab] = useState<"research" | "outline" | "script">("research");
  const [selectedTone, setSelectedTone] = useState("Conversational");
  const [customChanges, setCustomChanges] = useState("");

  const filteredScripts = sampleScripts.filter((script) =>
    script.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewScript = () => {
    // Navigate to new script creation
    window.location.href = "/dashboard/scripts/editor/new";
  };

  const handleDownloadScript = () => {
    if (selectedScript) {
      const element = document.createElement("a");
      const file = new Blob([selectedScript.script], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${selectedScript.title}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const renderResearchView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Research Sources</h3>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Source
        </Button>
      </div>
      {selectedScript?.research.length === 0 ? (
        <div className="panel-gradient">
          <div className="panel-inner flex flex-col items-center justify-center py-8">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">No research sources yet</p>
            <p className="text-sm text-muted-foreground">Add sources to strengthen your script</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {selectedScript?.research.map((source, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-sm">{source.title}</CardTitle>
                    <CardDescription className="text-xs">{source.url}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{source.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderOutlineView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Script Outline</h3>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Component
        </Button>
      </div>
      {selectedScript?.outline.length === 0 ? (
        <div className="panel-gradient">
          <div className="panel-inner flex flex-col items-center justify-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">No outline components yet</p>
            <p className="text-sm text-muted-foreground">Build your script structure</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {selectedScript?.outline.map((component) => (
            <Card key={component.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {component.type}
                      </Badge>
                      <h4 className="font-medium text-sm">{component.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{component.content}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderScriptView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Script Editor</h3>
        <div className="flex items-center gap-2">
          <Select value={selectedTone} onValueChange={setSelectedTone}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tone of voice" />
            </SelectTrigger>
            <SelectContent>
              {toneOptions.map((tone) => (
                <SelectItem key={tone} value={tone}>
                  {tone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <Textarea
            value={selectedScript?.script ?? ""}
            placeholder="Your script content will appear here..."
            className="min-h-[300px] resize-none border-none p-0 focus-visible:ring-0"
            readOnly={!selectedScript?.script}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Ask for Custom Changes</CardTitle>
          <CardDescription className="text-xs">
            Describe specific changes you&apos;d like AI to make to your script
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={customChanges}
            onChange={(e) => setCustomChanges(e.target.value)}
            placeholder="e.g., Make it more energetic, add a call-to-action, shorten the intro..."
            className="min-h-[80px]"
          />
          <Button size="sm" disabled={!customChanges.trim()}>
            Apply Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full">
      {/* Left Sidebar - Scripts List */}
      <div className="hidden md:block w-80 border-r border-border-strong bg-muted/30">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-border-strong p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">All Scripts</h2>
              <Button size="sm" onClick={handleNewScript}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search scripts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Scripts List */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-2">
              {filteredScripts.map((script) => (
                <div
                  key={script.id}
                  onClick={() => setSelectedScript(script)}
                  className={`cursor-pointer rounded-md p-3 transition-colors hover:bg-muted ${
                    selectedScript?.id === script.id ? "bg-muted font-medium" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm line-clamp-2">{script.title}</h3>
                    <div className={`w-2 h-2 rounded-full mt-1 ${statusConfig[script.status as keyof typeof statusConfig].color}`} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {script.platform}
                    </Badge>
                    <span>•</span>
                    <span>{script.words} words</span>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>{new Date(script.lastEdited).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-y-auto">
        {selectedScript ? (
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="border-b border-border-strong p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{selectedScript.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusConfig[selectedScript.status as keyof typeof statusConfig].color}`} />
                      <span>{statusConfig[selectedScript.status as keyof typeof statusConfig].label}</span>
                    </div>
                    <span>•</span>
                    <span>{selectedScript.platform}</span>
                    <span>•</span>
                    <span>{selectedScript.words} words</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CopyButton 
                    textToCopy={selectedScript?.script ?? ""} 
                    buttonText="Copy Script"
                    size="sm"
                    variant="outline"
                  />
                  <Button variant="outline" size="sm" onClick={handleDownloadScript}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Script
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 mt-6">
                <Button
                  variant={activeTab === "research" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("research")}
                  className="gap-2"
                >
                  <Lightbulb className="h-4 w-4" />
                  Research
                </Button>
                <Button
                  variant={activeTab === "outline" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("outline")}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Outline
                </Button>
                <Button
                  variant={activeTab === "script" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("script")}
                  className="gap-2"
                >
                  <PenTool className="h-4 w-4" />
                  Script
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {activeTab === "research" && renderResearchView()}
              {activeTab === "outline" && renderOutlineView()}
              {activeTab === "script" && renderScriptView()}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <ScrollText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a script to get started</h3>
              <p className="text-muted-foreground mb-4">Choose a script from the sidebar or create a new one</p>
              <Button onClick={handleNewScript}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Script
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

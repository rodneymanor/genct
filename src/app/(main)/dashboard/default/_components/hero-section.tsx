"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { ArrowUp, Volume2, FileText, Check, ChevronsUpDown, RotateCcw, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  className?: string;
}

interface ScriptComponent {
  id: string;
  title: string;
  description: string;
  content: string;
  type?: string;
  order?: number;
}

// Voice options for the ComboBox
const voices = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "authoritative", label: "Authoritative" },
  { value: "conversational", label: "Conversational" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "educational", label: "Educational" },
  { value: "persuasive", label: "Persuasive" },
];

// Script components data
const scriptComponents = {
  hooks: [
    { id: "question-hook", title: "Question Hook", description: "Engages audience with curiosity", content: "Have you ever wondered why..." },
    { id: "statistic-hook", title: "Statistic Hook", description: "Uses compelling data", content: "Did you know that 90% of..." },
    { id: "quote-hook", title: "Quote Hook", description: "Starts with a powerful quote", content: "As Einstein once said..." },
  ],
  bridges: [
    { id: "problem-solution", title: "Problem-Solution Bridge", description: "Connects problem to solution", content: "Now that we've identified the problem..." },
    { id: "storytelling", title: "Storytelling Bridge", description: "Uses a narrative to connect", content: "Let me tell you a story..." },
  ],
  nuggets: [
    { id: "expert-insight", title: "Expert Insight", description: "Provides valuable information", content: "Industry experts reveal that..." },
    { id: "key-takeaway", title: "Key Takeaway", description: "Summarizes the main point", content: "The most important thing to remember..." },
  ],
  wta: [
    { id: "clear-cta", title: "Clear Call to Action", description: "Direct action for audience", content: "Here's what you need to do next..." },
  ],
};

const savedTemplates = [
  { id: "sales-template", title: "Sales Script Template", components: 4, created: "2 days ago" },
  { id: "educational-template", title: "Educational Content", components: 3, created: "1 week ago" },
];

export function HeroSection({ className }: HeroSectionProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [selectedVoices, setSelectedVoices] = useState<string[]>(voices.map(v => v.value)); // All voices pre-selected
  const [voiceComboOpen, setVoiceComboOpen] = useState(false);
  const [scriptBuilderOpen, setScriptBuilderOpen] = useState(false);
  const [assembledComponents, setAssembledComponents] = useState<ScriptComponent[]>([
    { ...scriptComponents.hooks[0], type: "Hook", order: 1 }
  ]);

  const fullPlaceholder =
    "What would you like to create today? Describe your content idea, topic, or let me know what you're working on...";

  // Typewriter effect for placeholder
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const typeWriter = () => {
      if (currentIndex < fullPlaceholder.length) {
        setPlaceholder(fullPlaceholder.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeWriter, 30);
      }
    };

    typeWriter();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = value.trim();
    if (trimmedValue) {
      const encodedPrompt = encodeURIComponent(trimmedValue);
      router.push(`/dashboard/scripts/editor/new?prompt=${encodedPrompt}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleVoice = (voiceValue: string) => {
    setSelectedVoices(prev => 
      prev.includes(voiceValue) 
        ? prev.filter(v => v !== voiceValue)
        : [...prev, voiceValue]
    );
  };

  const addComponent = (component: ScriptComponent, type: string) => {
    const newComponent: ScriptComponent = {
      ...component,
      type,
      order: assembledComponents.length + 1
    };
    setAssembledComponents(prev => [...prev, newComponent]);
  };

  const removeComponent = (index: number) => {
    setAssembledComponents(prev => prev.filter((_, i) => i !== index));
  };

  const resetScriptBuilder = () => {
    setAssembledComponents([]);
  };

  const trimmedValue = value.trim();

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 md:py-20 lg:py-24", className)}>
      {/* Hero Headline */}
      <div className="mb-8 max-w-4xl text-center">
        <h1 className="mb-6 text-4xl font-black tracking-tight md:text-5xl lg:text-6xl xl:text-7xl">
          What will You <span className="text-emerald-500 font-black">Script Today</span>?
        </h1>
        <p className="text-muted-foreground text-xl md:text-2xl lg:text-2xl font-medium">
          Describe your idea and I&apos;ll help you create compelling content
        </p>
      </div>

      {/* Main Input Section */}
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
        <div className="relative">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="focus-visible:ring-primary/50 hover:border-primary/30 min-h-[100px] w-full resize-none border-border px-5 py-4 pr-20 pb-12 text-base transition-colors focus-visible:ring-2 md:min-h-[110px] md:text-lg"
            autoFocus
          />

          {/* Bottom Left Controls */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            {/* Voice Engine ComboBox */}
            <Popover open={voiceComboOpen} onOpenChange={setVoiceComboOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary h-7 px-2 text-xs font-medium border border-border/50 hover:border-border"
                >
                  <Volume2 className="h-3 w-3 mr-1.5" />
                  {selectedVoices.length === voices.length ? "All Voices" : `${selectedVoices.length} Selected`}
                  <ChevronsUpDown className="h-3 w-3 ml-1.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search voices..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No voices found.</CommandEmpty>
                    <CommandGroup>
                      {voices.map((voice) => (
                        <CommandItem
                          key={voice.value}
                          onSelect={() => toggleVoice(voice.value)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedVoices.includes(voice.value) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {voice.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Script Builder Dialog */}
            <Dialog open={scriptBuilderOpen} onOpenChange={setScriptBuilderOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary h-7 px-2 text-xs font-medium border border-border/50 hover:border-border"
                >
                  <FileText className="h-3 w-3 mr-1.5" />
                  Script Builder
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[800px] max-w-[90vw] h-[90vh] p-0">
                <DialogHeader className="sr-only">
                  <DialogTitle>Script Builder</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex justify-between items-center border-b py-2 px-4 bg-muted/30 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                      <h2 className="text-xs uppercase font-medium text-muted-foreground">Script Builder</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetScriptBuilder}
                        className="text-xs text-muted-foreground hover:text-foreground border h-6 px-2"
                      >
                        <RotateCcw className="h-2 w-2 mr-1" />
                        Reset
                      </Button>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex flex-1 min-h-0">
                    {/* Left Panel - Component Selection */}
                    <div className="w-2/3 border-r overflow-y-auto p-6 bg-background">
                      <div className="space-y-6">
                        {/* Hooks Section */}
                        <div>
                          <h4 className="text-xs uppercase text-muted-foreground mb-3 font-medium">Hooks</h4>
                          <div className="flex items-center space-x-3 overflow-x-auto pb-4">
                            {scriptComponents.hooks.map((hook) => (
                              <div
                                key={hook.id}
                                onClick={() => addComponent(hook, "Hook")}
                                className="p-3 border rounded-lg cursor-pointer hover:bg-accent border-border flex-shrink-0 w-40 transition-colors bg-background"
                              >
                                <h5 className="text-sm font-medium">{hook.title}</h5>
                                <p className="text-xs text-muted-foreground mt-1">{hook.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bridges Section */}
                        <div>
                          <h4 className="text-xs uppercase text-muted-foreground mb-3 font-medium">Bridges</h4>
                          <div className="flex items-center space-x-3 overflow-x-auto pb-4">
                            {scriptComponents.bridges.map((bridge) => (
                              <div
                                key={bridge.id}
                                onClick={() => addComponent(bridge, "Bridge")}
                                className="p-3 border rounded-lg cursor-pointer hover:bg-accent border-border flex-shrink-0 w-48 transition-colors bg-background"
                              >
                                <h5 className="text-sm font-medium">{bridge.title}</h5>
                                <p className="text-xs text-muted-foreground mt-1">{bridge.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Golden Nuggets Section */}
                        <div>
                          <h4 className="text-xs uppercase text-muted-foreground mb-3 font-medium">Golden Nuggets</h4>
                          <div className="flex items-center space-x-3 overflow-x-auto pb-4">
                            {scriptComponents.nuggets.map((nugget) => (
                              <div
                                key={nugget.id}
                                onClick={() => addComponent(nugget, "Nugget")}
                                className="p-3 border rounded-lg cursor-pointer hover:bg-accent border-border flex-shrink-0 w-44 transition-colors bg-background"
                              >
                                <h5 className="text-sm font-medium">{nugget.title}</h5>
                                <p className="text-xs text-muted-foreground mt-1">{nugget.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* WTA Section */}
                        <div>
                          <h4 className="text-xs uppercase text-muted-foreground mb-3 font-medium">What To Action (WTA)</h4>
                          <div className="flex items-center space-x-3 overflow-x-auto pb-4">
                            {scriptComponents.wta.map((wta) => (
                              <div
                                key={wta.id}
                                onClick={() => addComponent(wta, "WTA")}
                                className="p-3 border rounded-lg cursor-pointer hover:bg-accent border-border flex-shrink-0 w-48 transition-colors bg-background"
                              >
                                <h5 className="text-sm font-medium">{wta.title}</h5>
                                <p className="text-xs text-muted-foreground mt-1">{wta.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel - Assembly & Templates */}
                    <div className="w-1/3 flex flex-col bg-background">
                      {/* Script Assembly */}
                      <div className="flex-grow flex flex-col p-4">
                        <h3 className="text-sm font-semibold mb-4 flex-shrink-0">Script Assembly</h3>
                        <div className="flex-grow border-2 border-dashed border-border rounded-lg p-4 flex flex-col space-y-3 bg-muted/30 overflow-y-auto">
                          {assembledComponents.length > 0 ? (
                            assembledComponents.map((component, index) => (
                              <div key={index} className="p-3 border rounded-lg border-border bg-background flex-shrink-0">
                                <div className="flex justify-between items-start mb-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {index + 1}. {component.type}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeComponent(index)}
                                    className="h-4 w-4 p-0 text-muted-foreground hover:text-destructive"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                                <h5 className="text-sm font-medium mb-2">{component.title}</h5>
                                <div className="text-sm bg-muted p-2 rounded border">
                                  &quot;{component.content}&quot;
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-sm text-muted-foreground">Drop components here</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-end space-x-2 mt-4 flex-shrink-0">
                          <Button variant="outline" size="sm" className="text-xs">
                            Save as Template
                          </Button>
                          <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700">
                            Export Script
                          </Button>
                        </div>
                      </div>

                      {/* Saved Templates */}
                      <div className="h-1/3 border-t p-4 flex flex-col flex-shrink-0">
                        <h3 className="text-sm font-semibold mb-4">Saved Templates</h3>
                        <div className="space-y-3 overflow-y-auto">
                          {savedTemplates.map((template) => (
                            <div
                              key={template.id}
                              className="p-3 border rounded-lg cursor-pointer hover:bg-accent border-border transition-colors bg-background"
                            >
                              <h5 className="text-sm font-medium">{template.title}</h5>
                              <p className="text-xs text-muted-foreground mt-1">{template.components} components</p>
                              <p className="text-[10px] text-muted-foreground">Created: {template.created}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="icon"
            className={cn(
              "absolute bottom-3 right-3 h-[34px] w-[34px] rounded-md border transition-all duration-200 ease-out outline-none",
              "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1",
              trimmedValue
                ? "bg-primary hover:bg-primary/90 text-primary-foreground border-border"
                : "bg-background hover:bg-accent hover:text-accent-foreground text-foreground border-border"
            )}
            disabled={!trimmedValue}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>

        {trimmedValue && (
          <div className="mt-4 flex justify-center">
            <p className="text-muted-foreground text-sm">
              Press <kbd className="bg-muted rounded px-1.5 py-0.5 text-xs font-medium">⌘ Enter</kbd> to generate
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

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
    { id: "story-hook", title: "Story Hook", description: "Opens with a compelling narrative", content: "Picture this scenario..." },
  ],
  bridges: [
    { id: "problem-solution", title: "Problem-Solution Bridge", description: "Connects problem to solution", content: "Now that we've identified the problem..." },
    { id: "storytelling", title: "Storytelling Bridge", description: "Uses a narrative to connect", content: "Let me tell you a story..." },
    { id: "transition", title: "Smooth Transition", description: "Seamlessly moves between topics", content: "This brings us to the next point..." },
  ],
  nuggets: [
    { id: "expert-insight", title: "Expert Insight", description: "Provides valuable information", content: "Industry experts reveal that..." },
    { id: "key-takeaway", title: "Key Takeaway", description: "Summarizes the main point", content: "The most important thing to remember..." },
    { id: "pro-tip", title: "Pro Tip", description: "Shares insider knowledge", content: "Here's what professionals don't tell you..." },
  ],
  wta: [
    { id: "clear-cta", title: "Clear Call to Action", description: "Direct action for audience", content: "Here's what you need to do next..." },
    { id: "soft-cta", title: "Soft Call to Action", description: "Gentle encouragement to act", content: "If you're ready to take the next step..." },
  ],
};

// Sample saved templates
const savedTemplates = [
  {
    name: "Marketing Script",
    components: [
      { ...scriptComponents.hooks[0] },
      { ...scriptComponents.bridges[0] },
      { ...scriptComponents.wta[0] }
    ]
  },
  {
    name: "Educational Content",
    components: [
      { ...scriptComponents.hooks[1] },
      { ...scriptComponents.nuggets[0] },
      { ...scriptComponents.wta[1] }
    ]
  },
  {
    name: "Product Demo",
    components: [
      { ...scriptComponents.hooks[2] },
      { ...scriptComponents.bridges[1] },
      { ...scriptComponents.nuggets[1] },
      { ...scriptComponents.wta[0] }
    ]
  }
];

export function HeroSection({ className }: HeroSectionProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [selectedVoices, setSelectedVoices] = useState<string[]>(voices.map(v => v.value)); // All voices pre-selected
  const [voiceComboOpen, setVoiceComboOpen] = useState(false);
  const [scriptBuilderOpen, setScriptBuilderOpen] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState<ScriptComponent[]>([
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

  const addComponent = (component: ScriptComponent) => {
    setSelectedComponents([...selectedComponents, component]);
  };

  const removeComponent = (index: number) => {
    setSelectedComponents(selectedComponents.filter((_, i) => i !== index));
  };

  const resetComponents = () => {
    setSelectedComponents([]);
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
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground hover:text-primary h-7 px-2 text-xs font-medium border border-border/50 hover:border-border"
                >
                  <FileText className="h-3 w-3 mr-1.5" />
                  Script Builder
                </Button>
              </DialogTrigger>
              <DialogContent className="!fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2 !max-w-6xl !w-11/12 !h-[85vh] !p-0 !z-50 relative bg-white dark:bg-neutral-900 border border-transparent dark:border-neutral-800 rounded-2xl shadow-xl flex flex-col overflow-hidden">
                <DialogHeader className="sr-only">
                  <DialogTitle>Script Builder</DialogTitle>
                </DialogHeader>
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 py-3 px-4 bg-neutral-100 dark:bg-neutral-900 rounded-t-2xl">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xs uppercase font-medium text-neutral-700 dark:text-neutral-300">Script Builder</h2>
                    <button 
                      onClick={resetComponents}
                      className="text-[10px] text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 rounded-md px-2 py-0.5 flex items-center"
                    >
                      <RotateCcw className="w-2 h-2 mr-1 opacity-50" />
                      Reset
                    </button>
                  </div>
                  <button 
                    onClick={() => setScriptBuilderOpen(false)}
                    className="flex items-center justify-center text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 rounded-full p-1"
                  >
                    
                  </button>
                </div>

                {/* Main Content */}
                <div className="flex flex-col md:flex-row flex-1 h-full overflow-hidden rounded-b-2xl">
                  {/* Left Panel - Component Selection */}
                  <div className="w-full md:w-2/3 md:border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto bg-background rounded-bl-2xl">
                    <div className="p-6 space-y-8">
                      {/* Hooks Section */}
                      <div>
                        <h4 className="text-xs uppercase text-muted-foreground mb-4 font-medium px-1">Hooks</h4>
                        <div className="flex items-center space-x-4 overflow-x-auto pb-4 px-1">
                          {scriptComponents.hooks.map((hook) => (
                            <div
                              key={hook.id}
                              onClick={() => addComponent(hook)}
                              className="p-4 border rounded-lg cursor-pointer hover:bg-accent border-border flex-shrink-0 w-40 transition-colors bg-background"
                            >
                              <h5 className="text-sm font-medium mb-2">{hook.title}</h5>
                              <p className="text-xs text-muted-foreground">{hook.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bridges Section */}
                      <div>
                        <h4 className="text-xs uppercase text-muted-foreground mb-4 font-medium px-1">Bridges</h4>
                        <div className="flex items-center space-x-4 overflow-x-auto pb-4 px-1">
                          {scriptComponents.bridges.map((bridge) => (
                            <div
                              key={bridge.id}
                              onClick={() => addComponent(bridge)}
                              className="p-4 border rounded-lg cursor-pointer hover:bg-accent border-border flex-shrink-0 w-48 transition-colors bg-background"
                            >
                              <h5 className="text-sm font-medium mb-2">{bridge.title}</h5>
                              <p className="text-xs text-muted-foreground">{bridge.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Golden Nuggets Section */}
                      <div>
                        <h4 className="text-xs uppercase text-muted-foreground mb-4 font-medium px-1">Golden Nuggets</h4>
                        <div className="flex items-center space-x-4 overflow-x-auto pb-4 px-1">
                          {scriptComponents.nuggets.map((nugget) => (
                            <div
                              key={nugget.id}
                              onClick={() => addComponent(nugget)}
                              className="p-4 border rounded-lg cursor-pointer hover:bg-accent border-border flex-shrink-0 w-44 transition-colors bg-background"
                            >
                              <h5 className="text-sm font-medium mb-2">{nugget.title}</h5>
                              <p className="text-xs text-muted-foreground">{nugget.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* WTA Section */}
                      <div>
                        <h4 className="text-xs uppercase text-muted-foreground mb-4 font-medium px-1">What To Action (WTA)</h4>
                        <div className="flex items-center space-x-4 overflow-x-auto pb-4 px-1">
                          {scriptComponents.wta.map((wta) => (
                            <div
                              key={wta.id}
                              onClick={() => addComponent(wta)}
                              className="p-4 border rounded-lg cursor-pointer hover:bg-accent border-border flex-shrink-0 w-48 transition-colors bg-background"
                            >
                              <h5 className="text-sm font-medium mb-2">{wta.title}</h5>
                              <p className="text-xs text-muted-foreground">{wta.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Panel - Script Assembly */}
                  <div className="w-full md:w-1/3 flex flex-col h-full bg-background rounded-br-2xl">
                    <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                      <h3 className="text-sm font-medium mb-6">Script Assembly</h3>
                      <div className="space-y-3">
                        {selectedComponents.map((component, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <span className="text-sm font-medium">{component.title}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeComponent(index)}
                              className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        {selectedComponents.length === 0 && (
                          <div className="text-center py-12 text-muted-foreground text-sm">
                            <div className="mb-2 opacity-50">📝</div>
                            Click components to add them here
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 p-6 overflow-y-auto">
                      <h3 className="text-sm font-medium mb-6">Saved Templates</h3>
                      <div className="space-y-3">
                        {savedTemplates.map((template, index) => (
                          <div key={index} className="p-4 border rounded-lg bg-background hover:bg-muted/50 cursor-pointer transition-colors">
                            <div className="font-medium text-sm mb-1">{template.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {template.components.length} components
                            </div>
                          </div>
                        ))}
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

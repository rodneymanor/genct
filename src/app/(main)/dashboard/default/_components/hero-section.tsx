"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { Sparkles, Mic, ArrowUp, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [placeholder, setPlaceholder] = useState("");

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

  const handleVoiceAction = (action: string) => {
    console.log('Voice action:', action);
    // Placeholder for voice functionality
  };

  const handleScriptBuilderAction = (action: string) => {
    console.log('Script Builder action:', action);
    // Placeholder for script builder functionality
  };

  const trimmedValue = value.trim();

  const scrollToCards = () => {
    const cardsSection = document.getElementById("script-cards");
    if (cardsSection) {
      cardsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

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
        {/* Dropdown Buttons Row */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {/* Voice Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 px-3 py-2 h-9 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mic className="h-4 w-4" />
                <span className="text-sm">Voice</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => handleVoiceAction('record')}>
                <Mic className="h-4 w-4 mr-2" />
                Start Recording
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleVoiceAction('upload')}>
                <Mic className="h-4 w-4 mr-2" />
                Upload Audio File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleVoiceAction('settings')}>
                <Mic className="h-4 w-4 mr-2" />
                Voice Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Script Builder Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 px-3 py-2 h-9 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">Script Builder</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={() => handleScriptBuilderAction('template')}>
                <Sparkles className="h-4 w-4 mr-2" />
                Use Template
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleScriptBuilderAction('guided')}>
                <Sparkles className="h-4 w-4 mr-2" />
                Guided Builder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleScriptBuilderAction('components')}>
                <Sparkles className="h-4 w-4 mr-2" />
                Script Components
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleScriptBuilderAction('ai-assist')}>
                <Sparkles className="h-4 w-4 mr-2" />
                AI Assistant
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="relative">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="focus-visible:ring-primary/50 hover:border-primary/30 min-h-[100px] w-full resize-none border-border px-5 py-4 pr-20 text-base transition-colors focus-visible:ring-2 md:min-h-[110px] md:text-lg"
            autoFocus
          />

          {/* Voice Input Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary absolute bottom-3 right-14"
            onClick={() => {
              // TODO: Implement voice input
              console.log("Voice input clicked");
            }}
          >
            <Mic className="h-4 w-4" />
          </Button>

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

      {/* Scroll to Ideas Button - COMMENTED OUT FOR DOCK TESTING */}
      {/*
      <div className="mt-12 flex flex-col items-center gap-4">
        <p className="text-muted-foreground text-sm">Or browse script ideas below</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollToCards}
          className="group flex h-auto flex-col items-center gap-1 px-4 py-2 hover:bg-transparent"
        >
          <span className="group-hover:text-primary text-sm font-medium transition-colors">Browse Ideas</span>
          <ChevronDown className="group-hover:text-primary h-4 w-4 animate-bounce transition-all duration-300 group-hover:translate-y-1" />
        </Button>
      </div>
      */}
    </div>
  );
}

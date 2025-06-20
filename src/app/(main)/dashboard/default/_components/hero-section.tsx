"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { Sparkles, Mic, ArrowUp, ChevronDown, Volume2, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [selectedBuilder, setSelectedBuilder] = useState("Standard");

  const fullPlaceholder =
    "What would you like to create today? Describe your content idea, topic, or let me know what you're working on...";

  // Placeholder data for dropdowns
  const toneOptions = [
    "Professional",
    "Casual",
    "Friendly",
    "Authoritative", 
    "Conversational",
    "Enthusiastic"
  ];

  const builderOptions = [
    "Standard",
    "Video Script",
    "Blog Post",
    "Social Media",
    "Email",
    "Presentation"
  ];

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
        <div className="relative">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="focus-visible:ring-primary/50 hover:border-primary/30 min-h-[100px] w-full resize-none border-border px-5 py-4 pr-20 pb-12 text-base transition-colors focus-visible:ring-2 md:min-h-[110px] md:text-lg"
            autoFocus
          />

          {/* Bottom Left Dropdown Buttons */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            {/* Tone of Voice Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary h-7 px-2 text-xs font-medium border border-border/50 hover:border-border"
                >
                  <Volume2 className="h-3 w-3 mr-1.5" />
                  {selectedTone}
                  <ChevronDown className="h-3 w-3 ml-1.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                {toneOptions.map((tone) => (
                  <DropdownMenuItem
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className="text-sm"
                  >
                    {tone}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Script Builder Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary h-7 px-2 text-xs font-medium border border-border/50 hover:border-border"
                >
                  <FileText className="h-3 w-3 mr-1.5" />
                  {selectedBuilder}
                  <ChevronDown className="h-3 w-3 ml-1.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                {builderOptions.map((builder) => (
                  <DropdownMenuItem
                    key={builder}
                    onClick={() => setSelectedBuilder(builder)}
                    className="text-sm"
                  >
                    {builder}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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

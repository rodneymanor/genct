"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { Sparkles, Mic, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
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

  const trimmedValue = value.trim();

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 md:py-16 lg:py-20", className)}>
      {/* Hero Headline */}
      <div className="mb-8 max-w-3xl text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Turn Ideas Into Engaging Scripts
        </h1>
        <p className="text-muted-foreground mb-8 text-lg md:text-xl">
          Describe what you want to create and I&apos;ll help you craft compelling content that resonates with your
          audience
        </p>
      </div>

      {/* Main Input Section */}
      <form onSubmit={handleSubmit} className="w-full max-w-4xl">
        <div className="relative">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="focus-visible:ring-primary/50 hover:border-primary/30 min-h-[120px] resize-none border-2 px-6 py-4 pr-20 text-base transition-colors focus-visible:ring-2 md:min-h-[140px] md:text-lg"
            autoFocus
          />

          {/* Voice Input Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary absolute top-4 right-4"
            onClick={() => {
              // TODO: Implement voice input
              console.log("Voice input clicked");
            }}
          >
            <Mic className="h-5 w-5" />
          </Button>
        </div>

        {/* Primary Action Button */}
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            type="submit"
            size="lg"
            className="w-full gap-2 px-8 py-3 text-lg font-semibold sm:w-auto"
            disabled={!trimmedValue}
          >
            <Sparkles className="h-5 w-5" />
            Generate Script
            <ArrowRight className="h-5 w-5" />
          </Button>

          {trimmedValue && (
            <p className="text-muted-foreground text-sm">
              Press <kbd className="bg-muted rounded px-1.5 py-0.5 text-xs font-medium">⌘ Enter</kbd> to generate
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

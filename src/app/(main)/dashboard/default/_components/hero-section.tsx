"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { Sparkles, Mic, ArrowUp, ChevronDown } from "lucide-react";

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
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl">
        <div className="relative">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="focus-visible:ring-primary/50 hover:border-primary/30 min-h-[120px] w-full resize-none border-gray-200 px-6 py-4 pr-24 text-base transition-colors focus-visible:ring-2 md:min-h-[140px] md:text-lg"
            autoFocus
          />

          {/* Voice Input Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary absolute bottom-4 right-16"
            onClick={() => {
              // TODO: Implement voice input
              console.log("Voice input clicked");
            }}
          >
            <Mic className="h-5 w-5" />
          </Button>

          {/* Submit Button */}
          <Button
            type="submit"
            size="icon"
            className={cn(
              "absolute bottom-4 right-4 h-[38px] w-[38px] rounded-md border transition-all duration-200 ease-out outline-none",
              "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1",
              trimmedValue
                ? "bg-primary hover:bg-primary/90 text-primary-foreground border-gray-200"
                : "bg-background hover:bg-accent hover:text-accent-foreground text-foreground border-gray-200"
            )}
            disabled={!trimmedValue}
          >
            <ArrowUp className="h-5 w-5" />
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

      {/* Scroll to Ideas Button */}
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
    </div>
  );
}

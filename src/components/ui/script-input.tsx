"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, Sparkles, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ScriptInputProps {
  className?: string;
}

export function ScriptInput({ className }: ScriptInputProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  
  const fullPlaceholder = "What will you script today?";
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;
    
    const typeWriter = () => {
      if (currentIndex < fullPlaceholder.length) {
        setPlaceholder(fullPlaceholder.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeWriter, 100);
      } else {
        setIsTyping(false);
      }
    };
    
    typeWriter();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      // Navigate to script editor with the prompt as a URL parameter
      const encodedPrompt = encodeURIComponent(value.trim());
      router.push(`/dashboard/scripts/editor/new?prompt=${encodedPrompt}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
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

  return (
    <div className={cn("relative flex items-center gap-3", className)}>
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
      
      {/* Input Field */}
      <form onSubmit={handleSubmit} className="flex-1">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="border-none focus:border-none focus:outline-none shadow-none bg-transparent text-base"
          autoFocus
        />
      </form>
      
      {value.trim() && (
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          Press Enter to generate script
        </div>
      )}
    </div>
  );
} 